
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.f658b994f68a4393a155e58313ff131e',
  appName: 'neuronix-recovery-ai',
  webDir: 'dist',
  server: {
    url: 'https://f658b994-f68a-4393-a155-e58313ff131e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Filesystem: {
      androidRequestPermissions: true
    }
  }
};

export default config;
