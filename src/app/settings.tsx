import type { JSX } from "react";
import { View } from "react-native";
import { Typography, Card, Button, useThemeColor, PressableFeedback } from "heroui-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSettings, ThemeColor, CompassDesign, AppearanceMode } from "../domain/settings/settings-store";
import { triggerHapticSelection } from "../presentation/components/haptic-helper";
import Svg, { Path } from "react-native-svg";
import { applyAlpha } from "../presentation/components/color-helper";

import SunIcon from "../../assets/icons/sun.svg";
import MoonIcon from "../../assets/icons/moon.svg";
import SystemIcon from "../../assets/icons/system.svg";

export default function SettingsScreen(): JSX.Element {
  const router = useRouter();
  const themeForeground = useThemeColor("foreground");
  const {
    themeColor,
    compassDesign,
    appearanceMode,
    resolvedAppearanceMode,
    setThemeColor,
    setCompassDesign,
    setAppearanceMode,
  } = useSettings();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated styles for the integrated header title
  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 40], [1, 0], Extrapolate.CLAMP);
    const scale = interpolate(scrollY.value, [0, 40], [1, 0.8], Extrapolate.CLAMP);
    const translateY = interpolate(scrollY.value, [0, 40], [0, -10], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ scale }, { translateY }],
    };
  });

  const animatedSmallTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [20, 50], [0, 1], Extrapolate.CLAMP);
    return {
      opacity,
    };
  });

  const animatedHeaderBgStyle = useAnimatedStyle(() => {
    const borderOpacity = interpolate(scrollY.value, [30, 50], [0, 0.15], Extrapolate.CLAMP);
    return {
      borderBottomColor: `rgba(150, 150, 150, ${borderOpacity})`,
    };
  });

  const handleClose = () => {
    triggerHapticSelection();
    router.back();
  };

  const handleSelectColor = (color: ThemeColor) => {
    triggerHapticSelection();
    setThemeColor(color);
  };

  const handleSelectDesign = (design: CompassDesign) => {
    triggerHapticSelection();
    setCompassDesign(design);
  };

  const handleSelectAppearance = (mode: AppearanceMode) => {
    triggerHapticSelection();
    setAppearanceMode(mode);
  };

  // Predefined color choices
  const colors: { id: ThemeColor; name: string; hex: string }[] = [
    { id: "cyan", name: "Cyber Cyan", hex: "#00f0ff" },
    { id: "amber", name: "Amber Gold", hex: "#f59e0b" },
    { id: "crimson", name: "Crimson Red", hex: "#e11d48" },
    { id: "emerald", name: "Emerald Green", hex: "#10b981" },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Animated Fixed Header */}
      <Animated.View
        style={animatedHeaderBgStyle}
        className="h-16 flex-row items-center justify-between px-5 border-b border-transparent z-10 bg-background/95"
      >
        <View className="w-10" />

        {/* Small Integrated Title (fades in on scroll) */}
        <Animated.View style={animatedSmallTitleStyle}>
          <Typography.Heading type="h3" className="text-base font-bold text-foreground">
            Settings
          </Typography.Heading>
        </Animated.View>

        {/* Close Button */}
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
            color: applyAlpha(themeForeground, '20%'),
            foreground: true,
          }}
          className="w-10 h-10 p-0 items-center justify-center rounded-full bg-surface-secondary/50 border border-border/10 active:bg-surface-secondary"
        >
          <Typography className="text-base">✕</Typography>
        </Button>
      </Animated.View>

      {/* Main Settings Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Header Title (integrated with page content, fades out on scroll) */}
        <Animated.View style={animatedTitleStyle} className="pt-2 pb-6">
          <Typography.Heading type="h1" className="text-3xl font-black text-foreground tracking-wide">
            Settings
          </Typography.Heading>
          <Typography className="text-zinc-500 text-sm mt-1">
            Configure your instrument preferences
          </Typography>
        </Animated.View>
        {/* 1. Appearance Section */}
        <View className="gap-2 mb-6">
          <Typography className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-1">
            Appearance
          </Typography>
          <Card className="flex-row p-1.5 gap-1.5 rounded-2xl bg-surface/40 border border-border/10">
            <PressableFeedback
              onPress={() => handleSelectAppearance("light")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 ${
                appearanceMode === "light"
                  ? "bg-accent/15 border border-accent/20"
                  : "bg-transparent border border-transparent"
              }`}
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, '20%') }
                }}
              />
              <SunIcon
                width={16}
                height={16}
                className={appearanceMode === "light" ? "text-accent" : "text-zinc-500"}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "light" ? "text-accent" : "text-zinc-500"
                }`}
              >
                Light
              </Typography>
            </PressableFeedback>

            <PressableFeedback
              onPress={() => handleSelectAppearance("dark")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 ${
                appearanceMode === "dark"
                  ? "bg-accent/15 border border-accent/20"
                  : "bg-transparent border border-transparent"
              }`}
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, '20%') }
                }}
              />
              <MoonIcon
                width={16}
                height={16}
                className={appearanceMode === "dark" ? "text-accent" : "text-zinc-500"}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "dark" ? "text-accent" : "text-zinc-500"
                }`}
              >
                Dark
              </Typography>
            </PressableFeedback>

            <PressableFeedback
              onPress={() => handleSelectAppearance("system")}
              animation={{
                scale: {
                  value: 1,
                },
              }}
              className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-1.5 ${
                appearanceMode === "system"
                  ? "bg-accent/15 border border-accent/20"
                  : "bg-transparent border border-transparent"
              }`}
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: applyAlpha(themeForeground, '20%') }
                }}
              />
              <SystemIcon
                width={16}
                height={16}
                className={appearanceMode === "system" ? "text-accent" : "text-zinc-500"}
              />
              <Typography
                className={`text-xs font-semibold ${
                  appearanceMode === "system" ? "text-accent" : "text-zinc-500"
                }`}
              >
                System
              </Typography>
            </PressableFeedback>
          </Card>
        </View>

        {/* 2. Color Theme Section */}
        <View className="gap-2 mb-6">
          <Typography className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-1">
            Color Theme
          </Typography>
          <Card className="p-4 gap-4 rounded-2xl bg-surface/40 border border-border/10">
            <View className="flex-row justify-around">
              {colors.map((c) => {
                const isSelected = themeColor === c.id;
                return (
                  <PressableFeedback
                    key={c.id}
                    onPress={() => handleSelectColor(c.id)}
                    animation={{
                      scale: {
                        value: 1,
                      },
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: c.hex,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: resolvedAppearanceMode === "dark" ? "#ffffff" : "#000000",
                      boxShadow: isSelected
                        ? `0 0 12px ${c.hex}`
                        : "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <PressableFeedback.Ripple
                      animation={{
                        backgroundColor: { value: applyAlpha(c.hex, '20%') }
                      }}
                    />
                    {isSelected && (
                      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c.id === "amber" && resolvedAppearanceMode === "light" ? "#000000" : "#ffffff"} strokeWidth="3">
                        <Path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    )}
                  </PressableFeedback>
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
                      backgroundColor: { value: applyAlpha(themeForeground, '20%') }
                    }}
                  />
                  <View className="gap-1 flex-1 pr-4">
                    <Typography className={`font-bold text-sm ${isSelected ? "text-accent" : "text-foreground"}`}>
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
      </Animated.ScrollView>
    </View>
  );
}
