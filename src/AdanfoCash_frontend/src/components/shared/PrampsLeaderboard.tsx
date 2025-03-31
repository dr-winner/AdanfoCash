
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, Star, Trophy, Filter, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

// Mock data for the leaderboard
const mockLeaderboardData = [
  { id: 1, name: 'Emmanuel Oduro', role: 'borrower', pramps: 12500, university: 'University of Ghana' },
  { id: 2, name: 'Abena Mensah', role: 'lender', pramps: 10200, university: null },
  { id: 3, name: 'Kwame Asante', role: 'borrower', pramps: 9800, university: 'KNUST' },
  { id: 4, name: 'Gifty Owusu', role: 'borrower', pramps: 8450, university: 'University of Cape Coast' },
  { id: 5, name: 'Michael Addo', role: 'lender', pramps: 7900, university: null },
  { id: 6, name: 'Akua Sarpong', role: 'borrower', pramps: 7500, university: 'Ashesi University' },
  { id: 7, name: 'Frank Darko', role: 'lender', pramps: 6800, university: null },
  { id: 8, name: 'Grace Acheampong', role: 'borrower', pramps: 6200, university: 'University of Ghana' },
  { id: 9, name: 'Joseph Annan', role: 'borrower', pramps: 5950, university: 'KNUST' },
  { id: 10, name: 'Sophia Boateng', role: 'lender', pramps: 5600, university: null }
];

type FilterOption = 'all' | 'borrowers' | 'lenders';

const PrampsLeaderboard: React.FC = () => {
  const [filter, setFilter] = useState<FilterOption>('all');
  
  // Filter the leaderboard data based on the selected filter
  const filteredData = mockLeaderboardData.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'borrowers') return user.role === 'borrower';
    if (filter === 'lenders') return user.role === 'lender';
    return true;
  });
  
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0: // 1st place
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: // 2nd place
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: // 3rd place
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full rounded-xl overflow-hidden border border-border">
      <div className="bg-secondary/50 p-4 flex items-center justify-between">
        <h3 className="font-medium">Pramps Leaderboard</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              {filter === 'all' ? 'All Users' : 
               filter === 'borrowers' ? 'Borrowers Only' : 'Lenders Only'}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilter('all')}>
              All Users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('borrowers')}>
              Borrowers Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter('lenders')}>
              Lenders Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="divide-y divide-border">
        {filteredData.map((user, index) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-3 hover:bg-secondary/20 transition-colors flex items-center"
          >
            <div className="w-8 text-center font-medium">
              {index < 3 ? (
                getMedalIcon(index)
              ) : (
                <span className="text-foreground/60">{index + 1}</span>
              )}
            </div>
            
            <div className="ml-2 flex-grow">
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-secondary/60 rounded-full capitalize">
                  {user.role}
                </span>
                {user.university && (
                  <span className="text-xs text-foreground/60">
                    {user.university}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{user.pramps.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrampsLeaderboard;
