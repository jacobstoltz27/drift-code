// Drift bottom tab navigation
import React from "react";
import { View, StyleSheet, Platform, Text } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme";

const ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; outline: keyof typeof Ionicons.glyphMap }> = {
  home: { focused: "home", outline: "home-outline" },
  explore: { focused: "compass", outline: "compass-outline" },
  planner: { focused: "sparkles", outline: "sparkles-outline" },
  trips: { focused: "airplane", outline: "airplane-outline" },
  profile: { focused: "person", outline: "person-outline" },
};

const LABELS: Record<string, string> = {
  home: "Home",
  explore: "Explore",
  planner: "Planner",
  trips: "Trips",
  profile: "Profile",
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={({ route }) => {
        const cfg = ICONS[route.name] ?? ICONS.home;
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarBackground: () => (
            <BlurView
              intensity={Platform.OS === "ios" ? 60 : 80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            bottom: Math.max(insets.bottom, 12),
            height: 64,
            borderRadius: 999,
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: "rgba(14,19,34,0.85)",
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 8,
            elevation: 14,
            shadowColor: "#000",
            shadowOpacity: 0.45,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Ionicons
                name={focused ? cfg.focused : cfg.outline}
                size={focused ? 22 : 20}
                color={color}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color },
                  focused && { fontWeight: "800" },
                ]}
                numberOfLines={1}
              >
                {LABELS[route.name]}
              </Text>
            </View>
          ),
        };
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="trips" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 56,
  },
  tabItemFocused: {},
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 3,
    letterSpacing: 0.2,
  },
});
