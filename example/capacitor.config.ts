import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.capacitorcommunity.media',
  appName: 'Capacitor Community Media Example',
  webDir: 'build',
  plugins: {
    Media: {
      androidGalleryMode: false
    }
  }
};

export default config;
