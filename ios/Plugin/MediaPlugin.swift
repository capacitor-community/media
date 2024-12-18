import Foundation
import Photos
import Capacitor
import SDWebImage
import CoreServices

public class JSDate {
    static func toString(_ date: Date) -> String {
        let formatter = ISO8601DateFormatter()
        return formatter.string(from: date)
    }
}

enum AccessLevel {
    case addOnly
    case readWrite
}

let EC_ACCESS_DENIED = "accessDenied";
let EC_ARG_ERROR = "argumentError";
let EC_DOWNLOAD_ERROR = "downloadError";
let EC_FS_ERROR = "filesystemError";

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(MediaPlugin)
public class MediaPlugin: CAPPlugin {
    typealias JSObject = [String:Any]
    static let DEFAULT_QUANTITY = 25
    static let DEFAULT_TYPES = "photos"
    static let DEFAULT_THUMBNAIL_WIDTH = 256
    static let DEFAULT_THUMBNAIL_HEIGHT = 256

    // Must be lazy here because it will prompt for permissions on instantiation without it
    lazy var imageManager = PHCachingImageManager()

    @objc func getAlbums(_ call: CAPPluginCall) {
        checkAuthorization(permission: .readWrite, allowed: {
            self.fetchAlbumsToJs(call)
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })
    }

    @objc func getMedias(_ call: CAPPluginCall) {
        checkAuthorization(permission: .readWrite, allowed: {
            self.fetchResultAssetsToJs(call)
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })
    }

