import { useState } from "react";
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import { IonButton } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { photoDataURI, gifDataURI, videoDataURI, webpDataURI } from "./data";
import { FilePicker } from "@whiteguru/capacitor-plugin-file-picker";
import { Capacitor } from "@capacitor/core";

const SaveMedia = () => {
    const [status, setStatus] = useState<string>();
    const ensureDemoAlbum = async () => {
        const { albums } = await Media.getAlbums();
        const demoAlbum = albums.find(a => a.name === "Media Demo Album");
        if (!demoAlbum) {
            setStatus(`Demo album does not exist; create it first using the "Create Demo Album" button above.`);
            throw new Error("Demo album does not exist");
        }

        return demoAlbum.identifier;
    };

    const savePhotoOnlineNoAlbum = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://imgs.xkcd.com/comics/tar.png" };
        await Media.savePhoto(opts);
        setStatus("Saved photo from online source URL to library!");
    }

    const savePhotoOnline = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://imgs.xkcd.com/comics/tar.png", albumIdentifier: await ensureDemoAlbum() };
        await Media.savePhoto(opts);
        setStatus("Saved photo from online source URL!");
    };

    const savePhotoDataURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: photoDataURI, albumIdentifier: await ensureDemoAlbum(), fileName: "fromDataURI" };
        await Media.savePhoto(opts);
        setStatus("Saved photo from data URI!");
    };

    const saveWebPDataURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: webpDataURI, albumIdentifier: await ensureDemoAlbum() };
        await Media.savePhoto(opts);
        setStatus("Saved WebP photo from data URI!");
    };

    const saveTakenPhoto = async () => {
        setStatus("");
        const image = await Camera.getPhoto({
            resultType: CameraResultType.Uri
        });

        console.log(image);
        let opts: MediaSaveOptions = { path: image.path!, albumIdentifier: await ensureDemoAlbum() };
        await Media.savePhoto(opts);
        setStatus("Saved photo from Camera!");
    };

    const saveGIFDataURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: gifDataURI, albumIdentifier: await ensureDemoAlbum() };
        await Media.saveGif(opts);
        setStatus("Saved GIF from data URI!");
    };

    const saveGIFOnline = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif", albumIdentifier: await ensureDemoAlbum() };
        await Media.saveGif(opts);
        setStatus("Saved GIF from online source URL!");
    };

    const saveTakenVideo = async () => {
        setStatus("");
        const videos = await FilePicker.pick({
            mimes: ["video/*"],
            multiple: false
        });

        let path = videos.files[0].path;
        let opts: MediaSaveOptions = { path, albumIdentifier: await ensureDemoAlbum() };
        await Media.saveVideo(opts);
        setStatus("Re-saved video from camera roll!");
    };

    const saveVideoURI = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: videoDataURI, albumIdentifier: await ensureDemoAlbum() };
        await Media.saveVideo(opts);
        setStatus("Saved video from data URI!");
    };

    const saveVideoOnline = async () => {
        setStatus("");
        let opts: MediaSaveOptions = { path: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", albumIdentifier: await ensureDemoAlbum() };
        await Media.saveVideo(opts);
        setStatus("Saved video from online source URL!");
    };

    return <>
        { Capacitor.getPlatform() === "ios" && <IonButton onClick={savePhotoOnlineNoAlbum}>Save Photo to Library (No Album)</IonButton> }
        <IonButton onClick={savePhotoOnline}>Save Photo from online URL</IonButton>
        <IonButton onClick={savePhotoDataURI}>Save Photo from Data URI</IonButton>
        <IonButton onClick={saveWebPDataURI}>Save WebP from Data URI</IonButton>
        <IonButton onClick={saveTakenPhoto}>Save Photo from Camera</IonButton>
        <br />
        <IonButton onClick={saveGIFOnline}>Save GIF from online URL</IonButton>
        <IonButton onClick={saveGIFDataURI}>Save GIF from Data URI</IonButton>
        <br />
        <IonButton onClick={saveVideoOnline}>Save Video from online URL</IonButton>
        <IonButton onClick={saveVideoURI}>Save Video from Data URI</IonButton>
        <IonButton onClick={saveTakenVideo}>Save Previously Taken Video</IonButton>
        <p>{ status }</p>
    </>;
};

export default SaveMedia;