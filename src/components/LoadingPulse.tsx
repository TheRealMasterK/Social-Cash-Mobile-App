import React, { useEffect } from "react";
import Animated, { useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
// @ts-ignore
import logo from "../images/cryptobanter.png"; // TODO: configure webpack/metro/typescript to handle image imports.

const PULSE_DURATION = 500;

const LoadingPulse: React.FC<{ size: number }> = ({ size }) => {
  const pulseSize = useSharedValue(size);

  useEffect(() => {
    pulseSize.value = withRepeat(
      withSequence(
        withTiming(size * 1.5, { duration: PULSE_DURATION }),
        withTiming(size, { duration: PULSE_DURATION })
      ),
      -1 // Infinite
    );
  }, [pulseSize, size]);

  return (
    <Animated.Image
      source={logo}
      resizeMode="contain"
      style={{ margin: "auto", width: pulseSize, height: pulseSize }}
    />
  );
};

export default LoadingPulse;
