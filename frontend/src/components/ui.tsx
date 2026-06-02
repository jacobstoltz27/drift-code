// Shared UI primitives for Drift
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii, shadows } from "@/src/theme";

export const Card = ({
  children,
  style,
  testID,
}: {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}) => (
  <View testID={testID} style={[styles.card, style]}>
    {children}
  </View>
);

export const GlassCard = ({
  children,
  style,
  testID,
}: {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}) => (
  <View testID={testID} style={[styles.glass, style]}>
    {children}
  </View>
);

export const Pill = ({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  testID?: string;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    testID={testID}
    style={[styles.pill, active && styles.pillActive]}
  >
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export const PrimaryButton = ({
  label,
  onPress,
  testID,
  disabled,
  loading,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  testID?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    disabled={disabled || loading}
    testID={testID}
    style={[{ borderRadius: radii.pill, overflow: "hidden" }, style]}
  >
    <LinearGradient
      colors={[colors.accent, "#7C8AFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.primaryBtn, disabled && { opacity: 0.5 }]}
    >
      {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
      <Text style={styles.primaryBtnText}>{loading ? "..." : label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export const GhostButton = ({
  label,
  onPress,
  testID,
  style,
}: {
  label: string;
  onPress?: () => void;
  testID?: string;
  style?: ViewStyle;
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    testID={testID}
    style={[styles.ghostBtn, style]}
  >
    <Text style={styles.ghostBtnText}>{label}</Text>
  </TouchableOpacity>
);

export const Avatar = ({
  uri,
  size = 28,
  style,
}: {
  uri?: string | null;
  size?: number;
  style?: ImageStyle;
}) =>
  uri ? (
    <Image
      source={{ uri }}
      style={[
        { width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: colors.background },
        style,
      ]}
    />
  ) : (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.background, alignItems: "center", justifyContent: "center" },
        style as ViewStyle,
      ]}
    >
      <Text style={{ color: colors.text, fontSize: size * 0.4, fontWeight: "700" }}>?</Text>
    </View>
  );

// Circular SVG-free Trip Score badge using overlapping arcs (use two rings of color).
// We approximate the conic by overlaying a colored disc trimmed by a smaller dark disc.
export const TripScoreBadge = ({
  score,
  size = 56,
  testID,
}: {
  score: number;
  size?: number;
  testID?: string;
}) => {
  const ringColor =
    score >= 90 ? colors.teal : score >= 75 ? colors.accent : "#F59E0B";
  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(7,11,20,0.7)",
        borderWidth: 2,
        borderColor: ringColor,
        alignItems: "center",
        justifyContent: "center",
        ...shadows.glow,
        shadowColor: ringColor,
      }}
    >
      <Text style={{ color: colors.text, fontSize: size * 0.34, fontWeight: "900" }}>
        {Math.round(score)}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 8, marginTop: -2, letterSpacing: 1 }}>
        SCORE
      </Text>
    </View>
  );
};

export const Divider = ({ style }: { style?: ViewStyle }) => (
  <View style={[{ height: 1, backgroundColor: colors.border }, style]} />
);

export const SectionHeader = ({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? (
      <TouchableOpacity onPress={onAction} testID={`section-${title.toLowerCase().replace(/\s+/g, "-")}-action`}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  glass: {
    backgroundColor: colors.glass,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    paddingHorizontal: 14,
    height: 36,
    minWidth: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 13,
  },
  pillTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  primaryBtn: {
    height: 52,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  ghostBtn: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass,
  },
  ghostBtnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});
