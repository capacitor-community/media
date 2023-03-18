export interface MediaPlugin {
  /**
    * Get filtered media from camera roll (pictures only currently). iOS only.
    * 
    * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetMedias.tsx)
    */
  getMedias(options?: MediaFetchOptions): Promise<MediaResponse>;
  /**
    * Get list of albums. 
    * 
    * On Android, albums may only return if they have a photo in them.
    * 
    * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetAlbums.tsx)
    */
  getAlbums(): Promise<MediaAlbumResponse>;
  /**
   * Saves a photo to the camera roll.
   * 
   * On Android and iOS, this supports web URLs, base64 encoded images 
   * (e.g. data:image/jpeg;base64,...), and local files.
   * On Android, all image formats supported by the user's photo viewer are supported.
   * 
   * On iOS, [all image formats supported by SDWebImage are supported.](https://github.com/SDWebImage/SDWebImage#supported-image-formats)
   * All images on iOS are converted to PNG for system compatability. 
   * 
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx#L12)
   */
  savePhoto(options?: MediaSaveOptions): Promise<PhotoResponse>;
  /**
   * Saves a video to the camera roll.
   * 
   * On Android and iOS, this supports web URLs, base64 encoded videos 
   * (e.g. data:image/mp4;base64,...), and local files.
   * On Android, all video formats supported by the user's photo viewer are supported.
   * On iOS, the supported formats are based on iOS.
   * 
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx#L65)
   */
  saveVideo(options?: MediaSaveOptions): Promise<PhotoResponse>;
  /**
   * Saves an animated GIF to the camera roll.
   * 
   * On Android and iOS, this supports web URLs, base64 encoded GIFs 
   * (data:image/gif;base64,...), and local files.
   * This only supports GIF files specifically.
   * 
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx#L49)
   */
  saveGif(options?: MediaSaveOptions): Promise<PhotoResponse>;
  /**
   * Creates an album.
   * 
   * On Android, the album may only show up in `getAlbums()` 
   * if it has a photo in it.
   * 
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/CreateDemoAlbum.tsx)
   */
  createAlbum(options: MediaAlbumCreate): Promise<void>;
}

export interface MediaSaveOptions {
  /**
   * Web URL, base64 encoded URI, or local file path to save.
   */
  path: string;
  /**
   * Album ID. On iOS, this is the album identifier. 
   * On Android, it is the album name.
   */
  album?: string;
}

export interface MediaFetchOptions {
  /**
   * The number of photos to fetch, sorted by last created date descending
   */
  quantity?: number;
  /**
   * The width of thumbnail to return
   */
  thumbnailWidth?: number;
  /**
   * The height of thumbnail to return
   */
  thumbnailHeight?: number;
  /**
   * The quality of thumbnail to return as JPEG (0-100)
   */
  thumbnailQuality?: number;
  /**
   * Which types of assets to return. Only photos supported currently.
   */
  types?: "photos";
  /**
   * Which album identifier to query in (get identifier with getAlbums())
   */
  albumIdentifier?: string;
  /**
   * Sort order of returned assets by field and ascending/descending
   */
  sort?: MediaField | MediaSort[];
}

export interface MediaSort {
  key: MediaField;
  ascending: boolean;
}

/**
 * Attributes to sort media by.
 * 
 * [iOS Source](https://developer.apple.com/documentation/photokit/phfetchoptions)
 */
export type MediaField =
  | 'mediaType'
  | 'mediaSubtypes'
  | 'sourceType'
  | 'pixelWidth'
  | 'pixelHeight'
  | 'creationDate'
  | 'modificationDate'
  | 'isFavorite'
  | 'burstIdentifier';

export interface MediaResponse {
  medias: MediaAsset[];
}

export interface MediaAsset {
  /**
   * Platform-specific identifier
   */
  identifier: string;
  /**
   * Data for a photo asset as a base64 encoded string (JPEG only supported)
   */
  data: string;
  /**
   * ISO date string for creation date of asset
   */
  creationDate: string;
  /**
   * Full width of original asset
   */
  fullWidth: number;
  /**
   * Full height of original asset
   */
  fullHeight: number;
  /**
   * Width of thumbnail preview
   */
  thumbnailWidth: number;
  /**
   * Height of thumbnail preview
   */
  thumbnailHeight: number;
  /**
   * Location metadata for the asset
   */
  location: MediaLocation;
}

export interface MediaLocation {
  /**
   * GPS latitude image was taken at
   */
  latitude: number;
  /**
   * GPS longitude image was taken at
   */
  longitude: number;
  /**
   * Heading of user at time image was taken
   */
  heading: number;
  /**
   * Altitude of user at time image was taken
   */
  altitude: number;
  /**
   * Speed of user at time image was taken
   */
  speed: number;
}

export interface MediaAlbumResponse {
  albums: MediaAlbum[];
}

export interface MediaAlbum {
  identifier?: string;
  name: string;
  count?: number;
  type?: MediaAlbumType;
}

export declare enum MediaAlbumType {
  /**
   * Album is a "smart" album (such as Favorites or Recently Added)
   */
  Smart = 'smart',
  /**
   * Album is a cloud-shared album
   */
  Shared = 'shared',
  /**
   * Album is a user-created album
   */
  User = 'user',
}

export interface MediaAlbumCreate {
  name: string;
}

export interface PhotoResponse {
  filePath: string;
}
