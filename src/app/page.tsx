import Scene from '@/components/Scene';
import Effects from '@/components/Effects';
import TrialBalance from '@/components/TrialBalance';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Journey from '@/components/Journey';
import Skills from '@/components/Skills';
import Highlights from '@/components/Highlights';
import Contact from '@/components/Contact';

export default function Page() {
  return (
    <>
      <Scene />
      <Effects />
      <Nav />
      <main>
        <Hero />
        <Journey />
        <Skills />
        <Highlights />
        <Contact />
      </main>
      <footer className="mono">
        <span>Dr = Cr</span>
        <span>Built with Next.js and Three.js</span>
      </footer>
      <TrialBalance />
    </>
  );
}
