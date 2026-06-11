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

const FEATURES: { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; sub: string }[] = [
  { key: "score",   icon: "trophy-outline",   label: "Trip Score",       sub: "Boost your\nTrip Score" },
  { key: "map",     icon: "globe-outline",     label: "World Map",        sub: "See trips\naround the world" },
  { key: "group",   icon: "people-outline",    label: "Group Planning",   sub: "Plan trips\ntogether" },
  { key: "badge",   icon: "ribbon-outline",    label: "Creator Badge",    sub: "Unlock exclusive\ncreator badge" },
  { key: "steal",   icon: "copy-outline",      label: "Steal Itineraries", sub: "Steal and remix\nitineraries" },
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
      <View style={styles.headerIcon}>
        <Ionicons name="person-add-outline" size={22} color={colors.accent} />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.title}>
          You have{" "}
          <Text style={styles.titleAccent}>{remaining} invites left</Text>
        </Text>
        <Text style={styles.subtitle}>Invite friends and unlock exclusive features.</Text>
      </View>
    </View>

    <View style={styles.iconRow}>
      {FEATURES.map((f) => (
        <View key={f.key} style={styles.iconCol}>
          <View style={styles.iconBox}>
            <Ionicons name={f.icon} size={20} color="#fff" />
          </View>
          <Text style={styles.iconLabel} numberOfLines={2}>
            {f.label}
          </Text>
          <Text style={styles.iconSub} numberOfLines={2}>
            {f.sub}
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
        colors={[colors.accent, "#9088FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.ctaInner}
      >
        <Ionicons name="share-outline" size={16} color="#fff" />
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
    alignItems: "flex-start",
    gap: 14,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  headerText: { flex: 1 },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  titleAccent: { color: colors.accent },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3,
    lineHeight: 17,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 18,
  },
  iconCol: { alignItems: "center", width: 56 },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(108,99,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(108,99,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  iconSub: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 3,
    textAlign: "center",
    lineHeight: 13,
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
