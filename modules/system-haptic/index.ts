import SystemHapticModule from './src/SystemHapticModule';

export function isHapticFeedbackEnabled(): boolean {
  try {
    return SystemHapticModule.isHapticFeedbackEnabled();
  } catch (e) {
    console.warn("Failed to read system haptic settings: ", e);
    return true;
  }
}
