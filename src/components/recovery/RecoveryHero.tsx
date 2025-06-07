
import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain, Zap, FileSearch } from 'lucide-react';

export const RecoveryHero: React.FC = () => {
  return (
    <Card className="bg-black/40 border border-purple-500/30 backdrop-blur-xl p-8 text-center">
      <div className="space-y-6">
        {/* Hero Image Area with your updated brain image */}
        <div className="relative mx-auto max-w-md">
          <div className="bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/20">
            {/* Your brain + lightning + files image */}
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="AI Brain with Lightning - File Recovery"
              className="w-32 h-32 mx-auto mb-4 object-contain"
            />
            
            {/* Neural network pattern overlay */}
            <div className="absolute inset-0 opacity-20 rounded-2xl" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Cpath d='M30,10 L30,20 M30,40 L30,50 M10,30 L20,30 M40,30 L50,30' stroke='%23a855f7' stroke-width='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            AI-Powered File Recovery
          </h2>
          <p className="text-gray-300 max-w-lg mx-auto">
            Our advanced neural network algorithms analyze your storage device and recover files that others can't. 
            Start by scanning your drive to see what we can recover.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-sm text-gray-400">AI Analysis</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileSearch className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-sm text-gray-400">Deep Scan</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-sm text-gray-400">Fast Recovery</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
