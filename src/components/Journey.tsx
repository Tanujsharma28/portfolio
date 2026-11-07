import { profile } from '@/data/profile';
import SplitText from './SplitText';
import Tilt from './Tilt';

export default function Journey() {
  const j = profile.journey;
  return (
    <section className="sec wrap" id="journey">
      <p className="eyebrow">{j.eyebrow}</p>
      <SplitText as="h2" text={j.title} />
      <p className="sub">{j.intro}</p>
      <div className="ledger">
        {j.entries.map((e) => (
          <Tilt key={e.ref} className="entry" id={e.key ? 'balance-point' : undefined}>
            <div className="ref">
              <span className="mono">{e.ref}</span>
              <b>{e.title}</b>
            </div>
            <div className="cell dr">
              <span className="tag mono">Dr · Effort</span>
              <p>{e.effort}</p>
            </div>
            <div className="cell cr">
              <span className="tag mono">Cr · Result</span>
              <p>{e.result}</p>
            </div>
          </Tilt>
        ))}
        <Tilt className="entry total">
          <div className="ref">
            <span className="mono">{j.close.ref}</span>
            <b>{j.close.title}</b>
          </div>
          <div className="cell wide">
            <p className="big">
              <em>Dr</em> = <i>Cr</i>
            </p>
            <p>{j.close.line}</p>
          </div>
        </Tilt>
      </div>
    </section>
  );
}
