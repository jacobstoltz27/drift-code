// Drift bottom tab navigation
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, shadows } from "@/src/theme";

const ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; outline: keyof typeof Ionicons.glyphMap }> = {
  home: { focused: "home", outline: "home-outline" },
  explore: { focused: "compass", outline: "compass-outline" },
  planner: { focused: "sparkles", outline: "sparkles-outline" },
  trips: { focused: "airplane", outline: "airplane-outline" },
  profile: { focused: "person", outline: "person-outline" },
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
            left: 20,
            right: 20,
            bottom: Math.max(insets.bottom, 14),
            height: 66,
            borderRadius: radii.pill,
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            backgroundColor: "rgba(15,19,29,0.72)",
            paddingHorizontal: 10,
            paddingTop: 9,
            paddingBottom: 9,
            ...shadows.dock,
          },
          tabBarShowLabel: false,
          tabBarIconStyle: { flex: 1 },
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Ionicons
                name={focused ? cfg.focused : cfg.outline}
                size={22}
                color={focused ? colors.onPrimaryContainer : colors.textDim}
              />
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
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemFocused: {
    backgroundColor: colors.primaryContainer,
    ...shadows.glow,
    shadowColor: colors.glowIndigo,
  },
});
