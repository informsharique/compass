import React, { type JSX } from "react";
import { View, ScrollView } from "react-native";
import { Typography } from "heroui-native/text";
import { useCompass } from "@/application/compass/use-compass";
import { useCompassLocation, type LocationData } from "@/application/compass/use-compass-location";
import { CompassDial } from "@/presentation/components/home/compass-dial";
import { CompassCalibration } from "@/presentation/components/home/compass-calibration";
import { HeadingReadout } from "@/presentation/components/home/heading-readout";
import { CalibrationButton } from "@/presentation/components/home/calibration-button";
import { InformationDialog } from "@/presentation/components/home/information-dialog";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSettings } from "@/domain/settings/settings-store";
import { calculateQiblaDirection } from "@/domain/compass/heading-utils";
 
export default function HomeScreen(): JSX.Element {
	const { heading, calibrated, headingSV, magneticField } = useCompass();
	const { location } = useCompassLocation();
	const { qiblaCompassEnabled } = useSettings();
	const navigation = useRouter();
	const params = useLocalSearchParams<{
		isInformationOpen?: string;
		isCalibrationOpen?: string;
	}>();

	const isInformationOpen = params.isInformationOpen === "true";
	const isCalibrationOpen = params.isCalibrationOpen === "true";

	const setIsInformationOpen = (open: boolean) => {
		navigation.setParams({ isInformationOpen: open ? "true" : "false" });
	};

	const setIsCalibrationOpen = (open: boolean) => {
		navigation.setParams({ isCalibrationOpen: open ? "true" : "false" });
	};

	// Display heading rounded to integer for the readout UI
	const currentHeading = heading ? Math.round(heading.trueHeading) : 0;
	// Raw float heading passed to CompassDial so the ±1° isLit check uses the actual
	// sensor value, not the rounded integer (rounding creates asymmetric ±0.5–1.5° windows)
	const rawHeading = heading ? heading.trueHeading : 0;
	const cardinalDir = heading ? heading.cardinal : "N";
	const headingAccuracy = heading ? heading.headingAccuracy : null;

	const hasLocation = !!(location?.latitude && location?.longitude);
	const qiblaDirection =
		qiblaCompassEnabled && hasLocation
			? calculateQiblaDirection(location.latitude, location.longitude)
			: undefined;

	return (
		<View className="flex-1">
			<View className="absolute inset-0 bg-background" />
			<ScrollView
				contentContainerClassName="grow justify-between py-6 px-4"
				showsVerticalScrollIndicator={false}
			>
				{/* Main content */}
				<View className="flex-1 items-center justify-center gap-4 w-full">
					<HeadingReadout heading={currentHeading} cardinal={cardinalDir} />
					<CompassDial
						headingSV={headingSV}
						rawHeading={rawHeading}
						heading={currentHeading}
						qiblaDirection={qiblaDirection}
					/>
				</View>

				{/* Footer Actions */}
				<View className="items-center gap-8">
					{/* Qibla direction info — visible only when Qibla mode is on and location is known */}
					{qiblaCompassEnabled && qiblaDirection !== undefined ? (
						<QiblaDirectionBanner qiblaDirection={qiblaDirection} location={location} />
					) : null}
					<CalibrationButton
						calibrated={calibrated}
						onPress={() => setIsCalibrationOpen(true)}
					/>
				</View>
			</ScrollView>

			{/* Information Details Overlay */}
			<InformationDialog
				isOpen={isInformationOpen}
				onOpenChange={setIsInformationOpen}
				location={location}
				accuracy={headingAccuracy}
			/>

			{/* Figure-Eight Calibration Modal */}
			<CompassCalibration
				visible={isCalibrationOpen}
				onDismiss={() => setIsCalibrationOpen(false)}
				calibrated={calibrated}
				magneticField={magneticField}
			/>
		</View>
	);
}

interface QiblaDirectionBannerProps {
	qiblaDirection: number;
	location: LocationData | null;
}

const QiblaDirectionBanner: React.FC<QiblaDirectionBannerProps> = ({ qiblaDirection, location }) => {
	const deg = Math.round(qiblaDirection);
	const city = location?.city;
	const label = city ? `Approximate Qibla direction in ${city} is` : "Qibla direction";

	return (
		<View className="flex-row items-center justify-center gap-1 px-4 py-1">
			<Typography className="text-sm text-muted font-medium tracking-wide">
				{label}
			</Typography>
			<Typography className="font-bold text-accent">{deg}°</Typography>
		</View>
	);
};
