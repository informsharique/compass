import { ExpoConfig, ConfigContext } from "expo/config";
import packageJson from "./package.json";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "compass",
  slug: "compass",
  version: packageJson.version,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "compass",
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.sharique.compass",
    icon: {
      light: "./assets/images/ios-light.png",
      dark: "./assets/images/ios-dark.png",
      tinted: "./assets/images/ios-tinted.png",
    },
  },
  android: {
    package: "com.sharique.compass",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
	  backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/adaptive-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    "expo-system-ui",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon-light.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
        dark: {
          image: "./assets/images/splash-icon-dark.png",
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
