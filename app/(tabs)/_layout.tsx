import React from "react";
import { FontAwesome, EvilIcons, Ionicons } from "@expo/vector-icons/";
import { Tabs } from "expo-router";
import Colors from "../../src/constants/colors";
import { Image } from "react-native";

// @ts-ignore
import logo from "../../src/images/cryptobanter.png";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
const TabBarIcon = (props: { name: React.ComponentProps<typeof FontAwesome>["name"]; color: string }) => (
  <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
);

const TabBarIconEvil = (props: { name: React.ComponentProps<typeof EvilIcons>["name"]; color: string }) => (
  <EvilIcons size={42} style={{ marginBottom: -3 }} {...props} />
);

const TabBarIconIon = (props: { name: React.ComponentProps<typeof Ionicons>["name"]; color: string }) => (
  <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
);

const TabBarImage = (props: { size: number }) => (
  <Image source={logo} resizeMode="contain" style={{ height: props.size, width: props.size }} />
);

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const colorScheme = "light"; // TODO: Add dark mode support.

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
      }}
    >
      <Tabs.Screen
        name="settings-sharp"
        options={{
          title: "settings-sharp",
          tabBarIcon: ({ color }) => <TabBarIconEvil name="settings-sharp" color={color} />,
        }}
      />
      <Tabs.Screen
        name="coins"
        options={{
          title: "Competitions",
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <TabBarImage size={35} />,
          header: () => null,
        }}
      />
      <Tabs.Screen
        name="newsroom"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <TabBarIconIon name="ios-megaphone-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => <TabBarIconEvil name="bell" color={color} />,
        }}
      />
    </Tabs>
  );
}
