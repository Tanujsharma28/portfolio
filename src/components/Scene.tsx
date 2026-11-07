'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { world, lerp, monoFamily } from '@/lib/world';

const VERT = /* glsl */ `
attribute float aSeed; attribute float aSide; attribute float aR; attribute float aA; attribute float aY;
uniform float uTime; uniform float uChaos; uniform float uSize; uniform float uPx; uniform float uAspect;
uniform vec2 uMouse; uniform float uMouseOn; uniform vec2 uClick; uniform float uClickT;
varying vec3 vColor;
void main(){
  float dir = aSide > 0.5 ? -1.0 : 1.0;
  float w = dir * (0.5 / (0.7 + aR * 0.3));
  float an = aA + uTime * w;
  vec3 p = vec3(cos(an) * aR, aY, sin(an) * aR);
  float s = aSeed;
  vec3 n = vec3(sin(uTime*0.6 + s*37.0), cos(uTime*0.5 + s*53.0), sin(uTime*0.7 + s*71.0));
  float k = 0.4 + 1.6 * fract(s * 91.7);
  p += n * uChaos * k;
  p.x -= dir * uChaos * 2.6;
  p.y += dir * uChaos * 0.9;
  p *= 1.0 + 0.025 * sin(uTime * 0.8 + aR);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  vec2 df = ndc - uMouse; df.x *= uAspect; float d = length(df);
  float f = smoothstep(0.4, 0.0, d) * uMouseOn;
  vec2 dn = df / (d + 0.0001); vec2 pp = vec2(-dn.y, dn.x);
  vec2 off = dn * f * 0.11 + pp * f * 0.07 * dir;
  vec2 dc = ndc - uClick; dc.x *= uAspect; float dcl = length(dc);
  float rr = uClickT * 0.95; float q = (dcl - rr) / 0.09;
  float wave = exp(-q * q) * exp(-uClickT * 1.4);
  off += (dc / (dcl + 0.0001)) * wave * 0.17;
  off.x /= uAspect;
  ndc += off;
  gl_Position = vec4(ndc * clip.w, clip.z, clip.w);
  float tw = 0.6 + 0.8 * fract(s * 13.1);
  gl_PointSize = uSize * tw * (1.0 + f * 1.6 + wave * 2.4) * (uPx * 30.0 / -mv.z);
  vec3 base = dir > 0.0 ? vec3(1.0, 0.70, 0.28) : vec3(0.31, 0.82, 0.77);
  float gc = 1.0 + 1.1 * exp(-aR * 0.6);
  float br = (0.5 + 0.6 * fract(s * 7.3)) * gc;
  vColor = mix(base * br, vec3(1.0), clamp(f * 0.6 + wave * 0.7, 0.0, 1.0));
}`;

const FRAG = /* glsl */ `
varying vec3 vColor;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d); a = a * a;
  gl_FragColor = vec4(vColor, a * 0.6);
}`;

type Glyph = { m: THREE.Sprite; bx: number; by: number; bz: number; ph: number; ox: number; oy: number; vx: number; vy: number };

