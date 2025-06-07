
import React from 'react';
import { Brain } from 'lucide-react';

export const StatsCard: React.FC = () => {
  return (
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
  );
};
