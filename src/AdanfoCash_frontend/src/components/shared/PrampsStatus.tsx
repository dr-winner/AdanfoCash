
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, TrendingUp, Users } from 'lucide-react';
import { Progress } from '../ui/progress';

interface PrampsStatusProps {
  pramps: number;
  level: number;
  nextLevelAt: number;
  rank?: number;
}

const PrampsStatus: React.FC<PrampsStatusProps> = ({ 
  pramps, 
  level, 
  nextLevelAt,
  rank 
}) => {
  // Calculate progress percentage to next level
  const progressPercentage = Math.min((pramps / nextLevelAt) * 100, 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 rounded-xl bg-secondary/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow border border-border/50 dark:bg-secondary/20"
    >
      <div className="flex items-center justify-between mb-3">
        <motion.h3 
          className="font-medium flex items-center gap-2"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Award className="h-5 w-5 text-yellow-500" />
          <span>Your Pramps</span>
        </motion.h3>
        {rank && (
          <motion.div 
            className="flex items-center text-xs bg-secondary/60 px-2 py-1 rounded-full shadow-inner border border-border/30"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Users className="h-3 w-3 mr-1" />
            <span>Rank #{rank}</span>
          </motion.div>
        )}
      </div>
      
      <div className="flex items-end justify-between mb-1">
        <div className="flex items-center gap-2">
          <motion.div 
            className="p-1.5 rounded-full bg-yellow-500/20 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0 rgba(234, 179, 8, 0.2)",
                "0 0 10px rgba(234, 179, 8, 0.5)",
                "0 0 0 rgba(234, 179, 8, 0.2)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Star className="h-5 w-5 text-yellow-500" />
          </motion.div>
          <motion.span 
            className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {pramps}
          </motion.span>
        </div>
        <div className="text-xs text-foreground/70 bg-secondary/30 px-2 py-0.5 rounded">
          Level <span className="font-semibold">{level}</span>
        </div>
      </div>
      
      <div className="mb-1">
        <Progress 
          value={progressPercentage} 
          className="h-2"
          style={{ 
            background: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)"
          }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-foreground/60 mt-2">
        <span>{pramps} / {nextLevelAt} Pramps</span>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>{nextLevelAt - pramps} to next level</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PrampsStatus;
