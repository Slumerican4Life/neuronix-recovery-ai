import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, MessageCircle, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const MobileLyraAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🧠 Hi! I'm Lyra, your AI recovery assistant with real OpenAI integration! I'm now connected to my AI brain and ready to provide intelligent file recovery assistance. Ask me anything about recovery techniques or technical support!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const sendToLyraAI = async (message: string) => {
    try {
      console.log('🧠 Mobile: Sending message to Lyra AI:', message);
      
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message,
          conversationHistory
        }
      });

      if (error) {
        console.error('🔴 Mobile: Supabase function error:', error);
        throw error;
      }

      console.log('🧠 Mobile: Lyra AI response received:', data);
      
      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }
      
      return data.response || "I'm here to help with my AI brain!";
    } catch (error) {
      console.error('🔴 Mobile: Error calling Lyra AI:', error);
      return "🧠 I'm having trouble connecting to my AI brain right now. Please check that the OpenAI API key is configured in Supabase secrets. I'm designed to provide intelligent file recovery assistance!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const aiResponse = await sendToLyraAI(inputText);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleFeedback = async (feedback: string) => {
    const feedbackMessage = `User feedback for app improvement: ${feedback}`;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `💡 Suggestion: ${feedback}`,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const aiResponse = await sendToLyraAI(feedbackMessage);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 rounded-full shadow-2xl"
          size={isMobile ? "default" : "lg"}
        >
          <div className="relative">
            <img 
              src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
              alt="AI Brain"
              className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          {!isMobile && <span className="ml-2">AI Assistant</span>}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'bottom-4 right-4 left-4' : 'bottom-6 right-6'} z-50`}>
      <Card className={`bg-black/95 border-purple-500/50 backdrop-blur-xl transition-all duration-300 ${
        isMinimized 
          ? `${isMobile ? 'h-16' : 'w-80 h-16'}` 
          : `${isMobile ? 'h-[70vh]' : 'w-80 h-96'}`
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src="/lovable-uploads/e924ddd2-96a0-4051-a12b-b143448345ee.png" 
                alt="AI Brain"
                className="w-6 h-6 object-contain"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Lyra AI</h3>
              <p className="text-gray-400 text-xs">Connected to OpenAI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className={`flex-1 p-4 space-y-3 overflow-y-auto ${isMobile ? 'h-[calc(70vh-140px)]' : 'h-48'}`}>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${
                    message.isUser 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input and Feedback */}
            <div className="p-4 border-t border-purple-500/30 space-y-2">
              <div className="flex justify-center">
                <FeedbackDialog onSubmitFeedback={handleFeedback} />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about file recovery..."
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 px-3"
                  disabled={!inputText.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
