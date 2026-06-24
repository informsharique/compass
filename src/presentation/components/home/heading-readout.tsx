import React from "react";
import { View } from "react-native";
import { Typography } from "heroui-native/text";
import { getCardinalLongName } from "@/domain/compass/heading-utils";

interface HeadingReadoutProps {
	heading: number;
	cardinal: string;
}

export const HeadingReadout: React.FC<HeadingReadoutProps> = ({ heading, cardinal }) => {
	return (
		<View className="items-center gap-2 mb-2">
			<View className="flex-row items-baseline gap-2">
				<Typography.Heading
					type="h1"
					className="text-6xl font-black text-foreground tabular-nums tracking-tighter"
				>
					{heading}°
				</Typography.Heading>
			</View>
			<View className="flex-row items-center gap-1 bg-accent/10 rounded-md px-2 py-1">
				<Typography.Paragraph className="text-accent text-sm font-black uppercase tracking-wider">
					{getCardinalLongName(cardinal)}
				</Typography.Paragraph>
			</View>
		</View>
	);
};
