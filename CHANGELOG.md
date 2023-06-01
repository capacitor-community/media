# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
