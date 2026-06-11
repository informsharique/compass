import React from 'react';
import { View } from 'react-native';
import { Typography, Button, useThemeColor } from 'heroui-native';
import { Link } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { applyAlpha } from './color-helper';
import { triggerHapticSelection } from './haptic-helper';

interface CompassHeaderProps {
  onOpenTelemetry: () => void;
}

export const CompassHeader: React.FC<CompassHeaderProps> = ({ onOpenTelemetry }) => {
  const themeForeground = useThemeColor('foreground');

  const handleOpenTelemetry = () => {
    triggerHapticSelection();
    onOpenTelemetry();
  };

  return (
    <View className="flex-row justify-between items-center w-full max-w-md mx-auto px-2 mt-4">
      {/* Left: Telemetry Trigger */}
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        onPress={handleOpenTelemetry}
        feedbackVariant="scale"
        animation={{
          scale: {
            value: 1,
          },
        }}
        android_ripple={{
          color: applyAlpha(themeForeground, '20%'),
          foreground: true,
        }}
        className="w-10 h-10 p-0 items-center justify-center rounded-full bg-surface-secondary/51 border border-border/10 active:bg-surface-secondary"
      >
        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={themeForeground} strokeWidth="2.5">
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Button>

      {/* Center Title */}
      <View className="items-center">
        <Typography className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          Instrument
        </Typography>
        <Typography.Heading type="h1" className="text-2xl font-black text-foreground tracking-widest mt-0.5">
          COMPASS
        </Typography.Heading>
      </View>

      {/* Right: Settings Modal Link */}
      <Link href={'/settings' as any} asChild>
        <Button
          size="sm"
          variant="ghost"
          onPress={triggerHapticSelection}
          feedbackVariant="scale"
          animation={{
            scale: {
              value: 1,
            },
          }}
          android_ripple={{
            color: applyAlpha(themeForeground, '20%'),
            foreground: true,
          }}
          className="w-10 h-10 p-0 items-center justify-center rounded-full bg-surface-secondary/51 border border-border/10 active:bg-surface-secondary"
        >
          <Typography className="text-lg">⚙️</Typography>
        </Button>
      </Link>
    </View>
  );
};
