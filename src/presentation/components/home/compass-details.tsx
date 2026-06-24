import React from "react";
import { View } from "react-native";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { LocationData, refreshLocation } from "@/domain/location/location-store";
import { RefreshIcon } from "@/presentation/components/icons/refresh-icon";
import { applyAlpha } from "@/presentation/utils/color-helper";
import { useThemeColor } from "heroui-native/hooks";

interface CompassDetailsProps {
	location: LocationData | null;
	accuracy: number | null;
}

function formatDMS(deg: number, isLat: boolean): string {
	const absolute = Math.abs(deg);
	const degrees = Math.floor(absolute);
	const minutesNotTruncated = (absolute - degrees) * 60;
	const minutes = Math.floor(minutesNotTruncated);
	const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

	let direction = "";
	if (isLat) {
		direction = deg >= 0 ? "N" : "S";
	} else {
		direction = deg >= 0 ? "E" : "W";
	}

	return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

export const CompassDetails: React.FC<CompassDetailsProps> = ({ location, accuracy }) => {
	const hasLoc = location && !location.error;
	const [themeAccent] = useThemeColor(["accent"]);

	return (
		<Card className="bg-surface/80 border border-border/40 p-5 rounded-2xl w-full max-w-sm gap-4 shadow-2xl">
			{/* Header */}
			<View className="flex-row items-center justify-between border-b border-border/30 pb-3 w-full">
				<View className="flex-1 pr-2">
					<Typography className="text-muted text-[10px] font-bold uppercase tracking-wider">
						Current Location
					</Typography>
					<View className="flex-row items-center gap-2 mt-0.5">
						<Typography className="text-foreground text-base font-bold shrink" numberOfLines={1}>
							{hasLoc && location.city ? location.city : "Compass Status"}
						</Typography>
						<PressableFeedback
							onPress={() => {
								refreshLocation(true);
							}}
							className="w-7 h-7 rounded-full items-center justify-center border border-border bg-surface-secondary/20 active:bg-surface-secondary"
							animation={{
								scale: {
									value: 0.99,
								},
							}}
							android_ripple={{
								foreground: true,
								color: applyAlpha(themeAccent, "10%")
							}}
						>
							<RefreshIcon width={14} height={14} />
						</PressableFeedback>
					</View>
				</View>
			</View>

			{/* Lat/Lng DMS Grid */}
			<View className="flex-row justify-between">
				<View className="gap-0.5">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
						Latitude
					</Typography>
					<Typography className="text-foreground text-sm font-semibold">
						{hasLoc ? formatDMS(location.latitude, true) : "--"}
					</Typography>
				</View>

				<View className="gap-0.5 items-end">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
						Longitude
					</Typography>
					<Typography className="text-foreground text-sm font-semibold">
						{hasLoc ? formatDMS(location.longitude, false) : "--"}
					</Typography>
				</View>
			</View>

			{/* Altitude & Accuracy Grid */}
			<View className="flex-row justify-between border-t border-border/30 pt-3">
				<View className="gap-0.5">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
						Altitude
					</Typography>
					<Typography className="text-foreground text-sm font-semibold">
						{hasLoc && location.altitude !== null
							? `${Math.round(location.altitude)} m`
							: "--"}
					</Typography>
				</View>

				<View className="gap-0.5 items-end">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
						GPS Accuracy
					</Typography>
					<Typography className="text-foreground text-sm font-semibold">
						{hasLoc && location.accuracy !== null ? `±${Math.round(location.accuracy)} m` : "--"}
					</Typography>
				</View>
			</View>

			{/* Compass Accuracy & Sensor Status Footer */}
			<View className="flex-row justify-between border-t border-border/30 pt-3">
				<View className="gap-0.5">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
						Compass Accuracy
					</Typography>
					<Typography className="text-foreground text-sm font-semibold">
						{accuracy !== null ? `±${Math.round(accuracy)}°` : "--"}
					</Typography>
				</View>

				<View className="gap-0.5 items-end">
					<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider text-right">
						Sensor Status
					</Typography>
					<View className="flex-row items-center gap-1.5 mt-0.5">
						<View
							className={`w-2.5 h-2.5 rounded-full ${
								accuracy !== null && accuracy < 15
									? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
									: accuracy !== null && accuracy < 45
										? "bg-amber-500"
										: "bg-red-500"
							}`}
						/>
						<Typography className="text-foreground/80 text-xs font-medium">
							{accuracy !== null && accuracy < 15
								? "Calibrated"
								: accuracy !== null && accuracy < 45
									? "Moderate"
									: "Uncalibrated"}
						</Typography>
					</View>
				</View>
			</View>
		</Card>
	);
};
