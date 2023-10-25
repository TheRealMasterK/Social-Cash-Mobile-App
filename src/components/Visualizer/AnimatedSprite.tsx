import React, { useEffect, useMemo } from "react";
import { ImageSourcePropType, View } from "react-native";
import Animated, {
    Easing,
    SharedValue,
    runOnJS,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const SpriteAnimation: React.FC<{
    /** Number of frames in your sprite image */
    numberOfFrames: number;
    /** Duration of entire animation sequence */
    duration?: number;
    onAnimationFinished: () => void;
    /** Desired size of image */
    size: SharedValue<number>;
    imageSource: ImageSourcePropType;
}> = ({ onAnimationFinished, size, numberOfFrames, imageSource, duration = 500 }) => {
    const frameX = useSharedValue(0);
    const width = useDerivedValue(() => size.value * numberOfFrames, [size, numberOfFrames]);
    const frameOffsetX = useDerivedValue(() => -(Math.floor(frameX.value) * size.value), [frameX, size]);

    const containerDimens = useMemo(() => size.value, [size]);

    useEffect(() => {
        frameX.value = withTiming(
            numberOfFrames - 1,
            {
                duration,
                easing: Easing.linear,
            },

            finished => {
                if (finished) {
                    // https://stackoverflow.com/questions/73928255/react-native-reanimated-application-crashs-when-call-setstate-in-callback-with
                    // As withTiming runs on UI thread, we need to run this callback on JS thread, else mobile crashes.
                    runOnJS(onAnimationFinished)();
                }
            }
        );
    }, [duration, frameX, numberOfFrames, onAnimationFinished]);

    return (
        <View
            style={{
                position: "relative",
                height: containerDimens,
                width: containerDimens,
                overflow: "hidden",
            }}
        >
            <Animated.Image
                source={imageSource}
                resizeMode="contain"
                style={{
                    position: "absolute",
                    left: frameOffsetX,
                    height: containerDimens,
                    width,
                }}
            />
        </View>
    );
};

export default SpriteAnimation;
