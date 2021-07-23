package com.getcapacitor.community.media;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.Logger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.getcapacitor.community.media.MediaPluginRequestCodes.MEDIA_READ_EXTERNAL_STORAGE_PERMISSION;
import static com.getcapacitor.community.media.MediaPluginRequestCodes.MEDIA_WRITE_EXTERNAL_STORAGE_CREATE_ALBUM_PERMISSION;
import static com.getcapacitor.community.media.MediaPluginRequestCodes.MEDIA_WRITE_EXTERNAL_STORAGE_PERMISSION;
import static com.getcapacitor.community.media.MediaPluginRequestCodes.MEDIA_WRITE_EXTERNAL_STORAGE_PHOTO_PERMISSION;
import static com.getcapacitor.community.media.MediaPluginRequestCodes.MEDIA_WRITE_EXTERNAL_STORAGE_VIDEO_PERMISSION;


@NativePlugin(permissions = {
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.WRITE_EXTERNAL_STORAGE
}, requestCodes={
        MEDIA_READ_EXTERNAL_STORAGE_PERMISSION,
        MEDIA_WRITE_EXTERNAL_STORAGE_PHOTO_PERMISSION,
        MEDIA_WRITE_EXTERNAL_STORAGE_VIDEO_PERMISSION,
        MEDIA_WRITE_EXTERNAL_STORAGE_CREATE_ALBUM_PERMISSION,
        MEDIA_WRITE_EXTERNAL_STORAGE_PERMISSION
})
public class MediaPlugin extends Plugin {

    private static final String PERMISSION_DENIED_ERROR = "Unable to access media, user denied permission request";

    private static final String MOVIES = "MOVIES";
    private static final String PICTURES = "PICTURES";

    private static final Integer API_LEVEL_29 = 29;

    // @todo
    @PluginMethod()
    public void getMedias(PluginCall call) {
        call.unimplemented();
    }

    @PluginMethod()
    public void getAlbums(PluginCall call) {
        Log.d("DEBUG LOG", "GET ALBUMS");
        if (hasPermission(Manifest.permission.READ_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _getAlbums(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.READ_EXTERNAL_STORAGE, MEDIA_READ_EXTERNAL_STORAGE_PERMISSION);
        }
    }

    private void _getAlbums(PluginCall call) {
        Log.d("DEBUG LOG", "___GET ALBUMS");

        JSObject response = new JSObject();
        JSArray albums = new JSArray();
        StringBuffer list = new StringBuffer();

        String[] projection = new String[]{"DISTINCT " + MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME};
        Cursor cur = getActivity().getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, projection, null, null, null);

        while (cur.moveToNext()) {
            String albumName = cur.getString((cur.getColumnIndex(MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME)));
            JSObject album = new JSObject();

            list.append(albumName + "\n");

            album.put("name", albumName);
            albums.put(album);
        }

        response.put("albums", albums);
        Log.d("DEBUG LOG", String.valueOf(response));
        Log.d("DEBUG LOG", "___GET ALBUMS FINISHED");

        call.resolve(response);
    }


    @PluginMethod()
    public void getPhotos(PluginCall call) {
        call.unimplemented();
    }

    @PluginMethod()
    public void createAlbum(PluginCall call) {
        Log.d("DEBUG LOG", "CREATE ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _createAlbum(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, MEDIA_WRITE_EXTERNAL_STORAGE_CREATE_ALBUM_PERMISSION);
        }
    }

    private void _createAlbum(PluginCall call) {
        Log.d("DEBUG LOG", "___CREATE ALBUM");
        String folderName = call.getString("name");
        String folder;

        if (Build.VERSION.SDK_INT >= API_LEVEL_29) {
            folder = getContext().getExternalMediaDirs()[0].getAbsolutePath()+"/"+folderName;
        }else{
            folder = Environment.getExternalStoragePublicDirectory(folderName).toString();
        }

        Log.d("ENV STORAGE", folder);

        File f = new File(folder);

        if (!f.exists()) {
            if (!f.mkdir()) {
                Log.d("DEBUG LOG", "___ERROR ALBUM");
                call.error("Cant create album");
            } else {
                Log.d("DEBUG LOG", "___SUCCESS ALBUM CREATED");
                call.success();
            }
        } else {
            Log.d("DEBUG LOG", "___ERROR ALBUM ALREADY EXISTS");
            call.error("Album already exists");
        }

    }


