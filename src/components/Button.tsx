import React, { ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Button: React.FC<{ text?: string; children?: ReactNode; onClick: () => void }> = ({
    text,
    children,
    onClick,
}) => (
    <TouchableOpacity onPress={onClick}>
        <View className="p-2 border rounded">
            {text && <Text>{text}</Text>}
            {children}
        </View>
    </TouchableOpacity>
);

export default Button;
