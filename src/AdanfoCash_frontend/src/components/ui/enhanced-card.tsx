import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glassmorphism?: boolean;
  children: React.ReactNode;
}

const EnhancedCard = ({
  interactive = false,
  glassmorphism = true,
  className,
  children,
  ...props
}: CardProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Convert to rotation degrees (max 6 degrees)
    const rotateX = -(y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Reset rotation if interactive prop changes
  useEffect(() => {
    if (!interactive) {
      setRotation({ x: 0, y: 0 });
    }
  }, [interactive]);

  // Use type assertion to handle motion.div props
  const MotionDiv = motion.div as any;

  return (
    <MotionDiv
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-md transition-all duration-300',
        glassmorphism && 'glass-card',
        interactive && 'cursor-pointer',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: interactive && isHovered 
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: 'transform 0.2s ease-out'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
      
      {interactive && isHovered && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-10 pointer-events-none"
          style={{
            backgroundPosition: `${(rotation.y + 6) * 8}% ${(rotation.x + 6) * 8}%`,
            transition: 'background-position 0.2s ease-out'
          }}
        />
      )}
    </MotionDiv>
  );
};

// Export with a different name to avoid conflicts with shadcn Card
export { EnhancedCard };
