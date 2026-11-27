import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import AVFoundation


@main
class AppDelegate: RCTAppDelegate {

  override func application(_ application: UIApplication,
                            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    
    self.moduleName = "SocialMedia"
    self.dependencyProvider = RCTAppDependencyProvider()
    
    // Set audio session category properly in Swift
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback)
    } catch {
      print("Failed to set audio session category:", error)
    }

    self.initialProps = [:]
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func application(_ app: UIApplication,
                            open url: URL,
                            options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return super.application(app, open: url, options: options)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
