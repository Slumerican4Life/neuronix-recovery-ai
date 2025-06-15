
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScanningAgent } from './ScanningAgent';

interface ScannerCardProps {
  guestMode?: boolean;
  scanningAgent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' | null;
  children: React.ReactNode;
}

export const ScannerCard: React.FC<ScannerCardProps> = ({ 
  guestMode = false, 
  scanningAgent, 
  children 
}) => {
  return (
    <Card className="bg-black/50 border-purple-500/40 backdrop-blur-xl relative overflow-hidden">
      {/* Enhanced visual effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #a855f7 0%, transparent 70%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 70%)`,
          animation: 'pulse 6s ease-in-out infinite'
        }}></div>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="relative">
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="AI Brain"
              className="w-8 h-8 object-contain"
            />
            {scanningAgent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          AI-Powered File Scanner & Recovery System
          {guestMode && <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Free Trial</Badge>}
          <ScanningAgent agent={scanningAgent} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        {children}
      </CardContent>
    </Card>
  );
};
