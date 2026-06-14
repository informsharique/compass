import { useState, type JSX } from "react";
import { View, ScrollView } from "react-native";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { useThemeColor } from "heroui-native/hooks";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useCSSVariable } from "uniwind";
import Constants from "expo-constants";
import {
	useSettings,
	ThemeColor,
	CompassDesign,
	AppearanceMode,
} from "@/domain/settings/settings-store";
import { AppearanceButton } from "@/presentation/components/settings/appearance-button";
import { ColorSelectionDot } from "@/presentation/components/settings/color-selection-dot";
import { triggerHaptics } from "@/presentation/utils/haptic-helper";
import { applyAlpha } from "@/presentation/utils/color-helper";
import Animated, {
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

import SunIcon from "@/assets/icons/sun.svg";
import MoonIcon from "@/assets/icons/moon.svg";
import SystemIcon from "@/assets/icons/system.svg";

const APPEARANCE_OPTIONS = [
	{ id: "system" as AppearanceMode, label: "System", Icon: SystemIcon },
	{ id: "light" as AppearanceMode, label: "Light", Icon: SunIcon },
	{ id: "dark" as AppearanceMode, label: "Dark", Icon: MoonIcon },
];

export default function SettingsScreen(): JSX.Element {
	const themeForeground = useThemeColor("foreground");
	const themeAccent = useThemeColor("accent");
	const themeMuted = useThemeColor("muted");

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

	useAnimatedReaction(
		() => activeIndex,
		(nextActiveIndex) => {
			selectedIndex.value = withSpring(nextActiveIndex, {
				damping: 20,
				stiffness: 180,
				mass: 0.8,
			});
		}
	);

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

	const handleSelectColor = (color: ThemeColor) => {
		triggerHaptics();
		setThemeColor(color);
	};

	const handleSelectDesign = (design: CompassDesign) => {
		triggerHaptics();
		setCompassDesign(design);
	};

	const handleSelectAppearance = (mode: AppearanceMode) => {
		triggerHaptics();
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
						{buttonWidth > 0 && (
							<Animated.View style={indicatorStyle} className="rounded-xl" />
						)}

						{APPEARANCE_OPTIONS.map(({ id, label, Icon }) => (
							<AppearanceButton
								key={id}
								label={label}
								Icon={Icon}
								isActive={appearanceMode === id}
								onPress={() => handleSelectAppearance(id)}
								themeAccent={themeAccent}
								themeMuted={themeMuted}
								themeForeground={themeForeground}
							/>
						))}
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
								id: "standard" as CompassDesign,
								title: "Standard Compass",
								desc: "iOS-style clean layout with dense graduation ticks",
							},
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
										isSelected
											? "bg-accent/10"
											: "bg-transparent active:bg-surface-secondary/40"
									}`}
								>
									<PressableFeedback.Ripple
										animation={{
											backgroundColor: {
												value: applyAlpha(themeForeground, "20%"),
											},
										}}
									/>
									<View className="gap-1 flex-1 pr-4">
										<Typography
											className={`font-bold text-sm ${isSelected ? "text-accent" : "text-foreground"}`}
										>
											{d.title}
										</Typography>
										<Typography className="text-xs text-zinc-500">
											{d.desc}
										</Typography>
									</View>
									<View
										className={`w-5 h-5 rounded-full border items-center justify-center ${
											isSelected
												? "border-accent bg-accent"
												: "border-zinc-500"
										}`}
									>
										{isSelected && (
											<View className="w-2.5 h-2.5 rounded-full bg-background" />
										)}
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
