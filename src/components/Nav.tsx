import { profile } from '@/data/profile';

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-in">
        <a className="brand" href="#top">
          <span className="mk">CA</span>
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Sections">
          <ul>
            <li><a href="#journey">Journey</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
