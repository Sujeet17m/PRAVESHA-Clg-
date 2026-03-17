import React from 'react';
import { Mail, Phone, Instagram, Heart, MapPin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer
    style={{
      position: 'relative', zIndex: 1,
      background: 'rgba(5,5,8,0.98)',
      borderTop: '1px solid rgba(255,42,42,0.18)',
      padding: '5rem 1.5rem 2.5rem',
      marginTop: '2rem',
    }}
  >
    <div className="container">

      {/* ── VENUE MAP — moved ABOVE quick-links ──────────────────────────── */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <MapPin size={20} color="var(--neon-red)" />
          <h3 style={{ fontSize: '1rem', color: 'white', fontFamily: 'Orbitron', letterSpacing: '2px', margin: 0 }}>
            VENUE LOCATION
          </h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          <span style={{ color: 'var(--neon-blue)', fontWeight: 600 }}>Vels University (VISTAS)</span><br />
          PV Vaithiyalingam Rd, Velan Nagar, Krishnapuram,<br />
          Pallavaram, Chennai, Tamil Nadu 600117<br />
          <span style={{ fontSize: '0.8rem' }}>Plus Code: X555+2W Chennai, Tamil Nadu</span>
        </p>

        <div
          className="map-container"
          style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,42,42,0.2)',
            boxShadow: '0 0 30px rgba(255,42,42,0.08)',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--neon-red), var(--neon-blue), transparent)',
            zIndex: 2,
          }} />
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.223385770826!2d80.15728127484111!3d12.957552787356555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525e43ecc3adf7%3A0xa0ef3f153468699c!2sVels%20Institute%20of%20Science%2C%20Technology%20%26%20Advanced%20Studies%20(VISTAS)!5e0!3m2!1sen!2sin!4v1773702300601!5m2!1sen!2sin"
            title="Vels University Location"
            style={{ width: '100%', height: '400px', border: 'none', display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* ── MAIN FOOTER GRID (brand / quick-links / contact) ─────────────── */}
      <div className="footer-grid" style={{ marginBottom: '3rem' }}>

        {/* Brand */}
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--neon-red)', marginBottom: '1rem', fontFamily: 'Orbitron' }}>
            PRAVESHA 2K26
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '320px' }}>
            National Level Technical Symposium organized by the Department of Computer Science and Engineering, VISTAS.
          </p>
          <a
            href="https://instagram.com/PRAVESHA_2K26"
            target="_blank" rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.2rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600,
            }}
          >
            <Instagram size={18} color="#e1306c" /> @PRAVESHA_2K26
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'white', fontFamily: 'Orbitron', letterSpacing: '2px' }}>
            QUICK LINKS
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['#home', '#about', '#events', '#coordinators'].map(href => (
              <a
                key={href} href={href}
                style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-blue)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {href.replace('#', '').toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'white', fontFamily: 'Orbitron', letterSpacing: '2px' }}>
            CONTACT US
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="mailto:pravesha2k26@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Mail size={16} color="var(--neon-blue)" />
              pravesha2k26@gmail.com
            </a>
            <a href="tel:+917356666091"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <Phone size={16} color="var(--neon-red)" />
              +91 7356666091 (Ananya S)
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div style={{
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexWrap: 'wrap',
        justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          &copy; 2026 Pravesha Symposium. All rights reserved.
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Made with <Heart size={14} color="var(--neon-red)" fill="var(--neon-red)" /> by CSE Dept, VISTAS
        </span>
      </div>

    </div>
  </footer>
);

export default Footer;
