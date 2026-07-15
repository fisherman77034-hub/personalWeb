import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={navRef}>
      <Nav scrolled={scrolled} />
      <main>
        <Hero />
        <About />
        <Skills />
      </main>
      <Footer />
    </div>
  );
}

export default App;
