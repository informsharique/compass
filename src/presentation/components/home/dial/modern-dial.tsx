import React, { useMemo } from "react";
import { Circle, G, Line } from "react-native-svg";
import { UprightText } from "./upright-elements";
import { DialProps } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;
const LABEL_CARDINAL_OFFSET = 148;
const LABEL_DEGREES_OFFSET = 124;

/**
 * Radar-inspired dial with concentric rings, crosshair grid lines, ticks at
 * every 10°, cardinal letters, and inner degree annotations (0°, 90°, etc.).
 * Uses monospace font for a digital/HUD aesthetic.
 */
export const ModernDial: React.FC<DialProps> = ({ accentColor, foregroundColor, rotationSV }) => {
	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 10) {
			const isCardinal = angle % 90 === 0;
			const length = isCardinal ? 12 : 6;
			elements.push(
				<Line
					key={`tick-modern-${angle}`}
					x1={CENTER}
					y1={CENTER - RADIUS}
					x2={CENTER}
					y2={CENTER - RADIUS + length}
					stroke={isCardinal ? accentColor : `${accentColor}80`}
					strokeWidth={isCardinal ? 2 : 1}
					transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
				/>
			);
		}
		return elements;
	}, [accentColor]);

	const accentDim = `${accentColor}90`;
	const foregroundDim = `${foregroundColor}90`;

	return (
		<G>
			{/* Radar concentric rings at full radius, inner radius, and 40% */}
			<Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke={`${accentColor}30`} strokeWidth="1.5" />
			<Circle cx={CENTER} cy={CENTER} r={RADIUS - 20} fill="none" stroke={`${accentColor}15`} strokeWidth="1" />
			<Circle cx={CENTER} cy={CENTER} r={RADIUS * 0.4} fill="none" stroke={`${accentColor}10`} strokeWidth="1" strokeDasharray="4 4" />

			{/* Crosshair grid lines */}
			<Line x1={CENTER} y1={CENTER - RADIUS} x2={CENTER} y2={CENTER + RADIUS} stroke={`${accentColor}15`} strokeWidth="1" />
			<Line x1={CENTER - RADIUS} y1={CENTER} x2={CENTER + RADIUS} y2={CENTER} stroke={`${accentColor}15`} strokeWidth="1" />

			{ticks}

			<UprightText x={CENTER} y={CENTER - LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill={accentColor} fontSize="16" fontWeight="bold" fontFamily="monospace">
				N
			</UprightText>
			<UprightText x={CENTER + LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">
				E
			</UprightText>
			<UprightText x={CENTER} y={CENTER + LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">
				S
			</UprightText>
			<UprightText x={CENTER - LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="14" fontWeight="bold" fontFamily="monospace">
				W
			</UprightText>

			<UprightText x={CENTER} y={CENTER - LABEL_DEGREES_OFFSET} rotationSV={rotationSV} fill={accentDim} fontSize="11" fontWeight="bold" fontFamily="monospace">
				0°
			</UprightText>
			<UprightText x={CENTER + LABEL_DEGREES_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundDim} fontSize="11" fontWeight="bold" fontFamily="monospace">
				90°
			</UprightText>
			<UprightText x={CENTER} y={CENTER + LABEL_DEGREES_OFFSET} rotationSV={rotationSV} fill={foregroundDim} fontSize="11" fontWeight="bold" fontFamily="monospace">
				180°
			</UprightText>
			<UprightText x={CENTER - LABEL_DEGREES_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundDim} fontSize="11" fontWeight="bold" fontFamily="monospace">
				270°
			</UprightText>

			{/* Small centre circle to anchor the display */}
			<Circle cx={CENTER} cy={CENTER} r="28" fill="#00000030" stroke={`${accentColor}40`} strokeWidth="1.5" />
			<Circle cx={CENTER} cy={CENTER} r="3" fill={accentColor} />
		</G>
	);
};
