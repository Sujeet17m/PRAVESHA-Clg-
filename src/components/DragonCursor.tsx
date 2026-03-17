import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom neon dragon cursor.
 * – Large (80×45 px) recognisable dragon silhouette
 * – Smooth lerp follow, rotates in direction of motion
 * – Glowing red tail trail  
 * – Auto-disabled on touch/hover:none devices
 */

const DragonCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef    = useRef({ x: -400, y: -400 });
  const smoothRef = useRef({ x: -400, y: -400 });
  const rafRef    = useRef(0);
  const [active, setActive] = useState(false);

  const TRAIL = 8;

  useEffect(() => {
    // Touch-only devices → no custom cursor
    if (window.matchMedia('(hover: none)').matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!active) setActive(true);
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let prevX = posRef.current.x;
    let prevY = posRef.current.y;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const { x: tx, y: ty } = posRef.current;
      const { x: sx, y: sy } = smoothRef.current;

      // Smooth lerp
      const nx = sx + (tx - sx) * 0.12;
      const ny = sy + (ty - sy) * 0.12;
      smoothRef.current = { x: nx, y: ny };

      // Angle based on delta from previous smooth position
      const dx = nx - prevX;
      const dy = ny - prevY;
      const angle = Math.abs(dx) + Math.abs(dy) > 0.5
        ? Math.atan2(dy, dx) * (180 / Math.PI)
        : 0;
      prevX = nx;
      prevY = ny;

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${nx}px, ${ny}px) rotate(${angle}deg)`;
      }

      // Staggered trail positions
      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const t    = 1 - (i + 1) / (TRAIL + 1);
        const lx   = sx + (tx - sx) * t;
        const ly   = sy + (ty - sy) * t;
        const sc   = 0.9 - i * 0.1;
        const op   = 0.75 - i * 0.08;
        el.style.transform = `translate(${lx}px, ${ly}px) scale(${sc})`;
        el.style.opacity   = String(Math.max(op, 0));
      });
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active) return null;

  return (
    <>
      {/* ── Glowing Trail ──────────────────────────────────────────────── */}
      {Array.from({ length: TRAIL }, (_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el; }}
          style={{
            position: 'fixed', top: 0, left: 0,
            pointerEvents: 'none', zIndex: 99997,
            width:  i < 3 ? '8px' : '5px',
            height: i < 3 ? '8px' : '5px',
            borderRadius: '50%',
            background: i < 3
              ? 'radial-gradient(circle, #ff6644 0%, #ff2a2a 50%, transparent 100%)'
              : 'radial-gradient(circle, #ff2a2a 0%, transparent 100%)',
            boxShadow: `0 0 ${10 - i}px 2px rgba(255,42,42,0.6)`,
            marginLeft: i < 3 ? '-4px' : '-2.5px',
            marginTop:  i < 3 ? '-4px' : '-2.5px',
            willChange: 'transform',
          }}
        />
      ))}

      {/* ── Dragon SVG Cursor ──────────────────────────────────────────── */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          /* Hotspot: nose of dragon is at right-center of the SVG */
          marginLeft: '-72px',
          marginTop:  '-22px',
          filter: [
            'drop-shadow(0 0 4px #ff2a2a)',
            'drop-shadow(0 0 10px rgba(255,42,42,0.7))',
            'drop-shadow(0 0 20px rgba(255,42,42,0.3))',
          ].join(' '),
          willChange: 'transform',
        }}
      >
        <svg
          width="90" height="44"
          viewBox="0 0 90 44"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── BODY ─────────────────────────────────────────────── */}
          <path
            d="M8 22
               C18 10, 32 8, 44 14
               C52 18, 56 16, 62 12
               C68 8, 76 10, 82 16
               C86 19, 87 22, 84 25
               C80 29, 72 30, 64 28
               C56 26, 50 26, 44 30
               C34 36, 20 36, 8 22Z"
            fill="#1a0000"
            stroke="#ff2a2a"
            strokeWidth="1.4"
          />

          {/* ── UNDERBELLY PLATES ────────────────────────────────── */}
          <path
            d="M18 22 L26 20 L34 22 L42 20 L50 22 L58 20 L66 22 L74 20 L80 22"
            fill="none"
            stroke="#c0c0c0"
            strokeWidth="0.7"
            opacity="0.6"
          />

          {/* ── SPINE RIDGE ─────────────────────────────────────── */}
          <path
            d="M20 14 L26 10 L32 14 L38 10 L44 14 L50 9 L56 13 L62 9 L68 13"
            fill="none"
            stroke="#ff2a2a"
            strokeWidth="0.9"
            opacity="0.8"
          />

          {/* ── HEAD ─────────────────────────────────────────────── */}
          <path
            d="M78 12 L89 8 L90 15 L89 23 L86 28 L78 30 L70 28 L68 20 L70 12Z"
            fill="#200000"
            stroke="#ff2a2a"
            strokeWidth="1.5"
          />

          {/* ── SNOUT / JAW ─────────────────────────────────────── */}
          <path
            d="M86 14 L90 18 L90 22 L87 22 L84 20Z"
            fill="#0a0000"
            stroke="#ff4444"
            strokeWidth="1"
          />
          {/* Lower jaw */}
          <path
            d="M86 22 L90 22 L89 26 L84 25Z"
            fill="#0a0000"
            stroke="#ff2a2a"
            strokeWidth="0.8"
          />
          {/* Fang */}
          <line x1="88" y1="22" x2="89" y2="26" stroke="#c0c0c0" strokeWidth="1" opacity="0.9"/>

          {/* ── GLOWING EYE ─────────────────────────────────────── */}
          {/* Outer glow */}
          <circle cx="82" cy="17" r="4.5" fill="#ff000033"/>
          {/* Iris */}
          <circle cx="82" cy="17" r="3.2" fill="#cc0000"/>
          {/* Pupil (slit) */}
          <ellipse cx="82" cy="17" rx="1" ry="2.8" fill="#000"/>
          {/* Shine */}
          <circle cx="80.8" cy="15.5" r="1" fill="white" opacity="0.85"/>

          {/* ── HORN ─────────────────────────────────────────────── */}
          <path
            d="M80 12 L82 4 L85 12Z"
            fill="#c0c0c0"
            stroke="#aaa"
            strokeWidth="0.5"
            opacity="0.9"
          />
          <path
            d="M76 13 L77 6 L80 13Z"
            fill="#aaa"
            stroke="#888"
            strokeWidth="0.5"
            opacity="0.7"
          />

          {/* ── UPPER WING (left side) ───────────────────────────── */}
          <path
            d="M44 14 C36 4, 22 0, 10 2 C20 8, 32 10, 40 14Z"
            fill="rgba(255,42,42,0.18)"
            stroke="#ff2a2a"
            strokeWidth="1"
          />
          {/* Wing struts */}
          <line x1="44" y1="14" x2="25" y2="4" stroke="#ff2a2a" strokeWidth="0.6" opacity="0.6"/>
          <line x1="44" y1="14" x2="14" y2="4" stroke="#ff2a2a" strokeWidth="0.6" opacity="0.4"/>

          {/* ── LOWER WING (left side) ──────────────────────────── */}
          <path
            d="M44 30 C34 40, 20 44, 8 42 C18 36, 32 32, 40 30Z"
            fill="rgba(200,200,200,0.12)"
            stroke="#c0c0c0"
            strokeWidth="0.8"
          />
          {/* Wing struts */}
          <line x1="44" y1="30" x2="22" y2="42" stroke="#c0c0c0" strokeWidth="0.6" opacity="0.5"/>

          {/* ── TAIL ─────────────────────────────────────────────── */}
          <path
            d="M8 22
               C2 18, -1 19, 0 22
               C-1 25, 2 26, 6 24
               C1 28, 0 31, 4 30
               C7 29, 9 26, 8 22Z"
            fill="none"
            stroke="#ff2a2a"
            strokeWidth="1.2"
          />
          {/* Tail spike */}
          <path d="M0 22 L-4 20 L-3 25Z" fill="#ff2a2a" opacity="0.7"/>

          {/* ── CIRCUIT LINES ON BODY ───────────────────────────── */}
          <line x1="44" y1="18" x2="50" y2="12" stroke="#ff4444" strokeWidth="0.7" opacity="0.7"/>
          <line x1="50" y1="12" x2="58" y2="16" stroke="#ff4444" strokeWidth="0.7" opacity="0.7"/>
          <line x1="58" y1="18" x2="64" y2="14" stroke="#c0c0c0" strokeWidth="0.6" opacity="0.6"/>

          {/* ── LED CIRCUIT NODES ────────────────────────────────── */}
          <circle cx="44" cy="18" r="1.8" fill="#ff2a2a"/>
          <circle cx="50" cy="12" r="1.4" fill="#ff4444"/>
          <circle cx="58" cy="16" r="1.8" fill="#ff2a2a"/>
          <circle cx="64" cy="14" r="1.2" fill="#c0c0c0"/>
        </svg>
      </div>
    </>
  );
};

export default DragonCursor;
