export interface MediaPlugin {
  getMedias(options?: MediaFetchOptions): Promise<MediaResponse>;
  getAlbums(): Promise<MediaAlbumResponse>;
  savePhoto(options?: MediaSaveOptions): Promise<PhotoResponse>;
  saveVideo(options?: MediaSaveOptions): Promise<PhotoResponse>;
  saveGif(options?: MediaSaveOptions): Promise<PhotoResponse>;
  createAlbum(options: MediaAlbumCreate): Promise<void>;
}

export interface MediaSaveOptions {
  path: string;
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
   * Which types of assets to return (currently only supports "photos")
   */
  types?: string;
  /**
   * Which album identifier to query in (get identifier with getAlbums())
   */
  albumIdentifier?: string;
}

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
