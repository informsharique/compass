import React, { useMemo } from "react";
import { Circle, G, Line, Polygon } from "react-native-svg";
import { UprightText } from "./upright-elements";
import { DialProps } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;
const LABEL_CARDINAL_OFFSET = 148;
// Slightly tighter label radius keeps labels from feeling crowded on a sparse dial
const MINIMALIST_LABEL_RADIUS = LABEL_CARDINAL_OFFSET - 3;

/**
 * Bare-bones dial with ticks only at every 30°, thin borderless ring, cardinal
 * labels in a light font weight, and a simple north-south needle at centre.
 */
export const MinimalistDial: React.FC<DialProps> = ({ foregroundColor, rotationSV }) => {
	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 30) {
			const isCardinal = angle % 90 === 0;
			elements.push(
				<Line
					key={`tick-minimal-${angle}`}
					x1={CENTER}
					y1={CENTER - RADIUS + 5}
					x2={CENTER}
					y2={CENTER - RADIUS + 12}
					stroke={isCardinal ? foregroundColor : `${foregroundColor}40`}
					strokeWidth="1.5"
					transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
				/>
			);
		}
		return elements;
	}, [foregroundColor]);

	return (
		<G>
			<Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke={`${foregroundColor}15`} strokeWidth="1" />

			{ticks}

			<UprightText x={CENTER} y={CENTER - MINIMALIST_LABEL_RADIUS} rotationSV={rotationSV} fill="#ef4444" fontSize="16" fontWeight="300">
				N
			</UprightText>
			<UprightText x={CENTER + MINIMALIST_LABEL_RADIUS} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="300">
				E
			</UprightText>
			<UprightText x={CENTER} y={CENTER + MINIMALIST_LABEL_RADIUS} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="300">
				S
			</UprightText>
			<UprightText x={CENTER - MINIMALIST_LABEL_RADIUS} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="300">
				W
			</UprightText>

			{/* North-south needle: red tip pointing north, muted tail pointing south */}
			<G>
				<Polygon
					points={`${CENTER - 4},${CENTER} ${CENTER + 4},${CENTER} ${CENTER},${CENTER - RADIUS + 25}`}
					fill="#ef4444"
				/>
				<Polygon
					points={`${CENTER - 4},${CENTER} ${CENTER + 4},${CENTER} ${CENTER},${CENTER + RADIUS - 25}`}
					fill={foregroundColor}
					opacity="0.6"
				/>
				<Circle cx={CENTER} cy={CENTER} r="6" fill="#09090b" stroke={foregroundColor} strokeWidth="1.5" />
			</G>
		</G>
	);
};
