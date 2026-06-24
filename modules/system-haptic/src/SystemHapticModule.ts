import { NativeModule, requireNativeModule } from 'expo';

declare class SystemHapticModule extends NativeModule<{}> {
  isHapticFeedbackEnabled(): boolean;
}

export default requireNativeModule<SystemHapticModule>('SystemHaptic');
