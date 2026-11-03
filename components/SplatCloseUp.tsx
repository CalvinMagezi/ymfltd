"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CloseUpEntry = {
  file: string;
  bytes: number;
  splats: number;
  target: [number, number, number];
  camera: [number, number, number];
  minDistance: number;
  maxDistance: number;
};

type Props = { name: string; entry: CloseUpEntry; onClose: () => void };

// Splats are trained in Blender's Z-up axes; three.js is Y-up.
const Z_UP_TO_Y_UP = -Math.PI / 2;
const MAX_PIXEL_RATIO = 2;
const FOV_DEG = 38;
const MAX_POLAR = 1.38; // same ground-hugging limit as the explorer
const INIT_TIMEOUT_MS = 30000; // decoding 100k splats takes about a second; anything past this has failed

async function download(url: string, total: number, onProgress: (share: number) => void, signal: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok || !res.body) throw new Error(`download ${res.status}`);
  const reader = res.body.getReader();
  const parts: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value);
    got += value.length;
    onProgress(Math.min(1, got / total));
  }
  if (got !== total) throw new Error(`incomplete download (${got} of ${total} bytes)`);
  const bytes = new Uint8Array(got);
  let off = 0;
  for (const p of parts) { bytes.set(p, off); off += p.length; }
  return bytes;
}

/** Full-screen close-up of one district as a Gaussian splat, opened on request from the explorer. */
export default function SplatCloseUp({ name, entry, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const loadingId = useId();

  // Render at the top of the page and make everything else inert, so focus and touches stay in the dialog.
  useEffect(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const others = Array.from(document.body.children).filter((c): c is HTMLElement => c !== el && c instanceof HTMLElement && !c.inert);
    others.forEach((c) => { c.inert = true; });
    setHost(el);
    return () => { others.forEach((c) => { c.inert = false; }); el.remove(); };
  }, []);

  useEffect(() => {
    if (!host) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [host, onClose]);

  useEffect(() => {
    if (!host) return;
    const abort = new AbortController();
    let cleanup = () => {};
    (async () => {
      const [THREE, { OrbitControls }, { SparkRenderer, SplatMesh, SplatFileType }, fileBytes] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("@sparkjsdev/spark"),
        download(`/explore/splat/${entry.file}`, entry.bytes, setProgress, abort.signal),
      ]);
      if (abort.signal.aborted) return;
      const canvas = canvasRef.current!;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--sky").trim() || "#d7e3e6");
      const camera = new THREE.PerspectiveCamera(FOV_DEG, 1, 0.05, 500);
      const spark = new SparkRenderer({ renderer });
      scene.add(spark);
      const splat = new SplatMesh({ fileBytes, fileType: SplatFileType.SPZ });
      splat.rotation.x = Z_UP_TO_Y_UP;
      scene.add(splat);
      camera.position.set(...entry.camera);
      const controls = new OrbitControls(camera, canvas);
      controls.target.set(...entry.target);
      controls.enableDamping = true;
      controls.maxPolarAngle = MAX_POLAR;
      controls.minDistance = entry.minDistance;
      controls.maxDistance = entry.maxDistance;
      controls.update();
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      resize();
      renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
      // Browsers cap live WebGL contexts and drop the oldest (the explorer's) past it, so release this one now.
      cleanup = () => {
        renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose();
        splat.dispose(); spark.dispose(); renderer.dispose(); renderer.forceContextLoss();
      };
      let timer = 0;
      const timeout = new Promise<never>((_, rej) => { timer = window.setTimeout(() => rej(new Error("the splat did not finish decoding")), INIT_TIMEOUT_MS); });
      await Promise.race([splat.initialized, timeout]).finally(() => clearTimeout(timer));
      if (!abort.signal.aborted) setReady(true);
    })().catch((e) => {
      if (abort.signal.aborted) return;
      abort.abort();
      setError(e instanceof Error ? e.message : String(e));
    });
    return () => { abort.abort(); cleanup(); };
  }, [entry, host]);

  if (!host) return null;
  const mb = (entry.bytes / 1e6).toFixed(1);
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${name}, close-up`} className="fixed inset-0 z-50 touch-none overscroll-contain bg-[var(--sky)]">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-label={`Close-up of ${name} in the concept model. Drag to turn, pinch or scroll to zoom.`} />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-paper/90">
          <div className="grid w-[min(320px,80%)] gap-2 text-center">
            <p id={loadingId} className="text-[15px] font-semibold">{error ? "The close-up could not load." : `Loading the close-up, ${mb} MB`}</p>
            {!error && (
              <div className="h-2 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-labelledby={loadingId} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                <div className="h-full bg-gold-strong transition-[width]" style={{ width: `${progress * 100}%` }} />
              </div>
            )}
            {error && <p className="text-[13px] text-muted">{error}</p>}
          </div>
        </div>
      )}
      <div className="absolute left-4 right-14 top-4 max-w-[36ch] rounded-lg border border-line bg-card/95 p-3 text-[13.5px] leading-snug shadow-lg">
        <p className="font-semibold">{name}</p>
        <p className="text-muted">A close-up of the concept model, rendered from the same plan. Drag to turn, pinch or scroll to zoom.</p>
      </div>
      <button ref={closeRef} type="button" onClick={onClose} className="btn absolute right-4 top-4 !px-3 !py-2 shadow" aria-label="Close the close-up">×</button>
      <span className="aimp">Artist&apos;s impression</span>
    </div>,
    host,
  );
}
