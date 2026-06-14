import React, { createContext, useContext, useState, useEffect } from "react";
import { Uniwind } from "uniwind";
import { useColorScheme } from "react-native";

export type ThemeColor = "cyan" | "amber" | "crimson" | "emerald";
export type CompassDesign = "classic" | "modern" | "minimalist";
export type AppearanceMode = "light" | "dark" | "system";

interface SettingsContextProps {
	themeColor: ThemeColor;
	compassDesign: CompassDesign;
	appearanceMode: AppearanceMode;
	resolvedAppearanceMode: "light" | "dark";
	setThemeColor: (color: ThemeColor) => void;
	setCompassDesign: (design: CompassDesign) => void;
	setAppearanceMode: (mode: AppearanceMode) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const systemColorScheme = useColorScheme();
	const [themeColor, setThemeColorState] = useState<ThemeColor>("cyan");
	const [compassDesign, setCompassDesign] = useState<CompassDesign>("classic");
	const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>("system");

	const resolvedAppearanceMode =
		appearanceMode === "system"
			? systemColorScheme === "light"
				? "light"
				: "dark"
			: appearanceMode;

	// Synchronize Uniwind theme whenever color or mode changes
	useEffect(() => {
		const combinedTheme = `${themeColor}-${resolvedAppearanceMode}`;
		Uniwind.setTheme(combinedTheme as any);
	}, [themeColor, resolvedAppearanceMode]);

	const setThemeColor = (color: ThemeColor) => {
		setThemeColorState(color);
	};

	const setAppearanceMode = (mode: AppearanceMode) => {
		setAppearanceModeState(mode);
	};

	return (
		<SettingsContext.Provider
			value={{
				themeColor,
				compassDesign,
				appearanceMode,
				resolvedAppearanceMode,
				setThemeColor,
				setCompassDesign,
				setAppearanceMode,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
