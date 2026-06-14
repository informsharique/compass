import React from "react";
import { View } from "react-native";
import { Button } from "heroui-native/button";
import { Typography } from "heroui-native/text";
import { applyAlpha } from "@/presentation/utils/color-helper";
import { triggerHaptics } from "@/presentation/utils/haptic-helper";
import { useThemeColor } from "heroui-native/hooks";

interface CalibrationButtonProps {
	calibrated: boolean;
	onPress: () => void;
}

export const CalibrationButton: React.FC<CalibrationButtonProps> = ({ calibrated, onPress }) => {
	const [success, danger] = useThemeColor(["success", "danger"]);

	const handlePress = () => {
		triggerHaptics();
		onPress();
	};

	return (
		<View className="w-full max-w-sm mx-auto justify-center min-h-[56px] mb-4">
			{calibrated ? (
				<View className="flex-row items-center justify-between w-full px-4 gap-4">
					<View className="flex-row items-center flex-1">
						<View className="w-2 h-2 rounded-full mr-2 bg-success/75" />
						<Typography className="font-medium text-muted text-sm">
							Your Phone sensor accuracy is good
						</Typography>
					</View>
					<Button
						onPress={handlePress}
						variant="ghost"
						size="sm"
						animation={{
							scale: {
								value: 1,
							},
						}}
						android_ripple={{
							color: applyAlpha(success, "10%"),
							foreground: true,
						}}
						className="border-transparent bg-transparent py-1.5 px-3 rounded-xl"
					>
						<Button.Label className="font-semibold text-sm text-success/75">
							Calibrate
						</Button.Label>
					</Button>
				</View>
			) : (
				<View className="flex-row items-center justify-between w-full px-4 gap-4">
					<Typography className="text-muted text-sm font-normal flex-1">
						Let&apos;s get your compass pointing in the right direction.
					</Typography>
					<Button
						onPress={handlePress}
						variant="ghost"
						size="sm"
						animation={{
							scale: {
								value: 1,
							},
						}}
						android_ripple={{
							color: applyAlpha(danger, "10%"),
							foreground: true,
						}}
						className="border-transparent bg-transparent py-1.5 px-3 rounded-xl"
					>
						<View className="w-2 h-2 rounded-full mr-1.5 animate-pulse bg-danger/75" />
						<Button.Label className="font-bold text-sm text-danger/75">
							Calibrate
						</Button.Label>
					</Button>
				</View>
			)}
		</View>
	);
};
