
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ScanningAgentProps {
  agent: 'SENTINEL' | 'SPECTRA-X' | 'QUILL-X' | null;
}

export const ScanningAgent: React.FC<ScanningAgentProps> = ({ agent }) => {
  if (!agent) return null;

  return (
    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse">
      {agent} ACTIVE
    </Badge>
  );
};
