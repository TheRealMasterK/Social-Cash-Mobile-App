import { Feather, AntDesign } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const SearchInput: React.FC<{ onChange: (value: string) => void; value: string; onClose: () => void }> = ({
    value,
    onChange,
    onClose,
}) => (
    <View className="flex flex-1 p-1 mx-2 flex-row  border rounded items-center">
        <Feather size={22} name="search" />
        <TextInput className="flex flex-1" value={value} onChangeText={onChange} />
        <TouchableOpacity onPress={onClose}>
            <AntDesign size={22} name="close" />
        </TouchableOpacity>
    </View>
);

export default SearchInput;
