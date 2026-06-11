import * as Haptics from 'expo-haptics';

export const triggerHapticSelection = () => {
  Haptics.selectionAsync().catch(() => {});
};

export const triggerHapticImpact = (style = Haptics.ImpactFeedbackStyle.Light) => {
  Haptics.impactAsync(style).catch(() => {});
};

export const triggerHapticNotification = (type = Haptics.NotificationFeedbackType.Success) => {
  Haptics.notificationAsync(type).catch(() => {});
};
