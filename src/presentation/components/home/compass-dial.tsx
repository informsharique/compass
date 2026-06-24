import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import Svg, { Defs, Line, Polygon, RadialGradient, Stop } from "react-native-svg";
import Animated, {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	SharedValue
} from "react-native-reanimated";
import { useThemeColor } from "heroui-native/hooks";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Typography } from "heroui-native/text";

import { useSettings } from "@/domain/settings/settings-store";
import { getBearingDeviation } from "@/domain/compass/heading-utils";
import { triggerHaptics } from "@/presentation/utils/haptic-helper";
import { applyAlpha } from "@/presentation/utils/color-helper";

import {
	ClassicDial,
	MinimalistDial,
	ModernDial,
	StandardDial,
	AeroDial,
	SilverDial,
	NauticalDial,
	UprightKaaba,
} from "./dial";

const SVG_SIZE = 400;
const SVG_CENTER = SVG_SIZE / 2;
const DIAL_RADIUS = SVG_SIZE * 0.45;
const KAABA_ICON_OFFSET = 38;
const SVG_VIEWBOX = "-60 -60 520 520";

const DIAL_SPRING_CONFIG = {
	stiffness: 300,
	damping: 38,
	mass: 0.5,
};

export interface CompassDialProps {
	headingSV: SharedValue<number>;
	/** Raw (un-smoothed) heading used for precise Qibla alignment detection. */
	rawHeading?: number;
	/** Smoothed heading used for the numeric readout display. */
	heading: number;
	qiblaDirection?: number;
}

export const CompassDial: React.FC<CompassDialProps> = ({
	headingSV,
	rawHeading,
	heading,
	qiblaDirection,
}) => {
	const { compassDesign, qiblaCompassEnabled } = useSettings();

	const [accentColor, foregroundColor, borderLinkColor, surfaceColor, backgroundColor] =
		useThemeColor(["accent", "foreground", "border", "surface", "background"]);

	// Qibla alignment: true when raw heading is within 1° of the Qibla bearing
	const isQiblaAligned = useMemo(
		() =>
			qiblaCompassEnabled &&
			qiblaDirection !== undefined &&
			Math.abs(getBearingDeviation(rawHeading ?? 0, qiblaDirection)) <= 1,
		[qiblaCompassEnabled, qiblaDirection, rawHeading]
	);

	React.useEffect(() => {
		if (isQiblaAligned) {
			triggerHaptics();
		}
	}, [isQiblaAligned]);

	// Convert Qibla bearing to Cartesian (x, y) on the dial ring
	const kaabaPosition = useMemo(() => {
		const bearingRad = (qiblaDirection ?? 0) * (Math.PI / 180);
		const ringRadius = DIAL_RADIUS + KAABA_ICON_OFFSET;
		return {
			x: SVG_CENTER + ringRadius * Math.sin(bearingRad),
			y: SVG_CENTER - ringRadius * Math.cos(bearingRad),
		};
	}, [qiblaDirection]);

	// Accumulated rotation in degrees — grows unbounded to avoid wrap-around jumps
	const dialRotationSV = useSharedValue(0);

	useAnimatedReaction(
		() => headingSV.value,
		(currentHeading) => {
			"worklet";
			const previous = dialRotationSV.value;
			const target = -currentHeading;
			// Resolve shortest angular path to prevent a full 360° spin on wrap-around
			const shortestDiff = ((((target - previous) % 360) + 540) % 360) - 180;
			dialRotationSV.value = withSpring(previous + shortestDiff, DIAL_SPRING_CONFIG);
		}
	);

	const animatedDialStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${dialRotationSV.value}deg` }],
	}));

	const handleDialPress = useCallback(() => {
		triggerHaptics();
	}, []);

	const dialColors = {
		accentColor,
		foregroundColor,
		borderLinkColor,
		surfaceColor,
		backgroundColor,
	};

	return (
		<PressableFeedback
			onPress={handleDialPress}
			animation={{ scale: { value: 1 } }}
			className="w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] items-center justify-center relative"
		>
			<PressableFeedback.Ripple
				animation={{ backgroundColor: { value: applyAlpha(foregroundColor, "20%") } }}
			/>

			{/* Rotating SVG layer — contains the dial face and Kaaba icon */}
			<Animated.View className="w-full h-full items-center justify-center" style={animatedDialStyle}>
				<Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
					<Defs>
						<RadialGradient id="dialGrad" cx="50%" cy="50%" rx="50%" ry="50%">
							<Stop offset="70%" stopColor={surfaceColor} stopOpacity="0.9" />
							<Stop offset="100%" stopColor={backgroundColor} stopOpacity="0.5" />
						</RadialGradient>
					</Defs>

					{compassDesign === "classic" && <ClassicDial {...dialColors} rotationSV={dialRotationSV} />}
					{compassDesign === "modern" && <ModernDial {...dialColors} rotationSV={dialRotationSV} />}
					{compassDesign === "minimalist" && <MinimalistDial {...dialColors} rotationSV={dialRotationSV} />}
					{compassDesign === "standard" && <StandardDial {...dialColors} />}
					{compassDesign === "aero" && <AeroDial {...dialColors} rotationSV={dialRotationSV} />}
					{compassDesign === "silver" && <SilverDial {...dialColors} rotationSV={dialRotationSV} />}
					{compassDesign === "nautical" && <NauticalDial {...dialColors} rotationSV={dialRotationSV} />}

					{qiblaCompassEnabled && qiblaDirection !== undefined && (
						<UprightKaaba
							x={kaabaPosition.x}
							y={kaabaPosition.y}
							rotationSV={dialRotationSV}
							isAligned={isQiblaAligned}
						/>
					)}
				</Svg>
			</Animated.View>

			{/* Heading readout overlay — only visible on the Standard dial */}
			{compassDesign === "standard" && (
				<View className="absolute inset-0 items-center justify-center pointer-events-none">
					<Typography.Heading
						type="h2"
						className="text-4xl sm:text-5xl font-black text-foreground tabular-nums tracking-tighter"
					>
						{`${heading}°`}
					</Typography.Heading>
				</View>
			)}

			{/* Fixed north marker — does not rotate with the dial */}
			<View className="absolute inset-0 items-center pointer-events-none">
				<Svg width="100%" height="100%" viewBox={SVG_VIEWBOX}>
					<Polygon
						points={`${SVG_CENTER - 8},14 ${SVG_CENTER + 8},14 ${SVG_CENTER},26`}
						fill={isQiblaAligned ? "#fbbf24" : accentColor}
					/>
					<Line
						x1={SVG_CENTER}
						y1="0"
						x2={SVG_CENTER}
						y2="14"
						stroke={isQiblaAligned ? "#fbbf24" : accentColor}
						strokeWidth="2.5"
					/>
				</Svg>
			</View>
		</PressableFeedback>
	);
};
