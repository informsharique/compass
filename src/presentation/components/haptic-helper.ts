import { Presets } from "react-native-pulsar";

export const triggerHapticSelection = () => {
  try {
    Presets.System.selection();
  } catch (e) {
    console.log(e);
  }
};

export const triggerHapticImpact = () => {
  try {
    Presets.System.impactLight();
  } catch (e) {
    console.log(e);
  }
};

export const triggerHapticNotification = () => {
  try {
    Presets.System.notificationSuccess();
  } catch (e) {
    console.log(e);
  }
};

export const triggerHapticThemeChange = () => {
  try {
    Presets.ripple();
  } catch (e) {
    console.log(e);
  }
};

export const triggerHapticColorChange = () => {
  try {
    Presets.spark();
  } catch (e) {
    console.log(e);
  }
};

export const triggerHapticDesignChange = () => {
  try {
    Presets.combinationLock();
  } catch (e) {
    console.log(e);
  }
};
