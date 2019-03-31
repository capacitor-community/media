export interface PhotosFetchOptions {
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
export interface PhotoAsset {
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
  location: PhotoLocation;
}
export interface PhotoLocation {
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
export interface PhotosResult {
  /**
   * The list of photos returned from the library
   */
  photos: PhotoAsset[];
}
export interface PhotosSaveOptions {
  /**
   * The base64-encoded JPEG data for a photo (note: do not add HTML data-uri type prefix)
   */
  data: string;
  /**
   * The optional album identifier to save this photo in
   */
  albumIdentifier?: string;
}
export interface PhotosSaveResult {
  /**
   * Whether the photo was created
   */
  success: boolean;
}
export interface PhotosAlbumsFetchOptions {
  /**
   * Whether to load cloud shared albums
   */
  loadShared: boolean;
}
export interface PhotosAlbumsResult {
  /**
   * The list of albums returned from the query
   */
  albums: PhotosAlbum[];
}
export interface PhotosAlbum {
  /**
   * Local identifier for the album
   */
  identifier: string;
  /**
   * Name of the album
   */
  name: string;
  /**
   * Number of items in the album
   */
  count: number;
  /**
   * The type of album
   */
  type: PhotosAlbumType;
}
export interface PhotosCreateAlbumOptions {
  name: string;
}
export declare enum PhotosAlbumType {
  /**
   * Album is a "smart" album (such as Favorites or Recently Added)
   */
  Smart = "smart",
  /**
   * Album is a cloud-shared album
   */
  Shared = "shared",
  /**
   * Album is a user-created album
   */
  User = "user"
}
