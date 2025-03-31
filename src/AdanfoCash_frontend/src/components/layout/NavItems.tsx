
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface NavItem {
  name: string;
  path: string;
  roles?: string[]; // Optional roles that can access this nav item
}

interface NavItemsProps {
  items: NavItem[];
  isMobile?: boolean;
  onClick?: () => void;
}

const NavItems: React.FC<NavItemsProps> = ({ items, isMobile = false, onClick }) => {
  const location = useLocation();
  
  // Animation variants for menu items in mobile view
  const itemVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 }
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-2 mb-8">
        {items.map((item, index) => (
          <motion.div 
            key={item.path}
            initial="closed"
            animate="open"
            variants={itemVariants}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 5 }}
          >
            <Link
              to={item.path}
              className={`block px-3 py-4 rounded-lg text-lg font-medium ${
                location.pathname === item.path
                  ? 'bg-secondary/50 text-adanfo-blue dark:text-adanfo-blue'
                  : 'hover:bg-secondary/30'
              }`}
              onClick={onClick}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </nav>
    );
  }
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      {items.map((item) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Link
            to={item.path}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'text-adanfo-blue dark:text-adanfo-blue'
                : 'text-foreground/70 hover:text-foreground hover:bg-secondary/40'
            }`}
          >
            {item.name}
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default NavItems;
