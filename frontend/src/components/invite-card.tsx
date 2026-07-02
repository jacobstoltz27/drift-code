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
import { colors, radii, shadows, fonts, type } from "@/src/theme";

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
      colors={["rgba(123,133,255,0.10)", "rgba(123,133,255,0.0)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    {/* faint accent glow */}
    <View style={styles.glow} />

    <View style={styles.header}>
      <View style={styles.headerIcon}>
        <Ionicons name="person-add" size={24} color={colors.accent} />
      </View>
      <View style={styles.headerLeft}>
        <Text style={styles.title}>
          You have <Text style={styles.titleAccent}>{remaining} invites</Text> left
        </Text>
        <Text style={styles.subtitle}>
          Unlock exclusive creator features by inviting travel partners.
        </Text>
      </View>
    </View>

    <View style={styles.iconRow}>
      {FEATURES.map((f) => (
        <View key={f.key} style={styles.iconCol}>
          <View style={styles.iconCircle}>
            <Ionicons name={f.icon} size={17} color={colors.text} />
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
      accessibilityRole="button"
      accessibilityLabel="Invite friends"
      style={styles.cta}
    >
      <Ionicons name="share-social-outline" size={18} color={colors.onPrimaryContainer} />
      <Text style={styles.ctaText}>Invite Friends</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: "rgba(123,133,255,0.16)",
    backgroundColor: colors.surfaceElevated,
    overflow: "hidden",
    padding: 20,
  },
  glow: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accent,
    opacity: 0.14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLeft: { flex: 1 },
  title: {
    ...type.title,
    color: colors.text,
  },
  titleAccent: { color: colors.accent, fontFamily: fonts.bodyBold },
  subtitle: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    fontFamily: fonts.bodyMedium,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 20,
  },
  iconCol: { alignItems: "center", width: 58 },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: radii.sm,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: fonts.bodyBold,
    marginTop: 8,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  cta: {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryContainer,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: colors.onPrimaryContainer,
    fontFamily: fonts.bodyExtrabold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
