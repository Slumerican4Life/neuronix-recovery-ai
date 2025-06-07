
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from './Dashboard';
import { GuestScanner } from './GuestScanner';
import { Brain } from 'lucide-react';

export const AuthContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <div className="text-white">Loading Neuronix Recovery AI...</div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <GuestScanner />;
};
