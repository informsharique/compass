import type { JSX } from "react";
import { View, ScrollView } from "react-native";
import { useCompass } from "@/application/compass/use-compass";
import { useCompassLocation } from "@/application/compass/use-compass-location";
import { CompassDial } from "@/presentation/components/home/compass-dial";
import { CompassCalibration } from "@/presentation/components/home/compass-calibration";
import { HeadingReadout } from "@/presentation/components/home/heading-readout";
import { CalibrationButton } from "@/presentation/components/home/calibration-button";
import { InformationDialog } from "@/presentation/components/home/information-dialog";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HomeScreen(): JSX.Element {
	const { heading, calibrated, headingSV, magneticField } = useCompass();
	const location = useCompassLocation();
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

	const currentHeading = heading ? Math.round(heading.trueHeading) : 0;
	const cardinalDir = heading ? heading.cardinal : "N";
	const headingAccuracy = heading ? heading.headingAccuracy : null;

	return (
		<View className="flex-1">
			<View className="absolute inset-0 bg-background" />
			<ScrollView
				contentContainerClassName="grow justify-between py-6 px-4"
				showsVerticalScrollIndicator={false}
			>
				{/* Main content (Single flow) */}
				<View className="flex-1 items-center justify-center gap-6 my-4 w-full">
					<HeadingReadout heading={currentHeading} cardinal={cardinalDir} />
					<CompassDial headingSV={headingSV} heading={currentHeading} />
				</View>

				{/* Footer Actions */}
				<CalibrationButton
					calibrated={calibrated}
					onPress={() => setIsCalibrationOpen(true)}
				/>
			</ScrollView>

			{/* Information Details Overlay using HeroUI Native Dialog */}
			<InformationDialog
				isOpen={isInformationOpen}
				onOpenChange={setIsInformationOpen}
				location={location}
				accuracy={headingAccuracy}
			/>

			{/* Figure-Eight Calibration Modal Overlay */}
			<CompassCalibration
				visible={isCalibrationOpen}
				onDismiss={() => setIsCalibrationOpen(false)}
				calibrated={calibrated}
				magneticField={magneticField}
			/>
		</View>
	);
}
