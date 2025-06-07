
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackDialogProps {
  onSubmitFeedback: (feedback: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ onSubmitFeedback }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitFeedback(feedback);
      toast({
        title: "Feedback Sent!",
        description: "Thank you for your suggestions. Lyra will consider your feedback.",
      });
      setFeedback('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Suggest Improvements
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-purple-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-400" />
            Help Us Improve
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Tell Lyra what features or improvements would make this app better for file recovery:
          </p>
          
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="I think the app could be improved by adding..."
            className="bg-gray-800 border-gray-600 text-white min-h-[120px] resize-none"
          />
          
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!feedback.trim() || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Lyra
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
