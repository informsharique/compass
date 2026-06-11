import React from 'react';
import { View } from 'react-native';
import { Button } from 'heroui-native';
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
          color: applyAlpha(calibrated ? '#10b981' : '#ef4444', '10%'),
          foreground: true,
        }}
        className="border-transparent bg-transparent active:bg-surface-secondary/20 py-2 px-4 rounded-xl"
      >
        {/* Dot Icon on the Left */}
        <View
          className={`w-2 h-2 rounded-full mr-1.5 ${
            calibrated ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
          }`}
        />
        <Button.Label className="font-bold text-foreground text-sm">
          {calibrated ? 'System Calibrated' : 'Calibrate Compass'}
        </Button.Label>
      </Button>
    </View>
  );
};
