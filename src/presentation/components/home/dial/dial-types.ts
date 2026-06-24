import { SharedValue } from "react-native-reanimated";

export interface DialColors {
	accentColor: string;
	foregroundColor: string;
	borderLinkColor: string;
	surfaceColor: string;
	backgroundColor: string;
}

export interface DialProps extends DialColors {
	rotationSV: SharedValue<number>;
}
