
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { FileScanner } from '@/components/scanner/FileScanner';
import { RecoveryEngine } from '@/components/recovery/RecoveryEngine';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, LogOut, Settings, Crown } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useState } from 'react';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { role, canManageUsers, loading: roleLoading } = useUserRole();
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <div className="text-white">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (showAdminDashboard && canManageUsers) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Neural network background pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
      <div className="relative z-10 bg-slate-900/50 border-b border-purple-500/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-400" />
                <Zap className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Neuronix Recovery AI
                </h1>
                <p className="text-xs text-slate-400">Neural File Recovery System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {role && (
                <Badge className={
                  role === 'owner' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                  role === 'manager' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                  role === 'admin' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/50'
                }>
                  {role === 'owner' && <Crown className="h-3 w-3 mr-1" />}
                  {role}
                </Badge>
              )}
              
              <span className="text-slate-300 text-sm hidden sm:block">Welcome, {user?.email}</span>
              
              {canManageUsers && (
                <Button
                  onClick={() => setShowAdminDashboard(true)}
                  variant="ghost"
                  size="sm"
                  className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                >
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                </Button>
              )}
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Left Column - Scanner and Recovery */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            <FileScanner />
            <RecoveryEngine />
          </div>
          
          {/* Right Column - Subscription */}
          <div className="space-y-4 sm:space-y-8">
            <SubscriptionCard />
            
            {/* Stats Card */}
            <div className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl rounded-lg p-4 sm:p-6 border">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Recovery Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">94.7%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">12.3M</div>
                  <div className="text-xs text-slate-400">Files Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">847ms</div>
                  <div className="text-xs text-slate-400">Avg Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">99.9%</div>
                  <div className="text-xs text-slate-400">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

const AuthContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <div className="text-white">Loading Neuronix Recovery AI...</div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthForm />;
};

export default Index;
