import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography, Card, Button, useThemeColor } from 'heroui-native';
import { BlurTargetContext, DialogOverlayBlurView } from './blur';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path as SvgPath } from 'react-native-svg';
import { triggerHapticSelection } from './haptic-helper';
import { applyAlpha } from './color-helper';
import { useCompass } from '../../application/compass/use-compass';

interface CompassCalibrationProps {
  visible: boolean;
  onDismiss: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CompassCalibration: React.FC<CompassCalibrationProps> = ({ visible, onDismiss }) => {
  const animValue = useSharedValue(0);
  const themeAccent = useThemeColor("accent");
  const { calibrated } = useCompass();
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
    let d = '';
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
    return d + ' Z';
  };

  const handleDismiss = () => {
    triggerHapticSelection();
    onDismiss();
  };

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} className="absolute inset-0 z-50 items-center justify-center p-6">
      <DialogOverlayBlurView blurTargetRef={blurTargetRef} />
      
      <Card className="bg-surface/80 border border-border/20 p-6 rounded-3xl w-full max-w-sm gap-6 items-center shadow-2xl">
          {/* Header */}
          <View className="items-center gap-1">
            <Typography className="text-accent text-xs font-bold uppercase tracking-widest">
              Calibration Required
            </Typography>
            <Typography.Heading type="h2" className="text-xl font-bold text-foreground text-center mt-1">
              Calibrate Compass
            </Typography.Heading>
            
            {/* Real-time status indicator */}
            <View className="flex-row items-center gap-2 mt-2 bg-zinc-950/20 px-3 py-1 rounded-full border border-border/5">
              <View className={`w-2.5 h-2.5 rounded-full ${calibrated ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
              <Typography className={`text-xs font-semibold ${calibrated ? 'text-emerald-500' : 'text-rose-500'}`}>
                {calibrated ? 'Calibrated' : 'Not Calibrated'}
              </Typography>
            </View>
          </View>

          {/* SVG Animated Figure-Eight */}
          <View className="w-[300px] h-[160px] items-center justify-center bg-zinc-950/20 border border-border/5 rounded-2xl">
            <Svg width="300" height="160" viewBox="0 0 300 160">
              {/* Background Lemniscate Path Track */}
              <SvgPath
                d={generateLemniscatePath()}
                fill="none"
                stroke="var(--border)"
                strokeWidth="3"
                strokeDasharray="6 6"
                opacity="0.3"
              />

              {/* Glowing animated dot tracking the lemniscate path */}
              <AnimatedCircle
                r="7"
                fill="var(--accent)"
                animatedProps={animatedCircleProps}
              />
            </Svg>
          </View>

          {/* Instructions */}
          <Typography className="text-zinc-400 text-sm text-center leading-relaxed px-2">
            Tilt and rotate your device, moving it in a smooth{' '}
            <Typography className="font-semibold text-foreground">figure-eight (8) motion</Typography>{' '}
            to calibrate the heading sensors.
          </Typography>

          {/* Action Button */}
          <Button
            onPress={handleDismiss}
            feedbackVariant="scale"
            animation={{
              scale: {
                value: 1,
              },
            }}
            android_ripple={{
              color: applyAlpha(themeAccent, '20%'),
              foreground: true,
            }}
            className="w-full bg-accent text-accent-foreground rounded-xl"
          >
            <View className="py-3 w-full items-center justify-center">
              <Button.Label className="text-accent-foreground font-semibold">
                I&apos;m Calibrated
              </Button.Label>
            </View>
          </Button>
      </Card>
    </View>
  );
};
