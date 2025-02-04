export interface MediaPlugin {
  /**
   * Get filtered thumbnails from camera roll. iOS only.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetMedias.tsx)
   */
  getMedias(options?: MediaFetchOptions): Promise<MediaResponse>;
  /**
   * Get a filesystem path to a full-quality media asset by its identifier. iOS only.
   * This is not included for Android because on Android, a media asset's identifier IS its path!
   * You can simply use the Filesystem plugin to work with it. On iOS, you have to turn the identifier into a path
   * using this function. After that, you can use the Filesystem plugin, same as Android.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetMedias.tsx)
   */
  getMediaByIdentifier(options?: {
    identifier: string;
    width?: number;
    compression?: number;
  }): Promise<MediaPath>;
  /**
   * Get list of albums.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetAlbums.tsx)
   */
  getAlbums(): Promise<MediaAlbumResponse>;
  /**
   * Saves a still photo or GIF to the camera roll.
   *
   * On Android and iOS, this supports web URLs, base64 encoded images
   * (e.g. data:image/jpeg;base64,...), and local files.
   * On Android, all image formats supported by the user's photo viewer are supported.
   * On iOS, most common image formats are supported.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)
   */
  savePhoto(options?: MediaSaveOptions): Promise<PhotoResponse>;
  /**
   * Saves a video to the camera roll.
   *
   * On Android and iOS, this supports web URLs, base64 encoded videos
   * (e.g. data:image/mp4;base64,...), and local files.
   * On Android, all video formats supported by the user's photo viewer are supported.
   * On iOS, the supported formats are based on whatever iOS supports at the time.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)
   */
  saveVideo(options?: MediaSaveOptions): Promise<PhotoResponse>;
  /**
   * Creates an album.
   *
   * [Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/CreateDemoAlbum.tsx)
   */
  createAlbum(options: MediaAlbumCreate): Promise<void>;
  /**
   * Gets the path where album folders and their corresponding photos
   * are stored on the Android filesystem. This can be used to identify
   * your album by more than just its name on Android, in case there
   * are multiple albums with the same name, which is possible on Android.
   * Just compare the albums path to the start of the album identifier when
   * getting albums.
   *
   * Only available on Android.
   *
   * Code Examples: [basic](https://github.com/capacitor-community/media/blob/master/example/src/components/CreateDemoAlbum.tsx), [when saving media](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)
   */
  getAlbumsPath(): Promise<AlbumsPathResponse>;
}

export interface MediaSaveOptions {
  /**
   * Web URL, base64 encoded URI, or local file path to save.
   */
  path: string;
  /**
   * Album identifier from getAlbums().
   * Since 5.0, identifier is used on both Android and iOS.
   * Identifier is required on Android but not on iOS.
   * On iOS 14+, if the identifier is not specified and no permissions
   * have been requested yet, add-only permissions will be requested instead
   * of full permissions (assuming NSPhotoLibraryAddUsageDescription
   * is in Info.plist).
   */
  albumIdentifier?: string;
  /**
   * File name to save the image as in the album.
   * Do not include extension. Android only.
   */
  fileName?: string;
}

export interface MediaFetchOptions {
  /**
   * The number of photos to fetch, sorted by last created date descending. To paginate, just request a higher quantity -- OS caching should make this relatively performant.
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
   * Which types of assets to return thumbnails for.
   */
  types?: 'photos' | 'videos' | 'all';
  /**
   * Which album identifier to query in (get identifier with getAlbums())
   */
  albumIdentifier?: string;
  /**
   * Sort order of returned assets by field and ascending/descending
   */
  sort?: MediaField | MediaSort[];

  /**
   * Start date if any YYYY/MM/DD
   */
  startDate?: string;

  /**
   * End date if any YYYY/MM/DD
   */
  endDate?: string;

  /**
   * Offset for pagination (use together with quantity to paginate results)
   */
  offset?: number;

  /**
   * If we are to fetch total count (default true)
   */
  fetchCount?: boolean;
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
  totalCount: number;
  offset: number;
}

export interface AlbumsPathResponse {
  path: string;
}

export interface MediaAsset {
  /**
   * Platform-specific identifier
   */
  identifier: string;
  /**
   * Data URL for a photo asset as a base64 encoded string (JPEG only supported)
   */
  dataUrl: string;
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
  /**
   * Is media favorited
   */
  isFavorite: boolean;
}

export interface MediaPath {
  /**
   * Path to media asset
   */
  path: string;
  /**
   * Identifier for media asset
   */
  identifier: string;
  /**
   * Data URL for media asset
   */
  dataUrl: string;
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
  identifier: string;
  name: string;
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
  /**
   * Available on Android only.
   */
  filePath?: string;
}
