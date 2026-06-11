import { useState, useRef } from "react";
import type { JSX } from "react";
import { View, ScrollView } from "react-native";
import { useCompass } from "../application/compass/use-compass";
import { useCompassLocation } from "../application/compass/use-compass-location";
import { CompassDial } from "../presentation/components/compass-dial";
import { CompassCalibration } from "../presentation/components/compass-calibration";
import { BlurTargetView, BlurTargetContext } from "../presentation/components/blur";
import { CompassHeader } from "../presentation/components/compass-header";
import { HeadingReadout } from "../presentation/components/heading-readout";
import { CalibrationButton } from "../presentation/components/calibration-button";
import { TelemetryDialog } from "../presentation/components/telemetry-dialog";

export default function HomeScreen(): JSX.Element {
  const { heading, calibrated } = useCompass();
  const location = useCompassLocation();
  const blurTargetRef = useRef<View>(null);

  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);

  const currentHeading = heading ? Math.round(heading.trueHeading) : 0;
  const cardinalDir = heading ? heading.cardinal : 'N';
  const headingAccuracy = heading ? heading.headingAccuracy : null;

  return (
    <BlurTargetContext.Provider value={blurTargetRef}>
      <View className="flex-1 bg-background">
        <BlurTargetView ref={blurTargetRef} className="flex-1">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingVertical: 24,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Title & Navigation Actions */}
            <CompassHeader onOpenTelemetry={() => setIsTelemetryOpen(true)} />

            {/* Main content (Single flow) */}
            <View className="flex-1 items-center justify-center gap-6 my-4 w-full">
              <HeadingReadout heading={currentHeading} cardinal={cardinalDir} />
              <CompassDial heading={currentHeading} />
            </View>

            {/* Footer Actions */}
            <CalibrationButton
              calibrated={calibrated}
              onPress={() => setIsCalibrationOpen(true)}
            />
          </ScrollView>
        </BlurTargetView>

        {/* Telemetry Details Overlay using HeroUI Native Dialog */}
        <TelemetryDialog
          isOpen={isTelemetryOpen}
          onOpenChange={setIsTelemetryOpen}
          location={location}
          accuracy={headingAccuracy}
          blurTargetRef={blurTargetRef}
        />

        {/* Figure-Eight Calibration Modal Overlay */}
        <CompassCalibration
          visible={isCalibrationOpen && !calibrated}
          onDismiss={() => setIsCalibrationOpen(false)}
        />
      </View>
    </BlurTargetContext.Provider>
  );
}
