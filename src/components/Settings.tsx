import React from "react";
import { View, Text, Switch } from "react-native";

const SettingsItem = ({ title, value, onValueChange }) => (
  <View className="flex-row justify-between p-4 border-b border-gray-300">
    <Text className="text-lg">{title}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const SettingsSection = ({ title, children }) => (
  <View className="mt-4">
    <Text className="text-xl font-bold p-4">{title}</Text>
    {children}
  </View>
);

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);

  return (
    <View className="flex flex-1 bg-gray-50 p-4">
      <SettingsSection title="Display">
        <SettingsItem title="Dark Mode" value={isDarkMode} onValueChange={value => setIsDarkMode(value)} />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsItem
          title="Enable Notifications"
          value={isNotificationsEnabled}
          onValueChange={value => setIsNotificationsEnabled(value)}
        />
        <SettingsItem
          title="Enable Notified on all GiveAways"
          value={isNotificationsEnabled}
          onValueChange={value => setIsNotificationsEnabled(value)}
        />
      </SettingsSection>
    </View>
  );
};

export default Settings;
