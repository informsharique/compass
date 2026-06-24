const CARDINALS = [
	"N",
	"NNE",
	"NE",
	"ENE",
	"E",
	"ESE",
	"SE",
	"SSE",
	"S",
	"SSW",
	"SW",
	"WSW",
	"W",
	"WNW",
	"NW",
	"NNW",
] as const;

// Kaaba coordinates
const KAABA_LAT = 21.422487;
const KAABA_LON = 39.826206;

const KAABA_LAT_RAD = KAABA_LAT * (Math.PI / 180);
const KAABA_LON_RAD = KAABA_LON * (Math.PI / 180);

export function getCardinalDirection(degree: number): string {
	// Normalize degree to 0 - 360 range
	const normalized = ((degree % 360) + 360) % 360;

	// 16 points of the compass = 22.5 degrees per sector
	// Shift by half a sector (11.25 degrees) to center the N sector around 0
	const index = Math.round(normalized / 22.5) % 16;

	return CARDINALS[index];
}

export function getCardinalLongName(cardinal: string): string {
	const names: Record<string, string> = {
		N: "North",
		NNE: "North-Northeast",
		NE: "Northeast",
		ENE: "East-Northeast",
		E: "East",
		ESE: "East-Southeast",
		SE: "Southeast",
		SSE: "South-Southeast",
		S: "South",
		SSW: "South-Southwest",
		SW: "Southwest",
		WSW: "West-Southwest",
		W: "West",
		WNW: "West-Northwest",
		NW: "Northwest",
		NNW: "North-Northwest",
	};
	return names[cardinal] || cardinal;
}

export function getBearingDeviation(current: number, target: number): number {
	// Normalize target and current to 0 - 360
	const c = ((current % 360) + 360) % 360;
	const t = ((target % 360) + 360) % 360;

	let diff = t - c;

	// Adjust to get the shortest angular distance (-180 to 180)
	while (diff < -180) diff += 360;
	while (diff > 180) diff -= 360;

	return diff;
}

export function calculateQiblaDirection(lat: number, lon: number): number {
	const latRad = lat * (Math.PI / 180);
	const lonRad = lon * (Math.PI / 180);

	const dLon = KAABA_LON_RAD - lonRad;

	const y = Math.sin(dLon) * Math.cos(KAABA_LAT_RAD);
	const x =
		Math.cos(latRad) * Math.sin(KAABA_LAT_RAD) -
		Math.sin(latRad) * Math.cos(KAABA_LAT_RAD) * Math.cos(dLon);

	let bearing = Math.atan2(y, x) * (180 / Math.PI);
	return (bearing + 360) % 360;
}
