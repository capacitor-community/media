import { registerPlugin } from '@capacitor/core';

import type { MediaPlugin } from './definitions';

const Media = registerPlugin<MediaPlugin>('Media', {
  web: () => import('./web').then(m => new m.MediaWeb()),
});

export * from './definitions';
export { Media };
