import React from "react";
import { StyleSheet, View } from "react-native";
import { NativeWindStyleSheet } from "nativewind";
import CoinDataProvider from "../src/components/CoinData/CoinDataProvider";
import { Stack } from "expo-router";
export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

import "../nativewind-output";

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function App() {
    // TODO: Add Custom Error Boundary
    return (
        <View style={styles.container}>
            <CoinDataProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </CoinDataProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        backgroundColor: "#fff",
        height: "100%",
        width: "100%",
        overflow: "hidden",
    },
});
