// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorCommunityMedia",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorCommunityMedia",
            targets: ["MediaPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/SDWebImage/SDWebImage.git", from: "5.1.0")
    ],
    targets: [
        .target(
            name: "MediaPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "SDWebImage", package: "SDWebImage")
            ],
            path: "ios/Sources/MediaPlugin"),
        .testTarget(
            name: "MediaPluginTests",
            dependencies: ["MediaPlugin"],
            path: "ios/Tests/MediaPluginTests")
    ]
)