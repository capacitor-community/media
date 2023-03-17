import { useState } from "react";
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { photoDataURI, gifDataURI } from "./data";
import { FilePicker } from "@whiteguru/capacitor-plugin-file-picker";

const SavePhoto = () => {
    const [status, setStatus] = useState<string>();

    const savePhotoOnline = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://imgs.xkcd.com/comics/tar.png" };
        await Media.savePhoto(opts);
        setStatus("Saved photo from URL!");
    };

    const savePhotoDataURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: photoDataURI };
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
        let opts: MediaSaveOptions = { path: image.path! };
        if (Capacitor.getPlatform() === "android") opts["album"] = "Demo Album";
        await Media.savePhoto(opts);
        setStatus("Saved photo from Camera!");
    };

    const saveGIFDataURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: gifDataURI };
        if (Capacitor.getPlatform() === "android") opts["album"] = "Demo Album";
        await Media.saveGif(opts);
        setStatus("Saved GIF from data URI!");
    };

    const saveGIFOnline = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif" };
        await Media.saveGif(opts);
        setStatus("Saved GIF from data URI!");
    };

    const saveTakenVideo = async () => {
        setStatus("");
        const videos = await FilePicker.pick({
            mimes: ["video/*"],
            multiple: false
        });

        let path = videos.files[0].path;
        let opts: MediaSaveOptions = { path };
        if (Capacitor.getPlatform() === "android") opts["album"] = "Demo Album";
        await Media.saveVideo(opts);
        setStatus("Re-saved video from camera roll!");
    };

    return <>
        { Capacitor.getPlatform() === "ios" && <IonButton onClick={savePhotoOnline}>Save Photo from online URL (iOS only)</IonButton> }
        <IonButton onClick={savePhotoDataURI}>Save Photo from Data URI</IonButton>
        <IonButton onClick={saveTakenPhoto}>Save Photo from Camera</IonButton>
        { Capacitor.getPlatform() === "ios" && <IonButton onClick={saveGIFOnline}>Save GIF from online URL (iOS only)</IonButton> }
        <IonButton onClick={saveGIFDataURI}>Save GIF from Data URI</IonButton>
        <IonButton onClick={saveTakenVideo}>Save Previously Taken Video</IonButton>
        <p>{ status }</p>
    </>;
};

export default SavePhoto;