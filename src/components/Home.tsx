import React, { useState } from "react";
import { View, SafeAreaView, Platform } from "react-native";
import TopBar from "./TopBar/TopBar";
import Visualizer from "./Visualizer/Visualizer";
import { StatusBar } from "expo-status-bar";
import { PerformanceAccessor } from "./Visualizer/types";
import { SafeAreaView as SafeAreaAndroid } from "react-native-safe-area-context";
import { useCoinData } from "./CoinData/CoinDataProvider";
import LoadingPulse from "./LoadingPulse";

const TOP_BAR_HEIGHT = 50;

// This seems rediculous, but the one works on android and the other doesn't.
const SafeArea = Platform.OS === "android" ? SafeAreaAndroid : SafeAreaView;

const Home = () => {
    const [perfPeriod, setPerfPeriod] = useState<PerformanceAccessor>("d");
    const [appDimensions, setDimensions] = useState<{ height: number; width: number; x: number; y: number }>();

    const { loading, selectedCoins } = useCoinData();

    return (
        <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
            <StatusBar style="auto" />
            <SafeArea style={{ flex: 1 }}>
                <TopBar
                    onPerformancePeriodSelected={setPerfPeriod}
                    performancePeriod={perfPeriod}
                    height={TOP_BAR_HEIGHT}
                />
                <View
                    onLayout={e => {
                        const { height, width, x, y } = e.nativeEvent.layout;
                        setDimensions({ height, width, x, y });
                    }}
                    style={{ flex: 1, backgroundColor: "#1B1917" }}
                >
                    {appDimensions == null || (selectedCoins.length === 0 && loading) ? (
                        <View className="flex flex-1 justify-center items-center">
                            <LoadingPulse size={50} />
                        </View>
                    ) : (
                        <Visualizer performancePeriod={perfPeriod} dimensions={appDimensions} coins={selectedCoins} />
                    )}
                </View>
            </SafeArea>
        </View>
    );
};

export default Home;
