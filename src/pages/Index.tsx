
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { FileScanner } from '@/components/scanner/FileScanner';
import { RecoveryEngine } from '@/components/recovery/RecoveryEngine';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LyraAssistant } from '@/components/ai/LyraAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, LogOut, Settings, Crown } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='marble' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23330033;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%23660066;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23990099;stop-opacity:0.4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>
      
      {/* Neural network pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30,10 L30,20 M30,40 L30,50 M10,30 L20,30 M40,30 L50,30' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Header */}
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
                  onClick={() => setShowAdminDashboard(true)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                </Button>
              )}
              
              <Button
                onClick={handleSignOut}
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
            
            {/* Enhanced Stats Card */}
            <div className="bg-black/40 border border-purple-500/30 backdrop-blur-xl rounded-lg p-4 sm:p-6 relative overflow-hidden">
              {/* Marble background */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='marble2'%3E%3Cstop offset='0%25' style='stop-color:%23440044;stop-opacity:0.8'/%3E%3Cstop offset='100%25' style='stop-color:%23220022;stop-opacity:0.4'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble2)'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
              }}></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  AI Recovery Statistics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="text-xl sm:text-2xl font-bold text-green-400">98.3%</div>
                    <div className="text-xs text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">24.7M</div>
                    <div className="text-xs text-gray-400">Files Recovered</div>
                  </div>
                  <div className="text-center bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">247ms</div>
                    <div className="text-xs text-gray-400">Avg Speed</div>
                  </div>
                  <div className="text-center bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                    <div className="text-xl sm:text-2xl font-bold text-red-400">99.97%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lyra AI Assistant */}
      <LyraAssistant />
    </div>
  );
};

const GuestScanner: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);

  if (showAuthForm) {
    return <AuthForm onBack={() => setShowAuthForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 relative overflow-hidden">
      {/* Marble texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='marble' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23330033;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%23660066;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23990099;stop-opacity:0.4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23marble)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>
      
      {/* Header */}
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
                <p className="text-xs text-gray-400">Free Trial - Scan Now, Pay Only If You Find Files</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowAuthForm(true)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Recover Your Lost Files with AI Power
          </h2>
          <p className="text-gray-300 text-lg">
            Advanced neural network technology finds and recovers files others can't. 
            <span className="text-purple-400 font-semibold"> Scan for free - pay only if we find your files!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FileScanner guestMode={true} onLoginRequired={() => setShowAuthForm(true)} />
          </div>
          
          <div className="space-y-6">
            {/* Free Trial Info */}
            <div className="bg-black/40 border border-green-500/30 backdrop-blur-xl rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Free Trial Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Unlimited scanning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  5 free file recoveries
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Full file preview
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  AI file repair
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="bg-black/40 border border-purple-500/30 backdrop-blur-xl rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Unlimited Recovery</h3>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  $9.99/month
                </div>
                <p className="text-gray-400 text-sm">Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lyra AI Assistant */}
      <LyraAssistant />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <div className="text-white">Loading Neuronix Recovery AI...</div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <GuestScanner />;
};

export default Index;
