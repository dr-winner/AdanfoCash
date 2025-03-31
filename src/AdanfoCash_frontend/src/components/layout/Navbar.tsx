
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuthContext';
import NavbarLogo from './NavbarLogo';
import NavItems, { NavItem } from './NavItems';
import ThemeToggle from './ThemeToggle';
import UserRoleBadge from './UserRoleBadge';
import MobileMenu from './MobileMenu';
import WalletConnect from '../shared/WalletConnect';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Define navigation items with role restrictions
  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Borrow', path: '/borrower-dashboard', roles: ['borrower'] },
    { name: 'Lend', path: '/lender-dashboard', roles: ['lender'] },
    { name: 'FAQs', path: '/resources/faq' },
  ];
  
  // Filter nav items based on user role and authentication status
  const filteredNavItems = navItems.filter(item => {
    // Public routes anyone can see
    if (!item.roles) return true;
    
    // Routes that require authentication and specific role
    return user.isAuthenticated && item.roles.includes(user.role);
  });
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background/60 dark:bg-background/40 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavbarLogo />
          
          {/* Desktop Nav */}
          <NavItems items={filteredNavItems} />
          
          {/* Actions: Dark Mode, User Role Badge, and Connect Wallet */}
          <div className="flex items-center space-x-3">
            {user.isAuthenticated && user.role !== 'unregistered' && (
              <UserRoleBadge role={user.role} />
            )}
            
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            
            {!isMobile && <WalletConnect />}
            
            {/* Mobile menu */}
            {isMobile && (
              <MobileMenu 
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                navItems={filteredNavItems}
                userRole={user.role}
                isAuthenticated={user.isAuthenticated}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
