import React, { memo, useCallback } from "react";
import { View } from "react-native";
import useAnimatedCoins from "./useAnimatedCoins";
import { CoinData, DimensionsType } from "../../types";
import CoinBubbleView from "./CoinBubbleView";
import { PerformanceAccessor } from "./types";

const Visualizer: React.FC<{
    performancePeriod: PerformanceAccessor;
    dimensions: DimensionsType & { x: number; y: number };
    coins: CoinData[];
}> = ({ performancePeriod, dimensions, coins }) => {
    const pointerDown = React.useRef(false);
    const controller = useAnimatedCoins(coins, dimensions, performancePeriod);

    const onDownPress = useCallback(
        (x: number, y: number) => {
            if (controller.getDraggingCoin() != null) {
                return;
            }
            const coin = controller.getCoinAtPosition(x, y - dimensions.y);
            controller.setDraggingCoin(coin);
        },
        [controller, dimensions.y]
    );
    const onUpPress = useCallback(() => {
        controller.setDraggingCoin(undefined);
    }, [controller]);

    const onMovePress = useCallback(
        (x: number, y: number) => {
            controller.setDraggingCoinPosition(x, y - dimensions.y);
        },
        [controller, dimensions.y]
    );

    return (
        <View
            // Web
            onPointerDown={e => {
                pointerDown.current = true;
                onDownPress(e.nativeEvent.pageX, e.nativeEvent.pageY);
            }}
            onPointerUp={() => {
                pointerDown.current = false;
                onUpPress();
            }}
            onPointerMove={e => {
                if (pointerDown.current) {
                    onMovePress(e.nativeEvent.pageX, e.nativeEvent.pageY);
                }
                e.preventDefault();
            }}
            // Mobile
            onTouchStart={e => {
                onDownPress(e.nativeEvent.pageX, e.nativeEvent.pageY);
            }}
            onTouchMove={e => {
                onMovePress(e.nativeEvent.pageX, e.nativeEvent.pageY);
                e.preventDefault();
            }}
            onTouchEnd={() => {
                onUpPress();
            }}
            style={{ flex: 1 }}
        >
            {controller.coinBubbles.map((node, idx) => (
                <CoinBubbleView
                    key={`${node.id}-${node.symbol}-${node.name}`}
                    node={node}
                    controller={controller}
                    nodeIdx={idx}
                    onFinishedPopping={() => {
                        controller.visualizerCoinPopped(node.id);
                    }}
                />
            ))}
        </View>
    );
};

// We memoise this component as we only want it to rerender when its props change. Else visualizer will redraw bubbles each rerender(bad performance).
export default memo(Visualizer);
