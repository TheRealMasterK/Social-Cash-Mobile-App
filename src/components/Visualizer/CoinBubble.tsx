import React, { memo, useMemo } from "react";
import { View, Text, Image } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated";
import { VisualizerCoin } from "./types";
import { calculateMonospacedFontSize } from "./helpers";

// This is the size of the bubble before its scaled. We need a reasonable size for resolution. As the bubbles are scaled up/down.
const BUBBLE_FIXED_SIZE = 100;

const CoinBubble: React.FC<{
    x: SharedValue<number>;
    y: SharedValue<number>;
    diameter: SharedValue<number>;
    zIndex: SharedValue<number>;
    node: VisualizerCoin;
}> = ({ x, y, diameter, zIndex, node }) => {
    const subTextSize = useMemo(
        () => calculateMonospacedFontSize(BUBBLE_FIXED_SIZE * 0.9, node.performanceValueFormatted.trim().length),
        [node.performanceValueFormatted]
    );
    const textSize = useMemo(
        () => calculateMonospacedFontSize(BUBBLE_FIXED_SIZE, node.symbol.trim().length),
        [node.symbol]
    );
    const diameterScale = useDerivedValue(() => diameter.value / 100, [diameter]);

    const containerStyle = useAnimatedStyle(
        () => ({
            display: "flex",
            position: "absolute",
            left: x.value - BUBBLE_FIXED_SIZE / 2 + diameter.value / 2,
            top: y.value - BUBBLE_FIXED_SIZE / 2 + diameter.value / 2,
            width: BUBBLE_FIXED_SIZE,
            height: BUBBLE_FIXED_SIZE,
            zIndex: zIndex.value,
            borderRadius: 999,
            transform: [{ scale: diameterScale.value }],
        }),
        [diameter.value, diameterScale.value, x.value, y.value, zIndex.value]
    );

    const color =
        node.performanceValue < 0
            ? { borderColor: "red", backgroundColor: "#2A1A17" }
            : { borderColor: "#19E03F", backgroundColor: "#1F271B" };

    return (
        <Animated.View style={containerStyle}>
            {/* Note: Cannot have Animated children as direct child of an Animated.View */}
            <View
                style={{
                    display: "flex",
                    position: "absolute",
                    borderWidth: 2,
                    width: BUBBLE_FIXED_SIZE,
                    height: BUBBLE_FIXED_SIZE,
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                    userSelect: "none", // Web only
                    ...color,
                }}
            >
                <Image
                    style={{ height: BUBBLE_FIXED_SIZE * 0.3, width: BUBBLE_FIXED_SIZE * 0.3, borderRadius: 999 }}
                    source={{ uri: node.image }}
                />
                <Text style={{ color: "white", fontWeight: "bold", fontSize: textSize }}>
                    {node.symbol.toUpperCase()}
                </Text>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: subTextSize }}>
                    {node.performanceValueFormatted}
                </Text>
            </View>
        </Animated.View>
    );
};
// Memoised components only rerender if their props or state changes.
export default memo(CoinBubble);
