
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, HardDrive, Search, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export const SystemStatus = () => {
  const systemComponents = [
    {
      name: 'Lyra AI Brain',
      status: 'operational',
      icon: Brain,
      description: 'OpenAI GPT-4o-mini connected',
      details: 'Real-time AI analysis and file assessment'
    },
    {
      name: 'SENTINEL Agent',
      status: 'operational', 
      icon: Search,
      description: 'Deep scanning engine',
      details: 'Quantum-level sector analysis'
    },
    {
      name: 'SPECTRA-X Agent',
      status: 'operational',
      icon: Cpu,
      description: 'Multimedia recovery specialist',
      details: 'Advanced image and video reconstruction'
    },
    {
      name: 'QUILL-X Agent',
      status: 'operational',
      icon: HardDrive,
      description: 'Document recovery expert',
      details: 'Text and document file analysis'
    },
    {
      name: 'Neural Recovery Engine',
      status: 'operational',
      icon: Zap,
      description: 'AI-powered file reconstruction',
      details: 'Machine learning error correction'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-3 w-3" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-6 w-6 text-purple-400" />
          Recovery System Status
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {systemComponents.map((component, index) => {
            const Icon = component.icon;
            return (
              <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium">{component.name}</span>
                  </div>
                  <Badge className={getStatusColor(component.status)}>
                    {getStatusIcon(component.status)}
                    <span className="ml-1 capitalize">{component.status}</span>
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-slate-300 text-sm font-medium">{component.description}</p>
                  <p className="text-slate-400 text-xs">{component.details}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">All Systems Operational</span>
          </div>
          <p className="text-slate-300 text-sm">
            File and media recovery system is fully functional and ready for advanced AI-powered recovery operations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
