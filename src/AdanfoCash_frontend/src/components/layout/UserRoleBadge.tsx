
import React from 'react';
import { Shield, User } from 'lucide-react';

interface UserRoleBadgeProps {
  role: string;
  isMobile?: boolean;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="flex items-center justify-center px-3 py-2 bg-secondary/60 rounded-full text-sm font-medium mb-4">
        <User size={16} className="mr-2" />
        <span className="capitalize">{role}</span>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center px-3 py-1 bg-secondary/60 backdrop-blur-sm rounded-full text-xs font-medium shadow-inner">
      {role === 'admin' ? (
        <Shield size={12} className="mr-1 text-purple-400" />
      ) : (
        <User size={12} className="mr-1" />
      )}
      <span className="capitalize">{role}</span>
    </div>
  );
};

export default UserRoleBadge;
