
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavbarLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-8 w-9"
      >
        {/* Enhanced coin symbol with two overlapped coins */}
        <div className="absolute top-0 left-0 h-6 w-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg z-10"></div>
        <div className="absolute top-2 left-3 h-6 w-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow-lg"></div>
      </motion.div>
      <motion.span 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold font-display bg-gradient-to-r from-adanfo-blue to-adanfo-purple bg-clip-text text-transparent drop-shadow-sm"
      >
        AdanfoCash
      </motion.span>
    </Link>
  );
};

export default NavbarLogo;
