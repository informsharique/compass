import { Stack } from "expo-router";
import { HeroUINativeProvider, useThemeColor } from "heroui-native";
import type { JSX } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SettingsProvider } from "../domain/settings/settings-store";

import "../global.css";

function AppNavigator(): JSX.Element {
  const backgroundColor = useThemeColor("background");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
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
      <HeroUINativeProvider>
        <SettingsProvider>
          <AppNavigator />
        </SettingsProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
