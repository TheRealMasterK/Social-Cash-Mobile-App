// Import necessary libraries
import React, { useState } from "react";
import { View, Text, Switch } from "react-native";

// Define the component props
interface CheckboxRewards {
  label: string;
}

// Define the component
const CheckboxRewards: React.FC<CheckboxRewards> = ({ label }) => {
  // Define state for the checkbox
  const [isYes, setIsYes] = useState(false);

  // Toggle the checkbox state
  const toggleSwitch = () => setIsYes(previousState => !previousState);

  return (
    <View className="flex flex-col items-center m-4">
      <Text className="text-lg mb-2">{label}</Text>
      <View className="flex flex-row items-center pb-4">
        <Text className="Heading-Checkbox">Are you interested in social cash rewards?</Text>
      </View>
      <View className="flex flex-row items-center">
        <Text className="mr-2">No</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isYes ? "#0057e7" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isYes}
        />
        <Text className="ml-2">Yes</Text>
      </View>
    </View>
  );
};

export default CheckboxRewards;
