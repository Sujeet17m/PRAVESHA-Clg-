import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Zap, Calendar, Award, ChevronDown } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';
import themeImage from '../assets/hero.png';
import HeroScene from './HeroScene';

const TARGET = new Date('2026-04-09T09:00:00');

function useCountdown() {
  const calc = () => {
    const diff = TARGET.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const Hero: React.FC = () => {
  const { days, hours, minutes, seconds } = useCountdown();

  const tagRef       = useRef<HTMLSpanElement>(null);
  const h1Ref        = useRef<HTMLHeadingElement>(null);
  const paraRef      = useRef<HTMLParagraphElement>(null);
  const chipsRef     = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const chevronRef   = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(tagRef.current,       { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, 0.2)
      .fromTo(h1Ref.current,        { opacity: 0, y: 20  }, { opacity: 1, y: 0, duration: 0.6 }, 0.35)
      .fromTo(paraRef.current,      { opacity: 0         }, { opacity: 1,        duration: 0.5 }, 0.5)
      .fromTo(chipsRef.current,     { opacity: 0, y: 10  }, { opacity: 1, y: 0, duration: 0.5 }, 0.6)
      .fromTo(countdownRef.current, { opacity: 0, y: 10  }, { opacity: 1, y: 0, duration: 0.5 }, 0.7)
      .fromTo(ctaRef.current,       { opacity: 0, y: 10  }, { opacity: 1, y: 0, duration: 0.5 }, 0.8);
    gsap.to(chevronRef.current, { y: 8, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' });
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(5rem, 12vw, 7rem)',
        paddingBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div className="hero-bg-container">
        <img src={themeImage} alt="Cyber Dragon Background" className="hero-bg-image" />
        <div className="hero-bg-overlay" />
      </div>
      <div className="scan-line" />

      <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <div className="hero-grid-2col">

          {/* ── LEFT: Text ─────────────────────────────────────────────────── */}
          <div style={{ maxWidth: '700px' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span ref={tagRef} className="section-tag" style={{ opacity: 0 }}>
                DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING PRESENTS
              </span>
            </div>

            <h1
              ref={h1Ref}
              style={{
                opacity: 0,
                fontSize: 'clamp(2.2rem, 6vw, 4.8rem)',
                lineHeight: 1.1, marginBottom: '0.9rem', color: '#fff',
              }}
            >
              NATIONAL LEVEL<br />
              SYMPOSIUM<br />
              <span className="glitch" data-text="PRAVESHA" style={{ color: 'var(--neon-red)' }}>PRAVESHA</span><br />
              <span style={{
                background: 'linear-gradient(135deg,var(--neon-blue),#7dd3fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>2K26</span>
            </h1>

            <p ref={paraRef} style={{
              opacity: 0, fontSize: '1.1rem', color: 'var(--text-secondary)',
              marginBottom: '1.5rem', borderLeft: '4px solid var(--neon-red)',
              paddingLeft: '1.2rem', lineHeight: 1.7, maxWidth: '560px',
            }}>
              Synthesizing Technology, Celebrating Talent.<br />
              The ultimate engineering technical symposium.
            </p>

            {/* Info Chips */}
            <div ref={chipsRef} style={{ opacity: 0, display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { icon: <Calendar size={18} color="var(--neon-red)" />, label: 'DATE',  value: 'APRIL 09, 2026' },
                { icon: <Award    size={18} color="var(--neon-blue)"/>, label: 'PRIZE', value: 'CASH PRIZES'    },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '0.6rem 1rem',
                  minWidth: '160px', flex: '1 0 auto',
                }}>
                  {item.icon}
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1.5px' }}>{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 'clamp(0.8rem,2vw,1rem)', fontFamily: 'Orbitron', whiteSpace: 'nowrap' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div ref={countdownRef} style={{ opacity: 0, marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '3px', marginBottom: '0.75rem' }}>
                EVENT STARTS IN
              </div>
              <div className="countdown-row">
                {[
                  { val: days, label: 'DAYS' }, { val: hours,   label: 'HRS' },
                  { val: minutes, label: 'MIN' }, { val: seconds, label: 'SEC' },
                ].map(({ val, label }) => (
                  <div key={label} className="countdown-box">
                    <span className="countdown-num">{String(val).padStart(2, '0')}</span>
                    <span className="countdown-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} style={{ opacity: 0, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => smoothScrollTo('#events')} style={{ padding: '0.9rem 2rem' }}>
                <Zap size={18} /> Explore Events
              </button>
              <a href="https://instagram.com/PRAVESHA_2K26" target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }}>
                @PRAVESHA_2K26
              </a>
            </div>
          </div>

          {/* ── RIGHT: 3D Neural Network Scene ─────────────────────────────── */}
          <div className="hero-right-col">
            <div className="hero-scene-wrapper">
              <HeroScene />
            </div>
          </div>

        </div>
      </div>

      <div
        ref={chevronRef}
        style={{
          position: 'absolute', bottom: '1.5rem', left: '50%',
          transform: 'translateX(-50%)', color: 'var(--text-secondary)',
          cursor: 'pointer', zIndex: 3,
        }}
        onClick={() => smoothScrollTo('#about')}
      >
        <ChevronDown size={26} />
      </div>
    </section>
  );
};

export default Hero;
