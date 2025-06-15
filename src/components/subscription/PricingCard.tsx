
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingHeader } from './PricingHeader';
import { FeaturesList } from './FeaturesList';
import { SocialProof } from './SocialProof';

interface PricingCardProps {
  isLifetime?: boolean;
  isLoading?: boolean;
  isLoggedIn?: boolean;
  onUpgrade?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  isLifetime = true,
  isLoading = false,
  isLoggedIn = false,
  onUpgrade = () => {}
}) => {
  return (
    <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl relative overflow-hidden max-w-md mx-auto">
      {/* Enhanced visual effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #a855f7 0%, transparent 70%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 70%)`,
          animation: 'pulse 6s ease-in-out infinite'
        }}></div>
      </div>

      <CardHeader className="relative z-10">
        <PricingHeader 
          isLifetime={isLifetime}
          isLoading={isLoading}
          isLoggedIn={isLoggedIn}
          onUpgrade={onUpgrade}
        />
      </CardHeader>
      
      <CardContent className="space-y-6 relative z-10">
        <FeaturesList isLifetime={isLifetime} />
        <SocialProof />
      </CardContent>
    </Card>
  );
};
