
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ScanProgressProps {
  progress: number;
  message: string;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({ progress, message }) => {
  return (
    <div className="space-y-2">
      <div className="text-gray-300">
        {message}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
