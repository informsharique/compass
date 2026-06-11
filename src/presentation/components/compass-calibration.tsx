import React, { useEffect, useContext } from "react";
import { View } from "react-native";
import { Typography, Card, Button, Dialog, useThemeColor } from "heroui-native";
import { BlurTargetContext, DialogOverlayBlurView } from "./blur";
import Animated, {
	useSharedValue,
	useAnimatedProps,
	withRepeat,
	withTiming,
	Easing,
	FlipInXUp,
	FlipOutXUp,
} from "react-native-reanimated";
import Svg, { Circle, Path as SvgPath, G } from "react-native-svg";
import { triggerHapticSelection } from "./haptic-helper";
import { applyAlpha } from "./color-helper";
import { useCompass } from "../../application/compass/use-compass";

interface CompassCalibrationProps {
  visible: boolean;
  onDismiss: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CompassCalibration: React.FC<CompassCalibrationProps> = ({ visible, onDismiss }) => {
  const animValue = useSharedValue(0);
  const themeAccent = useThemeColor("accent");
  const { calibrated, magneticField } = useCompass();
  const blurTargetRef = useContext(BlurTargetContext);

  useEffect(() => {
    if (visible) {
      animValue.value = 0;
      animValue.value = withRepeat(
        withTiming(2 * Math.PI, {
          duration: 3000,
          easing: Easing.linear,
        }),
        -1, // infinite loop
        false
      );
    }
  }, [visible, animValue]);

  // Auto-dismiss calibration modal shortly after success
  useEffect(() => {
    if (visible && calibrated) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, calibrated, onDismiss]);

  // Bernoulli Lemniscate constants
  const cx = 150;
  const cy = 80;
  const scaleX = 90;
  const scaleY = 45;

  const animatedCircleProps = useAnimatedProps(() => {
    const t = animValue.value;
    const denom = 1 + Math.pow(Math.sin(t), 2);
    const x = cx + (scaleX * Math.cos(t)) / denom;
    const y = cy + (scaleY * Math.sin(t) * Math.cos(t)) / denom;

    return {
      cx: x,
      cy: y,
    };
  });

  const generateLemniscatePath = () => {
    let d = "";
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const denom = 1 + Math.pow(Math.sin(t), 2);
      const x = cx + (scaleX * Math.cos(t)) / denom;
      const y = cy + (scaleY * Math.sin(t) * Math.cos(t)) / denom;
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        d += ` L ${x} ${y}`;
      }
    }
    return d + " Z";
  };

  const handleDismiss = () => {
    triggerHapticSelection();
    onDismiss();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleDismiss();
    }
  };

  return (
    <Dialog isOpen={visible} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <DialogOverlayBlurView blurTargetRef={blurTargetRef} />
        <Dialog.Overlay className="bg-transparent" />
        <Dialog.Content
          className="self-center w-[90%] max-w-sm p-0 bg-background/25 border-0 shadow-none"
          animation={{ entering: FlipInXUp, exiting: FlipOutXUp }}
        >
          <Card className="bg-surface/90 border border-border/25 p-6 rounded-3xl w-full gap-6 items-center shadow-2xl">
            {/* Header */}
            <View className="items-center gap-2">
              <Typography.Heading
                type="h2"
                className="text-xl font-bold text-foreground text-center px-4"
              >
                Make a figure 8 to calibrate your compass.
              </Typography.Heading>
              <Typography className="text-zinc-500 dark:text-zinc-400 text-sm text-center leading-relaxed px-4">
                Keep your device away from metal (magnetic fields), and calibrate by waving your phone
                in a figure-8 motion.
              </Typography>
            </View>

            {/* SVG Animated Figure-Eight */}
            <View className="w-[300px] h-[160px] items-center justify-center bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <Svg width="300" height="160" viewBox="0 0 300 160">
                <G transform="rotate(-12, 150, 80)">
                  {/* Background Lemniscate Path Track */}
                  <SvgPath
                    d={generateLemniscatePath()}
                    fill="none"
                    stroke={themeAccent}
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    opacity="0.4"
                  />

                  {/* Glowing animated dot tracking the lemniscate path */}
                  <AnimatedCircle r="7" fill={themeAccent} animatedProps={animatedCircleProps} />
                </G>
              </Svg>
            </View>

            {/* Sensor & Magnetic Field Info Section */}
            <View className="w-full border-t border-border/15 border-dashed pt-3 gap-2 px-4">
              <View className="flex-row justify-between items-center">
                <Typography className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
                  Sensors&apos; Accuracy
                </Typography>
                <Typography
                  className={`text-xs font-bold ${calibrated ? "text-emerald-500" : "text-red-500"}`}
                >
                  {calibrated ? "High" : "Low"}
                </Typography>
              </View>
              <View className="flex-row justify-between items-center">
                <Typography className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
                  Magnetic Field Value
                </Typography>
                <Typography className={`text-xs font-bold ${magneticField > 20 && magneticField < 65 ? "text-emerald-500" : "text-amber-500"}`}>
                  {Math.round(magneticField)}µT
                </Typography>
              </View>
            </View>

            {/* Divider */}
            <View className="w-full border-t border-border/15 border-dashed" />

            {/* Action Button */}
            <Button
              onPress={handleDismiss}
              variant="ghost"
              android_ripple={{
                color: applyAlpha(themeAccent, "15%"),
                foreground: true,
              }}
              className="w-full border-transparent bg-transparent py-3 rounded-xl"
            >
              <Button.Label
                className="font-bold text-base text-center w-full text-accent"
              >
                Done
              </Button.Label>
            </Button>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
