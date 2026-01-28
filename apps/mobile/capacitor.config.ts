import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'eu.castelmundi.tend',
  appName: 'Tend',
  webDir: '../../dist/apps/mobile',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2f5738',
      showSpinner: false,
    },
  },
};

export default config;
