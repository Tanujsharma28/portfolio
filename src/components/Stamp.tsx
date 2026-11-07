'use client';

import { useEffect, useRef } from 'react';
import { world, shock } from '@/lib/world';

export default function Stamp({ top, main, bottom }: { top: string; main: string; bottom: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  const fire = (delay: number) =>
    setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight);
      shock(x, y, 1);
      world.burst?.(x, y);
    }, delay);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = fire(1500);
    return () => clearTimeout(t);
  }, []);

  const replay = () => {
    const el = ref.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'stampIn .55s cubic-bezier(.2,.8,.25,1) backwards';
    fire(380);
  };

  return (
    <button ref={ref} className="stamp" type="button" onClick={replay} aria-label="Replay the stamp">
      <span className="s1">{top}</span>
      <strong>{main}</strong>
      <span className="s2">{bottom}</span>
    </button>
  );
}
