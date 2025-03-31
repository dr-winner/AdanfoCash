
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
  opacity: number;
  trail: {x: number, y: number, opacity: number}[];
  isRocket: boolean;
  isOrbit: boolean;
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitCenterX?: number;
  orbitCenterY?: number;
  orbitAngle?: number;
  shape?: 'circle' | 'square' | 'triangle' | 'diamond' | 'hex' | 'star';
}

const COLORS = [
  'rgba(51, 195, 240, 0.7)',   // AdanfoCash blue
  'rgba(155, 135, 245, 0.7)',  // AdanfoCash purple
  'rgba(66, 220, 163, 0.7)',   // AdanfoCash green
  'rgba(255, 255, 255, 0.4)',  // white
  'rgba(255, 215, 0, 0.5)',    // gold
  'rgba(138, 43, 226, 0.6)',   // purple
];

const WEB3_COLORS = [
  'rgba(30, 190, 165, 0.65)',  // web3 teal
  'rgba(255, 88, 181, 0.5)',   // web3 pink
  'rgba(120, 118, 238, 0.6)',  // web3 purple
  'rgba(245, 171, 53, 0.55)',  // web3 orange
  'rgba(14, 165, 233, 0.6)',   // web3 blue
  'rgba(99, 102, 241, 0.6)',   // web3 indigo
];

const EnhancedParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  
  // Initialize particles
  const initializeParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Create particles
    particles.current = Array.from({ length: 90 }, () => {
      const isRocket = Math.random() < 0.05; // 5% chance to be a rocket
      const isOrbit = Math.random() < 0.25; // 25% chance to be in orbit (increased from 15%)
      
      const shapes: ('circle' | 'square' | 'triangle' | 'diamond' | 'hex' | 'star')[] = 
        ['circle', 'square', 'triangle', 'diamond', 'hex', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Random position on the canvas
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      // Parameters for orbital particles
      let orbitRadius, orbitSpeed, orbitCenterX, orbitCenterY, orbitAngle;
      
      if (isOrbit) {
        orbitRadius = 50 + Math.random() * 200; // Increased max radius
        orbitSpeed = 0.005 + Math.random() * 0.02;
        orbitCenterX = Math.random() * canvas.width;
        orbitCenterY = Math.random() * canvas.height;
        orbitAngle = Math.random() * Math.PI * 2;
      }
      
      return {
        x,
        y,
        size: isRocket ? 3 + Math.random() * 2 : 1 + Math.random() * 3,
        color: isOrbit 
          ? WEB3_COLORS[Math.floor(Math.random() * WEB3_COLORS.length)] 
          : COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: isRocket ? 1 + Math.random() * 3 : 0.1 + Math.random() * 0.5,
        direction: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.6,
        trail: [],
        isRocket,
        isOrbit,
        orbitRadius,
        orbitSpeed,
        orbitCenterX,
        orbitCenterY,
        orbitAngle,
        shape
      };
    });
    
    // Animation function
    const animate = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach(particle => {
        // Add current position to trail (only for rockets)
        if (particle.isRocket) {
          particle.trail.unshift({
            x: particle.x,
            y: particle.y,
            opacity: particle.opacity
          });
          
          // Limit trail length
          if (particle.trail.length > 10) {
            particle.trail.pop();
          }
          
          // Draw trail
          particle.trail.forEach((point, index) => {
            const trailOpacity = point.opacity * (1 - index / 10);
            const trailSize = particle.size * (1 - index / 10);
            
            ctx.fillStyle = `rgba(255, 165, 0, ${trailOpacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        
        // Draw particle based on shape
        ctx.fillStyle = particle.isRocket ? 
          `rgba(255, 255, 255, ${particle.opacity})` : 
          particle.color;
        
        ctx.beginPath();
        
        switch(particle.shape) {
          case 'square':
            ctx.rect(
              particle.x - particle.size, 
              particle.y - particle.size, 
              particle.size * 2, 
              particle.size * 2
            );
            break;
          case 'triangle':
            ctx.moveTo(particle.x, particle.y - particle.size);
            ctx.lineTo(particle.x - particle.size, particle.y + particle.size);
            ctx.lineTo(particle.x + particle.size, particle.y + particle.size);
            ctx.closePath();
            break;
          case 'diamond':
            ctx.moveTo(particle.x, particle.y - particle.size);
            ctx.lineTo(particle.x + particle.size, particle.y);
            ctx.lineTo(particle.x, particle.y + particle.size);
            ctx.lineTo(particle.x - particle.size, particle.y);
            ctx.closePath();
            break;
          case 'hex':
            for (let i = 0; i < 6; i++) {
              const angle = (Math.PI / 3) * i;
              const xPos = particle.x + particle.size * Math.cos(angle);
              const yPos = particle.y + particle.size * Math.sin(angle);
              
              if (i === 0) {
                ctx.moveTo(xPos, yPos);
              } else {
                ctx.lineTo(xPos, yPos);
              }
            }
            ctx.closePath();
            break;
          case 'star':
            for (let i = 0; i < 10; i++) {
              const radius = i % 2 === 0 ? particle.size : particle.size / 2;
              const angle = (Math.PI / 5) * i;
              const xPos = particle.x + radius * Math.cos(angle);
              const yPos = particle.y + radius * Math.sin(angle);
              
              if (i === 0) {
                ctx.moveTo(xPos, yPos);
              } else {
                ctx.lineTo(xPos, yPos);
              }
            }
            ctx.closePath();
            break;
          case 'circle':
          default:
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            break;
        }
        
        ctx.fill();
        
        // Draw connecting lines between nearby particles for web-like effect
        particles.current.forEach(otherParticle => {
          if (particle === otherParticle) return;
          
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect if particles are close enough
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`; // Fade with distance
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
        
        // Move particle based on whether it's orbital or not
        if (particle.isOrbit && particle.orbitCenterX && particle.orbitCenterY && 
            particle.orbitAngle !== undefined && particle.orbitRadius && particle.orbitSpeed) {
          // Update orbit angle
          particle.orbitAngle += particle.orbitSpeed;
          
          // Calculate new position based on orbit
          particle.x = particle.orbitCenterX + Math.cos(particle.orbitAngle) * particle.orbitRadius;
          particle.y = particle.orbitCenterY + Math.sin(particle.orbitAngle) * particle.orbitRadius;
        } else {
          // Move particle as before for non-orbital particles
          particle.x += Math.cos(particle.direction) * particle.speed;
          particle.y += Math.sin(particle.direction) * particle.speed;
          
          // Randomly change direction slightly
          particle.direction += (Math.random() - 0.5) * 0.1;
          
          // Boundary check
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationRef.current);
    };
  };
  
  useEffect(() => {
    initializeParticles();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  return (
    <>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-background via-background/95 to-background/90" />
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-[-1] pointer-events-none opacity-70 dark:opacity-40"
      />
      
      {/* Animated gradients for more depth - Web3 style */}
      <div className="fixed inset-0 z-[-2] opacity-30 dark:opacity-20 overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] rounded-full bg-adanfo-blue/30 blur-[100px]"
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -30, 0, 30, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -inset-[100px] translate-x-1/2 translate-y-1/3 rounded-full bg-adanfo-purple/30 blur-[100px]"
          animate={{
            x: [0, -30, 0, 30, 0],
            y: [0, 30, 0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-[#1ebe91]/20 blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 h-[250px] w-[250px] rounded-full bg-[#ff58b5]/20 blur-[80px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </>
  );
};

export default EnhancedParticleBackground;
