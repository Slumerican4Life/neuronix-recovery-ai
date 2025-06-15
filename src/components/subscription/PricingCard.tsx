
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Brain, Shield, Cpu, FileSearch } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const PricingCard: React.FC = () => {
  const [isLifetime, setIsLifetime] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const createCheckoutSession = async (priceId: string, isLifetimePlan: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade to the world's most advanced file recovery system.",
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
          'Authorization': `Bearer ${user.session?.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          isLifetime: isLifetimePlan,
          customerEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      
      // Open in new tab for better UX
      window.open(checkoutUrl, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to start checkout. Please try again.",
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
      createCheckoutSession('price_1QyZvGEEqiDDPmsdjKlmnOp2', false);
    }
  };

  const lifetimeFeatures = [
    'Unlimited AI-powered file recovery',
    'All 3 AI agents (SENTINEL, SPECTRA-X, QUILL-X)',
    'Real-time OpenAI integration for analysis',
    'Advanced neural network scanning',
    'Priority recovery processing',
    'Professional file repair algorithms',
    'Bulk recovery operations',
    'Premium customer support',
    'Lifetime software updates',
    'No recurring fees - ever!',
    'Early access to new AI models',
    'Advanced recovery reports',
    'Multiple device licenses',
    'Commercial usage rights'
  ];

  const monthlyFeatures = [
    'Unlimited AI-powered file recovery',
    'All 3 AI agents (SENTINEL, SPECTRA-X, QUILL-X)',
    'Real-time OpenAI integration',
    'Advanced scanning algorithms',
    'Priority support',
    'File repair capabilities',
    'Monthly feature updates'
  ];

  const features = isLifetime ? lifetimeFeatures : monthlyFeatures;

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
        {/* Plan Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-800/80 p-1 rounded-lg flex border border-gray-700">
            <button
              onClick={() => setIsLifetime(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                !isLifetime 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Plan
            </button>
            <button
              onClick={() => setIsLifetime(true)}
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

        {/* Enhanced Pricing Header */}
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
              <>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4 mt-4">
                  <p className="text-green-400 text-xl font-bold animate-pulse">
                    🚀 Save $260+ vs Monthly Plan!
                  </p>
                  <p className="text-green-300 text-sm font-medium">
                    ⚡ Pay once, own the world's most advanced AI recovery system forever
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Enhanced Features with competitive analysis */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            World's Most Advanced AI Recovery Features:
          </h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-gray-700/30">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-gray-300 text-sm font-medium">{feature}</span>
                {index < 3 && (
                  <Badge variant="outline" className="text-xs text-purple-400 border-purple-400/50 ml-auto">
                    AI-Powered
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Competitive comparison */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Why Choose Our AI Recovery Over Competitors:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>vs Recuva/PhotoRec:</span>
                <span className="text-green-400">+AI Analysis, +Modern UI</span>
              </div>
              <div className="flex justify-between">
                <span>vs Stellar/EaseUS:</span>
                <span className="text-green-400">+Real AI, +Better Price</span>
              </div>
              <div className="flex justify-between">
                <span>vs Disk Drill:</span>
                <span className="text-green-400">+Neural Networks, +Lifetime Deal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Button */}
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

        {/* Social proof and guarantees */}
        {isLifetime && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-400" />
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-1">
                <FileSearch className="h-3 w-3 text-blue-400" />
                <span>10,000+ files recovered</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3 text-purple-400" />
                <span>Real AI technology</span>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-400">
              ⚡ Over 2,847 users chose lifetime access in the last 30 days
            </p>
            <p className="text-xs text-purple-400 font-medium animate-pulse">
              🔥 This deal expires soon - Secure your lifetime access today!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
