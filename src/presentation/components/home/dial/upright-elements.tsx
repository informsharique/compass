import React from "react";
import { Circle, Polygon, Text as SvgText, G } from "react-native-svg";
import Animated, {
	useAnimatedProps,
	SharedValue,
} from "react-native-reanimated";

const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * Returns animated SVG props that keep a group upright by applying a
 * counter-rotation equal to the current dial rotation value.
 */
function useCounterRotateProps(x: number, y: number, rotationSV: SharedValue<number>) {
	return useAnimatedProps(
		() => ({
			transform: [{ translateX: x }, { translateY: y }, { rotate: `${-rotationSV.value}deg` }],
		}),
		[x, y]
	);
}

interface UprightTextProps {
	x: number;
	y: number;
	rotationSV: SharedValue<number>;
	children: React.ReactNode;
	[key: string]: any;
}

/**
 * An SVG text node that stays visually upright while its parent dial rotates.
 * Positioned via (x, y) in SVG coordinates.
 */
export const UprightText: React.FC<UprightTextProps> = ({ x, y, rotationSV, children, ...props }) => {
	const animatedProps = useCounterRotateProps(x, y, rotationSV);
	return (
		<AnimatedG animatedProps={animatedProps}>
			<SvgText x={0} y={0} textAnchor="middle" alignmentBaseline="middle" {...props}>
				{children}
			</SvgText>
		</AnimatedG>
	);
};

interface UprightKaabaProps {
	x: number;
	y: number;
	rotationSV: SharedValue<number>;
	/** When true, the Kaaba icon glows gold — used to signal Qibla alignment. */
	isAligned: boolean;
}

/**
 * An isometric Kaaba icon that remains upright as the dial rotates.
 * Glows and pulses when aligned with the Qibla direction.
 */
export const UprightKaaba: React.FC<UprightKaabaProps> = ({ x, y, rotationSV, isAligned }) => {
	const animatedProps = useCounterRotateProps(x, y, rotationSV);
	const kisbaBandColor = isAligned ? "#fbbf24" : "#9ca3af";

	return (
		<AnimatedG animatedProps={animatedProps}>
			{isAligned && <Circle cx={0} cy={0} r={34} fill="#fbbf24" opacity={0.25} />}
			<G transform="translate(-20, -24)">
				<Polygon points="0,10 20,20 20,48 0,38" fill={isAligned ? "#1e293b" : "#1f2937"} />
				<Polygon points="20,20 40,10 40,38 20,48" fill={isAligned ? "#0f172a" : "#111827"} />
				<Polygon points="0,10 20,0 40,10 20,20" fill={isAligned ? "#334155" : "#374151"} />
				<Polygon points="0,16 20,26 20,29 0,19" fill={kisbaBandColor} />
				<Polygon points="20,26 40,16 40,19 20,29" fill={kisbaBandColor} />
				<Polygon points="24,24 30,21 30,37 24,40" fill={kisbaBandColor} />
			</G>
		</AnimatedG>
	);
};
