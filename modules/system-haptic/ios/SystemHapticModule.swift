import ExpoModulesCore

public class SystemHapticModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SystemHaptic")

    Function("isHapticFeedbackEnabled") { () -> Bool in
      return true
    }
  }
}
