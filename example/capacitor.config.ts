import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.capacitorcommunity.media',
  appName: 'Capacitor Community Media Example',
  webDir: 'build',
  plugins: {
    MediaPlugin: {
      androidGalleryMode: false
    }
  }
};

export default config;
