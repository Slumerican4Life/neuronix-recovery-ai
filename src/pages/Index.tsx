
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { FileScanner } from '@/components/scanner/FileScanner';
import { RecoveryEngine } from '@/components/recovery/RecoveryEngine';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Brain, Zap, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Neural network background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
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
              <span className="text-slate-300 text-sm">Welcome, {user?.email}</span>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Scanner and Recovery */}
          <div className="lg:col-span-2 space-y-8">
            <FileScanner />
            <RecoveryEngine />
          </div>
          
          {/* Right Column - Subscription */}
          <div className="space-y-8">
            <SubscriptionCard />
            
            {/* Stats Card */}
            <div className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Recovery Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">94.7%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">12.3M</div>
                  <div className="text-xs text-slate-400">Files Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">847ms</div>
                  <div className="text-xs text-slate-400">Avg Speed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">99.9%</div>
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

const Index = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

const AuthContent = () => {
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
