"use client";

import { useEffect, useRef, useState } from "react";

type Meta = { file: string; bytes: number; splats: number; focus: [number, number, number] };
type Stats = { mb: string; seconds: string; splats: number } | null;

// The splat is trained in Blender's Z-up axes; three.js is Y-up.
const Z_UP_TO_Y_UP = -Math.PI / 2;
// Camera starts above and to the side of the hospital, like the explorer's zone views (scene units = 100 m).
const START_OFFSET = [-3.2, 4.6, -6.2] as const;
const MAX_PIXEL_RATIO = 2;
const FOV_DEG = 38;

export default function SplatClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState<Stats>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const t0 = performance.now();
    (async () => {
      const [THREE, { OrbitControls }, { SparkRenderer, SplatMesh }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("@sparkjsdev/spark"),
      ]);
      const meta: Meta = await fetch("/explore/splat/meta.json").then((r) => r.json());
      if (disposed) return;
      const canvas = canvasRef.current!;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--sky").trim() || "#d7e3e6");
      const camera = new THREE.PerspectiveCamera(FOV_DEG, 1, 0.05, 500);
      scene.add(new SparkRenderer({ renderer }));
      const splat = new SplatMesh({ url: `/explore/splat/${meta.file}` });
      splat.rotation.x = Z_UP_TO_Y_UP;
      scene.add(splat);
      const [fx, fy, fz] = meta.focus;
      const target = new THREE.Vector3(fx, fz, -fy);
      camera.position.copy(target).add(new THREE.Vector3(...START_OFFSET));
      const controls = new OrbitControls(camera, canvas);
      controls.target.copy(target);
      controls.enableDamping = true;
      controls.maxPolarAngle = 1.38;
      controls.update();
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      resize();
      renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
      await splat.initialized;
      if (!disposed) setStats({ mb: (meta.bytes / 1e6).toFixed(1), seconds: ((performance.now() - t0) / 1000).toFixed(1), splats: meta.splats });
      cleanup = () => { renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose(); splat.dispose(); renderer.dispose(); };
    })().catch((e) => { if (!disposed) setError(String(e)); });
    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="relative h-[calc(100svh-72px)] w-full bg-[var(--sky)]">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-label="Experimental Gaussian splat of the hospital district" />
      <div className="aimp">Artist&apos;s impression</div>
      <p className="absolute left-4 top-4 max-w-[34ch] rounded-lg bg-card/90 p-3 text-[13px] leading-snug text-ink">
        <strong>Experiment.</strong> A Gaussian splat trained from Blender renders of the concept model around the hospital district. Drag to turn,
        pinch or scroll to zoom.
        <br />
        {error ? `Could not load: ${error}` : stats ? `${stats.splats.toLocaleString()} splats, ${stats.mb} MB, ready in ${stats.seconds} s` : "Loading…"}
      </p>
    </div>
  );
}
