<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Capacitor Media</h3>
<p align="center"><strong><code>@capacitor-community/media</code></strong></p>
<p align="center">
  Capacitor community plugin for enabling extra media capabilities
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2023?style=flat-square" />
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/l/@capacitor-community/media?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/dw/@capacitor-community/media?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/v/@capacitor-community/media?style=flat-square" /></a>
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/badge/all%20contributors-10-orange?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->

</p>

## Sponsors

<table>
  <tr>
    <td align="center">
      <a href="https://intenseloop.com">
      <img src="https://static.intenseloop.com/assets/logo-512x512.png" width="40" />
      </a>
    </td>
    <td>
      <a href="https://intenseloop.com">
      Intenseloop
      </a>
    </td>
  </tr>
</table>

## Maintainers

| Maintainer   | GitHub                                | Social                                          |
| ------------ | ------------------------------------- | ----------------------------------------------- |
| Nisala Kalupahana | [nkalupahana](https://github.com/nkalupahana) | |
| Stewan Silva | [stewones](https://github.com/stewones) | [@StewanSilva](https://twitter.com/stewones) |

## Installation

Run one of the following commands, based on what you're using:

```bash
npm install @capacitor-community/media # NPM
yarn add @capacitor-community/media # Yarn
```

This plugin is currently for Capacitor 5. Add an `@4` at the end to install for Capacitor 4.

After installing, be sure to sync by running `ionic cap sync`.

## Migrating to Capacitor 5

**A major breaking change has been made to this plugin:** Saving media on Android now takes an album identifier instead of an album name. The album identifier, like on iOS, can be obtained using `getAlbums()`. (This call will now also return empty albums made by the plugin.) To ensure people notice this significant change, the property has been renamed from `album` to `albumIdentifier`, which will need to be updated in your code. It is still optional on iOS.

## API

Unless otherwise noted, there should be full feature parity between iOS and Android. Web is not supported.

<docgen-index>

* [`getMedias(...)`](#getmedias)
* [`getAlbums()`](#getalbums)
* [`savePhoto(...)`](#savephoto)
* [`saveVideo(...)`](#savevideo)
* [`saveGif(...)`](#savegif)
* [`createAlbum(...)`](#createalbum)
* [Interfaces](#interfaces)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### getMedias(...)

```typescript
getMedias(options?: MediaFetchOptions | undefined) => Promise<MediaResponse>
```

Get filtered media from camera roll (pictures only currently). iOS only.

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetMedias.tsx)

| Param         | Type                                                            |
| ------------- | --------------------------------------------------------------- |
| **`options`** | <code><a href="#mediafetchoptions">MediaFetchOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#mediaresponse">MediaResponse</a>&gt;</code>

--------------------


### getAlbums()

```typescript
getAlbums() => Promise<MediaAlbumResponse>
```

Get list of albums. 

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/GetAlbums.tsx)

**Returns:** <code>Promise&lt;<a href="#mediaalbumresponse">MediaAlbumResponse</a>&gt;</code>

--------------------


### savePhoto(...)

```typescript
savePhoto(options?: MediaSaveOptions | undefined) => Promise<PhotoResponse>
```

Saves a photo to the camera roll.

On Android and iOS, this supports web URLs, base64 encoded images 
(e.g. data:image/jpeg;base64,...), and local files.
On Android, all image formats supported by the user's photo viewer are supported.

On iOS, [all image formats supported by SDWebImage are supported.](https://github.com/SDWebImage/SDWebImage#supported-image-formats)
All images on iOS are converted to PNG for system compatability. 

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#mediasaveoptions">MediaSaveOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#photoresponse">PhotoResponse</a>&gt;</code>

--------------------


### saveVideo(...)

```typescript
saveVideo(options?: MediaSaveOptions | undefined) => Promise<PhotoResponse>
```

Saves a video to the camera roll.

On Android and iOS, this supports web URLs, base64 encoded videos 
(e.g. data:image/mp4;base64,...), and local files.
On Android, all video formats supported by the user's photo viewer are supported.
On iOS, the supported formats are based on whatever iOS supports at the time.

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#mediasaveoptions">MediaSaveOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#photoresponse">PhotoResponse</a>&gt;</code>

--------------------


### saveGif(...)

```typescript
saveGif(options?: MediaSaveOptions | undefined) => Promise<PhotoResponse>
```

Saves an animated GIF to the camera roll.

On Android and iOS, this supports web URLs, base64 encoded GIFs 
(e.g. data:image/gif;base64,...), and local files.
This only supports GIF files specifically.

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/SaveMedia.tsx)

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#mediasaveoptions">MediaSaveOptions</a></code> |

**Returns:** <code>Promise&lt;<a href="#photoresponse">PhotoResponse</a>&gt;</code>

--------------------


### createAlbum(...)

```typescript
createAlbum(options: MediaAlbumCreate) => Promise<void>
```

Creates an album.

[Code Examples](https://github.com/capacitor-community/media/blob/master/example/src/components/CreateDemoAlbum.tsx)

| Param         | Type                                                          |
| ------------- | ------------------------------------------------------------- |
| **`options`** | <code><a href="#mediaalbumcreate">MediaAlbumCreate</a></code> |

--------------------


### Interfaces


#### MediaResponse

| Prop         | Type                      |
| ------------ | ------------------------- |
| **`medias`** | <code>MediaAsset[]</code> |


#### MediaAsset

| Prop                  | Type                                                    | Description                                                             |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| **`identifier`**      | <code>string</code>                                     | Platform-specific identifier                                            |
| **`data`**            | <code>string</code>                                     | Data for a photo asset as a base64 encoded string (JPEG only supported) |
| **`creationDate`**    | <code>string</code>                                     | ISO date string for creation date of asset                              |
| **`fullWidth`**       | <code>number</code>                                     | Full width of original asset                                            |
| **`fullHeight`**      | <code>number</code>                                     | Full height of original asset                                           |
| **`thumbnailWidth`**  | <code>number</code>                                     | Width of thumbnail preview                                              |
| **`thumbnailHeight`** | <code>number</code>                                     | Height of thumbnail preview                                             |
| **`location`**        | <code><a href="#medialocation">MediaLocation</a></code> | Location metadata for the asset                                         |


#### MediaLocation

| Prop            | Type                | Description                              |
| --------------- | ------------------- | ---------------------------------------- |
| **`latitude`**  | <code>number</code> | GPS latitude image was taken at          |
| **`longitude`** | <code>number</code> | GPS longitude image was taken at         |
| **`heading`**   | <code>number</code> | Heading of user at time image was taken  |
| **`altitude`**  | <code>number</code> | Altitude of user at time image was taken |
| **`speed`**     | <code>number</code> | Speed of user at time image was taken    |


#### MediaFetchOptions

| Prop                   | Type                                                                                                                                                                                     | Description                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **`quantity`**         | <code>number</code>                                                                                                                                                                      | The number of photos to fetch, sorted by last created date descending |
| **`thumbnailWidth`**   | <code>number</code>                                                                                                                                                                      | The width of thumbnail to return                                      |
| **`thumbnailHeight`**  | <code>number</code>                                                                                                                                                                      | The height of thumbnail to return                                     |
| **`thumbnailQuality`** | <code>number</code>                                                                                                                                                                      | The quality of thumbnail to return as JPEG (0-100)                    |
| **`types`**            | <code>"photos"</code>                                                                                                                                                                    | Which types of assets to return. Only photos supported currently.     |
| **`albumIdentifier`**  | <code>string</code>                                                                                                                                                                      | Which album identifier to query in (get identifier with getAlbums())  |
| **`sort`**             | <code>"mediaType" \| "mediaSubtypes" \| "sourceType" \| "pixelWidth" \| "pixelHeight" \| "creationDate" \| "modificationDate" \| "isFavorite" \| "burstIdentifier" \| MediaSort[]</code> | Sort order of returned assets by field and ascending/descending       |


#### MediaSort

| Prop            | Type                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`key`**       | <code>"mediaType" \| "mediaSubtypes" \| "sourceType" \| "pixelWidth" \| "pixelHeight" \| "creationDate" \| "modificationDate" \| "isFavorite" \| "burstIdentifier"</code> |
| **`ascending`** | <code>boolean</code>                                                                                                                                                      |


#### MediaAlbumResponse

| Prop         | Type                      |
| ------------ | ------------------------- |
| **`albums`** | <code>MediaAlbum[]</code> |


#### MediaAlbum

| Prop             | Type                                                      |
| ---------------- | --------------------------------------------------------- |
| **`identifier`** | <code>string</code>                                       |
| **`name`**       | <code>string</code>                                       |
| **`type`**       | <code><a href="#mediaalbumtype">MediaAlbumType</a></code> |


#### PhotoResponse

| Prop           | Type                |
| -------------- | ------------------- |
| **`filePath`** | <code>string</code> |


#### MediaSaveOptions

| Prop                  | Type                | Description                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`path`**            | <code>string</code> | Web URL, base64 encoded URI, or local file path to save.                                                                                                                                                                                                                                                                                                                 |
| **`albumIdentifier`** | <code>string</code> | Album identifier from getAlbums(). Since 5.0, identifier is used on both Android and iOS. Identifier is required on Android but not on iOS. On iOS 14+, if the identifier is not specified and no permissions have been requested yet, add-only permissions will be requested instead of full permissions (assuming NSPhotoLibraryAddUsageDescription is in Info.plist). |


#### MediaAlbumCreate

| Prop       | Type                |
| ---------- | ------------------- |
| **`name`** | <code>string</code> |


### Enums


#### MediaAlbumType

| Members      | Value                 | Description                                                    |
| ------------ | --------------------- | -------------------------------------------------------------- |
| **`Smart`**  | <code>'smart'</code>  | Album is a "smart" album (such as Favorites or Recently Added) |
| **`Shared`** | <code>'shared'</code> | Album is a cloud-shared album                                  |
| **`User`**   | <code>'user'</code>   | Album is a user-created album                                  |

</docgen-api>

## iOS

You'll need to add the following to your app's `Info.plist` file:

```xml
<dict>
  ...
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Describe why you need access to user's photos (getting albums and media)</string>
  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>Describe why you need to add photos to user's photo library</string>
  ...
</dict>
```
## Android

You'll need to add the following to your app's `AndroidManifest.xml` file:

```xml
<manifest>
  ...
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
  <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
  ...
</manifest>
```

Note the READ_MEDIA permissions -- these are **new in Android 13**!

## Demo

Go the the `example/` folder to play with an example app that should show all functionality of this plugin.

<img style="width: 250px" src="https://github.com/capacitor-community/media/blob/master/example_app.png?raw=true" />

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://twitter.com/StewanSilva"><img src="https://avatars1.githubusercontent.com/u/719763?v=4?s=75" width="75px;" alt="Stew"/><br /><sub><b>Stew</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=stewwan" title="Code">💻</a> <a href="https://github.com/capacitor-community/media/commits?author=stewwan" title="Documentation">📖</a> <a href="#maintenance-stewwan" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/zakton5"><img src="https://avatars1.githubusercontent.com/u/7013396?v=4?s=75" width="75px;" alt="Zachary Keeton"/><br /><sub><b>Zachary Keeton</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=zakton5" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/pgrimaud"><img src="https://avatars.githubusercontent.com/u/1866496?v=4?s=75" width="75px;" alt="Pierre Grimaud"/><br /><sub><b>Pierre Grimaud</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=pgrimaud" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://www.kuau.com.br/"><img src="https://avatars.githubusercontent.com/u/14003158?v=4?s=75" width="75px;" alt="Talles Alves"/><br /><sub><b>Talles Alves</b></sub></a><br /><a href="#maintenance-tallesventura" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://www.zyadyasser.net/"><img src="https://avatars.githubusercontent.com/u/38470992?v=4?s=75" width="75px;" alt="Zyad Yasser"/><br /><sub><b>Zyad Yasser</b></sub></a><br /><a href="#maintenance-zyad-yasser" title="Maintenance">🚧</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="20%"><a href="https://github.com/dragermrb"><img src="https://avatars.githubusercontent.com/u/11479696?v=4?s=75" width="75px;" alt="Manuel Rodríguez"/><br /><sub><b>Manuel Rodríguez</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=dragermrb" title="Code">💻</a> <a href="#maintenance-dragermrb" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://github.com/Gr1zlY"><img src="https://avatars.githubusercontent.com/u/195971?v=4?s=75" width="75px;" alt="Michael"/><br /><sub><b>Michael</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=Gr1zlY" title="Code">💻</a></td>
      <td align="center" valign="top" width="20%"><a href="https://www.mtda.me/"><img src="https://avatars.githubusercontent.com/u/2229994?v=4?s=75" width="75px;" alt="Matheus Davidson"/><br /><sub><b>Matheus Davidson</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=matheusdavidson" title="Code">💻</a> <a href="https://github.com/capacitor-community/media/commits?author=matheusdavidson" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="20%"><a href="https://linkedin.com/in/nisala"><img src="https://avatars.githubusercontent.com/u/7347290?v=4?s=75" width="75px;" alt="Nisala Kalupahana"/><br /><sub><b>Nisala Kalupahana</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=nkalupahana" title="Code">💻</a> <a href="https://github.com/capacitor-community/media/commits?author=nkalupahana" title="Documentation">📖</a> <a href="#example-nkalupahana" title="Examples">💡</a> <a href="#maintenance-nkalupahana" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="20%"><a href="https://rdlabo.jp/"><img src="https://avatars.githubusercontent.com/u/9690024?v=4?s=75" width="75px;" alt="Masahiko Sakakibara"/><br /><sub><b>Masahiko Sakakibara</b></sub></a><br /><a href="#maintenance-rdlabo" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
