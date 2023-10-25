import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { PerformanceAccessor } from "../Visualizer/types";
import Animated, { useDerivedValue } from "react-native-reanimated";
import CoinGroupSelect from "./CoinGroupSelect";
import { Feather } from "@expo/vector-icons";
import SearchInput from "../SearchInput";
import { useCoinData } from "../CoinData/CoinDataProvider";

const RoundedButton: React.FC<{ text: string; onPress: () => void; selected: boolean }> = ({
    onPress,
    text,
    selected,
}) => (
    <TouchableOpacity onPress={onPress}>
        <View className={` ml-1 p-2.5 hover:bg-stone-900 bg-gray-300 rounded-full ${selected ? "bg-stone-900" : ""}`}>
            <Text className={`font-semibold ${selected ? "text-white" : "text-black hover:text-white"}`}>{text}</Text>
        </View>
    </TouchableOpacity>
);

const PERFORMANCE_STANDARD_FILTERS: Array<{ period: PerformanceAccessor; text: string }> = [
    // { period: "h", text: "Hour" }, // TODO
    { period: "d", text: "Today" },
    { period: "w", text: "Week" },
    { period: "m", text: "Month" },
    { period: "y", text: "Year" },
];

const TopBar: React.FC<{
    onPerformancePeriodSelected: (period: PerformanceAccessor) => void;
    height?: number;
    performancePeriod: PerformanceAccessor;
}> = ({ onPerformancePeriodSelected, height, performancePeriod }) => {
    const { setSearchTerm, progressToNextDataFetch } = useCoinData();
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const progress = useDerivedValue(() => `${progressToNextDataFetch?.value ?? 0}%`, [progressToNextDataFetch]);

    return (
        <View className="flex flex-col">
            <View
                className="flex flex-row bg-[#F3F4F6] items-center w-full"
                style={{
                    height: height ?? 50,
                }}
            >
                {!searchOpen && (
                    <>
                        <View className="flex flex-grow flex-row">
                            {PERFORMANCE_STANDARD_FILTERS.map(({ period, text }) => (
                                <RoundedButton
                                    key={period}
                                    text={text}
                                    selected={period === performancePeriod}
                                    onPress={() => onPerformancePeriodSelected(period)}
                                />
                            ))}
                        </View>
                        <View className="flex ml-auto mr-1 bg-white">
                            <CoinGroupSelect />
                        </View>

                        <TouchableOpacity onPress={() => setSearchOpen(true)}>
                            <View className="flex mx-1 ">
                                <Feather name="search" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                    </>
                )}
                {searchOpen && (
                    <SearchInput
                        onChange={value => {
                            setSearchTerm?.(value);
                            setSearchValue(value);
                        }}
                        value={searchValue}
                        onClose={() => {
                            setSearchOpen(false);
                            setSearchTerm?.("");
                            setSearchValue("");
                        }}
                    />
                )}
            </View>
            <Animated.View
                className="flex bottom-0 left-0 absolute -ml-1 h-1 bg-green-700"
                style={{ width: progress, borderRadius: 2 }}
            />
        </View>
    );
};

export default TopBar;
