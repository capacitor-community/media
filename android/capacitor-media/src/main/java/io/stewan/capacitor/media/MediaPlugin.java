package io.stewan.capacitor.media;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import android.provider.MediaStore;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.Date;


@NativePlugin(permissions = {
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.WRITE_EXTERNAL_STORAGE
})
public class MediaPlugin extends Plugin {

    // @todo
    @PluginMethod()
    public void getMedias(PluginCall call) {
        call.unimplemented();
    }

    @PluginMethod()
    public void getAlbums(PluginCall call) {
        Log.d("DEBUG LOG", "GET ALBUMS");
        if (hasPermission(Manifest.permission.READ_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSIONS");
            _getAlbums(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.READ_EXTERNAL_STORAGE, 1986);
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
            Log.d("DEBUG LOG", "HAS PERMISSIONS");
            _createAlbum(call);
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, 1986);
        }
    }

    private void _createAlbum(PluginCall call) {
        Log.d("DEBUG LOG", "___CREATE ALBUM");
        String folderName = call.getString("name");
        String folder = Environment.getExternalStorageDirectory() + "/" + folderName;

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
        Log.d("DEBUG LOG", "SAVE VIDEO TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSIONS");
            _saveMedia(call, "PICTURES");
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, 1986);
        }
    }

    @PluginMethod()
    public void saveVideo(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE VIDEO TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSIONS");
            _saveMedia(call, "MOVIES");
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, 1986);
        }
    }


    @PluginMethod()
    public void saveGif(PluginCall call) {
        Log.d("DEBUG LOG", "SAVE GIF TO ALBUM");
        if (hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
            Log.d("DEBUG LOG", "HAS PERMISSIONS");
            _saveMedia(call, "PICTURES");
        } else {
            Log.d("DEBUG LOG", "NOT ALLOWED");
            saveCall(call);
            pluginRequestPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, 1986);
        }
    }


    private void _saveMedia(PluginCall call, String destination) {
        String dest;
        if (destination == "MOVIES") {
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
        File albumDir = Environment.getExternalStoragePublicDirectory(dest);
        if (album != null) {
            albumDir = new File(albumDir, album);
        }

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
        File newFile = new File(albumDir, "IMG_" + timeStamp + "." + extension);

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


    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);

        if (savedLastCall == null) {
            Log.d(getLogTag(), "No stored plugin call for permissions request result");
            return;
        }

        for (int r : grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                Log.d(getLogTag(), "Permission not granted by the user");
                savedLastCall.reject("Permission denied");
                return;
            }
        }

        if (requestCode == 9800) {
            // doWhatever(savedLastCall);
        }

        savedLastCall = null;
    }
}