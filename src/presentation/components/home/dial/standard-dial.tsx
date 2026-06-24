import React, { useMemo } from "react";
import { G, Line, Text as SvgText } from "react-native-svg";
import { applyAlpha } from "@/presentation/utils/color-helper";
import { DialColors } from "./dial-types";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.45;

interface LabelDescriptor {
	angle: number;
	text: string;
	isCardinal?: boolean;
	isNorth?: boolean;
}

const DEGREE_LABELS: LabelDescriptor[] = [
	{ angle: 0, text: "N", isCardinal: true, isNorth: true },
	{ angle: 30, text: "30" },
	{ angle: 60, text: "60" },
	{ angle: 90, text: "E", isCardinal: true },
	{ angle: 120, text: "120" },
	{ angle: 150, text: "150" },
	{ angle: 180, text: "S", isCardinal: true },
	{ angle: 210, text: "210" },
	{ angle: 240, text: "240" },
	{ angle: 270, text: "W", isCardinal: true },
	{ angle: 300, text: "300" },
	{ angle: 330, text: "330" },
];

/**
 * Military-style standard dial with dense 2° ticks (major at 10° and 30°),
 * rotating labels at every 30° in the ring itself — no counter-rotation needed
 * since the labels are part of the spinning SVG layer, not overlaid on screen.
 * A numeric heading readout is rendered separately by the parent.
 */
export const StandardDial: React.FC<DialColors> = ({ accentColor, foregroundColor }) => {
	const ticks = useMemo(() => {
		const elements = [];
		for (let angle = 0; angle < 360; angle += 2) {
			const isMajor30 = angle % 30 === 0;
			const isMajor10 = angle % 10 === 0;
			const length = isMajor30 ? 16 : isMajor10 ? 10 : 6;
			const strokeWidth = isMajor30 ? 2 : isMajor10 ? 1.5 : 1;
			const color = isMajor30
				? angle === 0
					? accentColor
					: foregroundColor
				: isMajor10
					? applyAlpha(foregroundColor, "65%")
					: applyAlpha(foregroundColor, "30%");

			elements.push(
				<Line
					key={`tick-standard-${angle}`}
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
	}, [accentColor, foregroundColor]);

	const labelElements = useMemo(
		() =>
			DEGREE_LABELS.map((label) => {
				const color = label.isNorth
					? accentColor
					: label.isCardinal
						? foregroundColor
						: applyAlpha(foregroundColor, "60%");
				const fontSize = label.isCardinal ? "22" : "14";

				return (
					<G
						key={`label-standard-${label.angle}`}
						transform={`rotate(${label.angle}, ${CENTER}, ${CENTER})`}
					>
						<SvgText
							x={CENTER}
							y={CENTER - RADIUS + 38}
							fill={color}
							fontSize={fontSize}
							fontWeight="bold"
							textAnchor="middle"
							alignmentBaseline="middle"
						>
							{label.text}
						</SvgText>
					</G>
				);
			}),
		[accentColor, foregroundColor]
	);

	return (
		<G>
			{ticks}
			{labelElements}
		</G>
	);
};
