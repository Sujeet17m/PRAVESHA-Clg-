import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { smoothScrollTo } from '../utils/smoothScroll';

const links = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Events',       href: '#events' },
  { label: 'Coordinators', href: '#coordinators' },
];

// Registration URL — update when form goes live
const REGISTER_URL = 'https://forms.gle/example'; // ← replace with actual form URL

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [active, setActive] = useState('#home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleRegister = () => {
    window.open(REGISTER_URL, '_blank', 'noopener,noreferrer');
  };

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
  }, []);

  // Mobile menu open/close animation
  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;
    if (isOpen) {
      gsap.fromTo(el,
        { opacity: 0, y: -10, scale: 0.97, display: 'flex' },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      );
    } else {
      gsap.to(el, { opacity: 0, y: -10, scale: 0.97, duration: 0.15, ease: 'power2.in' });
    }
  }, [isOpen]);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 30);
      if (currentY > lastY && currentY > 100) {
        setIsVisible(false);
        setIsOpen(false);
      } else {
        setIsVisible(true);
      }
      lastY = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);
    window.addEventListener('modal-open', handleOpen);
    window.addEventListener('modal-close', handleClose);
    return () => {
      window.removeEventListener('modal-open', handleOpen);
      window.removeEventListener('modal-close', handleClose);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="glass-panel"
      style={{
        position: 'fixed',
        top: isVisible ? '1rem' : '-6rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '1200px',
        zIndex: 100,
        padding: '0.75rem 1.25rem',
        display: isModalOpen ? 'none' : 'flex',
        opacity: isModalOpen ? 0 : 1,
        pointerEvents: isModalOpen ? 'none' : 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: scrolled
          ? '0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,42,42,0.12)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        transition: 'top 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'Orbitron', fontWeight: 900,
          fontSize: 'clamp(1rem, 4vw, 1.4rem)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0,
        }}
      >
        <div className="pulse-dot" style={{ flexShrink: 0 }} />
        <span
          className="glitch"
          data-text="PRAVESHA"
          style={{ color: 'var(--neon-red)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          PRAVESHA
        </span>
      </div>

      {/* Desktop Links */}
      <div style={{ display: 'none', gap: '0.25rem', alignItems: 'center' }} className="desktop-nav">
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={e => { e.preventDefault(); setActive(link.href); smoothScrollTo(link.href); }}
            style={{
              color: active === link.href ? 'var(--neon-blue)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.95rem', padding: '0.5rem 1rem',
              borderRadius: '8px',
              background: active === link.href ? 'rgba(0,212,255,0.08)' : 'transparent',
              transition: 'all 0.2s', letterSpacing: '0.5px',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          className="btn btn-primary"
          style={{ marginLeft: '1rem', padding: '0.6rem 1.4rem' }}
          onClick={handleRegister}
          aria-label="Register for PRAVESHA 2K26"
        >
          Register
        </button>
      </div>

      {/* Mobile Toggle */}
      <div
        className="mobile-toggle"
        style={{
          display: 'flex', cursor: 'pointer', padding: '0.4rem',
          borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X color="var(--neon-red)" size={22} /> : <Menu color="var(--neon-blue)" size={22} />}
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="glass-panel"
        style={{
          display: isOpen ? 'flex' : 'none',
          position: 'absolute', top: 'calc(100% + 0.75rem)', left: 0, width: '100%',
          padding: '1.5rem', flexDirection: 'column', gap: '0.5rem',
        }}
      >
        {links.map(link => (
          <a
            key={link.href}
            href={link.href}
            onClick={e => { e.preventDefault(); setIsOpen(false); setActive(link.href); smoothScrollTo(link.href); }}
            style={{
              color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem',
              padding: '0.75rem 1rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid var(--neon-blue)',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
          onClick={() => { setIsOpen(false); handleRegister(); }}
          aria-label="Register for PRAVESHA 2K26"
        >
          Register Now
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
