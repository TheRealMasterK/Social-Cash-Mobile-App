import React, { memo, useEffect, useState } from "react";
import CoinBubblesController from "./coinBubblesController";
import Animated, { useDerivedValue, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { VisualizerCoin } from "./types";
import SpriteAnimation from "./AnimatedSprite";
import CoinBubble from "./CoinBubble";
import { calculateMonospacedFontSize } from "./helpers";

// @ts-ignore
import sprite from "../../images/sprites/bubble-pop-sprite.png";

const PULSE_DURATION = 400;
const PULSE_SIZE = 1.2;

const COIN_BUBBLE_Z_INDEX = 2;
const COIN_BUBBLE_Z_INDEX_LIFTED = 3;

const PULSE_Z_INDEX = 1;

const CoinBubbleView: React.FC<{
    node: VisualizerCoin;
    nodeIdx: number;
    controller: CoinBubblesController;
    onFinishedPopping: () => void;
}> = ({ node, controller, nodeIdx, onFinishedPopping }) => {
    const x = useSharedValue(node.x - node.radius);
    const y = useSharedValue(node.y - node.radius);
    const diameter = useSharedValue(node.radius * 2);
    const radius = useSharedValue(node.radius);
    const zIndex = useSharedValue(COIN_BUBBLE_Z_INDEX);
    const imageSize = useSharedValue(node.radius * 2 * 0.3);
    const textSize = useSharedValue(calculateMonospacedFontSize(node.radius * 2, node.symbol.trim().length));
    const subTextSize = useSharedValue(
        calculateMonospacedFontSize(node.radius * 2 * 0.7, node.performanceValueFormatted.trim().length)
    );

    // Pulse animation. To Note: hot reloading can sometimes cause wrong offset values.
    const pulseSize = useSharedValue<number>(0);
    const pulseOffsetY = useDerivedValue<number>(
        () => -(pulseSize.value - diameter.value) / 2 + y.value,
        [pulseSize, diameter, y]
    );
    const pulseOffsetX = useDerivedValue<number>(
        () => -(pulseSize.value - diameter.value) / 2 + x.value,
        [pulseSize, diameter, x]
    );

    // State to grow/pulse/hide bubble.
    const [isPulsing, setIsPulsing] = useState<boolean>(false);
    const [isPopping, setIsPopping] = useState<boolean>(false);
    const [isGrowing, setIsGrowing] = useState<boolean>(false);
    const [hasPopped, setHasPopped] = useState<boolean>(false);

    useEffect(() => {
        let zIndexTimeout: NodeJS.Timeout;

        const update = () => {
            const newValues = controller.coinBubbles[nodeIdx];
            if (newValues != null) {
                // Update position
                x.value = newValues.x - newValues.radius;
                y.value = newValues.y - newValues.radius;

                // Change zIndex to above other coins when dragging, for stuck to finger effect.
                if (newValues.isDragging && zIndex.value !== COIN_BUBBLE_Z_INDEX_LIFTED) {
                    clearTimeout(zIndexTimeout);
                    // Lift it above other coins(stuck to finger).
                    zIndex.value = COIN_BUBBLE_Z_INDEX_LIFTED;
                } else if (zIndex.value === COIN_BUBBLE_Z_INDEX_LIFTED && !newValues.isDragging) {
                    // After releasing coin, wait a bit before setting zIndex back to normal.
                    // Timeout is not a great solution, but it works for now.
                    zIndexTimeout = setTimeout(() => {
                        zIndex.value = COIN_BUBBLE_Z_INDEX;
                    }, 500);
                }

                // When radius changes, update diameter, image size and text size.
                if (newValues.radius !== radius.value) {
                    radius.value = newValues.radius;
                    diameter.value = withTiming(newValues.radius * 2);
                    imageSize.value = newValues.radius * 2 * 0.3;
                    textSize.value = calculateMonospacedFontSize(newValues.radius * 2, node.symbol.trim().length);
                    subTextSize.value = calculateMonospacedFontSize(
                        newValues.radius * 2 * 0.7,
                        node.symbol.trim().length
                    );
                }

                // Pulse
                if (newValues.pulse !== isPulsing) {
                    if (newValues.pulse) {
                        pulseSize.value = diameter.value;
                        pulseSize.value = withRepeat(
                            withTiming(diameter.value * PULSE_SIZE, {
                                duration: PULSE_DURATION,
                            }),
                            -1,
                            true
                        );
                        setIsPulsing(true);
                    } else {
                        setIsPulsing(false);
                    }
                }

                // Pop Animation
                if (newValues.isPopping && newValues.isPopping !== isGrowing) {
                    setIsGrowing(true);

                    pulseSize.value = newValues.radius * 2;
                    pulseSize.value = withTiming(newValues.radius * 2 * PULSE_SIZE, {
                        duration: 800,
                    });

                    // Clear timeout if user lifts finger before grow animation is finished.
                    setTimeout(() => {
                        // setIsGrowing(false);
                        setIsPopping(true);
                    }, 800);
                }
            }
        };
        controller.subscribeToTick(update);
        return () => {
            controller.unsubscribeFromTick(update);
        };
    }, [
        controller,
        diameter,
        nodeIdx,
        x,
        y,
        zIndex,
        node.symbol,
        pulseSize,
        isPulsing,
        isPopping,
        isGrowing,
        imageSize,
        textSize,
        subTextSize,
        radius,
    ]);

    // We use state to immediatly hide a coin when its popped, after that we can rely on node.hidden.
    if (hasPopped || node.hidden) {
        setTimeout(() => {
            setHasPopped(false);
            setIsGrowing(false);
            setIsPopping(false);
        }, 1000);
        return null;
    }

    if (isPopping) {
        return (
            <Animated.View
                style={{
                    display: "flex",
                    position: "absolute",
                    left: x,
                    top: y,
                    width: diameter,
                    height: diameter,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <SpriteAnimation
                    imageSource={sprite}
                    size={diameter}
                    numberOfFrames={15}
                    duration={250}
                    onAnimationFinished={() => {
                        setIsPopping(false);
                        setIsGrowing(false);
                        setHasPopped(true);
                        onFinishedPopping();
                    }}
                />
            </Animated.View>
        );
    }

    return (
        <>
            {(isPulsing || isGrowing) && (
                <Animated.View
                    style={{
                        display: "flex",
                        position: "absolute",
                        left: pulseOffsetX,
                        top: pulseOffsetY,
                        width: pulseSize,
                        height: pulseSize,
                        borderRadius: 999,
                        backgroundColor: "white",
                        zIndex: PULSE_Z_INDEX,
                    }}
                />
            )}
            <CoinBubble x={x} y={y} diameter={diameter} zIndex={zIndex} node={node} />
        </>
    );
};

// Memoised components only rerender if their props or state changes.
export default memo(CoinBubbleView);
