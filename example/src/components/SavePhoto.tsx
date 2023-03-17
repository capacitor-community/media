import { useState } from "react";
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";

const dataURI = `data:image/jpeg;base64,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`;

const SavePhoto = () => {
    const [status, setStatus] = useState<string>();

    const savePhotoOnline = async () => {
        setStatus("");
        const opts: MediaSaveOptions = { path: "https://imgs.xkcd.com/comics/tar.png" };
        if (Capacitor.getPlatform() === "android") opts["album"] = "Demo Album";
        await Media.savePhoto(opts);
        setStatus("Saved photo from URL!");
    };

    const savePhotoDataURI = async () => {
        setStatus("");
        const opts: MediaSaveOptions = { path: dataURI };
        if (Capacitor.getPlatform() === "android") opts["album"] = "Demo Album";
        await Media.savePhoto(opts);
        setStatus("Saved photo from data URI!");
    };

    const saveTakenPhoto = async () => {
        setStatus("");
        const image = await Camera.getPhoto({
            resultType: CameraResultType.Uri
        });

        console.log(image);
        const opts: MediaSaveOptions = { path: image.path! };
        await Media.savePhoto(opts);
        setStatus("Saved photo from Camera!");
    };

    return <>
        <IonButton onClick={savePhotoOnline}>Save Photo from online URL</IonButton>
        <IonButton onClick={savePhotoDataURI}>Save Photo from Data URI</IonButton>
        <IonButton onClick={saveTakenPhoto}>Save Photo from Camera</IonButton>
        <p>{ status }</p>
    </>;
};

export default SavePhoto;