
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Lightbulb, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Feedback {
  id: string;
  suggestion: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'implemented';
  timestamp: Date;
  userEmail?: string;
}

export const FeedbackSystem = () => {
  const [feedback, setFeedback] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [category, setCategory] = useState('feature');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      // Send feedback to Lyra AI for analysis and response
      const { data, error } = await supabase.functions.invoke('lyra-chat', {
        body: {
          message: `New user feedback for app improvement:
          
Category: ${category}
Suggestion: ${feedback}
User Email: ${userEmail || 'Anonymous'}

Please analyze this feedback and provide:
1. Assessment of the suggestion's value
2. Technical feasibility
3. Priority level (low/medium/high)
4. Implementation recommendations
5. Your thoughts on how this could improve the user experience

Respond as Lyra AI with professional insight.`,
          conversationHistory: []
        }
      });

      if (error) {
        throw error;
      }

      // Create feedback object
      const newFeedback: Feedback = {
        id: Date.now().toString(),
        suggestion: feedback,
        category,
        priority: 'medium',
        status: 'pending',
        timestamp: new Date(),
        userEmail: userEmail || undefined
      };

      setRecentFeedback(prev => [newFeedback, ...prev.slice(0, 4)]);

      toast({
        title: "🧠 Feedback Sent to Lyra AI!",
        description: "Lyra has analyzed your suggestion and will help prioritize improvements.",
      });

      // Clear form
      setFeedback('');
      setUserEmail('');
      
      console.log('Lyra AI Feedback Analysis:', data.response);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback to Lyra AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'feature', label: 'New Feature', icon: Lightbulb },
    { value: 'improvement', label: 'Improvement', icon: Star },
    { value: 'bug', label: 'Bug Report', icon: MessageSquare },
    { value: 'ui', label: 'UI/UX', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-400" />
            Suggest Improvements to Lyra AI
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Help us make this app better! Lyra AI will analyze your suggestions with her OpenAI brain.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Email (Optional)</label>
              <Input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="text-white text-sm font-medium mb-2 block">Your Suggestion</label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="I think the app could be improved by adding..."
              className="bg-gray-800 border-gray-600 text-white min-h-[120px] resize-none"
            />
          </div>

          <Button
            onClick={handleSubmitFeedback}
            disabled={!feedback.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSubmitting ? (
              'Sending to Lyra AI...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to Lyra AI for Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recentFeedback.length > 0 && (
        <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFeedback.map((item) => (
              <div key={item.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-purple-500/20 text-purple-300">
                    {categoryOptions.find(c => c.value === item.category)?.label}
                  </Badge>
                  <span className="text-gray-400 text-xs">
                    {item.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{item.suggestion}</p>
                <Badge className="mt-2 bg-green-500/20 text-green-300">
                  Analyzed by Lyra AI
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
