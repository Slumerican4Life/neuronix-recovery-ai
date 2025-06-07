import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Zap, Brain } from 'lucide-react';
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
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // For now, we'll use mock data since the supabase tables aren't available
      // fetchSubscriptionData();
    }
  }, [user]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      toast({
        title: "Redirecting to checkout...",
        description: "You'll be redirected to complete your subscription",
      });
      
      // Simulate upgrade
      setTimeout(() => {
        setSubscriptionData(prev => ({
          ...prev,
          subscribed: true,
          subscription_tier: 'premium',
          monthly_recovery_limit: 999999
        }));
        toast({
          title: "Welcome to Premium!",
          description: "You now have unlimited file recoveries",
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
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
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold text-white">Upgrade to Premium</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  $9.99/month
                </div>
                <div className="text-sm text-slate-400">Unlock unlimited recoveries</div>
              </div>
            </div>
            
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Now
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
