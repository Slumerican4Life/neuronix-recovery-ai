
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Brain, Shield } from 'lucide-react';

interface FeaturesListProps {
  isLifetime: boolean;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ isLifetime }) => {
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
  );
};
