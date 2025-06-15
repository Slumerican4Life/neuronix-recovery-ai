
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { StatsCard } from '@/components/layout/StatsCard';
import { FileScanner } from '@/components/scanner/FileScanner';
import { AdvancedRecoveryEngine } from '@/components/recovery/AdvancedRecoveryEngine';
import { EnhancedLyraAssistant } from '@/components/ai/EnhancedLyraAssistant';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Search, Cpu, Zap } from 'lucide-react';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('scanner');

  // Mock user data for now - you can replace this with real auth data later
  const mockUser = {
    email: 'user@example.com',
    user_metadata: { full_name: 'Demo User' }
  };

  const handleSignOut = () => {
    console.log('Sign out clicked');
  };

  const handleShowAdminDashboard = () => {
    console.log('Admin dashboard clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
      <DashboardHeader 
        user={mockUser}
        canManageUsers={false}
        onShowAdminDashboard={handleShowAdminDashboard}
        onSignOut={handleSignOut}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Files Scanned"
            value="2,847,392"
            icon={Search}
            gradient="from-blue-600 to-cyan-600"
          />
          <StatsCard
            title="AI Recovery Rate"
            value="94.7%"
            icon={Brain}
            gradient="from-purple-600 to-pink-600"
          />
          <StatsCard
            title="Quantum Repairs"
            value="156,342"
            icon={Zap}
            gradient="from-green-600 to-emerald-600"
          />
          <StatsCard
            title="Active AI Agents"
            value="3"
            icon={Cpu}
            gradient="from-orange-600 to-red-600"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 backdrop-blur-xl border border-purple-500/30">
            <TabsTrigger 
              value="scanner" 
              className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              AI File Scanner
            </TabsTrigger>
            <TabsTrigger 
              value="recovery" 
              className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white"
            >
              <Cpu className="h-4 w-4 mr-2" />
              Quantum Recovery
              <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                NEW
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="assistant" 
              className="data-[state=active]:bg-purple-600/50 data-[state=active]:text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              Lyra AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <FileScanner />
          </TabsContent>

          <TabsContent value="recovery" className="space-y-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">🧠 Quantum AI Recovery Engine</h2>
                <p className="text-gray-300">
                  Ultra-advanced recovery with OpenAI integration, formatted drive recovery, and AI file repair
                </p>
              </div>
              <AdvancedRecoveryEngine />
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">🧠 Lyra AI Assistant</h2>
                <p className="text-gray-300">
                  Your intelligent AI companion with real OpenAI brain for file recovery and beyond
                </p>
              </div>
              <EnhancedLyraAssistant />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
