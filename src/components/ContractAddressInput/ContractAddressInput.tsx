import React from "react";
import { Text, TextInput, View } from "react-native";

interface ContractAddressInputProps {
  callback: (value: string) => void;
}

const ContractAddressInput: React.FC<ContractAddressInputProps> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Enter your project address
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={42}
          onChangeText={props.callback}  // Note: onChangeText sends the text directly, not an event
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'column',
    backgroundColor: '#943537',
    width: 400,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#D9D9D9',
    textAlign: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

export default ContractAddressInput;
