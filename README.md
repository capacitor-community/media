<p align="center"><br><img src="https://user-images.githubusercontent.com/236501/85893648-1c92e880-b7a8-11ea-926d-95355b8175c7.png" width="128" height="128" /></p>
<h3 align="center">Capacitor Media</h3>
<p align="center"><strong><code>@capacitor-community/media</code></strong></p>
<p align="center">
  Capacitor community plugin for enabling extra media capabilities
</p>

<p align="center">
  <img src="https://img.shields.io/maintenance/yes/2022?style=flat-square" />
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/l/@capacitor-community/media?style=flat-square" /></a>
<br>
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/dw/@capacitor-community/media?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@capacitor-community/media"><img src="https://img.shields.io/npm/v/@capacitor-community/media?style=flat-square" /></a>
  <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href="#contributors"><img src="https://img.shields.io/badge/all%20contributors-8-orange?style=flat-square" /></a>
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
| Stewan Silva | [stewones](https://github.com/stewones) | [@StewanSilva](https://twitter.com/stewones) |
| Nisala Kalupahana | [nkalupahana](https://github.com/nkalupahana) | |

## Notice 🚀

We're starting fresh under an official org. If you were using the previous npm package `capacitor-media`, please update your package.json to `@capacitor-community/media`. Check out [changelog](/CHANGELOG.md) for more info.

## Installation

Using npm:

```bash
npm install @capacitor-community/media
```

Using yarn:

```bash
yarn add @capacitor-community/media
```

Sync native files:

```bash
npx cap sync
```

## API

- savePhoto
- saveVideo
- saveGif
- createAlbum
- getAlbums
- getMedias `only ios for now`

## Usage

```js
import { Media } from '@capacitor-community/media';

//
// Save video to a specific album
Media.saveVideo({ path: '/path/to/the/file', album: 'My Album' })
  .then(console.log) // on android it returns {filePath: 'uri to media'}
  .catch(console.log);

//
// Get a list of user albums
Media.getAlbums()
  .then(console.log) // -> { albums: [{name:'My Album', identifier:'A1-B2-C3-D4'}, {name:'My Another Album', identifier:'E5-F6-G7-H8'}]}
  .catch(console.log);
```

## Disclaimer

Make sure you pass the correct album parameter according to the platform

```js
album: this.platform.is('ios') ? album.identifier : album.name;
```

## iOS setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install —-save @capacitor-community/media`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- `npx cap open ios`
- sign your app at xcode (general tab)
- add the following to `Info.plist`:

```xml
<dict>
  ...
  <key>NSPhotoLibraryUsageDescription</key>
  <string>Describe why you need access to user's photos</string>
  ...
</dict>
```

> Tip: every time you change a native code you may need to clean up the cache (Product > Clean build folder) and then run the app again.

## Android setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install —-save @capacitor-community/media`
- `mkdir www && touch www/index.html`
- `npx cap add android`
- `npx cap open android`
- `[extra step]` in android case we need to tell Capacitor to initialise the plugin:

> on your `MainActivity.java` file add `import com.getcapacitor.community.media.MediaPlugin;` and then inside the init callback `add(MediaPlugin.class);`

Now you should be set to go. Try to run your client using `ionic cap run android --livereload`.

> Tip: every time you change a native code you may need to clean up the cache (Build > Clean Project | Build > Rebuild Project) and then run the app again.

## Example

Still WIP. Please send your PR with more examples!

- https://github.com/capacitor-community/media/blob/master/example

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/StewanSilva"><img src="https://avatars1.githubusercontent.com/u/719763?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Stew</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=stewwan" title="Code">💻</a> <a href="https://github.com/capacitor-community/media/commits?author=stewwan" title="Documentation">📖</a> <a href="#maintenance-stewwan" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/zakton5"><img src="https://avatars1.githubusercontent.com/u/7013396?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Zachary Keeton</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=zakton5" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/pgrimaud"><img src="https://avatars.githubusercontent.com/u/1866496?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Pierre Grimaud</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=pgrimaud" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.kuau.com.br/"><img src="https://avatars.githubusercontent.com/u/14003158?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Talles Alves</b></sub></a><br /><a href="#maintenance-tallesventura" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.zyadyasser.net/"><img src="https://avatars.githubusercontent.com/u/38470992?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Zyad Yasser</b></sub></a><br /><a href="#maintenance-zyad-yasser" title="Maintenance">🚧</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/dragermrb"><img src="https://avatars.githubusercontent.com/u/11479696?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Manuel Rodríguez</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=dragermrb" title="Code">💻</a> <a href="#maintenance-dragermrb" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/Gr1zlY"><img src="https://avatars.githubusercontent.com/u/195971?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Michael</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=Gr1zlY" title="Code">💻</a></td>
    <td align="center"><a href="https://www.mtda.me/"><img src="https://avatars.githubusercontent.com/u/2229994?v=4?s=75" width="75px;" alt=""/><br /><sub><b>Matheus Davidson</b></sub></a><br /><a href="https://github.com/capacitor-community/media/commits?author=matheusdavidson" title="Code">💻</a> <a href="https://github.com/capacitor-community/media/commits?author=matheusdavidson" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
