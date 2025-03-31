import React from 'react';
import EnhancedParticleBackground from '../components/shared/EnhancedParticleBackground';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import LenderIncentives from '../components/home/LenderIncentives';
import CallToAction from '../components/home/CallToAction';
import { motion, useScroll, useSpring } from 'framer-motion';

const Index: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <LenderIncentives />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
