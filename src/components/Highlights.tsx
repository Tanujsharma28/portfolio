import { profile } from '@/data/profile';
import SplitText from './SplitText';
import Tilt from './Tilt';

export default function Highlights() {
  const h = profile.highlights;

  return (
    <section className="sec wrap" id="highlights">
      <p className="eyebrow">{h.eyebrow}</p>
      <SplitText as="h2" text={h.title} />
      <div className="highlights-grid">
        {h.items.map((item, index) => (
          <Tilt key={item.title} className={`highlight-card ${index % 2 === 0 ? 'a' : 'b'}`}>
            <span className="highlight-index mono">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.note}</p>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
