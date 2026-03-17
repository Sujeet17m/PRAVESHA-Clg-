import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// ─── Types ─────────────────────────────────────────────────────────────────
interface Circuit {
  x: number; y: number; angle: number;
  len: number; drawn: number; speed: number;
  branches: Circuit[]; branched: boolean;
  alpha: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; size: number; color: string;
}

interface LoadingScreenProps { onComplete: () => void; }

// ─── SVG Dragon Path (cyber geometric style) ──────────────────────────────
const DRAGON_SVG = `
<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Body -->
  <path d="M40 60 Q70 30 110 45 Q140 55 160 45 Q190 30 220 40 Q250 52 260 60 Q250 68 220 75 Q190 90 160 78 Q140 68 110 78 Q70 92 40 60Z"
        fill="none" stroke="#ff2a2a" stroke-width="1.5" opacity="0.9"/>
  <!-- Underbelly segments -->
  <path d="M60 63 L80 60 L100 63 L120 60 L140 63 L160 60 L180 63 L200 60 L220 63 L240 60"
        fill="none" stroke="#c0c0c0" stroke-width="0.8" opacity="0.6"/>
  <!-- Head -->
  <path d="M220 40 L255 25 L270 35 L265 50 L255 58 L240 56 L220 75Z"
        fill="#1a0000" stroke="#ff2a2a" stroke-width="1.5"/>
  <!-- Snout -->
  <path d="M260 32 L278 40 L272 48 L262 46Z"
        fill="#0a0000" stroke="#ff4444" stroke-width="1"/>
  <!-- Eye (glowing) -->
  <circle cx="252" cy="38" r="5" fill="#ff0000" opacity="0.9"/>
  <circle cx="252" cy="38" r="2.5" fill="#ffaa00"/>
  <circle cx="250.5" cy="36.5" r="1" fill="white" opacity="0.8"/>
  <!-- Circuit lines on body -->
  <line x1="120" y1="52" x2="130" y2="40" stroke="#ff2a2a" stroke-width="0.6" opacity="0.7"/>
  <line x1="130" y1="40" x2="145" y2="44" stroke="#ff2a2a" stroke-width="0.6" opacity="0.7"/>
  <line x1="160" y1="52" x2="175" y2="42" stroke="#c0c0c0" stroke-width="0.6" opacity="0.6"/>
  <line x1="175" y1="42" x2="190" y2="48" stroke="#c0c0c0" stroke-width="0.6" opacity="0.6"/>
  <!-- Wings upper -->
  <path d="M140 50 Q120 10 80 5 Q100 30 110 45Z"
        fill="rgba(255,42,42,0.15)" stroke="#ff2a2a" stroke-width="1.2"/>
  <path d="M160 48 Q180 8 220 2 Q200 28 195 42Z"
        fill="rgba(255,42,42,0.15)" stroke="#ff2a2a" stroke-width="1.2"/>
  <!-- Wings lower -->
  <path d="M140 68 Q120 100 75 110 Q95 85 110 75Z"
        fill="rgba(192,192,192,0.12)" stroke="#c0c0c0" stroke-width="1"/>
  <path d="M160 72 Q182 102 230 112 Q210 84 195 75Z"
        fill="rgba(192,192,192,0.12)" stroke="#c0c0c0" stroke-width="1"/>
  <!-- Tail -->
  <path d="M40 60 Q20 50 10 45 Q5 48 8 55 Q15 62 25 65 Q10 72 12 78 Q20 80 35 65Z"
        fill="none" stroke="#ff2a2a" stroke-width="1.2"/>
  <!-- Horns -->
  <line x1="248" y1="28" x2="255" y2="14" stroke="#c0c0c0" stroke-width="1.5"/>
  <line x1="258" y1="30" x2="268" y2="16" stroke="#c0c0c0" stroke-width="1.5"/>
  <!-- LED dots (circuit nodes) -->
  <circle cx="120" cy="52" r="2" fill="#ff2a2a"/>
  <circle cx="160" cy="52" r="2" fill="#ff2a2a"/>
  <circle cx="130" cy="40" r="1.5" fill="#ff6666"/>
  <circle cx="175" cy="42" r="1.5" fill="#c0c0c0"/>
</svg>`;

