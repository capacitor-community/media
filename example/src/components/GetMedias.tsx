import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Media, MediaAsset } from "@west-co/capacitor-media-plugin";
import { IonButton, IonDatetime, IonDatetimeButton, IonModal, IonInput, IonList, IonItem } from "@ionic/react";
import { Capacitor } from "@capacitor/core";

const GetMedias = () => {
    const [loading, setLoading] = useState(false);
    const [medias, setMedias] = useState<MediaAsset[]>();
    const [highQualityPath, setHighQualityPath] = useState<string | undefined>(undefined);

    const [offset, setOffset] = useState(0);
    const [resultOffset, setResultOffset] = useState(0);
    const [quantity, setQuantity] = useState(4);
    const [totalCount, setTotalCount] = useState(0);

    const [fromDate, setFromDate] = useState<string | null>(dayjs().format('YYYY-MM-DDTHH:mm:ss'));
    const [toDate, setToDate] = useState<string | null>(dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss'));

    const now = dayjs();

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

    const getMediaDateRange = async () => {
        setMedias([]);
        const startDate = dayjs(fromDate);
        const endDate = dayjs(toDate);

        if (startDate.isAfter(endDate)) {
          window.alert('Start needs to be before end date');
          return;
        }

        setLoading(true);

        const medias = await Media.getMedias({ types: "photos", quantity: quantity, offset: offset, startDate: startDate.format('YYYY/MM/DD'), endDate: endDate.format('YYYY/MM/DD') })
        setMedias(medias.medias);
        setResultOffset(medias.offset);
        setTotalCount(medias.totalCount);

        setLoading(false);
    }

    const handleFromChange = (value: string | string[]) => {
      if (Array.isArray(value)) {
        setFromDate(dayjs(value[0]).format('YYYY-MM-DDTHH:mm:ss'));
      } else {
        setFromDate(dayjs(value).format('YYYY-MM-DDTHH:mm:ss'));
      }
    }

    const handleToChange = (value: string | string[]) => {
      if (Array.isArray(value)) {
        setToDate(dayjs(value[0]).format('YYYY-MM-DDTHH:mm:ss'));
      } else {
        setToDate(dayjs(value).format('YYYY-MM-DDTHH:mm:ss'));
      }
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
        <p>Date range</p>

        <p>
            <span>From:</span><IonDatetimeButton datetime="from"></IonDatetimeButton>
            <span>To:</span><IonDatetimeButton datetime="to"></IonDatetimeButton>
        </p>
        <p>
        <IonModal keepContentsMounted={true}>
          <IonDatetime id="from" value={fromDate} onIonChange={(e) => handleFromChange(e.detail.value!)}></IonDatetime>
        </IonModal>
        </p>
        <p>
        <IonModal keepContentsMounted={true}>
          <IonDatetime id="to" value={toDate} onIonChange={(e) => handleToChange(e.detail.value!)}></IonDatetime>
        </IonModal>
        </p>
        <p>
            Offset: <IonInput title="offset" type="number" value={offset} onIonChange={(e: any) => setOffset(parseInt(e.target.value))}></IonInput>
            Quantity: <IonInput title="quantity" type="number" value={quantity} onIonChange={(e: any) => setQuantity(parseInt(e.target.value))}></IonInput>
        </p>
        <p>
        <IonButton onClick={getMediaDateRange}>Get from {dayjs(fromDate).format('YYYY-MM-DD')} to {dayjs(toDate).format('YYYY-MM-DD')}</IonButton>
        </p>
        <p>Full-Size</p>
        <IonButton onClick={getHighQualityImage}>Get Full-Size Image</IonButton>
        <IonButton onClick={getHighQualityVideo}>Get Full-Size Video</IonButton>
        <br />
        <p>Results</p>
        {loading ? (
          <p>Loading...</p>
        ): (
          <p>count: {medias?.length}, offset: {resultOffset}, totalCount: {Math.max(medias?.length ?? 0, totalCount)}</p>
        )}
        { medias?.map(media => <p><img key={media.identifier} alt="Media Result" style={{"width": "100px"}} src={media.dataUrl} /><br/>{dayjs(media.creationDate).format('YYYY-M-D - HH:mm')}</p>) }
        { highQualityPath && <img alt="High Quality" src={highQualityPath} /> }
    </>
};

export default GetMedias;
