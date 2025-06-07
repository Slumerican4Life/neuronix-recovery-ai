
import React from 'react';

export const ScannerHero: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20 max-w-md mx-auto">
        <img 
          src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
          alt="AI Brain with Lightning - File Scanner"
          className="w-32 h-32 mx-auto mb-4 object-contain"
        />
        
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
          Smart File Organization
        </h3>
        <p className="text-gray-300 text-sm">
          Select a folder to scan and organize your files with AI-powered analysis
        </p>
      </div>
    </div>
  );
};
