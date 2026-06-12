import React, { use } from "react";
import { View } from "react-native";
import { Dialog, useThemeColor } from "heroui-native";
import { CompassDetails } from "./compass-details";
import { LocationData } from "../../application/compass/use-compass-location";
import { applyAlpha } from "./color-helper";
import { FlipInXUp, FlipOutXUp } from "react-native-reanimated";
import { BlurTargetContext, DialogOverlayBlurView } from "./blur";

interface TelemetryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: LocationData | null;
  accuracy: number | null;
}

export const InformationDialog: React.FC<TelemetryDialogProps> = ({
  isOpen,
  onOpenChange,
  location,
  accuracy,
}) => {
  const blurTargetRef = use(BlurTargetContext);
  const themeForeground = useThemeColor("foreground");

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
	  	{blurTargetRef && <DialogOverlayBlurView blurTargetRef={blurTargetRef} />}
        <Dialog.Overlay className="bg-overlay/51" />
        <Dialog.Content
          className="self-center w-[90%] max-w-sm p-0 bg-transparent border-0 shadow-none"
          animation={{ entering: FlipInXUp.duration(250), exiting: FlipOutXUp.duration(200) }}
        >
          <View className="w-full relative">
            <CompassDetails location={location} accuracy={accuracy} />
            <Dialog.Close
              variant="ghost"
              className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center border border-border p-0"
              animation={{
                scale: {
                  value: 1,
                },
              }}
              android_ripple={{
                color: applyAlpha(themeForeground, "20%"),
                foreground: true,
              }}
            />
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
