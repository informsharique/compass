import ExpoModulesCore
import CoreLocation

public class ExpoCompassModule: Module, CLLocationManagerDelegate {
  private let locationManager = CLLocationManager()
  private var isListening = false

  public func definition() -> ModuleDefinition {
    Name("ExpoCompass")

    Events("onHeadingChange")

    AsyncFunction("start") {
      if !self.isListening {
        self.locationManager.delegate = self
        self.locationManager.headingFilter = 0.1 // precise heading changes
        
        #if os(iOS)
        if CLLocationManager.headingAvailable() {
          self.locationManager.startUpdatingHeading()
          self.isListening = true
        }
        #endif
      }
    }

    AsyncFunction("stop") {
      #if os(iOS)
      if self.isListening {
        self.locationManager.stopUpdatingHeading()
        self.isListening = false
      }
      #endif
    }
  }

  public func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
    sendEvent("onHeadingChange", [
      "magneticHeading": newHeading.magneticHeading,
      "trueHeading": newHeading.trueHeading,
      "headingAccuracy": newHeading.headingAccuracy,
      "timestamp": newHeading.timestamp.timeIntervalSince1970 * 1000
    ])
  }
}
