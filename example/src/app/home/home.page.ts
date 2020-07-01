import { Component, NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  albums = [];
  constructor(private zone: NgZone) {}

  getAlbums() {
    Plugins.MediaPlugin.getAlbums().then((response) =>
      this.zone.run(() => (this.albums = response.albums))
    );
  }
}
