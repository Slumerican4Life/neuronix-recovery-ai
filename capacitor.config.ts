
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neuronix.recovery',
  appName: 'Neuronix Recovery AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
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
