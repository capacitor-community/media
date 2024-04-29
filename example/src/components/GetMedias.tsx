import { useEffect, useState } from "react";
import { Media, MediaAsset } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";
import { Capacitor } from "@capacitor/core";

const GetMedias = () => {
    const [medias, setMedias] = useState<MediaAsset[]>();
    const [highQualityPath, setHighQualityPath] = useState<string | undefined>(undefined);

    // Auto-reset high quality path when medias change
    useEffect(() => {
        setHighQualityPath(undefined);
    }, [medias]);

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

    const getHighQualityImage = async () => {
        setMedias([]);
        const { medias } = await Media.getMedias({ quantity: 1, types: "photos" });
        const { path } = await Media.getMediaByIdentifier({ identifier: medias[0].identifier });
        setHighQualityPath(Capacitor.convertFileSrc(path));
    }

    const getHighQualityVideo = async () => {
        setMedias([]);
        const { medias } = await Media.getMedias({ quantity: 1, types: "videos" });
        const { path } = await Media.getMediaByIdentifier({ identifier: medias[0].identifier });
        setHighQualityPath(Capacitor.convertFileSrc(path));
    }

    return <>
        <p>Thumbnails</p>
        <IonButton onClick={getMedias}>Get 25 (Default) Last Images</IonButton>
        <IonButton onClick={getNineImages}>Get 9 Last Images</IonButton>
        <IonButton onClick={getNineVideos}>Get 9 Last Video Thumbnails</IonButton>
        <IonButton onClick={getNineAny}>Get 9 Last Images/Video Thumbnails</IonButton>
        <IonButton onClick={getLowQualityMedias}>Get 9 Last Images, Low Quality</IonButton>
        <IonButton onClick={getMediasFavorites}>Get 9 Favorites</IonButton>
        <IonButton onClick={getMediasSortedFavorites}>Get 9 Images Last Created in Favorites</IonButton>
        <p>Full-Size</p>
        <IonButton onClick={getHighQualityImage}>Get Full-Size Image</IonButton>
        <IonButton onClick={getHighQualityVideo}>Get Full-Size Video</IonButton>
        <br />
        { medias?.map(media => <img key={media.identifier} alt="Media Result" style={{"width": "50px"}} src={"data:image/jpeg;base64," + media.data} />) }
        { highQualityPath && <img alt="High Quality" src={highQualityPath} /> }
    </>
};

export default GetMedias;