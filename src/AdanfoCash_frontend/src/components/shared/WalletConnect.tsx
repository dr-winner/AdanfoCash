
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Wallet, LogOut, Loader2, User, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useLocation } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WalletConnect: React.FC = () => {
  const { user, isLoading, login, logout } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setHasError(false);
      console.log("Starting Internet Identity connection process...");
      
      toast({
        title: "Connecting...",
        description: "Internet Identity authentication window will open.",
      });
      
      // Pass the current path so we can return here after authentication
      const currentPath = location.pathname;
      console.log("Saving redirect path:", currentPath);
      
      const success = await login(currentPath);
      
      if (success) {
        toast({
          title: "Connection Successful",
          description: "You're now connected with Internet Identity.",
        });
      } else {
        setHasError(true);
        toast({
          title: "Connection Failed",
          description: "Failed to connect using Internet Identity. Please try again.",
          variant: "destructive"
        });
        console.error("Login process completed but was not successful");
      }
    } catch (error) {
      setHasError(true);
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting to Internet Identity.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectWallet = async () => {
    try {
      await logout();
      toast({
        title: "Disconnected",
        description: "You've been logged out from Internet Identity.",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnection Error",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  };
  
  // Get first name of user if authenticated
  const firstName = user.isAuthenticated ? user.id.split(' ')[0] : '';
  
  // Verify badge component
  const VerifyBadge = () => {
    if (user.role !== 'borrower') return null;
    
    return (
      <Badge 
        variant={user.isVerified ? "secondary" : "outline"} 
        className={`ml-2 gap-1 px-2 py-1 ${user.isVerified ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}`}
      >
        {user.isVerified ? (
          <>
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>Verified</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3 text-orange-500" />
            <span>Unverified</span>
          </>
        )}
      </Badge>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!user.isAuthenticated ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="default"
                onClick={connectWallet}
                disabled={isLoading || isConnecting}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-adanfo-blue/20 to-adanfo-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
                <div className="flex items-center relative z-10">
                  {isLoading || isConnecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-adanfo-blue" />
                  ) : hasError ? (
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                  ) : (
                    <Wallet className="mr-2 h-4 w-4 group-hover:animate-pulse text-adanfo-blue" />
                  )}
                  <span>{isLoading || isConnecting ? 'Connecting...' : hasError ? 'Retry Connection' : 'Connect Internet Identity'}</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasError 
                ? "There was an issue connecting. Click to try again."
                : "Connect with Internet Identity to access all features"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Badge variant="outline" className="gap-1 px-2 py-1 bg-secondary/80">
              <User className="h-3 w-3 text-adanfo-blue" />
              <span>{firstName}</span>
            </Badge>
            <VerifyBadge />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={disconnectWallet}
            className="group relative overflow-hidden"
            title="Disconnect wallet"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-adanfo-purple/20 to-adanfo-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
            <LogOut className="h-4 w-4 group-hover:animate-pulse text-adanfo-purple" />
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default WalletConnect;
