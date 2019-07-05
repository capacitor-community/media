# capacitor-media [![npm version](https://badge.fury.io/js/capacitor-media.svg)](https://badge.fury.io/js/capacitor-media)

Capacitor plugin to activate media features such as saving videos and gifs into user's photo gallery

## API

- savePhoto
- saveVideo
- saveGif
- createAlbum
- getAlbums
- getMedias `only ios for now`

## Usage

```js
import { Media } from 'capacitor-media';
const media = new Media();

//
// Save video to a specfic album
media
  .saveVideo({ path: '/path/to/the/file', album: 'My Album' })
  .then(console.log)
  .catch(console.log);

//
// Get a list of user albums
media
  .getAlbums()
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
- `npm install —-save capacitor-media`
- `mkdir www && touch www/index.html`
- `npx cap add ios`
- `npx cap open ios`
- sign your app at xcode (general tab)

> Tip: every time you change a native code you may need to clean up the cache (Product > Clean build folder) and then run the app again.

## Android setup

- `ionic start my-cap-app --capacitor`
- `cd my-cap-app`
- `npm install —-save capacitor-media`
- `mkdir www && touch www/index.html`
- `npx cap add android`
- `npx cap open android`
- `[extra step]` in android case we need to tell Capacitor to initialise the plugin:

> on your `MainActivity.java` file add `import io.stewan.capacitor.media.MediaPlugin;` and then inside the init callback `add(MediaPlugin.class);`

Now you should be set to go. Try to run your client using `ionic cap run android --livereload`.

> Tip: every time you change a native code you may need to clean up the cache (Build > Clean Project | Build > Rebuild Project) and then run the app again.

## Sample app

(coming soon)

## You may also like

- [capacitor-analytics](https://github.com/stewwan/capacitor-analytics)
- [capacitor-intercom](https://github.com/stewwan/capacitor-intercom)
- [capacitor-fcm](https://github.com/stewwan/capacitor-fcm)
- [capacitor-twitter](https://github.com/stewwan/capacitor-twitter)

Cheers 🍻

Follow me [@Twitter](https://twitter.com/StewanSilva)

## License

MIT
