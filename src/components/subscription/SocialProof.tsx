
import React from 'react';
import { Shield, FileSearch, Brain } from 'lucide-react';

export const SocialProof: React.FC = () => {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-green-400" />
          <span>30-day guarantee</span>
        </div>
        <div className="flex items-center gap-1">
          <FileSearch className="h-3 w-3 text-blue-400" />
          <span>10,000+ files recovered</span>
        </div>
        <div className="flex items-center gap-1">
          <Brain className="h-3 w-3 text-purple-400" />
          <span>Real AI technology</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-400">
        ⚡ Over 2,847 users chose lifetime access in the last 30 days
      </p>
      <p className="text-xs text-purple-400 font-medium animate-pulse">
        🔥 This deal expires soon - Secure your lifetime access today!
      </p>
    </div>
  );
};
