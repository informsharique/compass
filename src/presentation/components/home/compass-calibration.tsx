import React, { useEffect, use } from "react";
import { View } from "react-native";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { Button } from "heroui-native/button";
import { Dialog } from "heroui-native/dialog";
import { useThemeColor } from "heroui-native/hooks";
import { BlurTargetContext, DialogOverlayBlurView } from "@/presentation/components/blur";
import Animated, {
	useSharedValue,
	useAnimatedProps,
	withRepeat,
	withTiming,
	Easing,
	FlipInXUp,
	FlipOutXUp,
} from "react-native-reanimated";
import Svg, { Circle, Path as SvgPath, G } from "react-native-svg";
import { triggerHaptics } from "@/presentation/utils/haptic-helper";
import { applyAlpha } from "@/presentation/utils/color-helper";

interface CompassCalibrationProps {
	visible: boolean;
	onDismiss: () => void;
	calibrated: boolean;
	magneticField: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CompassCalibration: React.FC<CompassCalibrationProps> = ({
	visible,
	onDismiss,
	calibrated,
	magneticField,
}) => {
	const animValue = useSharedValue(0);
	const themeAccent = useThemeColor("accent");
	const blurTargetRef = use(BlurTargetContext);

	useEffect(() => {
		if (visible) {
			animValue.value = 0;
			animValue.value = withRepeat(
				withTiming(2 * Math.PI, {
					duration: 3000,
					easing: Easing.linear,
				}),
				-1, // infinite loop
				false
			);
		}
	}, [visible, animValue]);

	// Figure-8 constants (using a modified Lemniscate of Bernoulli with a reduced denominator factor of 0.18 for a beautifully rounded but defined figure-8 shape)
	const cx = 150;
	const cy = 80;
	const scaleX = 90;
	const scaleY = 45;

	const animatedCircleProps = useAnimatedProps(() => {
		const t = animValue.value;
		const denom = 1 + 0.08 * Math.pow(Math.sin(t), 2);
		const x = cx + (scaleX * Math.cos(t)) / denom;
		const y = cy + (scaleY * Math.sin(t) * Math.cos(t)) / denom;

		return {
			cx: x,
			cy: y,
		};
	});

	const generateFigureEightPath = () => {
		let d = "";
		const steps = 100;
		for (let i = 0; i <= steps; i++) {
			const t = (i / steps) * 2 * Math.PI;
			const denom = 1 + 0.08 * Math.pow(Math.sin(t), 2);
			const x = cx + (scaleX * Math.cos(t)) / denom;
			const y = cy + (scaleY * Math.sin(t) * Math.cos(t)) / denom;
			if (i === 0) {
				d += `M ${x} ${y}`;
			} else {
				d += ` L ${x} ${y}`;
			}
		}
		return d + " Z";
	};

	const handleDismiss = () => {
		triggerHaptics();
		onDismiss();
	};

	return (
		<Dialog isOpen={visible} onOpenChange={onDismiss}>
			<Dialog.Portal>
				{blurTargetRef && <DialogOverlayBlurView blurTargetRef={blurTargetRef} />}
				<Dialog.Overlay className="bg-overlay/51" />
				<Dialog.Content
					className="self-center w-[90%] max-w-sm p-0 bg-background/25 border-0 shadow-none"
					animation={{
						entering: FlipInXUp.duration(250),
						exiting: FlipOutXUp.duration(200),
					}}
				>
					<Card className="bg-surface/90 border border-border/25 p-6 rounded-3xl w-full gap-6 items-center shadow-2xl">
						{/* Header */}
						<View className="items-center gap-2">
							<Typography.Heading
								type="h2"
								className="text-xl font-bold text-foreground text-center px-4"
							>
								Make a figure 8 to calibrate your compass.
							</Typography.Heading>
							<Typography className="text-muted text-sm text-center leading-relaxed px-4">
								Keep your device away from metal (magnetic fields), and calibrate by
								waving your phone in a figure-8 motion 3 times.
							</Typography>
						</View>

						{/* SVG Animated Figure-Eight */}
						<View className="w-[300px] h-[160px] items-center justify-center bg-surface-secondary/25 border border-border/30 rounded-2xl">
							<Svg width="300" height="160" viewBox="0 0 300 160">
								<G transform="rotate(-20, 150, 80)">
									{/* Background Figure-Eight Path Track */}
									<SvgPath
										d={generateFigureEightPath()}
										fill="none"
										stroke={themeAccent}
										strokeWidth="3"
										strokeDasharray="6 6"
										opacity="0.4"
									/>

									{/* Glowing animated dot tracking the lemniscate path */}
									<AnimatedCircle
										r="7"
										fill={themeAccent}
										animatedProps={animatedCircleProps}
									/>
								</G>
							</Svg>
						</View>

						{/* Sensor & Magnetic Field Info Section */}
						<View className="w-full border-t border-border/15 border-dashed pt-3 gap-2 px-4">
							<View className="flex-row justify-between items-center">
								<Typography className="text-muted text-xs font-semibold">
									Sensors&apos; Accuracy
								</Typography>
								<Typography
									className={`text-xs font-bold ${calibrated ? "text-emerald-500" : "text-red-500"}`}
								>
									{calibrated ? "High" : "Low"}
								</Typography>
							</View>
							<View className="flex-row justify-between items-center">
								<Typography className="text-muted text-xs font-semibold">
									Magnetic Field Value
								</Typography>
								<Typography
									className={`text-xs font-bold ${magneticField > 20 && magneticField < 65 ? "text-emerald-500" : "text-amber-500"}`}
								>
									{Math.round(magneticField)}µT
								</Typography>
							</View>
						</View>

						{/* Divider */}
						<View className="w-full border-t border-border/15 border-dashed" />

						{/* Action Button */}
						<Button
							onPress={handleDismiss}
							variant="ghost"
							android_ripple={{
								color: applyAlpha(themeAccent, "15%"),
								foreground: true,
							}}
							className="w-full border-transparent bg-transparent py-3 rounded-xl"
						>
							<Button.Label className="font-bold text-base text-center w-full text-accent">
								Done
							</Button.Label>
						</Button>
					</Card>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog>
	);
};
