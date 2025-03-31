
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FileText, Coins, Repeat } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
  isLastStep?: boolean;
}

const Step: React.FC<StepProps> = ({ icon, title, description, step, isLastStep = false }) => {
  return (
    <div className="relative flex flex-col items-center text-center z-10">
      {/* Step connector line */}
      {!isLastStep && (
        <div className="absolute top-12 h-[calc(100%-24px)] w-1 bg-gradient-to-b from-adanfo-blue/30 to-adanfo-purple/30 left-1/2 transform -translate-x-1/2 -z-10 md:w-full md:h-1 md:top-12 md:left-[calc(50%+60px)] md:translate-x-0" />
      )}
      
      {/* Icon */}
      <motion.div 
        className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-adanfo-blue/20 to-adanfo-purple/20 backdrop-blur-sm border border-white/10 text-adanfo-blue mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          delay: step * 0.2 
        }}
      >
        {icon}
      </motion.div>
      
      {/* Step number badge */}
      <div className="absolute top-0 right-0 md:top-10 md:right-auto md:left-0 w-6 h-6 rounded-full bg-adanfo-blue text-white flex items-center justify-center text-xs font-bold">
        {step}
      </div>
      
      {/* Content */}
      <motion.div 
        className="mt-4"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: step * 0.2 + 0.2 }}
      >
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-foreground/70 text-sm max-w-xs mx-auto">{description}</p>
      </motion.div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  const steps = [
    {
      icon: <FileText size={32} />,
      title: "Apply",
      description: "Create a profile and submit your loan request with the amount, duration, and purpose."
    },
    {
      icon: <Coins size={32} />,
      title: "Fund",
      description: "Lenders review your request and provide funds if they see a good fit."
    },
    {
      icon: <Repeat size={32} />,
      title: "Repay",
      description: "Make regular repayments directly through the platform using cryptocurrency."
    }
  ];
  
  return (
    <section ref={containerRef} className="py-24 relative">
      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
            Our simple three-step process makes borrowing and lending easy for everyone.
          </p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              {...step} 
              step={index + 1} 
              isLastStep={index === steps.length - 1} 
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;
