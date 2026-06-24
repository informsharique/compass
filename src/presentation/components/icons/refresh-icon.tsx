import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useThemeColor } from 'heroui-native/hooks';

export const RefreshIcon: React.FC<SvgProps> = (props) => {
	const strokeColor = useThemeColor("foreground");
	
	return (
		<Svg 
			width={props.width || 24} 
			height={props.height || 24} 
			viewBox="0 0 24 24" 
			fill={props.fill || "none"} 
			stroke={props.stroke || strokeColor} 
			strokeWidth={props.strokeWidth || 2} 
			strokeLinecap="round" 
			strokeLinejoin="round" 
			{...props}
		>
			<Path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<Path d="M3 3v5h5" />
			<Path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
			<Path d="M16 16h5v5" />
		</Svg>
	);
};
