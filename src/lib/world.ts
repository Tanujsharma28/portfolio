// Shared mutable state read by the 3D scene, the effects layer and the trial balance.
// It lives outside React on purpose: it changes every frame.

export type Pointer = {
  x: number;
  y: number;
  nx: number;
  ny: number;
  on: number;
  seen: boolean;
};

export const world = {
  ptr: { x: 0, y: 0, nx: 0.4, ny: 0.3, on: 0, seen: false } as Pointer,
  time: 0,
  prog: 0, // 0 at the top, 1 once attempt 02 is posted
  chaos: 0.9,
  pulse: 0,
  click: { x: 0, y: 0, t: 99 },
  small: false,
  reduce: false,
  burst: null as null | ((x: number, y: number) => void),
  sceneFrame: null as null | ((dt: number) => void),
  sceneResize: null as null | (() => void),
  sceneRebuild: null as null | (() => void),
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// Fires the shockwave through the galaxy from a screen position (in px).
export function shock(x: number, y: number, power = 0.6) {
  world.click.x = (x / innerWidth) * 2 - 1;
  world.click.y = -((y / innerHeight) * 2 - 1);
  world.click.t = 0;
  world.pulse = Math.max(world.pulse, power);
}

// Canvas needs the real family name that next/font generated.
export function monoFamily(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim();
  return (v ? v + ', ' : '') + 'monospace';
}
