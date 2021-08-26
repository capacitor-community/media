import { WebPlugin } from '@capacitor/core';

import type {
  MediaAlbumCreate,
  MediaAlbumResponse,
  MediaFetchOptions,
  MediaPlugin,
  MediaResponse,
  MediaSaveOptions,
  PhotoResponse,
} from './definitions';

export class MediaWeb extends WebPlugin implements MediaPlugin {
  getMedias(options?: MediaFetchOptions): Promise<MediaResponse> {
    console.log('getMedias', options);
    throw this.unimplemented('Not implemented on web.');
  }
  getAlbums(): Promise<MediaAlbumResponse> {
    throw this.unimplemented('Not implemented on web.');
  }
  savePhoto(options?: MediaSaveOptions): Promise<PhotoResponse> {
    console.log('savePhoto', options);
    throw this.unimplemented('Not implemented on web.');
  }
  saveVideo(options?: MediaSaveOptions): Promise<PhotoResponse> {
    console.log('saveVideo', options);
    throw this.unimplemented('Not implemented on web.');
  }
  saveGif(options?: MediaSaveOptions): Promise<PhotoResponse> {
    console.log('saveGif', options);
    throw this.unimplemented('Not implemented on web.');
  }
  createAlbum(options: MediaAlbumCreate): Promise<void> {
    console.log('createAlbum', options);
    throw this.unimplemented('Not implemented on web.');
  }
}
