import { Stack } from "expo-router";
import { HeroUINativeProviderRaw } from "heroui-native/provider-raw";
import type { JSX } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SettingsProvider } from "@/domain/settings/settings-store";

import "../global.css";
import { useUniwind } from "uniwind";
import { useThemeColor } from "heroui-native/hooks";
import { PortalHost } from "heroui-native/portal";

function AppNavigator(): JSX.Element {
	const backgroundColor = useThemeColor("background");
	const { theme } = useUniwind();
	const isDark = theme.includes("dark");

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor },
				statusBarStyle: isDark ? "light" : "dark",
				statusBarAnimation: "fade",
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="settings" options={{ presentation: "modal" }} />
		</Stack>
	);
}

export default function RootLayout(): JSX.Element {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SettingsProvider>
				<HeroUINativeProviderRaw>
					<AppNavigator />
					<PortalHost />
				</HeroUINativeProviderRaw>
			</SettingsProvider>
		</GestureHandlerRootView>
	);
}
