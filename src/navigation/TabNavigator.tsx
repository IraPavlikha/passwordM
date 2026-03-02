import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Shield, KeyRound, Activity, Settings } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import GeneratorScreen from "../screens/GeneratorScreen";
import StrengthScreen from "../screens/StrengthScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const PURPLE = "#8B5CF6";

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Паролі",
          tabBarIcon: ({ color }) => <Shield size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Generator"
        component={GeneratorScreen}
        options={{
          title: "Генератор",
          tabBarIcon: ({ color }) => <KeyRound size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Strength"
        component={StrengthScreen}
        options={{
          title: "Перевірка",
          tabBarIcon: ({ color }) => <Activity size={22} color={color} />,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Параметри",
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}