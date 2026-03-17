import React, { useEffect, useRef } from 'react';

// Matches the uploaded reference image:
// - Red elongated ember/spark streaks (rotated rectangles)
// - Warm gold bokeh dots (soft circles)
// - Dark near-black background
// - Particles rise from bottom, drift and fade

interface Ember {
  x: number; y: number;
  vx: number; vy: number;
  angle: number; angularV: number;
  life: number; maxLife: number;
  w: number; h: number;
  type: 'streak' | 'bokeh' | 'dot';
  hue: number; // 0=red, 35=gold
}

function mkEmber(W: number, H: number): Ember {
  const type = Math.random() < 0.45 ? 'streak'
             : Math.random() < 0.6  ? 'bokeh'
             :                        'dot';
  return {
    x: Math.random() * W,
    y: H + 20 + Math.random() * 100,
    vx: (Math.random() - 0.5) * 1.6,
    vy: -(1.2 + Math.random() * 2.8),
    angle: Math.random() * Math.PI * 2,
    angularV: (Math.random() - 0.5) * 0.06,
    life: 1,
    maxLife: 100 + Math.random() * 140,
    w: type === 'streak' ? 3 + Math.random() * 5 : 0,
    h: type === 'streak' ? 12 + Math.random() * 22 : 0,
    type,
    hue: type === 'bokeh' || type === 'dot' ? (Math.random() < 0.65 ? 35 : 0) : 0,
  };
}

const SparkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const embers    = useRef<Ember[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    const MAX = 90;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Spawn
      if (embers.current.length < MAX && Math.random() < 0.55) {
        embers.current.push(mkEmber(W, H));
      }

      embers.current = embers.current.filter(e => e.life > 0);

      embers.current.forEach(e => {
        e.x    += e.vx + Math.sin(e.vy * 0.3) * 0.4;
        e.y    += e.vy;
        e.angle += e.angularV;
        e.vx   *= 0.992;
        e.vy   *= 0.998;
        e.life -= 1 / e.maxLife;

        const alpha = Math.pow(Math.min(e.life * 2, 1), 0.6) * 0.9;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (e.type === 'streak') {
          ctx.translate(e.x, e.y);
          ctx.rotate(e.angle);
          // Elongated ember with glow gradient
          const g = ctx.createLinearGradient(0, -e.h / 2, 0, e.h / 2);
          g.addColorStop(0,   'rgba(255,80,40,0)');
          g.addColorStop(0.35,'rgba(255,42,42,0.9)');
          g.addColorStop(0.65,'rgba(255,60,30,1)');
          g.addColorStop(1,   'rgba(255,100,50,0)');
          ctx.shadowColor = '#ff2a2a';
          ctx.shadowBlur  = 10;
          ctx.beginPath();
          const rx = e.w / 2;
          ctx.moveTo(0, -e.h / 2);
          ctx.quadraticCurveTo(rx, 0, 0, e.h / 2);
          ctx.quadraticCurveTo(-rx, 0, 0, -e.h / 2);
          ctx.fillStyle = g;
          ctx.fill();

        } else if (e.type === 'bokeh') {
          // Soft glowing bokeh circle
          const r = 6 + Math.random() * 8;
          const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
          const col = e.hue === 35 ? [200, 160, 40] : [255, 42, 42];
          g.addColorStop(0,   `rgba(${col[0]},${col[1]},${col[2]},0.5)`);
          g.addColorStop(0.5, `rgba(${col[0]},${col[1]},${col[2]},0.25)`);
          g.addColorStop(1,   `rgba(${col[0]},${col[1]},${col[2]},0)`);
          ctx.beginPath();
          ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          // Bright center
          ctx.beginPath();
          ctx.arc(e.x, e.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.9)`;
          ctx.shadowColor = e.hue === 35 ? '#c8a028' : '#ff2a2a';
          ctx.shadowBlur  = 6;
          ctx.fill();

        } else {
          // Tiny dot
          ctx.beginPath();
          ctx.arc(e.x, e.y, 1.5, 0, Math.PI * 2);
          const col = e.hue === 35 ? '#c8a028' : '#ff6644';
          ctx.fillStyle = col;
          ctx.shadowColor = col;
          ctx.shadowBlur  = 5;
          ctx.fill();
        }

        ctx.restore();
      });
    };

    loop();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default SparkCanvas;
