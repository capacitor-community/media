import { useState } from 'react';
import { Media } from '@capacitor-community/media';
import { IonButton } from '@ionic/react';

const CreateDemoAlbum = () => {
    const [status, setStatus] = useState<string>();

    const createRandomAlbum = async () => {
        setStatus("");
        const random = Math.random();
        await Media.createAlbum({ name: `Demo Album ${random}` });
        setStatus(`Created album: Demo Album ${random}`);
    };

    const createDemoAlbum = async () => {
        setStatus("");
        const { albums } = await Media.getAlbums();
        const demoAlbum = albums.find(a => a.name === "Media Demo Album");
        if (demoAlbum) {
            setStatus("Demo album already exists!");
            return;
        }

        await Media.createAlbum({ name: "Media Demo Album" });
        setStatus("Created demo album");
    }

    const getAlbumsPath = async () => {
        setStatus("");
        try {
            const { path } = await Media.getAlbumsPath();
            setStatus(`Albums path: ${path}`);
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        }
    };

    return <>
        <IonButton onClick={createRandomAlbum}>Create Random Demo Album</IonButton>
        <IonButton onClick={createDemoAlbum}>Create Demo Album</IonButton>
        <IonButton onClick={getAlbumsPath}>Get Albums Path (Android)</IonButton>
        <p>{ status }</p>
    </>;
}

export default CreateDemoAlbum;