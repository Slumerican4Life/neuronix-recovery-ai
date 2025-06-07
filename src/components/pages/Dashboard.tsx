
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { FileScanner } from '@/components/scanner/FileScanner';
import { RecoveryEngine } from '@/components/recovery/RecoveryEngine';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { LyraAssistant } from '@/components/ai/LyraAssistant';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { StatsCard } from '@/components/layout/StatsCard';
import { BackgroundOverlay } from '@/components/layout/BackgroundOverlay';
import { Brain } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

export const Dashboard: React.FC = () => {
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
      <BackgroundOverlay />
      
      <DashboardHeader
        user={user!}
        role={role}
        canManageUsers={canManageUsers}
        onShowAdminDashboard={() => setShowAdminDashboard(true)}
        onSignOut={handleSignOut}
      />

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
            <StatsCard />
          </div>
        </div>
      </div>

      <LyraAssistant />
    </div>
  );
};
