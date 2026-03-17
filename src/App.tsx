import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Coordinators from './components/Coordinators';
import ComboEvent from './components/ComboEvent';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import DragonCursor from './components/DragonCursor';
import SparkCanvas from './components/SparkCanvas';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* ── Cinematic Loading Overlay ──────────────────── */}
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      {/* ── Custom Dragon Cursor (desktop only) ──────── */}
      <DragonCursor />

      {/* ── Global Ember Spark Effect ─────────────────── */}
      <SparkCanvas />

      {/* ── Background Layers ─────────────────────────── */}
      <div className="bg-grid" />
      <div className="bg-glow-red" />
      <div className="bg-glow-blue" />

      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Events />
        <ComboEvent />
        <Coordinators />
      </main>
      <Footer />
    </div>
  );
}

export default App;
