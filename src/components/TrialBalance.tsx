'use client';

import { useEffect, useState } from 'react';
import { world, clamp } from '@/lib/world';

const TOTAL = 486213;
const inr = (n: number) => '₹ ' + n.toLocaleString('en-IN');

// Decorative figures. The difference closes to zero as the page scrolls to attempt 02.
export default function TrialBalance() {
  const [diff, setDiff] = useState(6527);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const k = clamp(world.chaos / 0.9, 0, 1);
      let d = k < 0.004 ? 0 : Math.round(k * 6527 + Math.sin(world.time * 3) * k * 9);
      d = Math.max(0, d);
      if (d !== last) {
        last = d;
        setDiff(d);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ok = diff === 0;
  return (
    <aside className={`hud${ok ? ' ok' : ''}`} aria-label="Decorative trial balance that closes as you scroll">
      <header>
        <span>Trial balance</span>
        <i />
      </header>
      <div className="r dr"><span>Dr</span><b>{inr(TOTAL + diff)}</b></div>
      <div className="r cr"><span>Cr</span><b>{inr(TOTAL)}</b></div>
      <div className="r df"><span>{ok ? 'Balanced' : 'Out of balance'}</span><b>{inr(diff)}</b></div>
    </aside>
  );
}
