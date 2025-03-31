import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Shield, Award, History } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface IncentiveProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const Incentive: React.FC<IncentiveProps> = ({ icon, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 rounded-full bg-adanfo-purple/10 text-adanfo-purple">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-foreground/70 text-sm">{description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const LenderIncentives: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const incentives = [
    {
      icon: <TrendingUp size={20} />,
      title: "Higher Returns",
      description: "Earn competitive interest rates that outperform traditional savings accounts and many other investments."
    },
    {
      icon: <Shield size={20} />,
      title: "Smart Contracts Security",
      description: "Blockchain-based smart contracts automatically enforce loan terms and protect your investment."
    },
    {
      icon: <Award size={20} />,
      title: "Pramps Rewards",
      description: "Earn additional rewards through our loyalty program based on your lending activity."
    },
    {
      icon: <History size={20} />,
      title: "Transparent History",
      description: "View complete borrower repayment history and credit scores to make informed decisions."
    }
  ];

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-secondary/40 dark:from-background dark:to-secondary/10">
      {/* Background Circle */}
      <motion.div 
        className="absolute -right-1/4 -bottom-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-br from-adanfo-purple/10 to-transparent blur-3xl"
        style={{ y }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Lenders' Incentives</h2>
              <p className="text-foreground/70 mb-8">
                As a lender on AdanfoCash, you'll enjoy a range of benefits that make investing your crypto not only profitable but also secure and rewarding.
              </p>
              
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple rounded-xl blur-xl -z-10" />
                <div className="bg-gradient-to-r from-adanfo-blue to-adanfo-purple p-[1px] rounded-xl">
                  <div className="bg-background/95 dark:bg-background/90 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-adanfo-purple/10 rounded-full">
                        <TrendingUp className="h-6 w-6 text-adanfo-purple" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">Average Return</p>
                        <p className="text-3xl font-bold text-adanfo-purple">12-18% APY</p>
                        <p className="text-foreground/60 text-sm mt-1">Significantly higher than traditional savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Incentives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {incentives.map((incentive, index) => (
              <Incentive key={index} {...incentive} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LenderIncentives;
