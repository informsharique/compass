import React from 'react';
import { View } from 'react-native';
import { Typography, Button, useThemeColor } from 'heroui-native';
import { Link } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { applyAlpha } from './color-helper';
import { triggerHaptics } from './haptic-helper';

interface CompassHeaderProps {
  onOpenInformation: () => void;
}

export const CompassHeader: React.FC<CompassHeaderProps> = ({ onOpenInformation }) => {
  const themeForeground = useThemeColor('foreground');

  const handleOpenInformation = () => {
    triggerHaptics();
    onOpenInformation();
  };

  return (
    <View className="flex-row justify-between items-center w-full max-w-md mx-auto px-2 mt-4">
      {/* Left: Information Trigger */}
      <Button
        size="sm"
        variant="ghost"
        isIconOnly
        onPress={handleOpenInformation}
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
        <Typography.Heading type="h1" className="text-2xl font-black text-foreground tracking-widest mt-0.5">
          COMPASS
        </Typography.Heading>
      </View>

      {/* Right: Settings Modal Link */}
      <Link href={'/settings' as any} asChild>
        <Button
          size="sm"
          variant="ghost"
          onPress={triggerHaptics}
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
          <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={themeForeground} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </Svg>
        </Button>
      </Link>
    </View>
  );
};
