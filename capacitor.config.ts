
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.slumbucket.neuronixrecovery',
  appName: 'Neuronix Recovery AI',
  webDir: 'dist',
  server: {
    url: 'https://recovery.slumbucket.xyz',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e1b4b',
      showSpinner: true,
      spinnerColor: '#a855f7'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e1b4b'
    }
  }
};

export default config;
