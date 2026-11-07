import Image from 'next/image';
import { profile } from '@/data/profile';
import SplitText from './SplitText';
import Stamp from './Stamp';

const metrics = [
  { value: '2nd', label: 'attempt' },
  { value: 'CA', label: 'qualified' },
  { value: 'Audit', label: 'focus' },
];

export default function Hero() {
  return (
    <section className="hero wrap" id="top">
      <p className="eyebrow">
        <span className="pip" />
        <span>{profile.role}</span>
        <span>·</span>
        <span>{profile.qualified}</span>
      </p>
      <SplitText as="h1" className="intro" text={profile.name} />
      <div className="hero-row">
        <div className="hero-copy">
          <p className="lede">{profile.about}</p>
          <div className="hero-metrics" aria-label="Key summary stats">
            {metrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
        {profile.photo ? (
          <Image className="photo" src={profile.photo} alt={profile.name} width={220} height={280} priority />
        ) : null}
        <Stamp {...profile.stamp} />
      </div>
      <div className="cta">
        <a className="btn" data-magnet href="#journey">Read the journey</a>
        <a className="btn ghost" data-magnet href="#contact">Contact</a>
        <a className="btn ghost" data-magnet href={profile.resume.href} target="_blank" rel="noreferrer">{profile.resume.label}</a>
      </div>
      <p className="hint mono">Move your cursor or touch the screen. Click for a shockwave.</p>
    </section>
  );
}
