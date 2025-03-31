
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary/30 dark:bg-secondary/10 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Column */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-adanfo-blue to-adanfo-purple bg-clip-text text-transparent">
                AdanfoCash
              </span>
            </Link>
            <p className="mt-2 text-sm text-foreground/70">
              Financial freedom for students, powered by blockchain.
            </p>
          </motion.div>
          
          {/* Platform Column */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 className="text-lg font-medium">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', url: '/' },
                { label: 'Borrow', url: '/borrower-dashboard' },
                { label: 'Lend', url: '/lender-dashboard' },
                { label: 'FAQs', url: '/resources/faq' },
              ].map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    to={link.url} 
                    className="text-sm text-foreground/70 hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom Copyright */}
        <motion.div 
          className="pt-8 mt-8 border-t border-border/50 text-center text-sm text-foreground/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="flex justify-center items-center gap-1">
            Made with <Heart size={14} className="text-red-500" /> for decentralized finance
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} AdanfoCash. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
