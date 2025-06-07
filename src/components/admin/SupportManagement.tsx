
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Search, Clock, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

export const SupportManagement = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Get user emails for the tickets
      const userIds = [...new Set(ticketsData?.map(t => t.user_id) || [])];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const ticketsWithEmails = ticketsData?.map(ticket => ({
        ...ticket,
        user_email: profilesData?.find(p => p.id === ticket.user_id)?.email
      })) || [];

      setTickets(ticketsWithEmails);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch support tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket status updated successfully"
      });

      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700/50 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Support Management Header */}
      <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
            Support Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tickets by email, subject, status, or priority..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-400">
                {tickets.filter(t => t.status === 'open').length}
              </div>
              <div className="text-slate-400 text-sm">Open Tickets</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">
                {tickets.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-slate-400 text-sm">In Progress</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
              <div className="text-slate-400 text-sm">Resolved</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">
                {tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
              </div>
              <div className="text-slate-400 text-sm">High Priority</div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center gap-4 flex-1">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium text-white">{ticket.subject}</div>
                    <div className="text-sm text-slate-400">
                      {ticket.user_email} • {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-slate-300 mt-1 line-clamp-2">
                      {ticket.message}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                  
                  <Badge className={getStatusColor(ticket.status)}>
                    {ticket.status}
                  </Badge>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">Manage Support Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-300 text-sm">User Email</label>
                            <div className="text-white font-medium">{ticket.user_email}</div>
                          </div>
                          <div>
                            <label className="text-slate-300 text-sm">Created</label>
                            <div className="text-white">{new Date(ticket.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-slate-300 text-sm">Subject</label>
                          <div className="text-white font-medium">{ticket.subject}</div>
                        </div>
                        
                        <div>
                          <label className="text-slate-300 text-sm">Message</label>
                          <div className="bg-slate-700/50 p-3 rounded text-white text-sm">
                            {ticket.message}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-300 text-sm">Status</label>
                            <Select onValueChange={(value) => updateTicketStatus(ticket.id, value)}>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                <SelectValue placeholder={ticket.status} />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-slate-300 text-sm">Priority</label>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>No support tickets found.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
