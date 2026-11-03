/** Detailed buildings and baked shadow maps for the explorer, built by tools/blender/build_explore_assets.py. */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export interface UpgradeManifest {
  buildings: string;
  shadows: string[];
  shadowBounds: { x0: number; y0: number; x1: number; y1: number };
}

export interface BuildingMesh {
  phase: number;
  mesh: THREE.Mesh;
  /** Height factor 0..1, as applyRise() eases the plain boxes. */
  setRise(e: number): void;
}

// Window layout in metres comes from the glTF: _uvm (along the facade, above the ground), _win (floor
// height, bay, window share, glazed lobby) and _sill (sill and head as shares of each floor).
export const MIN_RISE = 0.001;
const WINDOW_MIN_M = 0.4;
const LOBBY_MULLION_M = 1.6;
const LOBBY_FRAME = 0.05; // mullion width as a share of the lobby bay
const LOBBY_SILL_M = 0.25;
const LOBBY_HEAD = 0.92; // share of the ground floor
const SLAB_BAND = 0.05;
const SLAB_SHADE = 0.78;
const CONTACT_SHADE = 0.72; // walls darken toward the ground, a cheap stand-in for baked contact shadow
const CONTACT_FADE_M = 5;
const GLASS = "vec3(0.050, 0.070, 0.090)";

const VERTEX_HEAD = /* glsl */ `
attribute float _foot;
attribute vec2 _uvm;
attribute vec4 _win;
attribute vec2 _sill;
uniform float uRise;
uniform vec2 uLocal;
varying vec2 vUvm;
varying vec4 vWin;
varying vec2 vSill;
`;
// Positions are quantized in the glTF node's local space; uLocal (translate y, scale y) maps the
// world-space footing into it so each building grows from its own base.
const VERTEX_RISE = /* glsl */ `
#include <begin_vertex>
float footL = (_foot - uLocal.x) / uLocal.y;
transformed.y = footL + (transformed.y - footL) * uRise;
vUvm = _uvm;
vWin = _win;
vSill = _sill;
`;
const FRAGMENT_HEAD = /* glsl */ `
varying vec2 vUvm;
varying vec4 vWin;
varying vec2 vSill;
`;
// GLSL ES rejects integer literals where a float is expected, so every constant is written as a float.
const f = (v: number) => v.toFixed(3);
const FRAGMENT_WINDOWS = /* glsl */ `
#include <color_fragment>
if (vWin.x > 0.0) {
  float fu = fract(vUvm.x / vWin.y);
  float fy = fract(vUvm.y / vWin.x);
  float m = step((1.0 - vWin.z) * 0.5, fu) * step(fu, (1.0 + vWin.z) * 0.5)
          * step(vSill.x, fy) * step(fy, vSill.y) * step(${f(WINDOW_MIN_M)}, vUvm.y);
  if (vWin.w > 0.5 && vUvm.y < vWin.x) {
    m = step(${f(LOBBY_FRAME)}, fract(vUvm.x / ${f(LOBBY_MULLION_M)})) * step(${f(LOBBY_SILL_M)}, vUvm.y) * step(vUvm.y, vWin.x * ${f(LOBBY_HEAD)});
  }
  diffuseColor.rgb *= mix(1.0, ${f(SLAB_SHADE)}, step(fy, ${f(SLAB_BAND)}));
  diffuseColor.rgb *= mix(${f(CONTACT_SHADE)}, 1.0, smoothstep(0.0, ${f(CONTACT_FADE_M)}, vUvm.y));
  diffuseColor.rgb = mix(diffuseColor.rgb, ${GLASS}, m);
}
`;

function buildingMaterial(rise: { value: number }, local: { value: THREE.Vector2 }) {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRise = rise;
    shader.uniforms.uLocal = local;
    shader.vertexShader = VERTEX_HEAD + shader.vertexShader.replace("#include <begin_vertex>", VERTEX_RISE);
    shader.fragmentShader = FRAGMENT_HEAD + shader.fragmentShader.replace("#include <color_fragment>", FRAGMENT_WINDOWS);
  };
  // Every phase shares one compiled program; only the uniforms differ.
  mat.customProgramCacheKey = () => "ymf-buildings";
  return mat;
}

export async function loadManifest(base: string): Promise<UpgradeManifest> {
  const r = await fetch(`${base}/upgrade/manifest.json`);
  if (!r.ok) throw new Error(`upgrade manifest ${r.status}`);
  return r.json();
}

export async function loadBuildings(base: string, m: UpgradeManifest): Promise<BuildingMesh[]> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(`${base}/upgrade/${m.buildings}`);
  const out: BuildingMesh[] = [];
  gltf.scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const match = /^phase(\d)$/.exec(o.name);
    if (!match) { disposeMesh(mesh); return; }
    const rise = { value: 1 };
    const local = { value: new THREE.Vector2(mesh.position.y, mesh.scale.y) };
    (mesh.material as THREE.Material).dispose();
    mesh.material = buildingMaterial(rise, local);
    out.push({ phase: Number(match[1]), mesh, setRise: (e) => { rise.value = Math.max(MIN_RISE, e); } });
  });
  return out;
}

export function disposeMesh(mesh: THREE.Mesh) {
  mesh.geometry.dispose();
  (mesh.material as THREE.Material).dispose();
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => (im.decode ? im.decode().catch(() => undefined) : Promise.resolve()).then(() => res(im));
    im.onerror = rej;
    im.src = src;
  });
}
