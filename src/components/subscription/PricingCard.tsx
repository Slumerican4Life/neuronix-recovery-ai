
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Zap, Cpu } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';
import { PlanToggle } from './PlanToggle';
import { PricingHeader } from './PricingHeader';
import { FeaturesList } from './FeaturesList';
import { SocialProof } from './SocialProof';

export const PricingCard: React.FC = () => {
  const [isLifetime, setIsLifetime] = useState(true);
  const { createCheckoutSession, isLoading } = useCheckout();

  const handleUpgrade = () => {
    if (isLifetime) {
      createCheckoutSession('price_1RXRl5EEqiDDPmsdmZH4XpAW', true);
    } else {
      createCheckoutSession('price_1QyZvGEEqiDDPmsdjKlmnOp2', false);
    }
  };

  return (
    <Card className="bg-black/50 border-purple-500/40 backdrop-blur-xl p-6 relative overflow-hidden">
      {/* Enhanced background with AI brain pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.2'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3Cpath d='M40,10 L40,30 M40,50 L40,70 M10,40 L30,40 M50,40 L70,40 M25,25 L35,35 M45,45 L55,55 M25,55 L35,45 M45,35 L55,25' stroke='%23a855f7' stroke-width='1' stroke-opacity='0.3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'pulse 8s ease-in-out infinite'
        }}></div>
      </div>
      
      <div className="relative z-10 space-y-6">
        <PlanToggle isLifetime={isLifetime} onToggle={setIsLifetime} />
        <PricingHeader isLifetime={isLifetime} />
        <FeaturesList isLifetime={isLifetime} />

        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className={`w-full ${
            isLifetime
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
          } text-white font-bold py-4 text-lg shadow-xl transform hover:scale-105 transition-all`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isLifetime ? <Crown className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
              {isLifetime ? 'Get Lifetime Access - $39.99' : 'Start AI Recovery - $19.99/mo'}
            </div>
          )}
        </Button>

        {isLifetime && <SocialProof />}
      </div>
    </Card>
  );
};
