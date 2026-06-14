const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const defaultConfig = getDefaultConfig(__dirname);

const { transformer, resolver } = defaultConfig;

defaultConfig.transformer = {
	...transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

defaultConfig.resolver = {
	...resolver,
	assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
	sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withUniwindConfig(defaultConfig, {
	cssEntryFile: "./src/global.css",
	extraThemes: [
		"cyan-light",
		"cyan-dark",
		"amber-light",
		"amber-dark",
		"crimson-light",
		"crimson-dark",
		"emerald-light",
		"emerald-dark",
	],
});
