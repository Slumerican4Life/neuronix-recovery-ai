
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useCheckout } from '@/hooks/useCheckout';
import { PlanToggle } from './PlanToggle';
import { PricingHeader } from './PricingHeader';
import { FeaturesList } from './FeaturesList';
import { SocialProof } from './SocialProof';

export const PricingCard: React.FC = () => {
  const [isLifetime, setIsLifetime] = useState(true);
  const { user } = useAuth();
  const { createCheckoutSession, isLoading } = useCheckout();

  const handleUpgrade = () => {
    const priceId = isLifetime 
      ? 'price_1QXlQ9JNcmPzuSeK2m9rssOy' // Lifetime price ID
      : 'price_1QXlQ9JNcmPzuSeK2m9rssOy'; // Monthly price ID (update when available)
    
    createCheckoutSession(priceId, isLifetime);
  };

  return (
    <Card className="bg-black/50 border-purple-500/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30"></div>
      </div>

      <CardContent className="p-6 relative z-10">
        <PlanToggle isLifetime={isLifetime} onToggle={setIsLifetime} />
        
        <PricingHeader 
          isLifetime={isLifetime}
          onUpgrade={handleUpgrade}
          isLoading={isLoading}
          isLoggedIn={!!user}
        />
        
        <FeaturesList />
        
        <SocialProof />
      </CardContent>
    </Card>
  );
};
