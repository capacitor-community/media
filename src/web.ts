import { WebPlugin } from '@capacitor/core';

import type {
  AlbumsPathResponse,
  MediaAlbumCreate,
  MediaAlbumResponse,
  MediaFetchOptions,
  MediaPath,
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
  getMediaByIdentifier(options: any): Promise<MediaPath> {
    console.log('getMediaByIdentifier', options);
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
  createAlbum(options: MediaAlbumCreate): Promise<void> {
    console.log('createAlbum', options);
    throw this.unimplemented('Not implemented on web.');
  }
  getAlbumsPath(): Promise<AlbumsPathResponse> {
      console.log('getAlbumsPath');
      throw this.unimplemented('Not implemented on web.');
  }
}
