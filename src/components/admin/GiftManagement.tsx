
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Gift, Plus, Calendar, User, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GiftSubscription {
  id: string;
  recipient_email: string;
  recipient_user_id?: string;
  months_gifted: number;
  months_used: number;
  status: string;
  created_at: string;
  redeemed_at?: string;
  gifted_by: string;
}

export const GiftManagement = () => {
  const [gifts, setGifts] = useState<GiftSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const [giftForm, setGiftForm] = useState({
    recipientEmail: '',
    months: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gift subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createGift = async () => {
    try {
      const { data, error } = await supabase.rpc('gift_subscription_months', {
        recipient_email: giftForm.recipientEmail,
        months: giftForm.months
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Gift subscription created for ${giftForm.recipientEmail}!`
      });

      setGiftForm({ recipientEmail: '', months: 1 });
      setIsGiftDialogOpen(false);
      fetchGifts();
    } catch (error) {
      console.error('Error creating gift:', error);
      toast({
        title: "Error",
        description: "Failed to create gift subscription",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'used': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gift Management Header */}
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-pink-400" />
              Gift Management
            </CardTitle>
            
            <Dialog open={isGiftDialogOpen} onOpenChange={setIsGiftDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Gift
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Gift Subscription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientEmail" className="text-slate-300">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      value={giftForm.recipientEmail}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, recipientEmail: e.target.value }))}
                      placeholder="Enter recipient's email"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="months" className="text-slate-300">Months to Gift</Label>
                    <Input
                      id="months"
                      type="number"
                      min="1"
                      max="12"
                      value={giftForm.months}
                      onChange={(e) => setGiftForm(prev => ({ ...prev, months: parseInt(e.target.value) || 1 }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button 
                    onClick={createGift}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    Create Gift
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-pink-400">{gifts.length}</div>
              <div className="text-slate-400 text-sm">Total Gifts Created</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {gifts.filter(g => g.status === 'used').length}
              </div>
              <div className="text-slate-400 text-sm">Gifts Redeemed</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {gifts.reduce((sum, g) => sum + g.months_gifted, 0)}
              </div>
              <div className="text-slate-400 text-sm">Total Months Gifted</div>
            </div>
          </div>

          {/* Gifts List */}
          <div className="space-y-3">
            {gifts.map((gift) => (
              <div key={gift.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-4">
                  <Gift className="h-5 w-5 text-pink-400" />
                  <div>
                    <div className="font-medium text-white">{gift.recipient_email}</div>
                    <div className="text-sm text-slate-400">
                      {gift.months_gifted} month(s) • Created {new Date(gift.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(gift.status)}>
                    {gift.status}
                  </Badge>
                  
                  {gift.redeemed_at && (
                    <div className="text-xs text-slate-400">
                      Redeemed {new Date(gift.redeemed_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {gifts.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>No gift subscriptions created yet.</div>
              <div className="text-sm">Create your first gift to get started!</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
