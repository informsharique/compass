import type { View } from 'react-native';
import { BlurTargetView as ExpoBlurTargetView, BlurView as ExpoBlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useUniwind, withUniwind } from 'uniwind';
import { createContext } from 'react';

const BlurView = withUniwind(ExpoBlurView);
export const BlurTargetView = withUniwind(ExpoBlurTargetView);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type blurTargetRefType = React.RefObject<View | null> | undefined;

export const BlurTargetContext = createContext<blurTargetRefType>(undefined);

export function DialogOverlayBlurView({ blurTargetRef }: { blurTargetRef: blurTargetRefType }) {
	const { theme } = useUniwind();

	return (
		<AnimatedBlurView
			entering={FadeIn.duration(350)}
			exiting={FadeOut.duration(300)}
			intensity={20}
			tint={theme === 'dark' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
			className="absolute inset-0"
			blurMethod="dimezisBlurViewSdk31Plus"
			blurTarget={blurTargetRef}
			pointerEvents="none"
		/>
	);
}
