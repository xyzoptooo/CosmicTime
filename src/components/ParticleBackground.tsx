import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  twinklePhase: number;
  isSnowflake: boolean;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      const particleCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
      const snowflakeCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 30000));
      particlesRef.current = [];

      const colors = ['#f0dc82', '#5bc0de', '#a855f7', '#22d3ee', '#fbbf24', '#bb86fc', '#03dac6'];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          size: Math.random() * 4 + 1.5,
          opacity: Math.random() * 0.5 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          twinklePhase: Math.random() * Math.PI * 2,
          isSnowflake: false,
        });
      }

      for (let i = 0; i < snowflakeCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: Math.random() * 0.5 + 0.2,
          size: Math.random() * 3 + 2,
          opacity: Math.random() * 0.3 + 0.4,
          color: '#ffffff',
          twinklePhase: Math.random() * Math.PI * 2,
          isSnowflake: true,
        });
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      if (particle.isSnowflake) {
        // Draw snowflake as a simple white circle with glow
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = particle.size * 4;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Twinkle effect for cosmic particles
        const twinkle = 0.3 * Math.sin(Date.now() * 0.005 + particle.twinklePhase);
        ctx.globalAlpha = Math.min(1, Math.max(0.1, particle.opacity + twinkle));
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 3;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawConnections = () => {
      const particles = particlesRef.current.filter(p => !p.isSnowflake);
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const opacity = (180 - distance) / 180 * 0.15;
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, particles[i].color);
            gradient.addColorStop(1, particles[j].color);
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      
      particles.forEach((particle) => {
        if (!particle.isSnowflake) {
          // Mouse attraction for cosmic particles
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 220) {
            const force = (220 - distance) / 220 * 0.015;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary bounce for cosmic particles
        if (!particle.isSnowflake) {
          if (particle.x <= 0 || particle.x >= canvas.width) {
            particle.vx *= -1;
          }
          if (particle.y <= 0 || particle.y >= canvas.height) {
            particle.vy *= -1;
          }
        } else {
          // Snowflakes wrap around bottom to top
          if (particle.y > canvas.height) {
            particle.y = 0;
            particle.x = Math.random() * canvas.width;
          }
          if (particle.x < 0) {
            particle.x = canvas.width;
          } else if (particle.x > canvas.width) {
            particle.x = 0;
          }
        }

        // Keep within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Add some friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles();
      drawConnections();
      
      particlesRef.current.forEach(drawParticle);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default ParticleBackground;
