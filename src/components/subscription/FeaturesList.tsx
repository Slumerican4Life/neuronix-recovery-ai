
import React from 'react';
import { Check, Brain, Zap, Shield, Infinity } from 'lucide-react';

interface FeaturesListProps {
  isLifetime: boolean;
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ isLifetime }) => {
  const features = [
    {
      icon: Brain,
      text: "AI-Powered Deep Scan",
      description: "Advanced neural networks analyze your storage"
    },
    {
      icon: Infinity,
      text: "Unlimited File Recovery",
      description: "No limits on files you can recover"
    },
    {
      icon: Zap,
      text: "3 Specialized AI Agents",
      description: "SENTINEL, SPECTRA-X, and QUILL-X working together"
    },
    {
      icon: Shield,
      text: "Quantum-Level Analysis",
      description: "Molecular-level storage examination"
    },
    {
      icon: Check,
      text: "Priority Support",
      description: "24/7 expert assistance"
    },
    {
      icon: Check,
      text: "Advanced Preview Generation",
      description: "AI-generated thumbnails and previews"
    }
  ];

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-white font-semibold text-lg mb-4">What you get:</h3>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="bg-purple-500/20 rounded-lg p-2 mt-1">
              <feature.icon className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{feature.text}</p>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {isLifetime && (
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-500/20 rounded p-1">
              <Check className="h-4 w-4 text-green-400" />
            </div>
            <span className="text-green-400 font-medium">Lifetime Value</span>
          </div>
          <p className="text-gray-300 text-sm">
            Save over $500 compared to monthly subscriptions. No recurring fees, lifetime updates included.
          </p>
        </div>
      )}
    </div>
  );
};
