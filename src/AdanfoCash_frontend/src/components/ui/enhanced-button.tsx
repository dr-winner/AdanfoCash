import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 glow-button',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
        gradient: 'bg-gradient-to-r from-adanfo-blue to-adanfo-purple text-white shadow-lg hover:shadow-xl glow-button',
        glass: 'backdrop-blur-md bg-white/10 border border-white/20 text-foreground hover:bg-white/20 glow-button',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-12 px-8 rounded-md text-base',
        xl: 'h-14 px-10 rounded-lg text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  animate?: boolean;
  to?: string;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animate = true, children, to, ...props }, ref) => {
    // If to prop is provided, render a Link component
    if (to) {
      const linkClassName = cn(buttonVariants({ variant, size, className }));
      
      return (
        <Link to={to} className={linkClassName}>
          {children}
        </Link>
      );
    }
    
    // Otherwise render a button
    const ButtonComponent = animate ? motion.button : 'button';
    
    const animationProps = animate ? {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.98 },
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    } : {};
    
    // Cast to any to get around the type error with motion.button
    const MotionButton = ButtonComponent as any;
    
    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...animationProps}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;
