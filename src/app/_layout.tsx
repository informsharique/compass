import { Stack, ThemeProvider, DarkTheme, DefaultTheme, router } from "expo-router";
import { HeroUINativeProviderRaw } from "heroui-native/provider-raw";
import { type JSX, useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SystemUI from "expo-system-ui";

import "../global.css";
import { useUniwind } from "uniwind";
import { useThemeColor } from "heroui-native/hooks";
import { PortalHost } from "heroui-native/portal";
import { StyleSheet, View } from "react-native";
import { SettingsHeader } from "@/presentation/components/settings/settings-header";
import {
	CompassHeaderLeft,
	CompassHeaderTitle,
	CompassHeaderRight,
} from "@/presentation/components/home/compass-header";
import { BlurTargetContext, BlurTargetView } from "@/presentation/components/blur";

import { startLocationService } from "@/domain/location/location-store";

function AppNavigator(): JSX.Element {
	const backgroundColor = useThemeColor("background");
	const { theme } = useUniwind();
	const isDark = theme.includes("dark");
	const blurTargetRef = useRef<View>(null);

	useEffect(() => {
		const cleanup = startLocationService();
		return () => {
			cleanup();
		};
	}, []);

	useEffect(() => {
		if (backgroundColor) {
			SystemUI.setBackgroundColorAsync(backgroundColor).catch(() => {});
		}
	}, [backgroundColor]);

	const navigationTheme = {
		...(isDark ? DarkTheme : DefaultTheme),
		colors: {
			...(isDark ? DarkTheme.colors : DefaultTheme.colors),
			background: backgroundColor,
		},
	};

	return (
		<ThemeProvider value={navigationTheme}>
			<BlurTargetContext value={blurTargetRef}>
				<BlurTargetView ref={blurTargetRef} className="flex-1">
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor },
							statusBarStyle: isDark ? "light" : "dark",
						}}
					>
						<Stack.Screen
							name="index"
							options={{
								headerShown: true,
								headerTitle: () => <CompassHeaderTitle />,
								headerTitleAlign: "center",
								headerStyle: { backgroundColor },
								headerShadowVisible: false,
								headerLeft: () => <CompassHeaderLeft />,
								headerRight: () => <CompassHeaderRight />,
							}}
						/>
						<Stack.Screen
							name="settings"
							options={{
								headerShown: true,
								headerTitle: "",
								headerStyle: { backgroundColor },
								headerShadowVisible: false,
								headerLeft: () => <SettingsHeader onClose={() => router.back()} />,
							}}
						/>
					</Stack>
				</BlurTargetView>
			</BlurTargetContext>
		</ThemeProvider>
	);
}

export default function RootLayout(): JSX.Element {
	return (
		<GestureHandlerRootView style={styles.container}>
			<HeroUINativeProviderRaw>
				<AppNavigator />
				<PortalHost />
			</HeroUINativeProviderRaw>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
