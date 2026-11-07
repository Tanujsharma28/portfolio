'use client';

import { useEffect } from 'react';
import { world, clamp, lerp, sstep, shock, monoFamily } from '@/lib/world';

const GLYPHS = ['₹', 'Dr', 'Cr', '0', '1', 'Σ', '%', '+', '−', '=', '7', '4', '9', 'Δ'];
const PAPER = [238, 234, 223];
const AMBER = [255, 179, 71];
const TEAL = [79, 209, 197];
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;

type Drop = {
  x: number; y: number; vx: number; vy: number; life: number; max: number;
  g: string; c: number; s: number; r: number; vr: number;
};
type Letter = { el: HTMLElement; cx: number; cy: number; x: number; y: number; r: number; s: number; m: number; side: number; on: boolean };
type Magnet = { el: HTMLElement; x: number; y: number };

// Pointer tracking, cursor, glyph trail, ruled-paper reveal, letter push, magnetic buttons
// and the scroll story that drives the 3D scene. One rAF loop runs all of it.
export default function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    const ptr = world.ptr;
    const ac = new AbortController();
    const opt = { passive: true, signal: ac.signal } as AddEventListenerOptions;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const calcSmall = () => innerWidth < 720 || matchMedia('(pointer: coarse)').matches;
    world.reduce = reduce;
    world.small = calcSmall();
    ptr.x = innerWidth * 0.7;
    ptr.y = innerHeight * 0.35;

    /* ---- pointer ---- */
    let offT: ReturnType<typeof setTimeout> | undefined;
    const setPtr = (x: number, y: number) => {
      ptr.x = x; ptr.y = y;
      ptr.nx = (x / innerWidth) * 2 - 1;
      ptr.ny = -((y / innerHeight) * 2 - 1);
      ptr.on = 1; ptr.seen = true;
      clearTimeout(offT);
      root.style.setProperty('--mx', x + 'px');
      root.style.setProperty('--my', y + 'px');
    };

    /* ---- glyph trail ---- */
    const tc = document.getElementById('trail') as HTMLCanvasElement;
    const tx = tc.getContext('2d') as CanvasRenderingContext2D;
    let TW = 0, TH = 0;
    const sizeTrail = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      TW = innerWidth; TH = innerHeight;
      tc.width = Math.round(TW * d); tc.height = Math.round(TH * d);
      tx.setTransform(d, 0, 0, d, 0, 0);
    };
    const drops: Drop[] = [];
    let lx: number | null = null, ly = 0, acc = 0, trailDirty = false;
    const spawn = (x: number, y: number, vx: number, vy: number, big: boolean) => {
      if (drops.length > 240) drops.shift();
      drops.push({
        x, y, vx, vy, life: 0, max: 0.9 + Math.random() * 0.9,
        g: GLYPHS[(Math.random() * GLYPHS.length) | 0], c: vx >= 0 ? 0 : 1,
        s: 13 + Math.random() * (big ? 16 : 9), r: (Math.random() - 0.5) * 0.8, vr: (Math.random() - 0.5) * 2.4,
      });
    };
    const trailMove = (x: number, y: number) => {
      if (reduce) return;
      if (lx != null) {
        acc += Math.hypot(x - lx, y - ly);
        if (acc > 32) {
          acc = 0;
          spawn(x, y, (x - lx) * 2.2 + (Math.random() - 0.5) * 40, (y - ly) * 2.2 - 30, false);
        }
      }
      lx = x; ly = y;
    };
    const burst = (x: number, y: number) => {
      if (reduce) return;
      for (let i = 0; i < 18; i++) {
        const a = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
        const v = 120 + Math.random() * 230;
        spawn(x, y, Math.cos(a) * v, Math.sin(a) * v - 40, true);
      }
    };
    world.burst = burst;
    const fam = monoFamily();
    const drawTrail = (dt: number) => {
      if (!drops.length) {
        if (trailDirty) { tx.clearRect(0, 0, TW, TH); trailDirty = false; }
        return;
      }
      trailDirty = true;
      tx.clearRect(0, 0, TW, TH);
      tx.globalCompositeOperation = 'lighter';
      tx.textAlign = 'center';
      tx.textBaseline = 'middle';
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life += dt / d.max;
        if (d.life >= 1) { drops.splice(i, 1); continue; }
        d.vy += 260 * dt; d.vx *= 0.985; d.x += d.vx * dt; d.y += d.vy * dt; d.r += d.vr * dt;
        tx.save();
        tx.translate(d.x, d.y);
        tx.rotate(d.r);
        tx.globalAlpha = Math.pow(1 - d.life, 1.6);
        tx.fillStyle = d.c ? '#4fd1c5' : '#ffb347';
        tx.font = `500 ${d.s}px ${fam}`;
        tx.fillText(d.g, 0, 0);
        tx.restore();
      }
      tx.globalAlpha = 1;
    };

    addEventListener('pointermove', (e) => { setPtr(e.clientX, e.clientY); trailMove(e.clientX, e.clientY); }, opt);
    addEventListener('pointerdown', (e) => {
      setPtr(e.clientX, e.clientY); shock(e.clientX, e.clientY, 0.6); burst(e.clientX, e.clientY);
    }, opt);
    addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'mouse') {
        clearTimeout(offT);
        offT = setTimeout(() => { ptr.on = 0; lx = null; }, 600);
      }
    }, opt);
    addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      setPtr(t.clientX, t.clientY); trailMove(t.clientX, t.clientY);
    }, opt);
    root.addEventListener('mouseleave', () => { ptr.on = 0; lx = null; }, { signal: ac.signal });

    /* ---- custom cursor ---- */
    const cur = document.querySelector('.cursor') as HTMLElement;
    const dotEl = cur.querySelector('.dot') as HTMLElement;
    const ringEl = cur.querySelector('.ring') as HTMLElement;
    if (finePointer) root.classList.add('has-cursor');
    let rx = ptr.x, ry = ptr.y;
    document.addEventListener('pointerover', (e) => {
      const t = (e.target as HTMLElement)?.closest?.('a,button,[data-tilt],[data-hover]');
      cur.classList.toggle('hot', !!t);
    }, { signal: ac.signal });

    /* ---- letters that run away from the cursor ---- */
    const letters: Letter[] = Array.from(document.querySelectorAll<HTMLElement>('.l')).map((el) => ({
      el, cx: 0, cy: 0, x: 0, y: 0, r: 0, s: 1, m: 0, side: 0, on: false,
    }));
    const offsetOf = (el: HTMLElement) => {
      let x = 0, y = 0;
      let n: HTMLElement | null = el;
      while (n) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
      return [x, y];
    };
    const measure = () => {
      letters.forEach((L) => {
        const o = offsetOf(L.el);
        L.cx = o[0] + L.el.offsetWidth / 2;
        L.cy = o[1] + L.el.offsetHeight / 2;
      });
    };
    const updateLetters = () => {
      const px = ptr.x + scrollX, py = ptr.y + scrollY;
      const R = world.small ? 120 : 190;
      const live = ptr.on && ptr.seen;
      const mid = scrollY + innerHeight / 2, lim = innerHeight * 1.2;
      for (const L of letters) {
        if (!L.on && Math.abs(L.cy - mid) > lim) continue;
        let tX = 0, tY = 0, tR = 0, tS = 1, tM = 0;
        if (live) {
          const dx = L.cx - px, dy = L.cy - py;
          if (Math.abs(dx) < R && Math.abs(dy) < R) {
            const d = Math.hypot(dx, dy);
            if (d < R) {
              const f = Math.pow(1 - d / R, 2), k = d || 1;
              tX = (dx / k) * f * 38; tY = (dy / k) * f * 38 - f * 10;
              tR = (dx > 0 ? 1 : -1) * f * 16; tS = 1 + f * 0.22; tM = f; L.side = dx > 0 ? 1 : 0;
            }
          }
        }
        L.x = lerp(L.x, tX, 0.16); L.y = lerp(L.y, tY, 0.16); L.r = lerp(L.r, tR, 0.16);
        L.s = lerp(L.s, tS, 0.16); L.m = lerp(L.m, tM, 0.16);
        const act = Math.abs(L.x) + Math.abs(L.y) + Math.abs(L.r) + Math.abs(L.s - 1) * 10 + L.m > 0.03;
        if (act) {
          L.el.style.transform = `translate(${L.x.toFixed(1)}px,${L.y.toFixed(1)}px) rotate(${L.r.toFixed(1)}deg) scale(${L.s.toFixed(3)})`;
          L.el.style.color = mix(PAPER, L.side ? TEAL : AMBER, clamp(L.m * 1.4, 0, 1));
          L.on = true;
        } else if (L.on) {
          L.el.style.transform = ''; L.el.style.color = ''; L.on = false;
        }
      }
    };

    /* ---- magnetic buttons ---- */
    const mags: Magnet[] = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]')).map((el) => ({ el, x: 0, y: 0 }));
    const updateMags = () => {
      for (const M of mags) {
        const r = M.el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - M.x, cy = r.top + r.height / 2 - M.y;
        let tX = 0, tY = 0;
        if (ptr.on && ptr.seen) {
          const dx = ptr.x - cx, dy = ptr.y - cy;
          const R = Math.max(r.width, r.height) * 0.85;
          if (Math.hypot(dx, dy) < R) { tX = dx * 0.3; tY = dy * 0.3; }
        }
        M.x = lerp(M.x, tX, 0.18); M.y = lerp(M.y, tY, 0.18);
        if (Math.abs(M.x) > 0.05 || Math.abs(M.y) > 0.05) M.el.style.transform = `translate(${M.x.toFixed(1)}px,${M.y.toFixed(1)}px)`;
        else if (M.el.style.transform) M.el.style.transform = '';
      }
    };

    /* ---- scroll story: where the galaxy starts and finishes balancing ---- */
    let yA = 0, yB = 1;
    const layout = () => {
      const j = document.getElementById('journey');
      const k = document.getElementById('balance-point');
      if (j && k) {
        yA = j.getBoundingClientRect().top + scrollY - innerHeight * 0.55;
        yB = k.getBoundingClientRect().top + scrollY - innerHeight * 0.3;
        if (yB <= yA + 50) yB = yA + 50;
      }
      world.small = calcSmall();
      measure();
      sizeTrail();
      world.sceneResize?.();
    };
    let layoutT: ReturnType<typeof setTimeout> | undefined;
    const queueLayout = () => { clearTimeout(layoutT); layoutT = setTimeout(layout, 80); };
    addEventListener('resize', queueLayout, { signal: ac.signal });
    const ro = new ResizeObserver(queueLayout);
    ro.observe(document.body);
    document.fonts?.ready.then(() => { layout(); world.sceneRebuild?.(); });
    layout();

    /* ---- main loop ---- */
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      world.time += dt * (reduce ? 0.25 : 1);
      if (world.click.t < 90) world.click.t += dt;
      world.prog = sstep(yA, yB, scrollY);
      world.chaos = 0.9 * (1 - world.prog);

      if (finePointer) {
        dotEl.style.transform = `translate3d(${ptr.x}px,${ptr.y}px,0)`;
        rx = lerp(rx, ptr.x, 0.2); ry = lerp(ry, ptr.y, 0.2);
        ringEl.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
        cur.style.opacity = ptr.seen && ptr.on ? '1' : '0';
      }
      if (!reduce) updateLetters();
      updateMags();
      drawTrail(dt);
      world.sceneFrame?.(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(layoutT);
      clearTimeout(offT);
      ro.disconnect();
      ac.abort();
      world.burst = null;
      root.classList.remove('has-cursor');
      letters.forEach((L) => { L.el.style.transform = ''; L.el.style.color = ''; });
    };
  }, []);

  return (
    <>
      <div className="ruling" aria-hidden="true" />
      <canvas id="trail" aria-hidden="true" />
      <div className="cursor" aria-hidden="true">
        <i className="ring" />
        <i className="dot" />
      </div>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
      </svg>
    </>
  );
}
