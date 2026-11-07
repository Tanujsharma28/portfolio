import { profile } from '@/data/profile';
import SplitText from './SplitText';
import Tilt from './Tilt';

export default function Skills() {
  const s = profile.skills;
  return (
    <section className="sec wrap" id="skills">
      <p className="eyebrow">{s.eyebrow}</p>
      <SplitText as="h2" text={s.title} />
      <div className="grid">
        {s.items.map((it, i) => (
          <Tilt key={it.title} className={`card ${i % 2 === 0 ? 'a' : 'b'}`}>
            <div className="sym">{it.sym}</div>
            <h3>{it.title}</h3>
            <p>{it.note}</p>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
