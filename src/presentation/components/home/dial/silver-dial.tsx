import React, { useMemo } from "react";
import { Circle, G, Line, Polygon, Defs, RadialGradient, Stop } from "react-native-svg";
import { UprightText } from "./upright-elements";
import { DialProps } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;
const LABEL_CARDINAL_OFFSET = 125;
const LABEL_DEGREES_OFFSET = 150;

/**
 * Silver Dial (Realistic Silver Compass)
 * Silver face, red/blue North/South needle, black star background.
 */
export const SilverDial: React.FC<DialProps> = ({ rotationSV, backgroundColor }) => {
	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 2) {
			const isMajor = angle % 10 === 0;
			const length = isMajor ? 12 : 6;
			const strokeWidth = isMajor ? 2.5 : 1;
			
			elements.push(
				<Line
					key={`tick-silver-${angle}`}
					x1={CENTER}
					y1={CENTER - RADIUS + 4}
					x2={CENTER}
					y2={CENTER - RADIUS + 4 + length}
					stroke="#000000"
					strokeWidth={strokeWidth}
					transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
				/>
			);
		}
		return elements;
	}, []);

	const numbers = useMemo(() => {
		const elements = [];
		for (let angle = 20; angle < 360; angle += 20) {
			elements.push(
				<UprightText
					key={`label-deg-${angle}`}
					x={CENTER}
					y={CENTER - LABEL_DEGREES_OFFSET}
					rotationSV={rotationSV}
					fill="#000000"
					fontSize="12"
					fontWeight="bold"
					baseAngle={angle}
				>
					{angle.toString()}
				</UprightText>
			);
		}
		return elements;
	}, [rotationSV]);

	return (
		<G>
			<Defs>
				<RadialGradient id="silverFaceGrad" cx="50%" cy="50%" rx="50%" ry="50%">
					<Stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
					<Stop offset="60%" stopColor="#e5e7eb" stopOpacity="1" />
					<Stop offset="100%" stopColor="#9ca3af" stopOpacity="1" />
				</RadialGradient>
				<RadialGradient id="outerRimGrad" cx="50%" cy="50%" rx="50%" ry="50%">
					<Stop offset="80%" stopColor={backgroundColor} stopOpacity="1" />
					<Stop offset="95%" stopColor="#4b5563" stopOpacity="1" />
					<Stop offset="100%" stopColor="#1f2937" stopOpacity="1" />
				</RadialGradient>
			</Defs>

			{/* Outer Rim */}
			<Circle cx={CENTER} cy={CENTER} r={RADIUS + 16} fill="url(#outerRimGrad)" stroke="#111827" strokeWidth="2" />
			<Circle cx={CENTER} cy={CENTER} r={RADIUS + 4} fill="none" stroke="#ffffff" strokeWidth="2" />
			
			{/* Silver Face */}
			<Circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#silverFaceGrad)" stroke="#6b7280" strokeWidth="1" />

			{ticks}
			{numbers}

			{/* Cardinal Labels */}
			<UprightText x={CENTER} y={CENTER - LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill="#2563eb" fontSize="32" fontWeight="900" fontFamily="sans-serif">
				N
			</UprightText>
			<UprightText x={CENTER + LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill="#000000" fontSize="28" fontWeight="bold" fontFamily="sans-serif">
				E
			</UprightText>
			<UprightText x={CENTER} y={CENTER + LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill="#ef4444" fontSize="28" fontWeight="bold" fontFamily="sans-serif">
				S
			</UprightText>
			<UprightText x={CENTER - LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill="#000000" fontSize="28" fontWeight="bold" fontFamily="sans-serif">
				W
			</UprightText>

			{/* Background Black Star */}
			<G transform={`translate(${CENTER}, ${CENTER}) scale(0.9)`}>
				<Polygon points="70,0 0,15 -15,0" fill="#111827" />
				<Polygon points="70,0 0,-15 -15,0" fill="#374151" />
				<Polygon points="-70,0 0,15 15,0" fill="#111827" />
				<Polygon points="-70,0 0,-15 15,0" fill="#374151" />
				
				<Polygon points="50,50 0,10 -10,0" fill="#111827" />
				<Polygon points="50,50 10,0 0,-10" fill="#374151" />
				<Polygon points="-50,-50 0,-10 10,0" fill="#111827" />
				<Polygon points="-50,-50 -10,0 0,10" fill="#374151" />

				<Polygon points="50,-50 10,0 0,10" fill="#111827" />
				<Polygon points="50,-50 0,-10 -10,0" fill="#374151" />
				<Polygon points="-50,50 -10,0 0,-10" fill="#111827" />
				<Polygon points="-50,50 0,10 10,0" fill="#374151" />
			</G>

			{/* Main N/S Needle (Red and Blue) */}
			<G transform={`translate(${CENTER}, ${CENTER}) scale(1.15)`}>
				<Polygon points="0,-85 10,0 0,10" fill="#2563eb" />
				<Polygon points="0,-85 -10,0 0,10" fill="#1d4ed8" />
				<Polygon points="0,85 10,0 0,-10" fill="#ef4444" />
				<Polygon points="0,85 -10,0 0,-10" fill="#b91c1c" />

				{/* Center cap */}
				<Circle cx="0" cy="0" r="10" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
			</G>
		</G>
	);
};
