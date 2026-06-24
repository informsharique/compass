import { Presets } from "react-native-pulsar";
import { Platform } from "react-native";
import { isHapticFeedbackEnabled } from "../../../modules/system-haptic";

export const triggerHaptics = () => {
	try {
		if (!isHapticFeedbackEnabled()) {
			return;
		}
	} catch (error) {
		console.warn("Failed to check if haptic feedback is enabled:", error);
	}

	if (Platform.OS === "android") {
		Presets.System.Android.effectClick();
		return;
	}
	Presets.System.impactMedium();
};

