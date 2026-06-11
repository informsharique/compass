import React from 'react';
import { View } from 'react-native';
import { Button, Typography } from 'heroui-native';
import { applyAlpha } from './color-helper';
import { triggerHapticSelection } from './haptic-helper';

interface CalibrationButtonProps {
  calibrated: boolean;
  onPress: () => void;
}

export const CalibrationButton: React.FC<CalibrationButtonProps> = ({ calibrated, onPress }) => {
  const handlePress = () => {
    triggerHapticSelection();
    onPress();
  };

  return (
    <View className="items-center w-full max-w-sm mx-auto gap-4 mb-4">
      {calibrated ? (
        <View className="flex-row items-center justify-center py-2 px-4">
          <View className="w-2.5 h-2.5 rounded-full mr-2 bg-emerald-500" />
          <Typography className="font-medium text-zinc-500 dark:text-zinc-400 text-sm">
            Compass calibrated
          </Typography>
        </View>
      ) : (
        <View className="items-center gap-2 w-full px-4">
          <Typography className="text-zinc-800 dark:text-zinc-200 text-center text-sm leading-relaxed font-normal">
            Let&apos;s get your compass pointing in the right direction.
          </Typography>
          <Button
            onPress={handlePress}
            variant="ghost"
            size="md"
            feedbackVariant="scale"
            animation={{
              scale: {
                value: 0.97,
              },
            }}
            android_ripple={{
              color: applyAlpha('#ef4444', '10%'),
              foreground: true,
            }}
            className="border-transparent bg-transparent active:bg-surface-secondary/20 py-1.5 px-4 rounded-xl"
          >
            <View className="w-2.5 h-2.5 rounded-full mr-2 animate-pulse bg-red-500" />
            <Button.Label className="font-bold text-sm text-accent">
              Calibrate compass
            </Button.Label>
          </Button>
        </View>
      )}
    </View>
  );
};

