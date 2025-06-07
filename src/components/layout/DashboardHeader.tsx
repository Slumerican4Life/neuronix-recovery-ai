
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, LogOut, Settings, Crown } from 'lucide-react';

interface DashboardHeaderProps {
  user: { email?: string };
  role?: string;
  canManageUsers: boolean;
  onShowAdminDashboard: () => void;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  role,
  canManageUsers,
  onShowAdminDashboard,
  onSignOut
}) => {
  return (
    <div className="relative z-10 bg-black/30 border-b border-purple-500/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-purple-400" />
              <Zap className="h-4 w-4 text-red-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                Neuronix Recovery AI
              </h1>
              <p className="text-xs text-gray-400">Neural File Recovery System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {role && (
              <Badge className={
                role === 'owner' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                role === 'manager' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                role === 'admin' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                'bg-gray-500/20 text-gray-400 border-gray-500/50'
              }>
                {role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                {role}
              </Badge>
            )}
            
            <span className="text-gray-300 text-sm hidden sm:block">Welcome, {user?.email}</span>
            
            {canManageUsers && (
              <Button
                onClick={onShowAdminDashboard}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Button>
            )}
            
            <Button
              onClick={onSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
