import { useState } from "react";
import { Media, MediaAsset } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";

const GetMedias = () => {
    const [medias, setMedias] = useState<MediaAsset[]>();

    const getMedias = async () => {
        setMedias([]);
        const medias = await Media.getMedias({});
        setMedias(medias.medias);
    };

    const getNineImages = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, types: "photos" });
        setMedias(medias.medias);
    };
    
    const getNineVideos = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, types: "videos" });
        setMedias(medias.medias);
    };

    const getNineAny = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, types: "all" });
        setMedias(medias.medias);
    };

    const getLowQualityMedias = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, thumbnailQuality: 10 });
        setMedias(medias.medias);
    };

    const getMediasFavorites = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, sort: "isFavorite" });
        setMedias(medias.medias);
    };

    const getMediasSortedFavorites = async () => {
        setMedias([]);
        const medias = await Media.getMedias({ quantity: 9, sort: [
            { key: "isFavorite", ascending: false },
            { key: "creationDate", ascending: false }
        ] });
        setMedias(medias.medias);
    };

    return <>
        <IonButton onClick={getMedias}>Get 25 (Default) Last Images</IonButton>
        <IonButton onClick={getNineImages}>Get 9 Last Images</IonButton>
        <IonButton onClick={getNineVideos}>Get 9 Last Video Thumbnails</IonButton>
        <IonButton onClick={getNineAny}>Get 9 Last Images/Video Thumbnails</IonButton>
        <IonButton onClick={getLowQualityMedias}>Get 9 Last Images, Low Quality</IonButton>
        <IonButton onClick={getMediasFavorites}>Get 9 Favorites</IonButton>
        <IonButton onClick={getMediasSortedFavorites}>Get 9 Images Last Created in Favorites</IonButton>
        <br />
        { medias?.map(media => <img key={media.identifier} alt="Media Result" style={{"width": "50px"}} src={"data:image/jpeg;base64," + media.data} />) }
    </>
};

export default GetMedias;