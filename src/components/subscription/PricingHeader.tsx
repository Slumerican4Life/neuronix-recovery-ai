
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

interface PricingHeaderProps {
  isLifetime: boolean;
}

export const PricingHeader: React.FC<PricingHeaderProps> = ({ isLifetime }) => {
  return (
    <div className="text-center relative">
      {isLifetime && (
        <>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-3 animate-pulse">
            <Crown className="h-3 w-3 mr-1" />
            🔥 LIMITED TIME - 85% OFF
          </Badge>
          <div className="absolute top-0 right-0">
            <img 
              src="/lovable-uploads/6b23e108-ada8-40d9-b1c2-35fe130ff138.png" 
              alt="Lifetime AI Deal - $39.99"
              className="w-24 h-24 object-contain opacity-90 animate-bounce"
            />
          </div>
        </>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img 
            src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
            alt="AI Brain"
            className="w-12 h-12 object-contain"
          />
          <div className={`text-6xl font-bold ${
            isLifetime 
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
          }`}>
            ${isLifetime ? '39.99' : '19.99'}
          </div>
        </div>
        
        {isLifetime && (
          <div className="text-gray-400 line-through text-lg">
            Regular Price: $299.99
          </div>
        )}
        
        <p className="text-gray-400 text-lg">
          {isLifetime ? 'One-time payment • Use forever' : 'per month • Cancel anytime'}
        </p>
        
        {isLifetime && (
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4 mt-4">
            <p className="text-green-400 text-xl font-bold animate-pulse">
              🚀 Save $260+ vs Monthly Plan!
            </p>
            <p className="text-green-300 text-sm font-medium">
              ⚡ Pay once, own the world's most advanced AI recovery system forever
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
