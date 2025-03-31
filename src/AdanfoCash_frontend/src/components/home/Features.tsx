
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Coins, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
    >
      <Card 
        className="h-full p-6 flex flex-col hover:shadow-lg hover:shadow-adanfo-blue/10 dark:hover:shadow-adanfo-blue/5"
      >
        <div className="mb-4 p-3 rounded-full bg-adanfo-blue/10 dark:bg-adanfo-blue/20 w-fit">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-foreground/70 text-sm flex-grow">{description}</p>
      </Card>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-adanfo-blue" />,
      title: "Decentralized",
      description: "No central authority, just a secure blockchain-based platform that connects borrowers and lenders directly.",
      delay: 0.1
    },
    {
      icon: <Clock className="h-6 w-6 text-adanfo-blue" />,
      title: "Instant Loans",
      description: "Get funded quickly without the lengthy approval processes of traditional banks.",
      delay: 0.2
    },
    {
      icon: <Coins className="h-6 w-6 text-adanfo-blue" />,
      title: "No Middlemen",
      description: "Lower fees and better rates for everyone since there are no financial intermediaries.",
      delay: 0.3
    },
    {
      icon: <Zap className="h-6 w-6 text-adanfo-blue" />,
      title: "Transparent",
      description: "All transactions are recorded on the blockchain, providing complete transparency for everyone.",
      delay: 0.4
    }
  ];

  return (
    <section className="py-20 bg-secondary/40 dark:bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Why AdanfoCash?</h2>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
            Our platform was built from the ground up to be better than traditional lending.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
