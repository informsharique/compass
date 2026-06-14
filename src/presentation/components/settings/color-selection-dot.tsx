import { View } from "react-native";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import Svg, { Path } from "react-native-svg";
import { applyAlpha } from "@/presentation/utils/color-helper";
import Animated, {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { ThemeColor } from "@/domain/settings/settings-store";

interface ColorSelectionDotProps {
	color: { id: ThemeColor; name: string; hex: string };
	isSelected: boolean;
	onPress: () => void;
	resolvedAppearanceMode: string;
	themeForeground: string;
}

export function ColorSelectionDot({
	color,
	isSelected,
	onPress,
	resolvedAppearanceMode,
	themeForeground,
}: ColorSelectionDotProps) {
	const scale = useSharedValue(isSelected ? 1 : 0.6);
	const opacity = useSharedValue(isSelected ? 1 : 0);

	useAnimatedReaction(
		() => isSelected,
		(nextIsSelected) => {
			scale.value = withSpring(nextIsSelected ? 1 : 0.6, {
				damping: 15,
				stiffness: 220,
				mass: 0.6,
			});
			opacity.value = withTiming(nextIsSelected ? 1 : 0, { duration: 120 });
		}
	);

	const ringStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }],
			opacity: opacity.value,
		};
	});

	return (
		<View style={{ width: 56, height: 56, alignItems: "center", justifyContent: "center" }}>
			{/* Outer Ring Animated */}
			<Animated.View
				style={[
					ringStyle,
					{
						position: "absolute",
						width: 56,
						height: 56,
						borderRadius: 28,
						borderWidth: 2,
						borderColor:
							resolvedAppearanceMode === "dark"
								? applyAlpha(themeForeground, "80%")
								: applyAlpha(themeForeground, "25%"),
					},
				]}
			/>

			<PressableFeedback
				onPress={onPress}
				animation={{
					scale: {
						value: isSelected ? 0.95 : 1,
					},
				}}
				style={{
					width: 44,
					height: 44,
					borderRadius: 22,
					backgroundColor: color.hex,
					alignItems: "center",
					justifyContent: "center",
					boxShadow: isSelected ? `0 0 12px ${color.hex}` : "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				<PressableFeedback.Ripple
					animation={{
						backgroundColor: { value: applyAlpha(color.hex, "20%") },
					}}
				/>
				{isSelected && (
					<Svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke={
							color.id === "amber" && resolvedAppearanceMode === "light"
								? "#000000"
								: "#ffffff"
						}
						strokeWidth="3"
					>
						<Path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
					</Svg>
				)}
			</PressableFeedback>
		</View>
	);
}
