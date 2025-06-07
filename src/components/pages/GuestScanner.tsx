
import React, { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { FileScanner } from '@/components/scanner/FileScanner';
import { LyraAssistant } from '@/components/ai/LyraAssistant';
import { BackgroundOverlay } from '@/components/layout/BackgroundOverlay';
import { Button } from '@/components/ui/button';
import { Brain, Zap } from 'lucide-react';

export const GuestScanner: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);

  if (showAuthForm) {
    return <AuthForm onBack={() => setShowAuthForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 relative overflow-hidden">
      <BackgroundOverlay />
      
      {/* Header */}
      <div className="relative z-10 bg-black/30 border-b border-purple-500/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-purple-400" />
                <Zap className="h-4 w-4 text-red-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Neuronix Recovery AI
                </h1>
                <p className="text-xs text-gray-400">Free Trial - Scan Now, Pay Only If You Find Files</p>
              </div>
            </div>
            
            <Button
              onClick={() => setShowAuthForm(true)}
              variant="ghost"
              size="sm"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Recover Your Lost Files with AI Power
          </h2>
          <p className="text-gray-300 text-lg">
            Advanced neural network technology finds and recovers files others can't. 
            <span className="text-purple-400 font-semibold"> Scan for free - pay only if we find your files!</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FileScanner guestMode={true} onLoginRequired={() => setShowAuthForm(true)} />
          </div>
          
          <div className="space-y-6">
            {/* Free Trial Info */}
            <div className="bg-black/40 border border-green-500/30 backdrop-blur-xl rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Free Trial Benefits</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Unlimited scanning
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  5 free file recoveries
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Full file preview
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  AI file repair
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="bg-black/40 border border-purple-500/30 backdrop-blur-xl rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Unlimited Recovery</h3>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  $9.99/month
                </div>
                <p className="text-gray-400 text-sm">Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LyraAssistant />
    </div>
  );
};
