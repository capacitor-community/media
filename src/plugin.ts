import { Plugins } from "@capacitor/core";
import {
  IMediaPlugin,
  MediaFetchOptions,
  MediaResponse,
  MediaAlbumResponse,
  MediaSaveOptions,
  MediaAlbumCreate
} from "./definitions";

const { MediaPlugin } = Plugins;

export class Media implements IMediaPlugin {
  getMedias(options?: MediaFetchOptions): Promise<MediaResponse> {
    return MediaPlugin.getMedias(options);
  }

  getAlbums(): Promise<MediaAlbumResponse> {
    return MediaPlugin.getAlbums();
  }

  savePhoto(options?: MediaSaveOptions): Promise<void> {
    return MediaPlugin.savePhoto(options);
  }

  saveVideo(options?: MediaSaveOptions): Promise<void> {
    return MediaPlugin.saveVideo(options);
  }

  saveGif(options?: MediaSaveOptions): Promise<void> {
    return MediaPlugin.saveGif(options);
  }

  createAlbum(options: MediaAlbumCreate): Promise<void> {
    return MediaPlugin.createAlbum(options);
  }
}
