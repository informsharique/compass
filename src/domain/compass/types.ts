export interface Heading {
	magneticHeading: number;
	trueHeading: number;
	headingAccuracy: number;
	cardinal: string;
}

export interface CompassState {
	heading: Heading | null;
	calibrated: boolean;
}
