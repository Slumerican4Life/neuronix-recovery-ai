
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, gradient }) => {
  return (
    <Card className="bg-black/60 border-purple-500/50 backdrop-blur-xl relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20`}></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-white text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-r ${gradient} bg-opacity-20`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
