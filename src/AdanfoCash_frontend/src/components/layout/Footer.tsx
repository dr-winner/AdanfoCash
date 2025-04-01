
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">© 2024 AdanfoCash</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/resources/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link to="/legal/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/adanfo-github" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={16} />
            </a>
            <a 
              href="https://adanfocash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
