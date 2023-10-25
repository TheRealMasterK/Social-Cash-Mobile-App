import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface CheckboxRewardsProps {
  label: string;
  onValueChange: (value: boolean) => void;
  initialValue?: boolean;
}

const CheckboxRewards: React.FC<CheckboxRewardsProps> = ({ label, onValueChange, initialValue = false }) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const toggleCheckbox = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onValueChange(newValue);
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
          borderWidth: 1,
          borderColor: "#000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isChecked && <Text>✓</Text>}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxRewards;
