import React, { useMemo } from "react";
import { Circle, G, Line, Polygon, Defs, RadialGradient, Stop } from "react-native-svg";
import { UprightText } from "./upright-elements";
import { DialProps } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;
const LABEL_CARDINAL_OFFSET = 135;
const LABEL_ORDINAL_OFFSET = 120;
const LABEL_ORDINAL_XY = Math.round(LABEL_ORDINAL_OFFSET * Math.sin(Math.PI / 4) * 10) / 10;

/**
 * Aero Dial (Realistic Blue Compass)
 * Deep blue face, golden star compass rose, vibrant green ordinals, and silver rim.
 */
export const AeroDial: React.FC<DialProps> = ({ rotationSV, backgroundColor, surfaceColor }) => {
	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 5) {
			const isMajor = angle % 30 === 0;
			const isCardinal = angle % 90 === 0;
			const length = isCardinal ? 12 : isMajor ? 8 : 4;
			const strokeWidth = isCardinal ? 2 : isMajor ? 1.5 : 1;
			
			// White ticks
			const color = "#ffffff";

			elements.push(
				<Line
					key={`tick-aero-${angle}`}
					x1={CENTER}
					y1={CENTER - RADIUS + 18}
					x2={CENTER}
					y2={CENTER - RADIUS + 18 + length}
					stroke={color}
					strokeWidth={strokeWidth}
					transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
				/>
			);
		}
		return elements;
	}, []);

	return (
		<G>
			<Defs>
				<RadialGradient id="blueDialGrad" cx="50%" cy="50%" rx="50%" ry="50%">
					<Stop offset="0%" stopColor="#0ea5e9" stopOpacity="1" />
					<Stop offset="70%" stopColor="#0284c7" stopOpacity="1" />
					<Stop offset="100%" stopColor="#0369a1" stopOpacity="1" />
				</RadialGradient>
				<RadialGradient id="silverRimGrad" cx="50%" cy="50%" rx="50%" ry="50%">
					<Stop offset="85%" stopColor={backgroundColor} stopOpacity="1" />
					<Stop offset="95%" stopColor={surfaceColor} stopOpacity="1" />
					<Stop offset="100%" stopColor="#4b5563" stopOpacity="1" />
				</RadialGradient>
			</Defs>

			{/* Silver Rim */}
			<Circle cx={CENTER} cy={CENTER} r={RADIUS + 12} fill="url(#silverRimGrad)" stroke="#374151" strokeWidth="2" />
			<Circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="none" stroke="#d1d5db" strokeWidth="4" />
			
			{/* Blue Face */}
			<Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#blueDialGrad)" stroke="#0c4a6e" strokeWidth="3" />
			<Circle cx={CENTER} cy={CENTER} r={RADIUS - 12} fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />

			{ticks}

			{/* Cardinal Labels */}
			<UprightText x={CENTER} y={CENTER - LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill="#ffffff" fontSize="22" fontWeight="900">
				N
			</UprightText>
			<UprightText x={CENTER + LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill="#ffffff" fontSize="20" fontWeight="bold">
				E
			</UprightText>
			<UprightText x={CENTER} y={CENTER + LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill="#ffffff" fontSize="20" fontWeight="bold">
				S
			</UprightText>
			<UprightText x={CENTER - LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill="#ffffff" fontSize="20" fontWeight="bold">
				W
			</UprightText>

			{/* Ordinal Labels (Green) */}
			<UprightText x={CENTER + LABEL_ORDINAL_XY} y={CENTER - LABEL_ORDINAL_XY} rotationSV={rotationSV} fill="#22c55e" fontSize="14" fontWeight="800">
				NE
			</UprightText>
			<UprightText x={CENTER + LABEL_ORDINAL_XY} y={CENTER + LABEL_ORDINAL_XY} rotationSV={rotationSV} fill="#22c55e" fontSize="14" fontWeight="800">
				SE
			</UprightText>
			<UprightText x={CENTER - LABEL_ORDINAL_XY} y={CENTER + LABEL_ORDINAL_XY} rotationSV={rotationSV} fill="#22c55e" fontSize="14" fontWeight="800">
				SW
			</UprightText>
			<UprightText x={CENTER - LABEL_ORDINAL_XY} y={CENTER - LABEL_ORDINAL_XY} rotationSV={rotationSV} fill="#22c55e" fontSize="14" fontWeight="800">
				NW
			</UprightText>

			{/* Golden Star Rose */}
			<G transform={`translate(${CENTER}, ${CENTER}) scale(1.15)`}>
				{/* N/S Needle (Gold and Silver) */}
				<Polygon points="0,-85 10,0 0,10" fill="#facc15" />
				<Polygon points="0,-85 -10,0 0,10" fill="#ca8a04" />
				<Polygon points="0,85 10,0 0,-10" fill="#facc15" />
				<Polygon points="0,85 -10,0 0,-10" fill="#ca8a04" />
				
				{/* E/W Needle (Silver) */}
				<Polygon points="85,0 0,10 -10,0" fill="#e5e7eb" />
				<Polygon points="85,0 0,-10 -10,0" fill="#9ca3af" />
				<Polygon points="-85,0 0,10 10,0" fill="#e5e7eb" />
				<Polygon points="-85,0 0,-10 10,0" fill="#9ca3af" />

				{/* Center cap */}
				<Circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
				<Circle cx="0" cy="0" r="8" fill="#0f172a" />
			</G>
		</G>
	);
};
