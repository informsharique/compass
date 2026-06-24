import { useState, type JSX } from "react";
import { View, ScrollView, Linking, Platform, ToastAndroid, Alert } from "react-native";
import { Typography } from "heroui-native/text";
import { Card } from "heroui-native/card";
import { useThemeColor } from "heroui-native/hooks";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Switch } from "heroui-native/switch";
import { useCSSVariable } from "uniwind";
import Constants from "expo-constants";
import * as Location from "expo-location";
import {
	useSettings,
	ThemeColor,
	CompassDesign,
	AppearanceMode,
} from "@/domain/settings/settings-store";
import { useLocation, refreshLocation, updateLocationData } from "@/domain/location/location-store";
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
	const [themeForeground, themeAccent, themeMuted, themeBorder] = useThemeColor([
		"foreground",
		"accent",
		"muted",
		"border",
	]);

	const location = useLocation();
	const permissionStatus = location.permissionStatus;

	const {
		themeColor,
		compassDesign,
		appearanceMode,
		qiblaCompassEnabled,
		resolvedAppearanceMode,
		setThemeColor,
		setCompassDesign,
		setAppearanceMode,
		setQiblaCompassEnabled,
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

	const isPermissionGranted = permissionStatus === Location.PermissionStatus.GRANTED;

	const handleToggleQibla = async (enabled: boolean) => {
		triggerHaptics();
		if (enabled && !isPermissionGranted) {
			if (Platform.OS === "android") {
				ToastAndroid.show(
					"Location permission is required to calculate Qibla direction.",
					ToastAndroid.LONG
				);
			} else {
				Alert.alert(
					"Permission Required",
					"Location permission is required to calculate Qibla direction."
				);
			}
			Linking.openSettings().catch(() => {});
			return;
		}
		setQiblaCompassEnabled(enabled);
	};

	const handleLocationPermissionPress = async () => {
		triggerHaptics();
		if (isPermissionGranted) return;
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			updateLocationData({ permissionStatus: status });
			if (status === Location.PermissionStatus.GRANTED) {
				refreshLocation(true);
			} else {
				Linking.openSettings().catch(() => {});
			}
		} catch (err) {
			console.warn("Error requesting permission in settings:", err);
		}
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
					<Typography className="text-muted text-xs font-bold uppercase tracking-wider pl-1">
						Appearance
					</Typography>
					<Card
						onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
						className="flex-row p-1.5 gap-1.5 rounded-2xl bg-surface/70 border border-border/10 relative"
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
					</Card>
				</View>

				{/* 2. Color Theme Section */}
				<View className="gap-2 mb-6">
					<Typography className="text-muted text-xs font-bold uppercase tracking-wider pl-1">
						Color Theme
					</Typography>
					<Card className="p-4 gap-4 rounded-2xl bg-surface/70 border border-border/10">
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
								{colors.find((c) => c.id === themeColor)?.name}
							</Typography>
						</View>
					</Card>
				</View>

				{/* 3. Compass Design Section */}
				<View className="gap-2 mb-6">
					<Typography className="text-muted text-xs font-bold uppercase tracking-wider pl-1">
						Compass Dial Style
					</Typography>
					<Card className="p-2 rounded-2xl bg-surface/70 border border-border/10 gap-1">
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
							{
								id: "silver" as CompassDesign,
								title: "Silver Metallic",
								desc: "Realistic silver face with red and blue needles",
							},
							{
								id: "aero" as CompassDesign,
								title: "Aero Blue",
								desc: "Realistic blue aeronautical face with gold star",
							},
							{
								id: "nautical" as CompassDesign,
								title: "Nautical Vector",
								desc: "Clean maritime design based on vector art",
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
									android_ripple={{
										foreground: true,
										color: applyAlpha(themeAccent, "5%")
									}}
									className={`p-4 rounded-xl flex-row items-center justify-between ${
										isSelected
											? "bg-accent/10"
											: "bg-transparent active:bg-surface-secondary/40"
									}`}
								>
									<View className="gap-1 flex-1 pr-4">
										<Typography
											className={`font-bold text-sm ${isSelected ? "text-accent" : "text-foreground"}`}
										>
											{d.title}
										</Typography>
										<Typography className="text-xs text-muted">
											{d.desc}
										</Typography>
									</View>
									<View
										className={`w-5 h-5 rounded-full border items-center justify-center ${
											isSelected ? "border-accent bg-accent" : "border-muted"
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

				{/* 4. Qibla Settings Section */}
				<View className="gap-2 mb-6">
					<Typography className="text-muted text-xs font-bold uppercase tracking-wider pl-1">
						Qibla Settings
					</Typography>
					<Card className="p-4 gap-4 rounded-2xl bg-surface/70 border border-border/10">
						{/* Qibla Toggle */}
						<View className="flex-row items-center justify-between">
							<View className="flex-1 pr-4 gap-0.5">
								<Typography className="text-foreground text-sm font-semibold">
									Enable Qibla Compass
								</Typography>
								<Typography className="text-xs text-muted">
									Show Kaaba direction on the compass face
								</Typography>
							</View>
							<Switch
								isSelected={qiblaCompassEnabled}
								onSelectedChange={handleToggleQibla}
								animation={{
									scale: {
										value: [1, 1]
									},
									backgroundColor: {
										value: [themeBorder, themeAccent],
									},
								}}
							>
								<Switch.Thumb
									className="size-5"
									animation={{
										left: {
											value: 2.5,
											springConfig: {
												damping: 25,
												stiffness: 300,
												mass: 1,
											},
										},
									}}
								/>
							</Switch>
						</View>

						<View className="h-px bg-zinc-500/10 w-full" />

						{/* Location Permission Status */}
						<View className="flex-row items-center justify-between">
							<View className="flex-1 pr-4 gap-0.5">
								<Typography className="text-foreground text-sm font-semibold">
									Location Permission
								</Typography>
								<Typography className="text-xs text-muted">
									Required to calculate Qibla direction
								</Typography>
							</View>
							<PressableFeedback
								onPress={handleLocationPermissionPress}
								className={`px-3 py-1.5 rounded-md border ${
									isPermissionGranted
										? "border-emerald-500/20 bg-emerald-500/10"
										: "border-amber-500/20 bg-amber-500/10"
								}`}
								animation={{
									scale: {
										value: 1,
									},
								}}
								android_ripple={{
									foreground: true,
									color: isPermissionGranted
										? "rgba(16, 185, 129, 0.1)"
										: "rgba(245, 158, 11, 0.1)",
								}}
							>
								<Typography
									className={`text-xs font-semibold ${
										isPermissionGranted ? "text-emerald-500" : "text-amber-500"
									}`}
								>
									{isPermissionGranted ? "Enabled" : "Not Enabled"}
								</Typography>
							</PressableFeedback>
						</View>
					</Card>
				</View>

				{/* 5. Location Details Section */}
				{isPermissionGranted && (
					<View className="gap-2 mb-6">
						<Typography className="text-muted text-xs font-bold uppercase tracking-wider pl-1">
							Location Details
						</Typography>
						<Card className="p-4 gap-4 rounded-2xl bg-surface/70 border border-border/10">
							{/* City/Region */}
							<View className="flex-row items-center justify-between">
								<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
									City / Region
								</Typography>
								<Typography className="text-foreground text-sm font-semibold">
									{location.city || "Unknown"}
								</Typography>
							</View>
							<View className="h-px bg-zinc-500/10 w-full" />
							{/* Coordinates */}
							<View className="flex-row items-center justify-between">
								<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
									Coordinates
								</Typography>
								<Typography className="text-foreground text-sm font-semibold">
									{location.latitude !== 0 || location.longitude !== 0
										? `${location.latitude.toFixed(6)}°, ${location.longitude.toFixed(6)}°`
										: "--"}
								</Typography>
							</View>
							<View className="h-px bg-zinc-500/10 w-full" />
							{/* Altitude */}
							<View className="flex-row items-center justify-between">
								<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
									Altitude
								</Typography>
								<Typography className="text-foreground text-sm font-semibold">
									{location.altitude !== null
										? `${Math.round(location.altitude)} m`
										: "--"}
								</Typography>
							</View>
							<View className="h-px bg-zinc-500/10 w-full" />
							{/* Accuracy */}
							<View className="flex-row items-center justify-between">
								<Typography className="text-muted text-[10px] font-semibold uppercase tracking-wider">
									GPS Accuracy
								</Typography>
								<Typography className="text-foreground text-sm font-semibold">
									{location.accuracy !== null
										? `±${Math.round(location.accuracy)} m`
										: "--"}
								</Typography>
							</View>
						</Card>
					</View>
				)}

				{/* App Version */}
				<View className="items-center justify-center mt-8 mb-4">
					<Typography className="text-muted text-xs font-medium">
						Version {Constants.expoConfig?.version ?? "1.0.0"}
					</Typography>
				</View>
			</ScrollView>
		</View>
	);
}