// Two counter-rotating particle clouds: Dr (amber) and Cr (teal).
// Their separation is driven by world.chaos, which falls to zero as the page scrolls to attempt 02.
export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      document.documentElement.classList.add('nogl');
      canvas.style.display = 'none';
      return;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0.6, 10);
    const root = new THREE.Group();
    root.rotation.x = 1.05;
    scene.add(root);

    /* particles */
    const N = world.small ? 3600 : 9000;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N), side = new Float32Array(N), rad = new Float32Array(N);
    const ang = new Float32Array(N), yy = new Float32Array(N);
    const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;
    for (let i = 0; i < N; i++) {
      const s = i % 2;
      const r = 0.35 + Math.pow(Math.random(), 0.65) * 6.2;
      const arm = Math.random() < 0.5 ? 0 : 1;
      side[i] = s; rad[i] = r; seed[i] = Math.random();
      ang[i] = arm * Math.PI + (s ? -1 : 1) * r * 0.62 + gauss() * (0.25 + 0.05 * r);
      yy[i] = gauss() * (0.9 * Math.exp(-r * 0.45) + 0.12);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geo.setAttribute('aSide', new THREE.BufferAttribute(side, 1));
    geo.setAttribute('aR', new THREE.BufferAttribute(rad, 1));
    geo.setAttribute('aA', new THREE.BufferAttribute(ang, 1));
    geo.setAttribute('aY', new THREE.BufferAttribute(yy, 1));

    const U = {
      uTime: { value: 0 }, uChaos: { value: 0.9 }, uSize: { value: 1.25 }, uPx: { value: 1 }, uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) }, uMouseOn: { value: 0 },
      uClick: { value: new THREE.Vector2(0, 0) }, uClickT: { value: 99 },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: U, vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    root.add(pts);

    /* wireframe core and glow */
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshBasicMaterial({ color: 0xeeeadf, wireframe: true, transparent: true, opacity: 0.4 }),
    );
    scene.add(core);
    const gc = document.createElement('canvas');
    gc.width = gc.height = 128;
    const g2 = gc.getContext('2d') as CanvasRenderingContext2D;
    const grd = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,240,215,.95)');
    grd.addColorStop(0.25, 'rgba(255,200,120,.35)');
    grd.addColorStop(0.6, 'rgba(79,209,197,.12)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g2.fillStyle = grd;
    g2.fillRect(0, 0, 128, 128);
    const glowTex = new THREE.CanvasTexture(gc);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 }),
    );
    glow.scale.set(4.6, 4.6, 1);
    scene.add(glow);

    /* floating glyphs that get pushed by the cursor */
    let glyphs: Glyph[] = [];
    const glyphTex = (text: string, color: string) => {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const x = c.getContext('2d') as CanvasRenderingContext2D;
      x.fillStyle = color;
      x.font = `500 ${text.length > 1 ? 58 : 84}px ${monoFamily()}`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(text, 64, 68);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const clearGlyphs = () => {
      glyphs.forEach((g) => {
        scene.remove(g.m);
        g.m.material.map?.dispose();
        g.m.material.dispose();
      });
      glyphs = [];
    };
    const buildGlyphs = () => {
      clearGlyphs();
      const list = ['₹', 'Dr', 'Cr', 'Σ', '0', '1', '%', '=', 'Δ', '7', '₹', 'Cr', 'Dr', '+', '9', '−', '4', 'Σ'];
      const count = world.small ? 12 : list.length;
      for (let i = 0; i < count; i++) {
        const m = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glyphTex(list[i], i % 2 === 0 ? '#ffb347' : '#4fd1c5'),
            transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending,
          }),
        );
        const a = Math.random() * Math.PI * 2;
        const rr = 3.2 + Math.random() * 5.5;
        const sc = 0.6 + Math.random() * 0.7;
        m.scale.set(sc, sc, 1);
        scene.add(m);
        glyphs.push({ m, bx: Math.cos(a) * rr, by: Math.sin(a) * rr * 0.62, bz: -3 + Math.random() * 5, ph: Math.random() * 6.28, ox: 0, oy: 0, vx: 0, vy: 0 });
      }
    };
    buildGlyphs();

    const mouse = { x: 0, y: 0, on: 0 };
    const mw = new THREE.Vector3();
    const tmp = new THREE.Vector3();

    const resize = () => {
      const w = innerWidth, h = innerHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, world.small ? 1.5 : 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      U.uPx.value = renderer.getPixelRatio();
      U.uAspect.value = w / h;
    };
    resize();

    const frame = (dt: number) => {
      const ptr = world.ptr;
      const idle = !ptr.seen;
      const tX = idle ? 0.45 * Math.sin(world.time * 0.5) : ptr.nx;
      const tY = idle ? 0.25 * Math.cos(world.time * 0.7) + 0.1 : ptr.ny;
      const tOn = idle ? 0.55 : ptr.on;
      mouse.x = lerp(mouse.x, tX, 0.22);
      mouse.y = lerp(mouse.y, tY, 0.22);
      mouse.on = lerp(mouse.on, tOn, 0.08);

      const prog = world.prog;
      const wide = camera.aspect > 1.15 ? 1 : 0;
      root.position.x = wide * 2.5 * (1 - prog);
      root.position.y = lerp(root.position.y, wide ? 0 : 1.2 * (1 - prog), 0.1);
      root.rotation.x = 1.05 - 0.35 * prog;
      root.rotation.y = lerp(root.rotation.y, mouse.x * 0.32, 0.04);
      root.rotation.z = lerp(root.rotation.z, mouse.x * 0.06 + prog * 0.25, 0.04);
      camera.position.x = lerp(camera.position.x, mouse.x * 0.7, 0.04);
      camera.position.y = lerp(camera.position.y, mouse.y * 0.5 + 0.6, 0.04);
      camera.position.z = 10 - 1.6 * prog;
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();

      core.position.set(root.position.x, root.position.y, 0);
      glow.position.copy(core.position);
      core.rotation.x += dt * 0.3;
      core.rotation.y += dt * 0.45;
      core.rotation.z = lerp(core.rotation.z, mouse.x * 0.8, 0.05);
      const sc = 1 + world.pulse * 0.7;
      core.scale.set(sc, sc, sc);
      (core.material as THREE.MeshBasicMaterial).opacity = 0.32 + world.pulse * 0.5 + mouse.on * 0.08;
      glow.scale.setScalar(4.6 + world.pulse * 3);
      world.pulse *= Math.pow(0.04, dt);

      // cursor position on the z=0 plane, for the glyph sprites
      tmp.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      mw.copy(camera.position).addScaledVector(tmp, -camera.position.z / tmp.z);
      for (const g of glyphs) {
        const px = g.bx + Math.sin(world.time * 0.25 + g.ph) * 0.7 + root.position.x * 0.6 + g.ox;
        const py = g.by + Math.cos(world.time * 0.3 + g.ph) * 0.5 + g.oy;
        const dx = px - mw.x, dy = py - mw.y, d = Math.hypot(dx, dy);
        if (d < 2.4 && mouse.on > 0.05) {
          const f = (1 - d / 2.4) * 0.5 * mouse.on;
          g.vx += (dx / (d + 0.01)) * f;
          g.vy += (dy / (d + 0.01)) * f;
        }
        g.vx *= 0.9; g.vy *= 0.9;
        g.ox += g.vx * 0.5; g.oy += g.vy * 0.5;
        g.ox *= 0.985; g.oy *= 0.985;
        g.m.position.set(px, py, g.bz);
        g.m.material.opacity = 0.38 + 0.2 * Math.sin(world.time * 0.8 + g.ph) + Math.min(0.3, Math.hypot(g.ox, g.oy) * 0.3);
      }

      U.uTime.value = world.time;
      U.uChaos.value = world.chaos;
      U.uMouse.value.set(mouse.x, mouse.y);
      U.uMouseOn.value = mouse.on;
      U.uClick.value.set(world.click.x, world.click.y);
      U.uClickT.value = world.click.t;
      renderer.render(scene, camera);
    };

    world.sceneFrame = frame;
    world.sceneResize = resize;
    world.sceneRebuild = buildGlyphs;

    return () => {
      world.sceneFrame = null;
      world.sceneResize = null;
      world.sceneRebuild = null;
      clearGlyphs();
      geo.dispose();
      mat.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      glowTex.dispose();
      (glow.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="scene" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
    </>
  );
}
