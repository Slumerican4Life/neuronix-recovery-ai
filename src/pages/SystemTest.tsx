
import React from 'react';
import { RecoverySystemTest } from '@/components/recovery/RecoverySystemTest';
import { SystemStatus } from '@/components/recovery/SystemStatus';
import { LyraAssistant } from '@/components/ai/LyraAssistant';
import { MobileLyraAssistant } from '@/components/ai/MobileLyraAssistant';
import { useIsMobile } from '@/hooks/use-mobile';

export const SystemTest = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧠 Recovery System Test Center
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Comprehensive testing suite for the AI-powered file and media recovery system. 
            Verify all components are functioning correctly.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          <SystemStatus />
          <RecoverySystemTest />
        </div>
      </div>

      {isMobile ? <MobileLyraAssistant /> : <LyraAssistant />}
    </div>
  );
};
