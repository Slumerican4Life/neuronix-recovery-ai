
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Mic, MicOff, Volume2, VolumeX, Zap, Lightbulb, FileQuestion, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiAnalysis?: string;
}

export const EnhancedLyraAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `🧠 Hello! I'm Lyra, your AI-powered recovery assistant with real OpenAI integration. I'm here to help you with:

• **Advanced File Recovery** - Expert guidance on data recovery techniques
• **Technical Support** - Troubleshooting and technical assistance  
• **AI Analysis** - Intelligent file analysis and damage assessment
• **General Knowledge** - I can help with questions beyond just file recovery
• **Smart Recommendations** - Personalized advice based on your specific situation

I have access to cutting-edge AI algorithms and can provide detailed technical explanations or simple step-by-step guidance. What would you like to know?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message: inputValue,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(data.conversationHistory || []);

      // Speak the response if speech synthesis is available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error calling Lyra AI:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `🧠 I'm having trouble connecting to my AI brain right now. This could be because:

• OpenAI API key needs to be configured
• Network connectivity issues
• Temporary service interruption

Please check that the OpenAI API key is properly set in your Supabase secrets, or try again in a moment. I'm still here to help with any questions you have!`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Issue",
        description: "Unable to connect to Lyra AI. Please check your OpenAI API key configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak your question to Lyra AI",
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Voice Error",
        description: "Unable to recognize speech. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const suggestedQuestions = [
    "How do I recover files from a formatted drive?",
    "What's the difference between quick and deep scan?", 
    "Can you explain how AI helps with file recovery?",
    "How do I repair corrupted video files?",
    "What are the best practices for data recovery?",
    "Tell me about quantum-level file analysis"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl relative overflow-hidden h-[600px] flex flex-col">
      {/* Enhanced visual effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #a855f7 0%, transparent 60%), radial-gradient(circle at 75% 75%, #3b82f6 0%, transparent 60%)`,
          animation: 'pulse 8s ease-in-out infinite'
        }}></div>
      </div>

      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="relative">
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="Lyra AI Brain"
              className="w-10 h-10 object-contain drop-shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            {isLoading && (
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            )}
          </div>
          🧠 Lyra AI Assistant
          <div className="flex gap-2 ml-auto">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
              <Brain className="h-3 w-3 mr-1" />
              OpenAI Connected
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={stopSpeech}
              className="text-purple-400 hover:text-purple-300"
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 relative z-10 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-purple-600/80 text-white'
                      : 'bg-slate-800/80 text-gray-100 border border-purple-500/30'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 font-medium text-sm">Lyra AI</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 rounded-lg p-4 border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
                    <span className="text-purple-400 font-medium text-sm">Lyra AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-gray-400 text-sm ml-2">Thinking with AI brain...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Try asking me about:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {question.substring(0, 25)}...
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Lyra anything about file recovery or any other topic..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading}
              className="bg-slate-800/80 border-purple-500/50 text-white placeholder-gray-400 pr-12"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              disabled={isLoading || isListening}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                isListening ? 'text-red-400' : 'text-purple-400'
              } hover:text-purple-300`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
