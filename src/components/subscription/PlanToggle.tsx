
import React from 'react';
import { Star } from 'lucide-react';

interface PlanToggleProps {
  isLifetime: boolean;
  onToggle: (isLifetime: boolean) => void;
}

export const PlanToggle: React.FC<PlanToggleProps> = ({ isLifetime, onToggle }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-800/80 p-1 rounded-lg flex border border-gray-700">
        <button
          onClick={() => onToggle(false)}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            !isLifetime 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Monthly Plan
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            isLifetime 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Lifetime Deal
          {isLifetime && <Star className="h-4 w-4 ml-1 inline animate-pulse" />}
        </button>
      </div>
    </div>
  );
};
