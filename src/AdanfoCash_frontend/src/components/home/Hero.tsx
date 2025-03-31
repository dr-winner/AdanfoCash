import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Rocket, Coins, Users } from 'lucide-react';
import { Button } from '../ui/button';
import EnhancedButton from '../ui/enhanced-button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Hero: React.FC = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { user, login, isRegistered } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };
  
  const floatingIcons = [
    { Icon: Rocket, delay: 0, x: '10%', y: '20%' },
    { Icon: Coins, delay: 1.5, x: '85%', y: '50%' },
    { Icon: Users, delay: 3, x: '20%', y: '85%' },
  ];

  const handleButtonClick = async (userType: 'borrower' | 'lender') => {
    const currentPath = location.pathname;
    
    // If not authenticated, trigger login first
    if (!user.isAuthenticated) {
      const loginSuccess = await login(currentPath);
      if (!loginSuccess) return; // Stop if login failed
    }
    
    // Now user is authenticated, check if registered
    if (isRegistered) {
      // If registered, go to dashboard
      if (userType === 'borrower') {
        navigate('/borrower-dashboard');
      } else {
        navigate('/lender-dashboard');
      }
    } else {
      // Not registered, redirect to registration form
      if (userType === 'borrower') {
        navigate('/borrower-registration');
      } else {
        navigate('/lender-registration');
      }
    }
  };
  
  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-adanfo-blue/30 dark:text-adanfo-blue/15"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: [0, 1.2, 1],
            y: [0, -15, 0, -15, 0],
          }}
          transition={{
            delay: delay,
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            },
            scale: {
              duration: 1,
              ease: "easeOut",
            }
          }}
        >
          <Icon size={48} />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="inline-block backdrop-blur-sm bg-adanfo-blue/10 dark:bg-adanfo-blue/20 border border-adanfo-blue/20 rounded-full px-4 py-1 text-sm text-adanfo-blue"
          >
            Decentralized Student Lending
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent"
          >
            Financial Freedom for Students, Powered by Blockchain
          </motion.h1>
          
          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl"
          >
            AdanfoCash connects students who need loans with investors looking for returns, all without banks or middlemen. Fast, transparent, and secure.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-6"
          >
            <EnhancedButton
              variant="gradient"
              size="lg"
              onClick={() => handleButtonClick('borrower')}
              className="sm:min-w-[180px] justify-center"
            >
              Get Started
            </EnhancedButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleButtonClick('lender')}
              className="sm:min-w-[180px] justify-center"
            >
              Start Investing
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
