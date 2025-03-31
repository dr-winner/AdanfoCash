
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink, Wallet, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface WalletDisplayProps {
  isConnected: boolean;
  walletAddress?: string;
  balance?: number;
}

const WalletDisplay: React.FC<WalletDisplayProps> = ({ 
  isConnected, 
  walletAddress = "", 
  balance = 0 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };
  
  return (
    <Card className="p-4 backdrop-blur-sm border-border/50 shadow-md hover:shadow-lg transition-shadow dark:shadow-primary/5 dark:hover:shadow-primary/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: isConnected ? [0, 15, -15, 0] : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Wallet className={`h-5 w-5 ${isConnected ? 'text-adanfo-green' : 'text-adanfo-blue'}`} />
            </motion.div>
            <h3 className="font-semibold">NFID Wallet Status</h3>
          </div>
          
          {isConnected ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Connected</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <motion.span 
                  className="font-mono bg-secondary/50 px-2 py-0.5 rounded border border-border/30 flex items-center gap-1"
                  whileHover={{ scale: 1.02 }}
                >
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                  <button 
                    onClick={copyToClipboard}
                    className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <Copy size={12} />
                  </button>
                </motion.span>
                <span className="ml-1 text-foreground/70 bg-secondary/30 px-2 py-0.5 rounded">
                  Balance: <span className="font-semibold text-adanfo-blue">{balance.toFixed(2)} ICP</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Not connected - Some features are unavailable</span>
            </div>
          )}
        </div>
        
        <div>
          {isConnected ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" className="gap-2 group">
                <ExternalLink className="h-4 w-4 group-hover:text-adanfo-blue transition-colors" />
                <span>View on Explorer</span>
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/wallet-connection')}
                className="bg-gradient-to-r from-adanfo-blue to-adanfo-purple hover:from-adanfo-blue-dark hover:to-adanfo-purple-dark shadow-md"
              >
                Connect Wallet
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WalletDisplay;
