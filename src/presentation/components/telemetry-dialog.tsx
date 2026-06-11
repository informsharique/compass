import React from "react";
import { View } from "react-native";
import { Dialog, useThemeColor } from "heroui-native";
import { CompassDetails } from "./compass-details";
import { LocationData } from "../../application/compass/use-compass-location";
import { applyAlpha } from "./color-helper";
import { triggerHapticSelection } from "./haptic-helper";
import { DialogOverlayBlurView } from "./blur";
import { FlipInXUp, FlipOutXUp } from "react-native-reanimated";

interface TelemetryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  location: LocationData | null;
  accuracy: number | null;
  blurTargetRef: React.RefObject<View | null> | undefined;
}

export const TelemetryDialog: React.FC<TelemetryDialogProps> = ({
  isOpen,
  onOpenChange,
  location,
  accuracy,
  blurTargetRef,
}) => {
  const themeForeground = useThemeColor("foreground");

  const handleOpenChange = (open: boolean) => {
    triggerHapticSelection();
    onOpenChange(open);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <DialogOverlayBlurView blurTargetRef={blurTargetRef} />
        <Dialog.Overlay className="bg-transparent" />
        <Dialog.Content
          className="self-center w-[90%] max-w-sm p-0 bg-background/25 border-0 shadow-none"
          animation={{ entering: FlipInXUp, exiting: FlipOutXUp }}
        >
          <View className="w-full relative">
            <CompassDetails location={location} accuracy={accuracy} />
            <Dialog.Close
              variant="ghost"
              onPress={triggerHapticSelection}
              className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center bg-zinc-950/40 active:bg-zinc-950/60 border border-white/5 p-0"
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
