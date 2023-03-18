import { Capacitor } from '@capacitor/core';
import { IonPage, IonContent } from '@ionic/react';
import CreateDemoAlbum from '../components/CreateDemoAlbum';
import GetAlbums from '../components/GetAlbums';
import GetMedias from '../components/GetMedias';
import SaveMedia from '../components/SaveMedia';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <div className="container">
          <br /><br />
          <h1>@capacitor-community/media</h1>
          <p>This package only works on iOS and Android. Web users, turn back.</p>
          <h3>Get Albums</h3>
          <p>If you only give access to selected photos, this won't show non-default albums.</p>
          <GetAlbums />

          <h3>Create Album</h3>
          <CreateDemoAlbum />

          <h3>Save Media</h3>
          <SaveMedia />

          { Capacitor.getPlatform() === "ios" && <>
            <h3>Get Images</h3>
            <GetMedias />
          </> }
          <br /><br /><br /><br /><br /><br />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