    @PluginMethod()
    public void savePhoto(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE PHOTO TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call, PICTURES);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, MEDIA_WRITE_EXTERNAL_STORAGE_PHOTO_PERMISSION);
            Log.d("DEBUG LOG", "___SAVE PHOTO TO ALBUM AFTER PERMISSION REQUEST");
        }
    }

    @PluginMethod()
    public void saveVideo(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE VIDEO TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call, MOVIES);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, MEDIA_WRITE_EXTERNAL_STORAGE_VIDEO_PERMISSION);
        }
    }


    @PluginMethod()
    public void saveGif(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE GIF TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call, PICTURES);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, MEDIA_WRITE_EXTERNAL_STORAGE_PHOTO_PERMISSION);
        }
    }


    private void _saveMedia(PluginCall call, String destination) {
        String dest;
        if (destination == MOVIES) {
            dest = Environment.DIRECTORY_MOVIES;
        } else {
            dest = Environment.DIRECTORY_PICTURES;
        }

        Log.d("DEBUG LOG", "___SAVE MEDIA TO ALBUM");
        String inputPath = call.getString("path");
        if (inputPath == null) {
            call.reject("Input file path is required");
            return;
        }

        Uri inputUri = Uri.parse(inputPath);
        File inputFile = new File(inputUri.getPath());

        String album = call.getString("album");
        File albumDir = null;
        String albumPath;
        Log.d("SDK BUILD VERSION", String.valueOf(Build.VERSION.SDK_INT));

        if (Build.VERSION.SDK_INT >= API_LEVEL_29) {
            albumPath = getContext().getExternalMediaDirs()[0].getAbsolutePath();

        }else{
            albumPath = Environment.getExternalStoragePublicDirectory(dest).getAbsolutePath();
        }

        // Log.d("ENV LOG", String.valueOf(getContext().getExternalMediaDirs()));

        if (album != null) {
            albumDir = new File(albumPath, album);
        }else{
            call.error("album name required");
        }

        Log.d("ENV LOG - ALBUM DIR", String.valueOf(albumDir));

        try {
            File expFile = copyFile(inputFile, albumDir);
            scanPhoto(expFile);

            JSObject result = new JSObject();
            result.put("filePath", expFile.toString());
            call.resolve(result);

        } catch (RuntimeException e) {
            call.reject("RuntimeException occurred", e);
        }

    }

    private File copyFile(File inputFile, File albumDir) {

        // if destination folder does not exist, create it
        if (!albumDir.exists()) {
            if (!albumDir.mkdir()) {
                throw new RuntimeException("Destination folder does not exist and cannot be created.");
            }
        }

        String absolutePath = inputFile.getAbsolutePath();
        String extension = absolutePath.substring(absolutePath.lastIndexOf("."));

        // generate image file name using current date and time
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmssSSS").format(new Date());
        File newFile = new File(albumDir, "IMG_" + timeStamp + extension);

        // Read and write image files
        FileChannel inChannel = null;
        FileChannel outChannel = null;

        try {
            inChannel = new FileInputStream(inputFile).getChannel();
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Source file not found: " + inputFile + ", error: " + e.getMessage());
        }
        try {
            outChannel = new FileOutputStream(newFile).getChannel();
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Copy file not found: " + newFile + ", error: " + e.getMessage());
        }

        try {
            inChannel.transferTo(0, inChannel.size(), outChannel);
        } catch (IOException e) {
            throw new RuntimeException("Error transfering file, error: " + e.getMessage());
        } finally {
            if (inChannel != null) {
                try {
                    inChannel.close();
                } catch (IOException e) {
                    Log.d("SaveImage", "Error closing input file channel: " + e.getMessage());
                    // does not harm, do nothing
                }
            }
            if (outChannel != null) {
                try {
                    outChannel.close();
                } catch (IOException e) {
                    Log.d("SaveImage", "Error closing output file channel: " + e.getMessage());
                    // does not harm, do nothing
                }
            }
        }

        return newFile;
    }

    private void scanPhoto(File imageFile) {
        Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        Uri contentUri = Uri.fromFile(imageFile);
        mediaScanIntent.setData(contentUri);
        bridge.getActivity().sendBroadcast(mediaScanIntent);
    }

    @PluginMethod()
    public void hasStoragePermission(PluginCall call) {
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            call.success();
        } else {
            call.error("permission denied WRITE_EXTERNAL_STORAGE");
        }
    }

    @PluginMethod()
    public void requestStoragePermission(PluginCall call) {
        pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, MEDIA_WRITE_EXTERNAL_STORAGE_PERMISSION);
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            call.success();
        }else{
            call.error("permission denied");
        }
    }

    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);

        Logger.debug(getLogTag(),"handling request perms result");

        PluginCall savedCall = getSavedCall();

        if (savedCall == null) {
            Logger.debug(getLogTag(),"No stored plugin call for permissions request result");
            return;
        }

        for (int i = 0; i < grantResults.length; i++) {
            int result = grantResults[i];
            String perm = permissions[i];
            if(result == PackageManager.PERMISSION_DENIED) {
                Logger.debug(getLogTag(), "User denied permission: " + perm);
                savedCall.error(PERMISSION_DENIED_ERROR);
                return;
            }
        }

        switch(requestCode){
            case MEDIA_READ_EXTERNAL_STORAGE_PERMISSION: {
                _getAlbums(savedCall);
                break;
            }
            case MEDIA_WRITE_EXTERNAL_STORAGE_PHOTO_PERMISSION: {
                _saveMedia(savedCall, PICTURES);
                break;
            }
            case MEDIA_WRITE_EXTERNAL_STORAGE_VIDEO_PERMISSION: {
                _saveMedia(savedCall, MOVIES);
                break;
            }
            case MEDIA_WRITE_EXTERNAL_STORAGE_CREATE_ALBUM_PERMISSION: {
                _createAlbum(savedCall);
                break;
            }
        }
    }


}
