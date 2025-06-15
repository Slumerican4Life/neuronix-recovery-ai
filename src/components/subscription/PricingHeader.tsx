
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Crown } from 'lucide-react';

interface PricingHeaderProps {
  isLifetime: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  onUpgrade: () => void;
}

export const PricingHeader: React.FC<PricingHeaderProps> = ({
  isLifetime,
  isLoading,
  isLoggedIn,
  onUpgrade
}) => {
  return (
    <div className="text-center space-y-6 mb-8">
      <div className="space-y-2">
        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 mb-4">
          <Crown className="h-3 w-3 mr-1" />
          PREMIUM PLAN
        </Badge>
        <h2 className="text-3xl font-bold text-white mb-2">
          Neuronix Recovery Pro
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`text-4xl font-bold ${isLifetime ? 'text-white' : 'text-gray-400 line-through'}`}>
            {isLifetime ? '$299' : '$19.99/mo'}
          </span>
          {isLifetime && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              One-time payment
            </Badge>
          )}
        </div>
        <p className="text-gray-300 text-lg">
          Unlimited AI-powered file recovery with advanced neural networks
        </p>
      </div>

      <Button
        onClick={onUpgrade}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 text-lg shadow-2xl transform hover:scale-105 transition-all"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-5 w-5" />
            {isLoggedIn ? 'Upgrade to Pro' : 'Sign Up & Upgrade'}
          </>
        )}
      </Button>
    </div>
  );
};
