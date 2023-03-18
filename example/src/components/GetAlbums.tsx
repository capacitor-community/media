import { Media, MediaAlbum } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";
import { useState } from "react";

const GetAlbums = () => {
    const [albums, setAlbums] = useState<MediaAlbum[]>([]);

    const getAlbums = async () => {
        setAlbums([]);
        const { albums } = await Media.getAlbums();
        setAlbums(albums);
    };
    
    return <>
        <IonButton onClick={getAlbums}>Get Albums</IonButton>
        { albums.length !== 0 && <p>Albums: { albums.map(album => album.name).join(", ") }</p>}
    </>
};

export default GetAlbums;