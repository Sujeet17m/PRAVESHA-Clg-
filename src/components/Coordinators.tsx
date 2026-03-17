import React, { useEffect, useRef } from 'react';
import { GraduationCap, UserCircle, Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const staffCoordinators = [
  { name: 'Dr. A. Rajesh',        phone: '9750222225' },
  { name: 'Dr. A. Saritha',       phone: '9820305258' },
  { name: 'Dr. P. Thilakavathy',  phone: '9920026608' },
  { name: 'Mr. N. Udayakumar',    phone: '8228777606' },
];

const studentCoordinators = [
  { name: 'Ananya S',             phone: '7356666091' },
  { name: 'Sakthi Priyadharsan',  phone: '9345252389' },
  { name: 'Shiva Sundar P',       phone: '7338711301' },
  { name: 'S. Mohammed Kabir',    phone: '9840362703' },
  { name: 'K.B. Yathindra',       phone: '8667669019' },
];

const PersonRow = ({ name, phone, color }: { name: string; phone: string; color: string }) => (
  <div
    className="person-row"
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.8rem 1rem',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      transition: 'background 0.2s',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    {/* Name */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
      <div
        style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: color, flexShrink: 0,
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
      <span
        style={{
          fontSize: 'clamp(0.82rem, 1.8vw, 0.98rem)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
      >
        {name}
      </span>
    </div>

    {/* Phone */}
    <a
      href={`tel:${phone}`}
      className="person-phone-link"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        color,
        fontFamily: 'Orbitron',
        fontSize: 'clamp(0.65rem, 1.5vw, 0.82rem)',
        fontWeight: 700,
        background: `${color}12`,
        padding: '0.35rem 0.65rem',
        borderRadius: '8px',
        border: `1px solid ${color}30`,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        textDecoration: 'none',
        minWidth: '130px',
        justifyContent: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <Phone size={12} style={{ opacity: 0.9, flexShrink: 0 }} />
      <span style={{ letterSpacing: '0.6px' }}>{phone}</span>
    </a>
  </div>
);

const CoordCard = ({
  title, icon: Icon, color, people, cardRef,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  people: { name: string; phone: string }[];
  cardRef: React.RefObject<HTMLDivElement>;
}) => (
  <div
    ref={cardRef}
    className="glass-panel coord-card"
    style={{
      opacity: 0,
      padding: 'clamp(1.25rem, 3vw, 2rem)',
      borderColor: `${color}33`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxSizing: 'border-box',
    }}
  >
    {/* Top accent bar */}
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />

    {/* Card Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
      <div
        style={{
          width: '46px', height: '46px', borderRadius: '12px',
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color, flexShrink: 0,
        }}
      >
        <Icon size={22} />
      </div>
      <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', margin: 0, color: 'white' }}>{title}</h3>
    </div>

    {/* People List */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
      {people.map(p => <PersonRow key={p.name} {...p} color={color} />)}
    </div>
  </div>
);

const Coordinators: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref  = useRef<HTMLDivElement>(null);
  const card2Ref  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [headerRef, card1Ref, card2Ref].forEach((ref, i) => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6,
          delay: i * 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      );
    });
  }, []);

  return (
    <section id="coordinators" style={{ padding: '4rem 0', position: 'relative' }}>
      <div className="container">
        {/* Header */}
        <div ref={headerRef} style={{ opacity: 0, textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-tag">REACH OUT</span>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', marginBottom: '0.75rem' }}>
            COMMAND <span style={{ color: 'var(--neon-blue)' }}>CENTER</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Get in touch with our coordinators for any queries.
          </p>
        </div>

        {/* Cards */}
        <div className="coords-grid">
          <CoordCard
            title="STAFF COORDINATORS"
            icon={GraduationCap}
            color="var(--neon-red)"
            people={staffCoordinators}
            cardRef={card1Ref as React.RefObject<HTMLDivElement>}
          />
          <CoordCard
            title="STUDENT COORDINATORS"
            icon={UserCircle}
            color="var(--neon-blue)"
            people={studentCoordinators}
            cardRef={card2Ref as React.RefObject<HTMLDivElement>}
          />
        </div>
      </div>
    </section>
  );
};

export default Coordinators;
