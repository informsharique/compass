package expo.modules.systemhaptic

import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SystemHapticModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("SystemHaptic")

    Function("isHapticFeedbackEnabled") {
      val context = appContext.reactContext ?: return@Function false
      val contentResolver = context.contentResolver
      Settings.System.getInt(contentResolver, Settings.System.HAPTIC_FEEDBACK_ENABLED, 0) != 0
    }
  }
}
