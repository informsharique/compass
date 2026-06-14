import dotenv from "dotenv";
import { ExpoConfig, ConfigContext } from "expo/config";
import packageJson from "./package.json";

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "compass",
	slug: "compass",
	version: packageJson.version,
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "compass",
	owner: process.env.EXPO_PUBLIC_ACCOUNT_OWNER,
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
				imageWidth: 200,
			},
		],
		[
			"expo-build-properties",
			{
				android: {
					enableMinifyInReleaseBuilds: true,
					enableShrinkResourcesInReleaseBuilds: true,
				},
			},
		],
	],
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
	extra: {
		eas: {
			projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
		},
	},
});
