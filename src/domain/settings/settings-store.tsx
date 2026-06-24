import { useState, useEffect } from "react";
import { createMMKV } from "react-native-mmkv";
import { Uniwind, useUniwind } from "uniwind";
import { Appearance } from "react-native";

export const storage = createMMKV();

export type ThemeColor = "cyan" | "amber" | "crimson" | "emerald";
export type CompassDesign = "classic" | "modern" | "minimalist" | "standard" | "aero" | "silver" | "nautical";
export type AppearanceMode = "light" | "dark" | "system";

const COLOR_KEY = "settings.themeColor";
const DESIGN_KEY = "settings.compassDesign";
const APPEARANCE_KEY = "settings.appearanceMode";
const QIBLA_KEY = "settings.qiblaCompassEnabled";

// Getter helper functions
export const getThemeColor = (): ThemeColor => (storage.getString(COLOR_KEY) as ThemeColor) || "cyan";
export const getCompassDesign = (): CompassDesign => (storage.getString(DESIGN_KEY) as CompassDesign) || "standard";
export const getAppearanceMode = (): AppearanceMode => (storage.getString(APPEARANCE_KEY) as AppearanceMode) || "system";
export const getQiblaCompassEnabled = (): boolean => storage.getBoolean(QIBLA_KEY) ?? false;

// Synchronize theme in Uniwind using CSS-defined themes and Uniwind's theme resolution
export const syncTheme = () => {
	const color = getThemeColor();
	const mode = getAppearanceMode();

	let resolvedMode: "light" | "dark";
	if (mode === "system") {
		// Leverage Uniwind to check and resolve the system color scheme
		Uniwind.setTheme("system");
		resolvedMode = Uniwind.currentTheme.includes("dark") ? "dark" : "light";
	} else {
		resolvedMode = mode;
	}

	const combinedTheme = `${color}-${resolvedMode}`;
	Uniwind.setTheme(combinedTheme as any);
};

// Listeners for settings updates (pub-sub)
type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribe = (listener: Listener) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

const notify = () => {
	listeners.forEach((l) => l());
};

// Setters
export const setThemeColor = (color: ThemeColor) => {
	storage.set(COLOR_KEY, color);
	syncTheme();
	notify();
};

export const setCompassDesign = (design: CompassDesign) => {
	storage.set(DESIGN_KEY, design);
	notify();
};

export const setAppearanceMode = (mode: AppearanceMode) => {
	storage.set(APPEARANCE_KEY, mode);
	syncTheme();
	notify();
};

export const setQiblaCompassEnabled = (enabled: boolean) => {
	storage.set(QIBLA_KEY, enabled);
	notify();
};

// Listen to system theme changes to update the Uniwind theme color combination dynamically when in system mode
Appearance.addChangeListener(() => {
	if (getAppearanceMode() === "system") {
		syncTheme();
		notify();
	}
});

// Perform initial sync on load
syncTheme();

// Custom hook to consume settings reactively
export const useSettings = () => {
	const { theme } = useUniwind();
	const [state, setState] = useState(() => ({
		themeColor: getThemeColor(),
		compassDesign: getCompassDesign(),
		appearanceMode: getAppearanceMode(),
		qiblaCompassEnabled: getQiblaCompassEnabled(),
	}));

	useEffect(() => {
		return subscribe(() => {
			setState({
				themeColor: getThemeColor(),
				compassDesign: getCompassDesign(),
				appearanceMode: getAppearanceMode(),
				qiblaCompassEnabled: getQiblaCompassEnabled(),
			});
		});
	}, []);

	const resolvedAppearanceMode = theme.includes("dark") ? ("dark" as const) : ("light" as const);

	return {
		...state,
		resolvedAppearanceMode,
		setThemeColor,
		setCompassDesign,
		setAppearanceMode,
		setQiblaCompassEnabled,
	};
};
