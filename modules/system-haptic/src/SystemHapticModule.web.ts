import { registerWebModule, NativeModule } from 'expo';

class SystemHapticModule extends NativeModule<{}> {
  isHapticFeedbackEnabled(): boolean {
    return true;
  }
}

export default registerWebModule(SystemHapticModule, 'SystemHaptic');
