export const applyAlpha = (colorString: string, alphaStr: string): string => {
	const alphaVal = parseFloat(alphaStr) / 100;

	if (colorString.startsWith("hsl")) {
		// If it has alpha already
		if (colorString.startsWith("hsla")) {
			return colorString.replace(/,[\s]*[0-9.]+\)$/, `, ${alphaVal})`);
		}
		return colorString.replace("hsl", "hsla").replace(")", `, ${alphaVal})`);
	}

	// Hex color conversions
	if (colorString.startsWith("#")) {
		const cleanHex = colorString.substring(1);
		const alphaHex = Math.round(alphaVal * 255)
			.toString(16)
			.padStart(2, "0");
		// If shorthand hex
		if (cleanHex.length === 3) {
			const expanded = cleanHex
				.split("")
				.map((char) => char + char)
				.join("");
			return `#${expanded}${alphaHex}`;
		}
		return `#${cleanHex.substring(0, 6)}${alphaHex}`;
	}

	return colorString;
};
