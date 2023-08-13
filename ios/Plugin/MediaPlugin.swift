import Foundation
import Photos
import Capacitor
import SDWebImage

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
            call.reject("Access to photos not allowed by user")
        })
    }

    @objc func getMedias(_ call: CAPPluginCall) {
        checkAuthorization(permission: .readWrite, allowed: {
            self.fetchResultAssetsToJs(call)
        }, notAllowed: {
            call.reject("Access to photos not allowed by user")
        })
    }

    @objc func createAlbum(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.reject("Must provide a name")
            return
        }

        checkAuthorization(permission: .readWrite, allowed: {
            PHPhotoLibrary.shared().performChanges({
                PHAssetCollectionChangeRequest.creationRequestForAssetCollection(withTitle: name)
            }, completionHandler: { success, error in
                if !success {
                    call.reject("Unable to create album")
                    return
                }
                call.resolve()
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user")
        })
    }

    @objc func savePhoto(_ call: CAPPluginCall) {
        guard let data = call.getString("path") else {
            call.reject("Must provide the data path")
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
                call.reject("Unable to find that album")
                return
            }
            if !targetCollection!.canPerform(.addContent) {
                call.reject("Album doesn't support adding content (is this a smart album?)")
                return
            }
        }

        checkAuthorization(permission: .addOnly, allowed: {
            // Add it to the photo library.
            var image: UIImage? = nil;
            let url = URL(string: data)
            var data = try? Data(contentsOf: url!)
            let mutableData = NSMutableData() // Output data buffer
            if (data != nil) {
                // Get image metadata
                let imgSource = CGImageSourceCreateWithData(data! as CFData, .none)
                if (imgSource == nil) {
                    call.reject("Loading image data failed!")
                    return
                }
                
                let metadata = CGImageSourceCopyPropertiesAtIndex(imgSource!, 0, .none)
                
                // Convert image to PNG
                image = UIImage(data: data!)
                data = image?.sd_imageData(as: .PNG)
                if (data != nil) {
                    image = UIImage(data: data!)
                } else {
                    call.reject("Image conversion to PNG failed!")
                    return
                }
                
                // Create data buffer with image and metadata
                let imgDest = CGImageDestinationCreateWithData(mutableData as CFMutableData, "public.png" as CFString, 1, nil)
                if (imgDest == nil) {
                    call.reject("Creating output image data buffer failed!")
                    return
                }
                
                CGImageDestinationAddImage(imgDest!, image!.cgImage!, metadata)
                let finished = CGImageDestinationFinalize(imgDest!)
                if (!finished) {
                    call.reject("Saving output image failed!")
                    return
                }
            } else {
                call.reject("Could not convert fileURL into Data");
                return
            }
            
            PHPhotoLibrary.shared().performChanges({
                let creationRequest = PHAssetCreationRequest.forAsset()
                creationRequest.addResource(with: .photo, data: mutableData as Data, options: .none)

                if let collection = targetCollection {
                    let addAssetRequest = PHAssetCollectionChangeRequest(for: collection)
                    addAssetRequest?.addAssets([creationRequest.placeholderForCreatedAsset! as Any] as NSArray)
                }
            }, completionHandler: {success, error in
                if !success {
                    call.reject("Unable to save image to album")
                } else {
                    call.resolve()
                }
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user")
        })

    }

    @objc func saveVideo(_ call: CAPPluginCall) {
        guard let data = call.getString("path") else {
            call.reject("Must provide the data path")
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
                call.reject("Unable to find that album")
                return
            }
            if !targetCollection!.canPerform(.addContent) {
                call.reject("Album doesn't support adding content (is this a smart album?)")
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
            PHPhotoLibrary.shared().performChanges({
                let creationRequest = PHAssetChangeRequest.creationRequestForAssetFromVideo(atFileURL: fileURL! as URL)

                if let collection = targetCollection {
                    let addAssetRequest = PHAssetCollectionChangeRequest(for: collection)
                    addAssetRequest?.addAssets([creationRequest?.placeholderForCreatedAsset! as Any] as NSArray)
                }
            }, completionHandler: {success, error in
                if !success {
                    call.reject("Unable to save video to album")
                } else {
                    //TODO: return fileUri
                    call.resolve()
                }
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user")
        })

    }

    @objc func saveGif(_ call: CAPPluginCall) {
        guard let data = call.getString("path") else {
            call.reject("Must provide the data path")
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
                call.reject("Unable to find that album")
                return
            }
            if !targetCollection!.canPerform(.addContent) {
                call.reject("Album doesn't support adding content (is this a smart album?)")
                return
            }
        }

        checkAuthorization(permission: .addOnly, allowed: {
            // Write to a temp location first if not on disk -- required for playable GIFs
            var fileURL = URL(string: data)
            if !data.starts(with: "file://") {
                let directory = NSTemporaryDirectory()
                let fileName = NSUUID().uuidString + ".gif"
                fileURL = NSURL.fileURL(withPathComponents: [directory, fileName])
                
                let url = URL(string: data)
                let data = try! Data(contentsOf: url!)
                try! data.write(to: fileURL!)
            }
            
            // Add it to the photo library.
            PHPhotoLibrary.shared().performChanges({
                let creationRequest = PHAssetChangeRequest.creationRequestForAssetFromImage(atFileURL: fileURL! as URL)

                if let collection = targetCollection {
                    let addAssetRequest = PHAssetCollectionChangeRequest(for: collection)
                    addAssetRequest?.addAssets([creationRequest?.placeholderForCreatedAsset! as Any] as NSArray)
                }

            }, completionHandler: {success, error in
                if !success {
                    call.reject("Unable to save gif to album")
                } else {
                    //TODO: return fileUri
                    call.resolve()
                }
            })
        }, notAllowed: {
            call.reject("Access to photos not allowed by user")
        })
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

        //let after = call.getString("after")

        let types = call.getString("types") ?? MediaPlugin.DEFAULT_TYPES
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

            if asset.mediaType == .image && types == "videos" {
                return
            }
            if asset.mediaType == .video && types == "photos" {
                return
            }

            var a = JSObject()

            self.imageManager.requestImage(for: asset, targetSize: thumbnailSize, contentMode: .aspectFill, options: requestOptions, resultHandler: { (fetchedImage, _) in
                guard let image = fetchedImage else {
                    return
                }

                a["identifier"] = asset.localIdentifier

                // TODO: We need to know original type
                a["data"] = image.jpegData(compressionQuality: CGFloat(thumbnailQuality) / 100.0)?.base64EncodedString()

                if asset.creationDate != nil {
                    a["creationDate"] = JSDate.toString(asset.creationDate!)
                }
                a["fullWidth"] = asset.pixelWidth
                a["fullHeight"] = asset.pixelHeight
                a["thumbnailWidth"] = image.size.width
                a["thumbnailHeight"] = image.size.height
                a["location"] = self.makeLocation(asset)

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
