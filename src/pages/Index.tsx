
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthContent } from '@/components/pages/AuthContent';

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
};

export default Index;
