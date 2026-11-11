import { useRef, useEffect } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000 });
  const animFrameRef = useRef(null);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  const PARTICLE_COUNT = 120;
  const CONNECTION_DIST = 160;
  const MOUSE_CONNECT_DIST = 220;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = mouseRef.current;

    class Particle {
      constructor(w, h) {
        this.reset(w, h);
      }

      reset(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2.5 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.baseVx = this.vx;
        this.baseVy = this.vy;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(w, h, time) {
        this.x += this.vx;
        this.y += this.vy;

        // Gentle random drift
        this.vx += (Math.random() - 0.5) * 0.015;
        this.vy += (Math.random() - 0.5) * 0.015;

        // Return to base velocity
        this.vx += (this.baseVx - this.vx) * 0.008;
        this.vy += (this.baseVy - this.vy) * 0.008;

        const maxSpeed = 0.5;
        const spd = Math.hypot(this.vx, this.vy);
        if (spd > maxSpeed) {
          this.vx = (this.vx / spd) * maxSpeed;
          this.vy = (this.vy / spd) * maxSpeed;
        }

        const pad = 50;
        if (this.x < -pad) this.x = w + pad;
        if (this.x > w + pad) this.x = -pad;
        if (this.y < -pad) this.y = h + pad;
        if (this.y > h + pad) this.y = -pad;

        // Pulsing opacity
        this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulsePhase));
      }

      draw(ctx, time) {
        const opacity = this.currentOpacity || this.opacity;

        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity * 0.06})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.fill();
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      dimensionsRef.current = { w, h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(new Particle(w, h));
        }
      } else {
        particles.forEach((p) => {
          if (p.x > w || p.y > h) {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
          }
        });
      }
    };

    const onMouseMove = (e) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.px = -1000;
      mouse.py = -1000;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const animate = () => {
      const { w, h } = dimensionsRef.current;
      if (!w || !h) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = Date.now() * 0.001;
      ctx.clearRect(0, 0, w, h);

      // Update and draw particles
      particles.forEach((p) => p.update(w, h, time));
      particles.forEach((p) => p.draw(ctx, time));

      const mouseActive = mouse.x > 0 && mouse.x < w && mouse.y > 0 && mouse.y < h;

      // Draw connections between particles
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.6 + (1 - dist / CONNECTION_DIST) * 0.6;
            ctx.stroke();
          }
        }

        // Draw connections to mouse
        if (mouseActive) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_CONNECT_DIST) {
            const alpha = (1 - dist / MOUSE_CONNECT_DIST) * 0.5;

            // Line from particle to mouse
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Particle glow on hover
            ctx.beginPath();
            ctx.arc(a.x, a.y, a.radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.35})`;
            ctx.fill();
          }
        }
      }

      // Mouse glow aura
      if (mouseActive) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, MOUSE_CONNECT_DIST
        );
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.04)');
        gradient.addColorStop(0.4, 'rgba(168, 85, 247, 0.02)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_CONNECT_DIST, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default ParticleNetwork;