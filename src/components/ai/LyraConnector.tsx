
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, CheckCircle, AlertCircle, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const LyraConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const { toast } = useToast();

  const testLyraConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message: "Hello Lyra! This is a connection test. Please confirm that your OpenAI brain is working and respond with your capabilities.",
          conversationHistory: []
        }
      });

      if (error) {
        throw error;
      }

      if (data.response && !data.error) {
        setIsConnected(true);
        setConnectionStatus('connected');
        toast({
          title: "🧠 Lyra AI Connected!",
          description: "Lyra's OpenAI brain is now active and ready to help.",
        });
      } else {
        throw new Error(data.error || 'No response from Lyra');
      }

    } catch (error) {
      console.error('Connection test failed:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Lyra's OpenAI brain. Please check API key configuration.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    // Auto-test connection on component mount
    testLyraConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'connecting': return <Wifi className="h-5 w-5 text-yellow-400 animate-pulse" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
      default: return <Brain className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="Lyra AI Brain"
              className="w-8 h-8 object-contain drop-shadow-lg"
            />
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          Lyra AI Brain Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className={`font-medium ${getStatusColor()}`}>
                {connectionStatus === 'connected' && 'Connected to OpenAI'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'error' && 'Connection Failed'}
                {connectionStatus === 'disconnected' && 'Disconnected'}
              </p>
              <p className="text-gray-400 text-sm">
                {isConnected ? 'Lyra AI is ready with full OpenAI capabilities' : 'Testing connection to OpenAI API'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isConnected && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                <Zap className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">AI Capabilities</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                File Recovery Expertise
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                Technical Support
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                General Knowledge
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                Smart Analysis
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Connection Info</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>Model: GPT-4o-mini</li>
              <li>Response Time: ~2-3s</li>
              <li>Max Tokens: 1000</li>
              <li>Temperature: 0.8</li>
            </ul>
          </div>
        </div>

        <Button
          onClick={testLyraConnection}
          disabled={isConnecting}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isConnecting ? 'Testing Connection...' : 'Test Lyra AI Connection'}
        </Button>
      </CardContent>
    </Card>
  );
};
