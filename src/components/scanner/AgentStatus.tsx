
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Eye, FileText, Zap, CheckCircle, Loader } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'scanning' | 'processing' | 'complete';
  progress: number;
  filesFound: number;
  currentTask: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const AgentStatus: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'sentinel',
      name: 'SENTINEL',
      role: 'Master Orchestrator + Raw Scanner',
      status: 'scanning',
      progress: 0,
      filesFound: 0,
      currentTask: 'Initializing file system scan...',
      icon: Brain,
      color: 'blue'
    },
    {
      id: 'spectra',
      name: 'SPECTRA-X',
      role: 'Photo + Video Recovery',
      status: 'idle',
      progress: 0,
      filesFound: 0,
      currentTask: 'Waiting for image signatures...',
      icon: Eye,
      color: 'purple'
    },
    {
      id: 'quill',
      name: 'QUILL-X',
      role: 'Document Recovery + Repair',
      status: 'idle',
      progress: 0,
      filesFound: 0,
      currentTask: 'Standing by for document analysis...',
      icon: FileText,
      color: 'pink'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prevAgents => {
        return prevAgents.map(agent => {
          let newAgent = { ...agent };
          
          // SENTINEL starts first
          if (agent.id === 'sentinel' && agent.status === 'scanning') {
            newAgent.progress = Math.min(agent.progress + Math.random() * 15, 100);
            
            if (newAgent.progress < 30) {
              newAgent.currentTask = 'Scanning partition tables and boot sectors...';
            } else if (newAgent.progress < 60) {
              newAgent.currentTask = 'Analyzing file allocation tables...';
              newAgent.filesFound = Math.floor(newAgent.progress / 10);
            } else if (newAgent.progress < 90) {
              newAgent.currentTask = 'Performing raw sector analysis...';
              newAgent.filesFound = Math.floor(newAgent.progress / 8);
            } else {
              newAgent.currentTask = 'Dispatching specialized agents...';
              newAgent.status = 'complete';
              newAgent.filesFound = 12;
            }
          }
          
          // SPECTRA-X starts when SENTINEL reaches 40%
          if (agent.id === 'spectra' && prevAgents[0].progress > 40 && agent.status === 'idle') {
            newAgent.status = 'scanning';
            newAgent.currentTask = 'Searching for image file signatures...';
          }
          
          if (agent.id === 'spectra' && agent.status === 'scanning') {
            newAgent.progress = Math.min(agent.progress + Math.random() * 12, 100);
            
            if (newAgent.progress < 40) {
              newAgent.currentTask = 'Analyzing JPEG and PNG headers...';
            } else if (newAgent.progress < 70) {
              newAgent.currentTask = 'Reconstructing video containers...';
              newAgent.filesFound = Math.floor(newAgent.progress / 15);
            } else {
              newAgent.currentTask = 'Repairing damaged multimedia files...';
              newAgent.status = 'processing';
              newAgent.filesFound = Math.floor(newAgent.progress / 12);
            }
          }
          
          // QUILL-X starts when SENTINEL reaches 50%
          if (agent.id === 'quill' && prevAgents[0].progress > 50 && agent.status === 'idle') {
            newAgent.status = 'scanning';
            newAgent.currentTask = 'Searching for document signatures...';
          }
          
          if (agent.id === 'quill' && agent.status === 'scanning') {
            newAgent.progress = Math.min(agent.progress + Math.random() * 10, 100);
            
            if (newAgent.progress < 50) {
              newAgent.currentTask = 'Analyzing PDF and Office documents...';
            } else if (newAgent.progress < 80) {
              newAgent.currentTask = 'Repairing corrupted file headers...';
              newAgent.filesFound = Math.floor(newAgent.progress / 20);
            } else {
              newAgent.currentTask = 'Extracting text from damaged files...';
              newAgent.status = 'processing';
              newAgent.filesFound = Math.floor(newAgent.progress / 18);
            }
          }
          
          return newAgent;
        });
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scanning':
      case 'processing':
        return <Loader className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string, color: string) => {
    const baseColors = {
      blue: status === 'complete' ? 'text-blue-400' : status === 'idle' ? 'text-gray-400' : 'text-blue-300',
      purple: status === 'complete' ? 'text-purple-400' : status === 'idle' ? 'text-gray-400' : 'text-purple-300',
      pink: status === 'complete' ? 'text-pink-400' : status === 'idle' ? 'text-gray-400' : 'text-pink-300'
    };
    return baseColors[color as keyof typeof baseColors] || 'text-gray-400';
  };

  const getProgressColor = (color: string) => {
    const colors = {
      blue: 'from-blue-600 to-blue-400',
      purple: 'from-purple-600 to-purple-400',
      pink: 'from-pink-600 to-pink-400'
    };
    return colors[color as keyof typeof colors] || 'from-gray-600 to-gray-400';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-400" />
        AI Agent Status
      </h3>
      
      <div className="grid gap-4">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <Card key={agent.id} className="bg-black/60 border-gray-600 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${agent.color}-500/20`}>
                      <IconComponent className={`h-5 w-5 ${getStatusColor(agent.status, agent.color)}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{agent.name}</h4>
                      <p className="text-gray-400 text-sm">{agent.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent.status)}
                    <span className={`text-sm font-medium ${getStatusColor(agent.status, agent.color)}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{agent.currentTask}</span>
                    <span className="text-gray-400">{agent.filesFound} files found</span>
                  </div>
                  
                  <div className="relative">
                    <Progress value={agent.progress} className="h-2" />
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${getProgressColor(agent.color)} rounded-full transition-all duration-300`}
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
