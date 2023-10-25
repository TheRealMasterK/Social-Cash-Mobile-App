import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useCoinData } from "../CoinData/CoinDataProvider";
import { Entypo } from "@expo/vector-icons";

const CoinGroupSelect: React.FC = () => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { availableCoinGroups, setSelectedCoinGroup, selectedCoinGroup } = useCoinData();
    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View className="flex-row ml-auto border items-center rounded-md p-1 border-black  border-solid">
                    <Entypo name="select-arrows" size={10} color="black" />
                    <Text className="ml-1 font-semibold">{selectedCoinGroup}</Text>
                </View>
            </TouchableOpacity>
            <Modal transparent={true} visible={modalVisible}>
                <View className="flex flex-col w-[90%] bg-white m-auto rounded overflow-auto">
                    <View className="flex flex-row p-2 w-full">
                        <Text className="font-bold text-lg">Groupings</Text>
                        <View className="ml-auto">
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Entypo name="cross" size={18} color="black" />
                            </Pressable>
                        </View>
                    </View>
                    {availableCoinGroups?.map(group => (
                        <TouchableOpacity
                            key={group}
                            onPress={() => {
                                setSelectedCoinGroup?.(group);
                                setModalVisible(false);
                            }}
                        >
                            <View className="flex flex-col items-center p-2 w-full">
                                <View className="w-[90%] border-b border-gray-300 items-center">
                                    <Text className="font-semibold">{group}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </Modal>
        </>
    );
};

export default CoinGroupSelect;
