// Import necessary libraries and components
import React from "react";
import { View } from "react-native";
import CheckboxRewards from "../../src/components/CheckboxRewards/CheckboxRewards";
import ContractAddressInput from "../../src/components/ContractAddressInput/ContractAddressInput";

// Define the component
const GiveAwayScreen: React.FC = () => (
  <View>
    <CheckboxRewards />
    <ContractAddressInput />
  </View>
);

export default GiveAwayScreen;
