import React from "react";
import { View } from "react-native";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { Button } from "heroui-native/button";
import Svg, { Path } from "react-native-svg";

interface BearingDisplayProps {
	bearingLock: number | null;
	deviation: number | null;
	onClearLock: () => void;
}

export const BearingDisplay: React.FC<BearingDisplayProps> = ({
	bearingLock,
	deviation,
	onClearLock,
}) => {
	if (bearingLock === null) {
		return (
			<View className="items-center py-2">
				<Typography className="text-muted text-sm font-medium">
					Tap the compass dial to lock your heading
				</Typography>
			</View>
		);
	}

	// Round deviation to integer
	const roundedDev = deviation !== null ? Math.round(deviation) : 0;
	const isAligned = Math.abs(roundedDev) <= 2; // aligned if within 2 degrees
	const direction = roundedDev > 0 ? "right" : "left";

	return (
		<Card className="border border-orange-500/20 bg-orange-500/5 py-4 px-6 gap-3 rounded-2xl w-full max-w-sm">
			<View className="flex-row items-center justify-between">
				<View className="gap-0.5">
					<Typography className="text-orange-500 text-xs font-semibold uppercase tracking-wider">
						Bearing Lock
					</Typography>
					<Typography.Heading type="h3" className="text-xl font-bold text-foreground">
						{bearingLock}°
					</Typography.Heading>
				</View>

				<Button
					size="sm"
					variant="ghost"
					onPress={onClearLock}
					className="px-3 py-1.5 h-auto text-orange-500 bg-orange-500/10 active:bg-orange-500/20 rounded-full"
				>
					Unlock
				</Button>
			</View>

			<View className="flex-row items-center gap-3 pt-1">
				{isAligned ? (
					<View className="bg-emerald-500/20 p-2 rounded-full">
						<Svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#10b981"
							strokeWidth="2.5"
						>
							<Path
								d="M20 6L9 17L4 12"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
					</View>
				) : (
					<View className="bg-orange-500/20 p-2 rounded-full">
						<Svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="#f97316"
							strokeWidth="2.5"
							style={{
								transform: [{ rotate: direction === "left" ? "-90deg" : "90deg" }],
							}}
						>
							<Path
								d="M5 12h14M12 5l7 7-7 7"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</Svg>
					</View>
				)}

				<View className="flex-1 justify-center">
					{isAligned ? (
						<Typography className="text-emerald-500 font-semibold text-sm">
							Perfect Alignment
						</Typography>
					) : (
						<Typography className="text-orange-500 font-semibold text-sm">
							Turn {Math.abs(roundedDev)}° {direction === "left" ? "Left" : "Right"}
						</Typography>
					)}
				</View>
			</View>
		</Card>
	);
};
