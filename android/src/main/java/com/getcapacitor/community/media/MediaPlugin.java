package com.getcapacitor.community.media;

import android.Manifest;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.SystemClock;
import android.util.Base64;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Logger;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@CapacitorPlugin(
    name = "Media",
    permissions = {
        @Permission(
            strings = { Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE },
            alias = "publicStorage"
        ),
        @Permission(
            strings = { Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO },
            alias = "publicStorage13Plus"
        )
    }
)
public class MediaPlugin extends Plugin {

    private static final String PERMISSION_DENIED_ERROR = "Unable to access media, user denied permission request";

    private static final int API_LEVEL_29 = 29;
    private static final int API_LEVEL_33 = 33;

    // @todo
    @PluginMethod
    public void getMedias(PluginCall call) {
        call.unimplemented();
    }

    @PluginMethod
    public void getAlbums(PluginCall call) {
        Log.d("DEBUG LOG", "GET ALBUMS");
        if (isStoragePermissionGranted()) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _getAlbums(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            this.bridge.saveCall(call);
            requestAllPermissions(call, "permissionCallback");
        }
    }

    @PluginMethod
    public void savePhoto(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE PHOTO TO ALBUM");
        if (isStoragePermissionGranted()) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            this.bridge.saveCall(call);
            requestAllPermissions(call, "permissionCallback");
            Log.d("DEBUG LOG", "___SAVE PHOTO TO ALBUM AFTER PERMISSION REQUEST");
        }
    }

    @PluginMethod
    public void saveVideo(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE VIDEO TO ALBUM");
        if (isStoragePermissionGranted()) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            this.bridge.saveCall(call);
            requestAllPermissions(call, "permissionCallback");
        }
    }

    @PluginMethod
    public void saveGif(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE GIF TO ALBUM");
        if (isStoragePermissionGranted()) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _saveMedia(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            this.bridge.saveCall(call);
            requestAllPermissions(call, "permissionCallback");
        }
    }

    @PluginMethod
    public void createAlbum(PluginCall call) {
        Log.d("DEBUG LOG", "CREATE ALBUM");
        if (isStoragePermissionGranted()) {
            Log.d("DEBUG LOG", "HAS PERMISSION");
            _createAlbum(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            this.bridge.saveCall(call);
            requestAllPermissions(call, "permissionCallback");
        }
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        if (!isStoragePermissionGranted()) {
            Logger.debug(getLogTag(), "User denied storage permission");
            call.reject("Unable to do file operation, user denied permission request");
            return;
        }

        switch (call.getMethodName()) {
            case "getMedias" -> call.unimplemented();
            case "getAlbums" -> _getAlbums(call);
            case "savePhoto", "saveVideo", "saveGif" -> _saveMedia(call);
            case "createAlbum" -> _createAlbum(call);
        }
    }

    private boolean isStoragePermissionGranted() {
        String permissionSet = "publicStorage";
        if (Build.VERSION.SDK_INT >= API_LEVEL_33) {
            permissionSet = "publicStorage13Plus";
        }

        return getPermissionState(permissionSet) == PermissionState.GRANTED;
    }

    private void _getAlbums(PluginCall call) {
        Log.d("DEBUG LOG", "___GET ALBUMS");

        JSObject response = new JSObject();
        JSArray albums = new JSArray();
        Set<String> bucketIds = new HashSet<String>();
        Set<String> identifiers = new HashSet<String>();

        String[] projection = new String[] {
            MediaStore.MediaColumns.BUCKET_DISPLAY_NAME,
            MediaStore.MediaColumns.BUCKET_ID,
            MediaStore.MediaColumns.DATA
        };
        Cursor[] curs = {
            getActivity().getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, projection, null, null, null),
            getActivity().getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, projection, null, null, null)
        };

        for (Cursor cur : curs) {
            while (cur.moveToNext()) {
                String albumName = cur.getString((cur.getColumnIndex(MediaStore.MediaColumns.BUCKET_DISPLAY_NAME)));
                String bucketId = cur.getString((cur.getColumnIndex(MediaStore.MediaColumns.BUCKET_ID)));

                if (!bucketIds.contains(bucketId)) {
                    String path = cur.getString((cur.getColumnIndex(MediaStore.MediaColumns.DATA)));
                    File fileForPath = new File(path);
                    JSObject album = new JSObject();

                    album.put("name", albumName);
                    album.put("identifier", fileForPath.getParent());
                    albums.put(album);

                    bucketIds.add(bucketId);
                    identifiers.add(fileForPath.getParent());
                }
            }

            cur.close();
        }

        File albumPath = new File(_getAlbumsPath());
        for (File sub : albumPath.listFiles()) {
            if (sub.isDirectory() && !identifiers.contains(sub.getAbsolutePath())) {
                JSObject album = new JSObject();

                album.put("name", sub.getName());
                album.put("identifier", sub.getAbsolutePath());
                identifiers.add(sub.getAbsolutePath());
                albums.put(album);
            }
        }

        response.put("albums", albums);
        Log.d("DEBUG LOG", String.valueOf(response));
        Log.d("DEBUG LOG", "___GET ALBUMS FINISHED");

        call.resolve(response);
    }

    @PluginMethod
    public void getAlbumsPath(PluginCall call) {
        JSObject data = new JSObject();
        data.put("path", _getAlbumsPath());
        call.resolve(data);
    }

    private String _getAlbumsPath() {
        if (Build.VERSION.SDK_INT >= API_LEVEL_29) {
            return getContext().getExternalMediaDirs()[0].getAbsolutePath();
        } else {
            return Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath();
        }
    }

    private void _saveMedia(PluginCall call) {
        Log.d("DEBUG LOG", "___SAVE MEDIA TO ALBUM");
        String inputPath = call.getString("path");
        if (inputPath == null) {
            call.reject("Input file path is required");
            return;
        }

        File inputFile;

        if (inputPath.startsWith("data:")) {
            try {
                String base64EncodedString = inputPath.substring(inputPath.indexOf(",") + 1);
                byte[] decodedBytes = Base64.decode(base64EncodedString, Base64.DEFAULT);
                inputFile = File.createTempFile(
                        "tmp",
                        "." + inputPath.split("/", 2)[1].split(";", 2)[0],
                        getContext().getCacheDir()
                );
                OutputStream os = new FileOutputStream(inputFile);
                os.write(decodedBytes);
                os.close();
            } catch (Exception e) {
                call.reject("Temporary file creation from data URL failed");
                return;
            }
        } else if (inputPath.startsWith("http://") || inputPath.startsWith("https://")) {
            DownloadManager manager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(inputPath));
            Uri inputUri = Uri.parse(inputPath);
            String filename = inputUri.getLastPathSegment();
            request.setDestinationInExternalFilesDir(getContext(), null, filename);

            long requestID = manager.enqueue(request);
            Uri result = null;
            while (result == null) {
                SystemClock.sleep(100);
                result = manager.getUriForDownloadedFile(requestID);
            }

            final Cursor cursor = manager.query(new DownloadManager.Query().setFilterById(requestID));
            cursor.moveToFirst();
            inputPath = cursor.getString(cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI));
            try {
                Uri downloadsUri = Uri.parse(inputPath);
                File fileInDownloads = new File(downloadsUri.getPath());
                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmssSSS").format(new Date());
                inputFile = copyFile(fileInDownloads, getContext().getCacheDir(), "IMG_" + timeStamp);
                fileInDownloads.delete();
                cursor.close();
            } catch (RuntimeException e) {
                call.reject("RuntimeException occurred", e);
                return;
            }
        } else {
            Uri inputUri = Uri.parse(inputPath);
            inputFile = new File(inputUri.getPath());
        }

        String album = call.getString("albumIdentifier");
        File albumDir = null;
        Log.d("SDK BUILD VERSION", String.valueOf(Build.VERSION.SDK_INT));

        if (album != null) {
            albumDir = new File(album);
        } else {
            call.error("Album identifier required");
            return;
        }

        if (!albumDir.exists() || !albumDir.isDirectory()) {
            call.error("Album identifier does not exist, use getAlbums() to get");
            return;
        }

        Log.d("ENV LOG - ALBUM DIR", String.valueOf(albumDir));

        try {
            // generate image file name using current date and time
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmssSSS").format(new Date());
            String fileName = call.getString("fileName", "IMG_" + timeStamp);
            File expFile = copyFile(inputFile, albumDir, fileName);
            scanPhoto(expFile);

            JSObject result = new JSObject();
            result.put("filePath", expFile.toString());
            call.resolve(result);
        } catch (RuntimeException e) {
            call.reject("RuntimeException occurred", e);
            return;
        }
    }

    private void _createAlbum(PluginCall call) {
        Log.d("DEBUG LOG", "___CREATE ALBUM");
        String folderName = call.getString("name");

        if (folderName == null) {
            call.reject("Album name must be given!");
            return;
        }

        File f = new File(_getAlbumsPath(), folderName);

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

    private File copyFile(File inputFile, File albumDir, String fileName) {
        // if destination folder does not exist, create it
        if (!albumDir.exists()) {
            if (!albumDir.mkdir()) {
                throw new RuntimeException("Destination folder does not exist and cannot be created.");
            }
        }

        String absolutePath = inputFile.getAbsolutePath();
        String extension = absolutePath.substring(absolutePath.lastIndexOf("."));

        File newFile = new File(albumDir, fileName + extension);

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
}
