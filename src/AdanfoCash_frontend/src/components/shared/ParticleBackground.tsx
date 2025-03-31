
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  trail: {x: number; y: number}[];
  isRocket: boolean;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isMobile = useIsMobile();
  
  const colors = [
    'rgba(51, 195, 240, 1)', // Adanfo blue
    'rgba(139, 92, 246, 1)', // Adanfo purple
    'rgba(16, 185, 129, 1)', // Adanfo green
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Initialize particles
    const particleCount = isMobile ? 30 : 60;
    const rocketCount = isMobile ? 3 : 6;
    
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const isRocket = i < rocketCount;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isRocket ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * (isRocket ? 3 : 1),
        speedY: (Math.random() - 0.5) * (isRocket ? 3 : 1),
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.4,
        trail: [],
        isRocket
      });
    }
    
    particlesRef.current = particles;
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Update trail
        if (particle.isRocket) {
          particle.trail.push({x: particle.x, y: particle.y});
          if (particle.trail.length > 15) {
            particle.trail.shift();
          }
          
          // Draw trail
          ctx.beginPath();
          for (let i = 0; i < particle.trail.length; i++) {
            const point = particle.trail[i];
            const opacity = i / particle.trail.length * particle.opacity;
            ctx.strokeStyle = particle.color.replace('1)', `${opacity})`);
            
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.stroke();
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('1)', `${particle.opacity})`);
        ctx.fill();
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isMobile]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full -z-10 opacity-60 dark:opacity-30"
    />
  );
};

export default ParticleBackground;
