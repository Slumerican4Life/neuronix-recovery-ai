
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DollarSign, RefreshCw, Search, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BillingRecord {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  created_at: string;
  user_email?: string;
}

export const BillingManagement = () => {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingRecords();
  }, []);

  const fetchBillingRecords = async () => {
    try {
      const { data: billingData, error: billingError } = await supabase
        .from('billing_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (billingError) throw billingError;

      // Get user emails for the billing records
      const userIds = [...new Set(billingData?.map(b => b.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const billingWithEmails = billingData?.map(billing => ({
        ...billing,
        user_email: profilesData?.find(p => p.id === billing.user_id)?.email
      })) || [];

      setBillingRecords(billingWithEmails);
    } catch (error) {
      console.error('Error fetching billing records:', error);
      toast({
        title: "Error",
        description: "Failed to fetch billing records",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async () => {
    if (!selectedRecord || !refundAmount) return;

    try {
      const { error } = await supabase
        .from('billing_history')
        .insert({
          user_id: selectedRecord.user_id,
          transaction_type: 'refund',
          amount: -parseFloat(refundAmount),
          currency: selectedRecord.currency,
          status: 'completed',
          description: `Refund for transaction ${selectedRecord.id}`
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Refund processed successfully"
      });

      setIsRefundDialogOpen(false);
      setSelectedRecord(null);
      setRefundAmount('');
      fetchBillingRecords();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive"
      });
    }
  };

  const filteredRecords = billingRecords.filter(record => 
    record.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'refunded': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'refund': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'gift': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'upgrade': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Billing Management Header */}
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-400" />
            Billing Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by email, transaction type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                ${billingRecords.filter(r => r.transaction_type === 'subscription' && r.amount > 0).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
              </div>
              <div className="text-slate-400 text-sm">Total Revenue</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">
                ${Math.abs(billingRecords.filter(r => r.transaction_type === 'refund').reduce((sum, r) => sum + r.amount, 0)).toFixed(2)}
              </div>
              <div className="text-slate-400 text-sm">Total Refunds</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {billingRecords.filter(r => r.status === 'completed').length}
              </div>
              <div className="text-slate-400 text-sm">Completed</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {billingRecords.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-slate-400 text-sm">Pending</div>
            </div>
          </div>

          {/* Billing Records List */}
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white">{record.user_email}</div>
                    <div className="text-sm text-slate-400">
                      {new Date(record.created_at).toLocaleDateString()} • {record.description || 'No description'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium text-white">
                      {record.amount >= 0 ? '+' : ''}${record.amount.toFixed(2)} {record.currency}
                    </div>
                  </div>
                  
                  <Badge className={getTransactionTypeColor(record.transaction_type)}>
                    {record.transaction_type}
                  </Badge>
                  
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>

                  {record.transaction_type === 'subscription' && record.status === 'completed' && record.amount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                      onClick={() => {
                        setSelectedRecord(record);
                        setRefundAmount(record.amount.toString());
                        setIsRefundDialogOpen(true);
                      }}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refund
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>No billing records found.</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Process Refund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">This will create a refund record in the system.</span>
              </div>
            </div>
            
            {selectedRecord && (
              <div className="space-y-2">
                <div className="text-slate-300">
                  User: <span className="font-medium text-white">{selectedRecord.user_email}</span>
                </div>
                <div className="text-slate-300">
                  Original Amount: <span className="font-medium text-white">${selectedRecord.amount}</span>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="refundAmount" className="text-slate-300">Refund Amount</Label>
              <Input
                id="refundAmount"
                type="number"
                step="0.01"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Button 
              onClick={processRefund}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Process Refund
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