// ─── Component ──────────────────────────────────────────────────────────────
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dragonRef  = useRef<HTMLDivElement>(null);
  const phaseRef   = useRef(0);
  const rafRef     = useRef(0);
  const circuitsRef = useRef<Circuit[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const bhRadiusRef = useRef(0);
  const bhAlphaRef  = useRef(0);
  const angleRef    = useRef(0);

  const spawnCircuit = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, angle: number, depth = 0
  ): Circuit => {
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const cx = W / 2, cy = H / 2;
    const distToCenter = Math.hypot(x - cx, y - cy);
    // steer toward center
    const toCenter = Math.atan2(cy - y, cx - x);
    const steered   = angle + (toCenter - angle) * 0.12;
    return {
      x, y, angle: steered,
      len: distToCenter * 0.18 + 20,
      drawn: 0,
      speed: 3 + Math.random() * 2,
      branches: [],
      branched: false,
      alpha: 0.8 + Math.random() * 0.2,
    };
  }, []);

  const initCircuits = useCallback((ctx: CanvasRenderingContext2D) => {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const count = 28;
    const cs: Circuit[] = [];
    for (let i = 0; i < count; i++) {
      const edge = i % 4;
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * W; y = 0; }
      else if (edge === 1) { x = W; y = Math.random() * H; }
      else if (edge === 2) { x = Math.random() * W; y = H; }
      else { x = 0; y = Math.random() * H; }
      const angle = Math.atan2(H / 2 - y, W / 2 - x) + (Math.random() - 0.5) * 0.6;
      cs.push(spawnCircuit(ctx, x, y, angle));
    }
    circuitsRef.current = cs;
  }, [spawnCircuit]);

  // ── Draw PCB Circuits (Phase 1) ──────────────────────────────────────────
  const drawCircuits = useCallback((ctx: CanvasRenderingContext2D): boolean => {
    const done: boolean[] = [];
    const drawOne = (c: Circuit, color: string) => {
      if (c.drawn >= c.len) { done.push(true); return; }
      done.push(false);
      c.drawn = Math.min(c.drawn + c.speed, c.len);
      const ex = c.x + Math.cos(c.angle) * c.drawn;
      const ey = c.y + Math.sin(c.angle) * c.drawn;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = c.alpha * 0.7;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // LED dot at head
      ctx.beginPath();
      ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = c.alpha;
      ctx.fill();
      ctx.restore();

      // Branch
      if (!c.branched && c.drawn > c.len * 0.4 && Math.random() < 0.04) {
        c.branched = true;
        const bAngle = c.angle + (Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2);
        c.branches.push(spawnCircuit(ctx, ex, ey, bAngle));
      }
      c.branches.forEach(b => drawOne(b, color));
    };

    circuitsRef.current.forEach((c, i) => {
      drawOne(c, i % 3 === 0 ? '#c0c0c0' : '#ff2a2a');
    });
    return done.every(Boolean);
  }, [spawnCircuit]);

  // ── Draw Black Hole (Phase 2) ─────────────────────────────────────────────
  const drawBlackHole = useCallback((ctx: CanvasRenderingContext2D, progress: number) => {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const cx = W / 2, cy = H / 2;
    const maxR = Math.min(W, H) * 0.28;
    const r = maxR * progress;
    bhRadiusRef.current = r;
    bhAlphaRef.current  = progress;
    angleRef.current   += 0.012;

    ctx.save();
    // Event horizon (deep black core)
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    core.addColorStop(0,   'rgba(0,0,0,1)');
    core.addColorStop(0.6, 'rgba(5,0,0,0.97)');
    core.addColorStop(0.85,'rgba(30,0,0,0.85)');
    core.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
    ctx.fillStyle = core;
    ctx.fill();

    // Accretion rings
    for (let ring = 0; ring < 3; ring++) {
      const rr = r * (0.95 + ring * 0.18);
      const bw = r * 0.08;
      const grad = ctx.createRadialGradient(cx, cy, rr - bw, cx, cy, rr + bw);
      const alpha = (0.7 - ring * 0.2) * progress;
      grad.addColorStop(0,   `rgba(255,42,42,0)`);
      grad.addColorStop(0.4, `rgba(255,42,42,${alpha})`);
      grad.addColorStop(0.6, `rgba(255,80,80,${alpha * 1.2})`);
      grad.addColorStop(1,   `rgba(255,42,42,0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,42,42,${alpha})`;
      ctx.lineWidth = bw * 2;
      ctx.shadowColor = '#ff2a2a';
      ctx.shadowBlur  = 20 * progress;
      ctx.stroke();
    }

    // Gravitational lensing swirls
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleRef.current);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x1 = Math.cos(a) * r * 0.9;
      const y1 = Math.sin(a) * r * 0.9;
      const x2 = Math.cos(a + 0.5) * r * 1.5;
      const y2 = Math.sin(a + 0.5) * r * 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(0, 0, x2, y2);
      ctx.strokeStyle = `rgba(192,192,192,${0.25 * progress})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'silver';
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }, []);

  // ── Spawn Particles (Phase 4) ─────────────────────────────────────────────
  const spawnBurstParticles = useCallback((cx: number, cy: number) => {
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 1.5 + Math.random() * 3.5,
        color: Math.random() < 0.7 ? '#ff2a2a' : '#c0c0c0',
      });
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    particlesRef.current.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.94; p.vy *= 0.94;
      p.life = Math.max(0, p.life - 0.025);
      ctx.save();
      ctx.globalAlpha = p.life * 0.85;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.restore();
    });
  }, []);

  // ── Main Animation ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    const overlay = overlayRef.current!;
    const dragon  = dragonRef.current!;

    const setSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ── Phases ───────────────────────────────────────────────────────────────
    let phase       = 0;
    let bhProgress  = 0;
    let dragonX     = -300;
    const dragonY   = () => H() / 2;
    let dragonScale = 1;
    let dragonAlpha = 0;
    let bhGrow      = 0;
    let dragonInBH  = false;
    let burstSpawned = false;
    let finalFade   = 0;
    let startTime   = performance.now();

    initCircuits(ctx);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const elapsed = performance.now() - startTime;

      ctx.clearRect(0, 0, W(), H());

      // ── PHASE 0: black bg always ──────────────────────────────────────────
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, W(), H());

      // ── PHASE 1: Circuit traces (0–2.5s) ─────────────────────────────────
      if (phase === 0) {
        if (elapsed < 2500) {
          drawCircuits(ctx);
        } else {
          phase = 1;
          startTime = performance.now();
        }
      }

      // ── Keep drawing circuits as ghost layer ──────────────────────────────
      if (phase >= 1) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 0.4 - bhGrow * 0.5);
        drawCircuits(ctx);
        ctx.restore();
      }

      // ── PHASE 1: Black hole materializes (0–1.8s) ─────────────────────────
      if (phase === 1) {
        bhGrow = Math.min(elapsed / 1800, 1);
        drawBlackHole(ctx, bhGrow);
        if (bhGrow >= 1) {
          phase = 2;
          startTime = performance.now();
          dragonAlpha = 0;
          dragonX = -350;
          gsap.set(dragon, { opacity: 0, x: -350, y: 0, scale: 1 });
          gsap.to(dragon, { opacity: 1, duration: 0.4 });
        }
      }

      // ── PHASE 2: Black hole holds, draw it at full ────────────────────────
      if (phase >= 2) {
        drawBlackHole(ctx, 1);
        drawParticles(ctx);
      }

      // ── PHASE 2: Dragon flies in (0–2.2s) ─────────────────────────────────
      if (phase === 2) {
        const t  = Math.min(elapsed / 2200, 1);
        dragonX  = -350 + (W() / 2 + 120) * t;
        dragonAlpha = Math.min(t * 3, 1);
        dragon.style.left    = `${dragonX}px`;
        dragon.style.top     = `${H() / 2 - 60}px`;
        dragon.style.opacity = String(dragonAlpha);

        if (t >= 1) {
          phase = 3;
          startTime = performance.now();
        }
      }

      // ── PHASE 3: Dragon enters black hole (0–1.4s) ────────────────────────
      if (phase === 3) {
        const t = Math.min(elapsed / 1400, 1);
        dragonScale = 1 - t * 0.85;
        dragonAlpha = 1 - t;
        dragonX     = W() / 2 + 120 - 120 * t;
        dragon.style.left      = `${dragonX}px`;
        dragon.style.transform = `scaleX(${dragonScale}) scaleY(${dragonScale})`;
        dragon.style.opacity   = String(Math.max(dragonAlpha, 0));

        if (!burstSpawned && t > 0.5) {
          burstSpawned = true;
          spawnBurstParticles(W() / 2, H() / 2);
        }

        if (t >= 1) {
          phase = 4;
          startTime = performance.now();
          dragon.style.display = 'none';
        }
      }

      // ── PHASE 4: BH collapses, page reveals (0–3.5s SLOW FADE) ──────────
      if (phase === 4) {
        const t   = Math.min(elapsed / 3500, 1);
        const inv = 1 - t;
        drawBlackHole(ctx, inv);
        drawParticles(ctx);

        // Slow cinematic fade
        overlay.style.opacity = String(inv);

        if (t >= 1) {
          cancelAnimationFrame(rafRef.current);
          window.removeEventListener('resize', setSize);
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
          setTimeout(onComplete, 600);
        }
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setSize);
    };
  }, [drawBlackHole, drawCircuits, drawParticles, initCircuits, onComplete, spawnBurstParticles]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#050508',
        transition: 'opacity 2s ease',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Cyber Dragon Element */}
      <div
        ref={dragonRef}
        style={{
          position: 'absolute',
          width: '320px',
          height: '130px',
          opacity: 0,
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 0 12px #ff2a2a) drop-shadow(0 0 24px #ff2a2a55)',
          pointerEvents: 'none',
        }}
        dangerouslySetInnerHTML={{ __html: DRAGON_SVG }}
      />

      {/* Loading text */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
          letterSpacing: '4px',
          color: 'rgba(255,42,42,0.6)',
          animation: 'blink-load 1.2s ease-in-out infinite',
          whiteSpace: 'nowrap',
        }}
      >
        INITIALIZING SYSTEM...
      </div>

      <style>{`
        @keyframes blink-load {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
