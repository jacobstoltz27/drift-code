// Drift "Invite Friends Unlock" premium card
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows } from "@/src/theme";

const FEATURES: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { key: "score", icon: "speedometer", label: "Trip Score" },
  { key: "map", icon: "globe-outline", label: "World Map" },
  { key: "steal", icon: "briefcase-outline", label: "Steal Itineraries" },
  { key: "group", icon: "people-outline", label: "Group Planning" },
  { key: "creators", icon: "person-circle-outline", label: "Creator Profiles" },
];

export const InviteUnlockCard = ({
  remaining,
  onInvite,
}: {
  remaining: number;
  onInvite?: () => void;
}) => (
  <View style={[styles.wrap, shadows.card]} testID="invite-unlock-card">
    <LinearGradient
      colors={["#0B1024", "#1B1F3B"]}
      style={StyleSheet.absoluteFillObject}
    />
    {/* faint accent glow */}
    <View style={styles.glow} />

    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.eyebrow}>UNLOCK MORE</Text>
        <Text style={styles.title}>You have {remaining} invites left</Text>
      </View>
      <View style={styles.headerBadge}>
        <Ionicons name="key-outline" size={18} color={colors.accent} />
      </View>
    </View>

    <View style={styles.iconRow}>
      {FEATURES.map((f) => (
        <View key={f.key} style={styles.iconCol}>
          <View style={styles.iconCircle}>
            <Ionicons name={f.icon} size={18} color="#fff" />
          </View>
          <Text style={styles.iconLabel} numberOfLines={2}>
            {f.label}
          </Text>
        </View>
      ))}
    </View>

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onInvite}
      testID="invite-friends-button"
      style={styles.cta}
    >
      <LinearGradient
        colors={[colors.accent, "#8088FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.ctaInner}
      >
        <Ionicons name="paper-plane-outline" size={16} color="#fff" />
        <Text style={styles.ctaText}>Invite Friends</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(91,103,255,0.18)",
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },
  glow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flex: 1 },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  headerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 18,
  },
  iconCol: { alignItems: "center", width: 56 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cta: { borderRadius: 999, overflow: "hidden" },
  ctaInner: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 15, letterSpacing: 0.2 },
});
