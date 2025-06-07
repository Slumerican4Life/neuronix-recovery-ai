
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Brain, Check, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  recovery_count: number;
  monthly_recovery_limit: number;
}

export const SubscriptionCard = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false,
    subscription_tier: null,
    recovery_count: 0,
    monthly_recovery_limit: 5
  });
  const [loading, setLoading] = useState(false);
  const [isLifetime, setIsLifetime] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // For now, we'll use mock data since the supabase tables aren't available
      // fetchSubscriptionData();
    }
  }, [user]);

  const createCheckoutSession = async (priceId: string, isLifetimePlan: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade your subscription.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
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
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (isLifetime) {
      createCheckoutSession('price_1RXRl5EEqiDDPmsdmZH4XpAW', true);
    } else {
      // Monthly subscription - you'll need to add your monthly price ID here
      createCheckoutSession('price_monthly_here', false);
    }
  };

  const usagePercentage = (subscriptionData.recovery_count / subscriptionData.monthly_recovery_limit) * 100;

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {subscriptionData.subscribed ? (
            <>
              <Crown className="h-6 w-6 text-yellow-400" />
              Premium Account
            </>
          ) : (
            <>
              <Brain className="h-6 w-6 text-purple-400" />
              Free Account
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Current Plan:</span>
          <Badge className={subscriptionData.subscribed ? 
            "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" : 
            "bg-slate-500/20 text-slate-400 border-slate-500/50"
          }>
            {subscriptionData.subscribed ? 'Premium' : 'Free'}
          </Badge>
        </div>

        {!subscriptionData.subscribed && (
          <>
            <div className="space-y-3">
              <div className="text-slate-300">
                Monthly Recovery Usage:
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{subscriptionData.recovery_count} used</span>
                  <span>{subscriptionData.monthly_recovery_limit} limit</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              
              {usagePercentage > 80 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <p className="text-orange-300 text-sm">
                    You're running low on recoveries! Upgrade to Premium for unlimited access.
                  </p>
                </div>
              )}
            </div>

            {/* Plan Toggle */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-800 p-1 rounded-lg flex">
                <button
                  onClick={() => setIsLifetime(false)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    !isLifetime 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsLifetime(true)}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                    isLifetime 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Lifetime
                  {isLifetime && <Star className="h-3 w-3 ml-1 inline" />}
                </button>
              </div>
            </div>

            {/* Enhanced Pricing Display with Your Pricing Image */}
            <div className="text-center space-y-2 relative">
              {isLifetime && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-2">
                  <Crown className="h-3 w-3 mr-1" />
                  BEST VALUE
                </Badge>
              )}
              
              {/* Pricing Grid with Images */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {/* Monthly Plan */}
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  !isLifetime 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-600 bg-gray-800/50'
                }`}>
                  <div className="text-lg font-bold text-purple-400">$9.99</div>
                  <div className="text-xs text-slate-400">per month</div>
                </div>
                
                {/* Lifetime Plan with Your Image */}
                <div className={`p-3 rounded-lg border-2 transition-all relative ${
                  isLifetime 
                    ? 'border-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-br from-purple-900/50 to-pink-900/50' 
                    : 'border-purple-400 bg-purple-800/30 hover:border-purple-300'
                }`}>
                  <img 
                    src="/lovable-uploads/6b23e108-ada8-40d9-b1c2-35fe130ff138.png" 
                    alt="Lifetime AI Deal"
                    className="absolute top-1 right-1 w-6 h-6 object-contain opacity-80"
                  />
                  <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    $39.99
                  </div>
                  <div className="text-xs text-slate-400">lifetime</div>
                  <div className="text-xs text-green-400 font-medium">Save $80+</div>
                </div>
              </div>
              
              <div className="text-sm text-slate-400">
                {isLifetime ? 'One-time payment - Never pay again!' : 'Cancel anytime'}
              </div>
              {isLifetime && (
                <div className="text-green-400 text-xs font-medium animate-pulse">
                  🚀 Limited Time: Pay Once, Use Forever!
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-white">Premium Features:</div>
              <div className="space-y-1">
                {[
                  'Unlimited file recoveries',
                  'All AI agents access',
                  'Priority processing',
                  '24/7 Lyra AI support',
                  ...(isLifetime ? [
                    'Lifetime updates',
                    'No recurring fees ever',
                    'Priority customer support'
                  ] : [])
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {subscriptionData.subscribed ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="font-semibold text-yellow-400">Premium Benefits</span>
              </div>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Unlimited file recoveries</li>
                <li>• Priority processing</li>
                <li>• Advanced recovery algorithms</li>
                <li>• 24/7 Lyra AI support</li>
              </ul>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className={`w-full ${
              isLifetime
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white font-semibold`}
          >
            {loading ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                {isLifetime ? 'Get Lifetime Access - $39.99' : 'Upgrade Now - $9.99/mo'}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