    @objc func getMediaByIdentifier(_ call: CAPPluginCall) {
        checkAuthorization(permission: .readWrite, allowed: {
            guard let identifier = call.getString("identifier") else {
                call.reject("Must provide an identifier", EC_ARG_ERROR)
                return
            }

            let fetchResult = PHAsset.fetchAssets(withLocalIdentifiers: [identifier], options: nil)
            guard let asset = fetchResult.firstObject else {
                call.reject("Asset with given identifier not found", EC_ARG_ERROR)
                return
            }

            if asset.mediaType == .image {
                let requestOptions = PHImageRequestOptions()
                requestOptions.isNetworkAccessAllowed = true
                PHImageManager.default().requestImageDataAndOrientation(for: asset, options: requestOptions) { imageData, uti, _, _ in
                    guard let imageData = imageData else {
                        call.reject("Failed to get image data for identifier", EC_ARG_ERROR)
                        return
                    }

                    var ext = "png" // default extension
                    // Get extension from UTI
                    if let uti = uti {
                       ext = UTTypeCopyPreferredTagWithClass(uti as CFString, kUTTagClassFilenameExtension)?.takeRetainedValue() as String? ?? ext
                    }

                    // Create path and save image
                    let fileURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0].appendingPathComponent("image-\(Int.random(in: 0...100000)).\(ext)")
                    do {
                        try imageData.write(to: fileURL)
                        var ret = JSObject()
                        ret["identifier"] = identifier
                        ret["path"] = fileURL.absoluteString
                        call.resolve(ret)
                    } catch {
                        call.reject("Failed to save image to disk", EC_FS_ERROR)
                    }
                }
            } else if asset.mediaType == .video {
                let requestOptions = PHVideoRequestOptions()
                requestOptions.isNetworkAccessAllowed = true
                PHImageManager.default().requestAVAsset(forVideo: asset, options: requestOptions) { (avAsset, _, _) in
                    guard let videoAsset = avAsset as? AVURLAsset else {
                        call.reject("Failed to get video data for identifier", EC_ARG_ERROR)
                        return
                    }

                    let videoData = try? Data(contentsOf: videoAsset.url)
                    guard let videoData = videoData else {
                        call.reject("Failed to extract video data for identifier", EC_FS_ERROR)
                        return
                    }
                    let ext = videoAsset.url.pathExtension

                    // Create path and save video data
                    let fileURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0].appendingPathComponent("video-\(Int.random(in: 0...100000)).\(ext)")
                    do {
                        try videoData.write(to: fileURL)
                        var ret = JSObject()
                        ret["identifier"] = identifier
                        ret["path"] = fileURL.absoluteString
                        call.resolve(ret)
                    } catch {
                        call.reject("Failed to save video to disk", EC_FS_ERROR)
                    }
                }
            } else {
                call.reject("Asset type is not a photo or video.", EC_ARG_ERROR)
            }
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })
    }

    @objc func createAlbum(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.reject("Must provide a name", EC_ARG_ERROR)
            return
        }

        checkAuthorization(permission: .readWrite, allowed: {
            PHPhotoLibrary.shared().performChanges({
                PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: name)
            }, completionHandler: { success, error in
                if !success {
                    call.reject("Unable to create album: \(error?.localizedDescription ?? "Unknown error")", EC_FS_ERROR)
                    return
                }
                call.resolve()
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })
    }

    @objc func savePhoto(_ call: CAPPluginCall) {
        guard let data = call.getString("path") else {
            call.reject("Must provide the data path", EC_ARG_ERROR)
            return
        }

        let albumId = call.getString("albumIdentifier")
        var targetCollection: PHAssetCollection?

        if albumId != nil {
            let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumId!], options: nil)
            albumFetchResult.enumerateObjects({ (collection, count, _) in
                targetCollection = collection
            })
            if targetCollection == nil {
                call.reject("Unable to find that album", EC_ARG_ERROR)
                return
            }
            if !targetCollection!.canPerform(.addContent) {
                call.reject("Album doesn't support adding content (is this a smart album?)", EC_ARG_ERROR)
                return
            }
        }

        checkAuthorization(permission: .addOnly, allowed: {
            // Add it to the photo library.
            let imageUrl = URL(string: data)
            let downloaderOptions: SDWebImageDownloaderOptions = [.ignoreCachedResponse]

            SDWebImageDownloader.shared.downloadImage(with: imageUrl, options: downloaderOptions, progress: nil) { (image, data, error, finished) in
                guard let imageData = data, finished else {
                   call.reject("Unable to download image from URL", EC_DOWNLOAD_ERROR)
                   return
                }

                var createdIdentifer = ""
                PHPhotoLibrary.shared().performChanges({
                    let creationRequest = PHAssetCreationRequest.forAsset()
                    creationRequest.addResource(with: .photo, data: imageData as Data, options: .none)
                    createdIdentifer = creationRequest.placeholderForCreatedAsset!.localIdentifier

                    if let collection = targetCollection {
                        let addAssetRequest = PHAssetCollectionChangeRequest(for: collection)
                        addAssetRequest!.addAssets([creationRequest.placeholderForCreatedAsset! as Any] as NSArray)
                    }
                }, completionHandler: {success, error in
                    if !success {
                        call.reject("Unable to save image to album", EC_FS_ERROR)
                    } else {
                        var ret = JSObject()
                        ret["identifier"] = createdIdentifer
                        call.resolve(ret)
                    }
                })
           }
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })

    }

    @objc func saveVideo(_ call: CAPPluginCall) {
        guard let data = call.getString("path") else {
            call.reject("Must provide the data path", EC_ARG_ERROR)
            return
        }

        let albumId = call.getString("albumIdentifier")
        var targetCollection: PHAssetCollection?

        if albumId != nil {
            let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumId!], options: nil)
            albumFetchResult.enumerateObjects({ (collection, count, _) in
                targetCollection = collection
            })
            if targetCollection == nil {
                call.reject("Unable to find that album", EC_ARG_ERROR)
                return
            }
            if !targetCollection!.canPerform(.addContent) {
                call.reject("Album doesn't support adding content (is this a smart album?)", EC_ARG_ERROR)
                return
            }
        }

        checkAuthorization(permission: .addOnly, allowed: {
            var fileURL = URL(string: data)
            if !data.starts(with: "file://") {
                let directory = NSTemporaryDirectory()
                var ext = "";
                if data.starts(with: "data:") {
                    ext = "." + data.split(separator: ";")[0].split(separator: "/")[1];
                } else {
                    ext = String(data[data.lastIndex(of: ".")!...])
                }
                let fileName = NSUUID().uuidString + ext;
                fileURL = NSURL.fileURL(withPathComponents: [directory, fileName])
                
                let url = URL(string: data)
                let data = try! Data(contentsOf: url!)
                try! data.write(to: fileURL!)
            }
            
            // Add it to the photo library.
            var createdIdentifier = "";
            PHPhotoLibrary.shared().performChanges({
                let creationRequest = PHAssetChangeRequest.creationRequestForAssetFromVideo(atFileURL: fileURL! as URL)
                createdIdentifier = creationRequest!.placeholderForCreatedAsset!.localIdentifier

                if let collection = targetCollection {
                    let addAssetRequest = PHAssetCollectionChangeRequest(for: collection)
                    addAssetRequest!.addAssets([creationRequest?.placeholderForCreatedAsset! as Any] as NSArray)
                }
            }, completionHandler: {success, error in
                if !success {
                    call.reject("Unable to save video to album", EC_FS_ERROR)
                } else {
                    var ret = JSObject()
                    ret["identifier"] = createdIdentifier
                    call.resolve(ret)
                }
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user", EC_ACCESS_DENIED)
        })
    }
        
    @objc func getAlbumsPath(_ call: CAPPluginCall) {
        call.unimplemented("Not implemented on iOS.")
    }
    
    @available(iOS 14, *)
    func getPHAccessLevel(permission: AccessLevel) -> PHAccessLevel {
        switch (permission) {
        case .addOnly:
            return PHAccessLevel.addOnly
        case .readWrite:
            return PHAccessLevel.readWrite
        }
    }

    func checkAuthorization(permission: AccessLevel, allowed: @escaping () -> Void, notAllowed: @escaping () -> Void) {
        var status = PHAuthorizationStatus.notDetermined
        if #available(iOS 14, *) {
            status = PHPhotoLibrary.authorizationStatus(for: getPHAccessLevel(permission: permission))
        } else {
            status = PHPhotoLibrary.authorizationStatus()
        }
        
        if status == PHAuthorizationStatus.authorized {
            allowed()
        } else {
            let handler = { (newStatus) in
                if newStatus == PHAuthorizationStatus.authorized {
                    allowed()
                } else {
                    notAllowed()
                }
            }
            
            if #available(iOS 14, *) {
                PHPhotoLibrary.requestAuthorization(for: getPHAccessLevel(permission: permission), handler: handler)
            } else {
                PHPhotoLibrary.requestAuthorization(handler)
            }
        }
    }

    func fetchAlbumsToJs(_ call: CAPPluginCall) {
        var albums = [JSObject]()

        let loadSharedAlbums = call.getBool("loadShared", false)

        // Load our smart albums
        var fetchResult = PHAssetCollection.fetchAssetCollections(with: .smartAlbum, subtype: .albumRegular, options: nil)
        fetchResult.enumerateObjects({ (collection, count, stop: UnsafeMutablePointer<ObjCBool>) in
            var o = JSObject()
            o["name"] = collection.localizedTitle
            o["identifier"] = collection.localIdentifier
            o["type"] = "smart"
            albums.append(o)
        })

        if loadSharedAlbums {
            fetchResult = PHAssetCollection.fetchAssetCollections(with: .album, subtype: .albumCloudShared, options: nil)
            fetchResult.enumerateObjects({ (collection, count, stop: UnsafeMutablePointer<ObjCBool>) in
                var o = JSObject()
                o["name"] = collection.localizedTitle
                o["identifier"] = collection.localIdentifier
                o["type"] = "shared"
                albums.append(o)
            })
        }

        // Load our user albums
        PHCollectionList.fetchTopLevelUserCollections(with: nil).enumerateObjects({ (collection, count, stop: UnsafeMutablePointer<ObjCBool>) in
            var o = JSObject()
            o["name"] = collection.localizedTitle
            o["identifier"] = collection.localIdentifier
            o["type"] = "user"
            albums.append(o)
        })

        call.resolve([
            "albums": albums
            ])
    }

    func fetchResultAssetsToJs(_ call: CAPPluginCall) {
        var assets: [JSObject] = []

        let albumId = call.getString("albumIdentifier")

        let quantity = call.getInt("quantity", MediaPlugin.DEFAULT_QUANTITY)

        var targetCollection: PHAssetCollection?

        let options = PHFetchOptions()
        options.fetchLimit = quantity
        
        let types = call.getString("types") ?? MediaPlugin.DEFAULT_TYPES
        if types == "photos" {
            options.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.image.rawValue)
        } else if types == "videos" {
            options.predicate = NSPredicate(format: "mediaType == %d", PHAssetMediaType.video.rawValue)
        } else if types == "all" {
            options.predicate = NSPredicate(format: "(mediaType == %d) || (mediaType == %d)", argumentArray: [PHAssetMediaType.image.rawValue, PHAssetMediaType.video.rawValue])
        }
        
        // Set sort
        var sortDescriptors = [] as [NSSortDescriptor];
        
        // Handle when sort is string
        if call.getString("sort") != nil {
            let key = call.getString("sort") ?? "creationDate"
            sortDescriptors.append(NSSortDescriptor(key: key, ascending: false))
        }
        // Handle when sort is an array
        else if let sortArray = call.getArray("sort") as? [[String: Any]] {
            for object in sortArray {
        
                // Should have at least key for array value
                if let key = object["key"] as? String {
                    let ascending = object["ascending"] as? Bool ?? false
                    sortDescriptors.append(NSSortDescriptor(key: key, ascending: ascending))
                }
            }
        }
        
        // Check if sort descriptors is empty
        // it can happen because of validations inside the previous if, in this case, set a default value
        if sortDescriptors.isEmpty {
            sortDescriptors.append(NSSortDescriptor(key: "creationDate", ascending: false))
        }
        
        // Set sort descriptors
        options.sortDescriptors = sortDescriptors

        if albumId != nil {
            let albumFetchResult = PHAssetCollection.fetchAssetCollections(withLocalIdentifiers: [albumId!], options: nil)
            albumFetchResult.enumerateObjects({ (collection, count, _) in
                targetCollection = collection
            })
        }

        var fetchResult: PHFetchResult<PHAsset>;
        if targetCollection != nil {
            fetchResult = PHAsset.fetchAssets(in: targetCollection!, options: options)
        } else {
            fetchResult = PHAsset.fetchAssets(with: options)
        }

        let thumbnailWidth = call.getInt("thumbnailWidth", MediaPlugin.DEFAULT_THUMBNAIL_WIDTH)
        let thumbnailHeight = call.getInt("thumbnailHeight", MediaPlugin.DEFAULT_THUMBNAIL_HEIGHT)
        let thumbnailSize = CGSize(width: thumbnailWidth, height: thumbnailHeight)
        let thumbnailQuality = call.getInt("thumbnailQuality", 95)
        let requestOptions = PHImageRequestOptions()
        requestOptions.isNetworkAccessAllowed = true
        requestOptions.version = .current
        requestOptions.deliveryMode = .opportunistic
        requestOptions.isSynchronous = true

        fetchResult.enumerateObjects({ (asset, count: Int, stop: UnsafeMutablePointer<ObjCBool>) in
            var a = JSObject()

            self.imageManager.requestImage(for: asset, targetSize: thumbnailSize, contentMode: .aspectFill, options: requestOptions, resultHandler: { (fetchedImage, _) in
                guard let image = fetchedImage else {
                    return
                }

                a["identifier"] = asset.localIdentifier

                a["data"] = image.jpegData(compressionQuality: CGFloat(thumbnailQuality) / 100.0)?.base64EncodedString()

                if asset.creationDate != nil {
                    a["creationDate"] = JSDate.toString(asset.creationDate!)
                }
                a["duration"] = asset.mediaType == .video ? asset.duration : nil
                a["fullWidth"] = asset.pixelWidth
                a["fullHeight"] = asset.pixelHeight
                a["thumbnailWidth"] = image.size.width
                a["thumbnailHeight"] = image.size.height
                a["location"] = self.makeLocation(asset)
                a["type"] = asset.mediaType == .image ? "photo" : "video"

                assets.append(a)
            })
        })

        call.resolve([
            "medias": assets
            ])
    }


    func makeLocation(_ asset: PHAsset) -> JSObject {
        var loc = JSObject()
        guard let location = asset.location else {
            return loc
        }

        loc["latitude"] = location.coordinate.latitude
        loc["longitude"] = location.coordinate.longitude
        loc["altitude"] = location.altitude
        loc["heading"] = location.course
        loc["speed"] = location.speed
        return loc
    }
}
