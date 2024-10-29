# Changelog

All notable changes to this project will be documented in this file.

## [7.0.0](https://github.com/capacitor-community/media/compare/v7.0.0...v6.0.0) (2024-08-28)
- Add duration to `getMedias()` videos
- Permissions are no longer required on Android for non-gallery use (BREAKING)
- Added gallery functionality on Android to access all albums on device (BREAKING)

## [6.0.0](https://github.com/capacitor-community/media/compare/v5.4.1...v6.0.0) (2024-04-29)
- Update to Capacitor 6
- Fix missing source maps
- Add `getMediaByIdentifier()` to get full-size media to web layer on iOS
- Improve error handling on Android
- Improve download performance on Android
- Add error codes to promise rejections
- Handle image URLs without extensions properly on Android
- Remove `saveGif` -- functionality is now in `savePhoto`

## [5.4.1](https://github.com/capacitor-community/media/compare/v5.4.0...v5.4.1) (2024-04-02)
- Update `getMedias()` to also return video thumbnails
- Save images in their source format when using `savePhoto()` to save space on iOS

## [5.4.0](https://github.com/capacitor-community/media/compare/v5.3.1...v5.4.0) (2023-12-19)
- Add `getAlbumsPath()` to Android for getting path where albums are stored for more accurate album identification

## [5.3.1](https://github.com/capacitor-community/media/compare/v5.3.0...v5.3.1) (2023-12-05)
- Fix runtime error when downloading file from the Internet on older Android versions

## [5.3.0](https://github.com/capacitor-community/media/compare/v5.2.2...v5.3.0) (2023-10-30)
- Catch `copyFile()` crash when downloading file from the Internet

## [5.2.2](https://github.com/capacitor-community/media/compare/v5.2.1...v5.2.2) (2023-08-23)
- Fix bug in `getAlbums()` with only videos in albums

## [5.2.1](https://github.com/capacitor-community/media/compare/v5.2.0...v5.2.1) (2023-08-13)
- Add custom filenames on Android
- Fix bug in `getAlbums()` with trashed items in folder

## [5.2.0](https://github.com/capacitor-community/media/compare/v5.1.0...v5.2.0) (2023-08-13)
- Allow add-only photo permissions on iOS 14+

## [5.1.0](https://github.com/capacitor-community/media/compare/v5.0.1...v5.1.0) (2023-08-04)
- Keep EXIF data when saving images with `savePhoto()`

## [5.0.1](https://github.com/capacitor-community/media/compare/v5.0.0...v5.0.1) (2023-06-01)
- Fixes permissions on Android 13 (API 33+)

## [5.0.0](https://github.com/capacitor-community/media/compare/4.2.0...v5.0.0) (2023-05-11)
- Updates to Capacitor 5
- Returns album identifiers on Android
- BREAKING: Requires album identifiers instead of album name to add media to albums on Android
- Returns empty album names on Android

## [4.2.0](https://github.com/capacitor-community/media/compare/v4.1.0...4.2.0) (2023-03-17)

This update:
- Standardizes APIs: the iOS and Android versions of this plugin should have feature parity, bar `getMedias`.
- Updates documentation: the README is now generated via `docgen`.
- Gives code examples: almost all of the plugin's functionality can be tested using a new demo app.

## [4.1.0](https://github.com/capacitor-community/media/compare/v4.0.0-0...v4.1.0) (2023-02-20)

### Features

* **get-medias/sort:** add option to customize sort on getMedias ([#37](https://github.com/capacitor-community/media/issues/37)) ([187b253](https://github.com/capacitor-community/media/commit/187b25308415403dc11637b0baa7bc199036735f))

### [1.0.1](https://github.com/capacitor-community/media/compare/v1.0.0...v1.0.1) (2020-07-01)

### Features

- add example ([8cc960b](https://github.com/capacitor-community/media/commit/8cc960badb058d2070f313f41def4577dedcc136))

### Bug Fixes

- **android:** revamp platform. fixes [#6](https://github.com/capacitor-community/media/issues/6) ([ebdce5b](https://github.com/capacitor-community/media/commit/ebdce5bc400447fbb54c50412842ca0ae5ea6920))

## 1.0.0 (2020-06-28)

### Features

- **android:** update to capacitor v2 ([42b5620](https://github.com/capacitor-community/media/commit/42b56204e5b9aeee7b66934774a174f4b6ab8afb))
- release capacitor plugin for medias ([62a47e1](https://github.com/capacitor-community/media/commit/62a47e16dfdd8070657d206fda0e8de981ecae9e))

### Bug Fixes

- **album:** media definition ([bc07a5a](https://github.com/capacitor-community/media/commit/bc07a5aec2608c28f5b821ec1c774bac17598435))
- **android:** add app compat ([b7f8834](https://github.com/capacitor-community/media/commit/b7f8834d8ba372fa521e800383de38ace35d1321))
- **android:** enable api 29 for saveMedia ([e446af5](https://github.com/capacitor-community/media/commit/e446af568d60fdbe8809e10559a059ad94ab1ece))
- capacitor implementation ([024ce37](https://github.com/capacitor-community/media/commit/024ce37f2a14d3da676cad464af5f0d1eb5fb2a3))
