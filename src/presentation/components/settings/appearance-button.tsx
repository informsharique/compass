import type { ComponentType } from "react";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Typography } from "heroui-native/text";
import { applyAlpha } from "@/presentation/utils/color-helper";

interface AppearanceButtonProps {
	label: string;
	Icon: ComponentType<{ width: number; height: number; color: string }>;
	isActive: boolean;
	onPress: () => void;
	themeAccent: string;
	themeMuted: string;
	themeForeground: string;
}

export function AppearanceButton({
	label,
	Icon,
	isActive,
	onPress,
	themeAccent,
	themeMuted,
	themeForeground,
}: AppearanceButtonProps) {
	return (
		<PressableFeedback
			onPress={onPress}
			animation={{
				scale: {
					value: 1,
				},
			}}
			className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 bg-transparent border border-transparent"
		>
			<PressableFeedback.Ripple
				animation={{
					backgroundColor: { value: applyAlpha(themeForeground, "20%") },
				}}
			/>
			<Icon
				width={16}
				height={16}
				color={isActive ? themeAccent : themeMuted}
			/>
			<Typography
				className={`text-xs font-semibold ${
					isActive ? "text-accent" : "text-muted"
				}`}
			>
				{label}
			</Typography>
		</PressableFeedback>
	);
}
