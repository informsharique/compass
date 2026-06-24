import React, { useMemo } from "react";
import { Circle, G, Line, Polygon } from "react-native-svg";
import { UprightText } from "./upright-elements";
import { DialProps } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;
const LABEL_CARDINAL_OFFSET = 148;
const LABEL_ORDINAL_OFFSET = 132;
const LABEL_ORDINAL_XY = Math.round(LABEL_ORDINAL_OFFSET * Math.sin(Math.PI / 4) * 10) / 10;

/**
 * Traditional compass rose style with a filled dial background, tick marks
 * at every 5° (major at 30°, cardinal at 90°), ordinal labels (NE, SW, etc.),
 * and a classic four-pointed arrow rose at centre.
 */
export const ClassicDial: React.FC<DialProps> = ({
	accentColor,
	foregroundColor,
	borderLinkColor,
	surfaceColor,
	backgroundColor,
	rotationSV,
}) => {
	const majorTickColor = foregroundColor;
	const minorTickColor = `${foregroundColor}60`;
	const ordinalLabelColor = `${foregroundColor}90`;

	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 5) {
			const isMajor = angle % 30 === 0;
			const isCardinal = angle % 90 === 0;
			const length = isCardinal ? 15 : isMajor ? 10 : 5;
			const strokeWidth = isCardinal ? 2.5 : isMajor ? 1.5 : 1;
			const color = isCardinal
				? angle === 0
					? "#ef4444"
					: accentColor
				: isMajor
					? majorTickColor
					: minorTickColor;

			elements.push(
				<Line
					key={`tick-classic-${angle}`}
					x1={CENTER}
					y1={CENTER - RADIUS}
					x2={CENTER}
					y2={CENTER - RADIUS + length}
					stroke={color}
					strokeWidth={strokeWidth}
					transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
				/>
			);
		}
		return elements;
	}, [accentColor, majorTickColor, minorTickColor]);

	const northY = CENTER - LABEL_CARDINAL_OFFSET;

	return (
		<G>
			<Circle
				cx={CENTER}
				cy={CENTER}
				r={RADIUS + 4}
				stroke={accentColor}
				strokeWidth="1.5"
				fill="none"
				opacity="0.3"
			/>
			<Circle
				cx={CENTER}
				cy={CENTER}
				r={RADIUS}
				fill="url(#dialGrad)"
				stroke={`${borderLinkColor}40`}
				strokeWidth="1.5"
			/>

			{ticks}

			<UprightText x={CENTER} y={northY} rotationSV={rotationSV} fill="#ef4444" fontSize="18" fontWeight="bold">
				N
			</UprightText>
			<UprightText x={CENTER + LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="16" fontWeight="bold">
				E
			</UprightText>
			<UprightText x={CENTER} y={CENTER + LABEL_CARDINAL_OFFSET} rotationSV={rotationSV} fill={foregroundColor} fontSize="16" fontWeight="bold">
				S
			</UprightText>
			<UprightText x={CENTER - LABEL_CARDINAL_OFFSET} y={CENTER} rotationSV={rotationSV} fill={foregroundColor} fontSize="16" fontWeight="bold">
				W
			</UprightText>

			<UprightText x={CENTER + LABEL_ORDINAL_XY} y={CENTER - LABEL_ORDINAL_XY} rotationSV={rotationSV} fill={ordinalLabelColor} fontSize="11">
				NE
			</UprightText>
			<UprightText x={CENTER + LABEL_ORDINAL_XY} y={CENTER + LABEL_ORDINAL_XY} rotationSV={rotationSV} fill={ordinalLabelColor} fontSize="11">
				SE
			</UprightText>
			<UprightText x={CENTER - LABEL_ORDINAL_XY} y={CENTER + LABEL_ORDINAL_XY} rotationSV={rotationSV} fill={ordinalLabelColor} fontSize="11">
				SW
			</UprightText>
			<UprightText x={CENTER - LABEL_ORDINAL_XY} y={CENTER - LABEL_ORDINAL_XY} rotationSV={rotationSV} fill={ordinalLabelColor} fontSize="11">
				NW
			</UprightText>

			{/* Four-pointed compass rose arrow at centre */}
			<G transform={`translate(${CENTER - 25}, ${CENTER - 25})`}>
				<Polygon points="25,5 29,21 25,25" fill="#ef4444" />
				<Polygon points="25,5 21,21 25,25" fill="#b91c1c" />
				<Polygon points="25,45 21,29 25,25" fill={foregroundColor} opacity="0.8" />
				<Polygon points="25,45 29,29 25,25" fill={foregroundColor} opacity="0.6" />
				<Polygon points="45,25 29,21 25,25" fill={foregroundColor} opacity="0.8" />
				<Polygon points="45,25 29,29 25,25" fill={foregroundColor} opacity="0.6" />
				<Polygon points="5,25 21,29 25,25" fill={foregroundColor} opacity="0.8" />
				<Polygon points="5,25 21,21 25,25" fill={foregroundColor} opacity="0.6" />
				<Circle cx="25" cy="25" r="4" fill="#09090b" />
			</G>
		</G>
	);
};
