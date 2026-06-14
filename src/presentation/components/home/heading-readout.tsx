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
		<View className="items-center gap-1 mb-2">
			<View className="flex-row items-baseline gap-2">
				<Typography.Heading
					type="h1"
					className="text-6xl font-black text-foreground tabular-nums tracking-tighter"
				>
					{heading}°
				</Typography.Heading>
				<Typography.Heading type="h3" className="text-2xl font-bold text-accent">
					{cardinal}
				</Typography.Heading>
			</View>
			<Typography className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">
				{getCardinalLongName(cardinal)}
			</Typography>
		</View>
	);
};
