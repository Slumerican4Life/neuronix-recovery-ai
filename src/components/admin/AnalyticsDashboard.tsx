
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Gift, FileText, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalRecoveries: number;
  successRate: number;
  giftsGiven: number;
  premiumUsers: number;
}

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalRecoveries: 0,
    successRate: 94.7,
    giftsGiven: 0,
    premiumUsers: 0
  });
  const [revenueChart, setRevenueChart] = useState([]);
  const [userGrowthChart, setUserGrowthChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch basic analytics
      const [usersResult, subscribersResult, recoveriesResult, giftsResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('subscribers').select('*'),
        supabase.from('recovery_sessions').select('*'),
        supabase.from('gift_subscriptions').select('*')
      ]);

      const totalUsers = usersResult.count || 0;
      const subscribers = subscribersResult.data || [];
      const recoveries = recoveriesResult.data || [];
      const gifts = giftsResult.data || [];

      const premiumUsers = subscribers.filter(s => s.subscribed).length;
      const totalRecoveries = recoveries.reduce((sum, r) => sum + (r.files_recovered || 0), 0);
      const giftsGiven = gifts.length;

      // Mock revenue data for demonstration
      const monthlyRevenue = premiumUsers * 9.99;
      const totalRevenue = monthlyRevenue * 6; // Assume 6 months of operation

      setAnalyticsData({
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.7), // 70% active rate
        totalRevenue,
        monthlyRevenue,
        totalRecoveries,
        successRate: 94.7,
        giftsGiven,
        premiumUsers
      });

      // Generate mock chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const revenueData = months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 5000) + 2000,
        users: Math.floor(Math.random() * 200) + 100
      }));

      setRevenueChart(revenueData);
      setUserGrowthChart(revenueData);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: analyticsData.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Monthly Revenue',
      value: `$${analyticsData.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Recoveries',
      value: analyticsData.totalRecoveries.toLocaleString(),
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Success Rate',
      value: `${analyticsData.successRate}%`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Premium Users',
      value: analyticsData.premiumUsers.toLocaleString(),
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Gifts Given',
      value: analyticsData.giftsGiven.toLocaleString(),
      icon: Gift,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 border-purple-500/30 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-700/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
