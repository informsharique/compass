import { useState, type JSX } from "react";
import { View, ScrollView } from "react-native";
import { Typography, Card, Button, useThemeColor, PressableFeedback } from "heroui-native";
import { Stack, useRouter } from "expo-router";
import { useCSSVariable } from "uniwind";
import Constants from "expo-constants";
import {
	useSettings,
	ThemeColor,
	CompassDesign,
	AppearanceMode,
} from "../domain/settings/settings-store";
import {
	triggerHapticSelection,
	triggerHapticThemeChange,
	triggerHapticColorChange,
	triggerHapticDesignChange,
} from "../presentation/components/haptic-helper";
import Svg, { Path } from "react-native-svg";
import { applyAlpha } from "../presentation/components/color-helper";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

import SunIcon from "../../assets/icons/sun.svg";
import MoonIcon from "../../assets/icons/moon.svg";
import SystemIcon from "../../assets/icons/system.svg";

function ColorSelectionDot({
  color,
  isSelected,
  onPress,
  resolvedAppearanceMode,
  themeForeground,
}: {
  color: { id: ThemeColor; name: string; hex: string };
  isSelected: boolean;
  onPress: () => void;
  resolvedAppearanceMode: string;
  themeForeground: string;
}) {
  const scale = useSharedValue(isSelected ? 1 : 0.6);
  const opacity = useSharedValue(isSelected ? 1 : 0);

  scale.value = withSpring(isSelected ? 1 : 0.6, {
    damping: 15,
    stiffness: 220,
    mass: 0.6,
  });
  opacity.value = withTiming(isSelected ? 1 : 0, { duration: 120 });

  const ringStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={{ width: 56, height: 56, alignItems: "center", justifyContent: "center" }}>
      {/* Outer Ring Animated */}
      <Animated.View
        style={[
          ringStyle,
          {
            position: "absolute",
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor:
              resolvedAppearanceMode === "dark"
                ? applyAlpha(themeForeground, "80%")
                : applyAlpha(themeForeground, "25%"),
          },
        ]}
      />

      <PressableFeedback
        onPress={onPress}
        animation={{
          scale: {
            value: isSelected ? 0.95 : 1,
          },
        }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: color.hex,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isSelected ? `0 0 12px ${color.hex}` : "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <PressableFeedback.Ripple
          animation={{
            backgroundColor: { value: applyAlpha(color.hex, "20%") },
          }}
        />
        {isSelected && (
          <Svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={
              color.id === "amber" && resolvedAppearanceMode === "light" ? "#000000" : "#ffffff"
            }
            strokeWidth="3"
          >
            <Path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </PressableFeedback>
    </View>
  );
}

export default function SettingsScreen(): JSX.Element {
  const router = useRouter();
  const themeForeground = useThemeColor("foreground");
  const themeAccent = useThemeColor("accent");
  const themeMuted = useThemeColor("muted");
  const themeBackground = useThemeColor("background");

  const {
    themeColor,
    compassDesign,
    appearanceMode,
    resolvedAppearanceMode,
    setThemeColor,
    setCompassDesign,
    setAppearanceMode,
  } = useSettings();

  const [containerWidth, setContainerWidth] = useState(0);
  const activeIndex = appearanceMode === "system" ? 0 : appearanceMode === "light" ? 1 : 2;

  const selectedIndex = useSharedValue(activeIndex);
  selectedIndex.value = withTiming(activeIndex, { duration: 180 });

  const padding = 6;
  const gap = 6;
  const buttonWidth = containerWidth ? (containerWidth - padding * 2 - gap * 2) / 3 : 0;

  const animatedStyle = useAnimatedStyle(() => {
    if (buttonWidth === 0) return { opacity: 0 };
    const leftPosition = padding + selectedIndex.value * (buttonWidth + gap);
    return {
      position: "absolute",
      left: leftPosition,
      top: padding,
      bottom: padding,
      width: buttonWidth,
      opacity: 1,
    };
  });

  const indicatorStyle = [
    animatedStyle,
    {
      backgroundColor: applyAlpha(themeAccent, "15%"),
      borderColor: applyAlpha(themeAccent, "20%"),
      borderWidth: 1,
    },
  ];

  const handleClose = () => {
    triggerHapticSelection();
    router.back();
  };

  const handleSelectColor = (color: ThemeColor) => {
    triggerHapticColorChange();
    setThemeColor(color);
  };

  const handleSelectDesign = (design: CompassDesign) => {
    triggerHapticDesignChange();
    setCompassDesign(design);
  };

  const handleSelectAppearance = (mode: AppearanceMode) => {
    triggerHapticThemeChange();
    setAppearanceMode(mode);
  };

  const [cyanVal, amberVal, crimsonVal, emeraldVal] = useCSSVariable([
    "--theme-cyan",
    "--theme-amber",
    "--theme-crimson",
    "--theme-emerald",
  ]) as (string | undefined)[];

  // Predefined color choices
  const colors: { id: ThemeColor; name: string; hex: string }[] = [
    { id: "cyan", name: "Cyber Cyan", hex: cyanVal || "#00f0ff" },
    { id: "amber", name: "Amber Gold", hex: amberVal || "#f59e0b" },
    { id: "crimson", name: "Crimson Red", hex: crimsonVal || "#e11d48" },
    { id: "emerald", name: "Emerald Green", hex: emeraldVal || "#10b981" },
  ];

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: themeBackground },
          headerShadowVisible: false,
          headerLeft: () => (
            <View className="flex-row items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onPress={handleClose}
                feedbackVariant="scale"
                animation={{
                  scale: {
                    value: 1,
                  },
                }}
                android_ripple={{
                  color: applyAlpha(themeForeground, "20%"),
                  foreground: true,
                }}
                className="w-10 h-10 p-0 items-center justify-center rounded-full bg-surface-secondary/51 border border-border/10"
              >
                <Svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={themeForeground}
                  strokeWidth="2.5"
                >
                  <Path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </Button>
              <View className="flex-col gap-0.25">
                <Typography.Heading
                  type="h2"
                  className="text-xl font-bold text-foreground leading-tight"
                >
                  Settings
                </Typography.Heading>
                <Typography.Paragraph className="text-zinc-500 text-sm leading-tight">
                  Configure your compass preferences
                </Typography.Paragraph>
              </View>
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Appearance Section */}
        <View className="gap-2 mb-6">
          <Typography className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-1">
            Appearance
          </Typography>
          <View
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
            className="flex-row p-1.5 gap-1.5 rounded-2xl bg-surface/40 border border-border/10 relative"
          >
            {buttonWidth > 0 && <Animated.View style={indicatorStyle} className="rounded-xl" />}

            {/* System */}
            <PressableFeedback
              onPress={() => handleSelectAppearance("system")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 bg-transparent border border-transparent"
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, "20%") },
                }}
              />
              <SystemIcon
                width={16}
                height={16}
                color={appearanceMode === "system" ? themeAccent : themeMuted}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "system" ? "text-accent" : "text-zinc-500"
                }`}
              >
                System
              </Typography>
            </PressableFeedback>

            {/* Light */}
            <PressableFeedback
              onPress={() => handleSelectAppearance("light")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 bg-transparent border border-transparent"
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, "20%") },
                }}
              />
              <SunIcon
                width={16}
                height={16}
                color={appearanceMode === "light" ? themeAccent : themeMuted}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "light" ? "text-accent" : "text-zinc-500"
                }`}
              >
                Light
              </Typography>
            </PressableFeedback>

            {/* Dark */}
            <PressableFeedback
              onPress={() => handleSelectAppearance("dark")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 bg-transparent border border-transparent"
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, "20%") },
                }}
              />
              <MoonIcon
                width={16}
                height={16}
                color={appearanceMode === "dark" ? themeAccent : themeMuted}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "dark" ? "text-accent" : "text-zinc-500"
                }`}
              >
                Dark
              </Typography>
            </PressableFeedback>
          </View>
        </View>

        {/* 2. Color Theme Section */}
        <View className="gap-2 mb-6">
          <Typography className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-1">
            Color Theme
          </Typography>
          <Card className="p-4 gap-4 rounded-2xl bg-surface/40 border border-border/10">
            <View className="flex-row justify-around items-center">
              {colors.map((c) => {
                const isSelected = themeColor === c.id;
                return (
                  <ColorSelectionDot
                    key={c.id}
                    color={c}
                    isSelected={isSelected}
                    onPress={() => handleSelectColor(c.id)}
                    resolvedAppearanceMode={resolvedAppearanceMode}
                    themeForeground={themeForeground}
                  />
                );
              })}
            </View>
            <View className="items-center">
              <Typography className="text-foreground text-sm font-semibold capitalize">
                {colors.find((c) => c.id === themeColor)?.name} Theme
              </Typography>
            </View>
          </Card>
        </View>

        {/* 3. Compass Design Section */}
        <View className="gap-2 mb-6">
          <Typography className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-1">
            Compass Dial Style
          </Typography>
          <Card className="p-2 rounded-2xl bg-surface/40 border border-border/10 gap-1">
            {[
              {
                id: "classic" as CompassDesign,
                title: "Classic Rose",
                desc: "Detailed ticks with full 16-point cardinal rose",
              },
              {
                id: "modern" as CompassDesign,
                title: "Modern HUD",
                desc: "Sci-fi tactical radar interface with crosshairs",
              },
              {
                id: "minimalist" as CompassDesign,
                title: "Minimalist Bauhaus",
                desc: "High-contrast geometric layout with clean pointers",
              },
            ].map((d) => {
              const isSelected = compassDesign === d.id;
              return (
                <PressableFeedback
                  key={d.id}
                  onPress={() => handleSelectDesign(d.id)}
                  animation={{
                    scale: {
                      value: 1,
                    },
                  }}
                  className={`p-4 rounded-xl flex-row items-center justify-between ${
                    isSelected ? "bg-accent/10" : "bg-transparent active:bg-surface-secondary/40"
                  }`}
                >
                  <PressableFeedback.Ripple
                    animation={{
                      backgroundColor: { value: applyAlpha(themeForeground, "20%") },
                    }}
                  />
                  <View className="gap-1 flex-1 pr-4">
                    <Typography
                      className={`font-bold text-sm ${isSelected ? "text-accent" : "text-foreground"}`}
                    >
                      {d.title}
                    </Typography>
                    <Typography className="text-xs text-zinc-500">{d.desc}</Typography>
                  </View>
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center ${
                      isSelected ? "border-accent bg-accent" : "border-zinc-500"
                    }`}
                  >
                    {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-background" />}
                  </View>
                </PressableFeedback>
              );
            })}
          </Card>
        </View>

        {/* App Version */}
        <View className="items-center justify-center mt-8 mb-4">
          <Typography className="text-zinc-500 text-xs font-medium">
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}
