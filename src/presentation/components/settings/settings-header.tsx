import React from "react";
import { View } from "react-native";
import { Typography } from "heroui-native/text";
import { Button } from "heroui-native/button";
import { useThemeColor } from "heroui-native/hooks";
import Svg, { Path } from "react-native-svg";
import { applyAlpha } from "@/presentation/utils/color-helper";
import { triggerHaptics } from "@/presentation/utils/haptic-helper";

interface SettingsHeaderProps {
	onClose: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onClose }) => {
	const themeForeground = useThemeColor("foreground");

	const handleClose = () => {
		triggerHaptics();
		onClose();
	};

	return (
		<View className="flex-row items-center gap-1">
			<Button
				size="sm"
				variant="ghost"
				onPress={handleClose}
				feedbackVariant="scale"
				animation={{
					scale: {
						value: 1,
					},
				}}
				android_ripple={{
					color: applyAlpha(themeForeground, "20%"),
					foreground: true,
				}}
				className="w-10 h-10 p-0 items-center justify-center rounded-full bg-surface-secondary/51 border border-border/10"
			>
				<Svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke={themeForeground}
					strokeWidth="2.5"
				>
					<Path
						d="M15 19l-7-7 7-7"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</Svg>
			</Button>
			<View className="flex-col gap-0.25">
				<Typography.Heading
					type="h2"
					className="text-xl font-bold text-foreground leading-tight"
				>
					Settings
				</Typography.Heading>
				<Typography.Paragraph className="text-zinc-500 text-sm leading-tight">
					Configure your compass preferences
				</Typography.Paragraph>
			</View>
		</View>
	);
};
