import { useState } from 'react';
import { Media } from '@capacitor-community/media';
import { IonButton } from '@ionic/react';

const CreateDemoAlbum = () => {
    const [status, setStatus] = useState<string>();

    const createAlbum = async () => {
        const random = Math.random();
        await Media.createAlbum({ name: `Demo Album ${random}` });
        setStatus(`Created album: Demo Album ${random}`);
    };

    return <>
        <IonButton onClick={createAlbum}>Create Demo Album</IonButton>
        <p>{ status }</p>
    </>;
}

export default CreateDemoAlbum;