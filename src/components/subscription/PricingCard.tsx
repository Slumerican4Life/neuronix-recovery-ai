
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const PricingCard: React.FC = () => {
  const [isLifetime, setIsLifetime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (priceId: string, isLifetimePlan: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your subscription.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://dvpeahnehnvofjzozmng.functions.supabase.co/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          isLifetime: isLifetimePlan,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (isLifetime) {
      createCheckoutSession('price_1RXRl5EEqiDDPmsdmZH4XpAW', true);
    } else {
      // Use your monthly price ID here
      createCheckoutSession('price_monthly_id_here', false);
    }
  };

  return (
    <Card className="bg-black/40 border border-purple-500/30 backdrop-blur-xl p-6 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30,10 L30,20 M30,40 L30,50 M10,30 L20,30 M40,30 L50,30' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 space-y-6">
        {/* Plan Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-800 p-1 rounded-lg flex">
            <button
              onClick={() => setIsLifetime(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                !isLifetime 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsLifetime(true)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isLifetime 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Lifetime
              {isLifetime && <Star className="h-4 w-4 ml-1 inline" />}
            </button>
          </div>
        </div>

        {/* Pricing Header */}
        <div className="text-center">
          {isLifetime && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-3">
              <Crown className="h-3 w-3 mr-1" />
              BEST VALUE
            </Badge>
          )}
          
          <div className="space-y-2">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ${isLifetime ? '39.99' : '9.99'}
            </div>
            <p className="text-gray-400">
              {isLifetime ? 'One-time payment' : 'per month'}
            </p>
            {isLifetime && (
              <p className="text-green-400 text-sm font-medium">
                Save $80+ vs Monthly Plan
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">What's Included:</h3>
          <div className="space-y-2">
            {[
              'Unlimited file recovery',
              'All AI agents (SENTINEL, SPECTRA-X, QUILL-X)',
              'Priority scanning speed',
              'Advanced file repair',
              'Email support',
              ...(isLifetime ? [
                'Lifetime updates',
                'Premium Lyra AI features',
                'No recurring fees ever'
              ] : [])
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className={`w-full ${
            isLifetime
              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white font-semibold py-3`}
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              {isLifetime ? 'Get Lifetime Access' : 'Upgrade Now'}
            </>
          )}
        </Button>

        {isLifetime && (
          <p className="text-xs text-center text-gray-400">
            ⚡ Limited time offer - Secure your lifetime access today
          </p>
        )}
      </div>
    </Card>
  );
};
