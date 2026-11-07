import { profile } from '@/data/profile';
import SplitText from './SplitText';
import CopyButton from './CopyButton';

export default function Contact() {
  const c = profile.contact;
  return (
    <section className="sec wrap contact" id="contact">
      <p className="eyebrow">{c.eyebrow}</p>
      <SplitText as="h2" text={c.title} />
      <p className="open">{c.openTo}</p>
      <div className="clist">
        {c.rows.map((r) => (
          <div className="crow" key={r.label}>
            <span className="mono">{r.label}</span>
            {r.href ? (
              <a className="cval" href={r.href} target={r.href.startsWith('http') ? '_blank' : undefined} rel={r.href.startsWith('http') ? 'noreferrer' : undefined}>
                {r.value}
              </a>
            ) : (
              <span className="cval">{r.value}</span>
            )}
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </section>
  );
}
