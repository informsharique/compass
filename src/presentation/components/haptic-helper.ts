import { Presets } from "react-native-pulsar";
import { Platform } from "react-native";

export const triggerHaptics = () => {
	if (Platform.OS === "android") {
		Presets.System.Android.effectClick();
		return;
	}
	Presets.System.impactMedium();
};
