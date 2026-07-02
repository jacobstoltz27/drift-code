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
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radii, shadows, type, fonts } from "@/src/theme";

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

// Frosted glass surface with real backdrop blur + a hair-line highlight border.
export const GlassCard = ({
  children,
  style,
  intensity = 24,
  testID,
}: {
  children?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  testID?: string;
}) => (
  <View testID={testID} style={[styles.glass, style]}>
    <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
    <View style={styles.glassTint} pointerEvents="none" />
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
    accessibilityRole="button"
    accessibilityState={{ selected: !!active }}
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
    activeOpacity={0.9}
    onPress={onPress}
    disabled={disabled || loading}
    testID={testID}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={[{ borderRadius: radii.lg, overflow: "hidden" }, shadows.glow, style]}
  >
    <LinearGradient
      colors={[colors.accent, colors.primary]}
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
    accessibilityRole="button"
    accessibilityLabel={label}
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
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        },
        style,
      ]}
    />
  ) : (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primarySoft,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          alignItems: "center",
          justifyContent: "center",
        },
        style as ViewStyle,
      ]}
    >
      <Text style={{ color: colors.accent, fontSize: size * 0.4, fontFamily: fonts.bodyBold }}>
        ?
      </Text>
    </View>
  );

// Circular Trip Score badge — colored ring over a translucent disc.
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
    score >= 90 ? colors.teal : score >= 75 ? colors.accent : colors.gold;
  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(10,14,23,0.72)",
        borderWidth: 2,
        borderColor: ringColor,
        alignItems: "center",
        justifyContent: "center",
        ...shadows.glow,
        shadowColor: ringColor,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: size * 0.34,
          fontFamily: fonts.displayBold,
        }}
      >
        {Math.round(score)}
      </Text>
      <Text
        style={{
          color: colors.textMuted,
          fontSize: 8,
          marginTop: -1,
          letterSpacing: 1.4,
          fontFamily: fonts.bodyBold,
        }}
      >
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
      <TouchableOpacity
        onPress={onAction}
        accessibilityRole="button"
        testID={`section-${title.toLowerCase().replace(/\s+/g, "-")}-action`}
      >
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  glass: {
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: "hidden",
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glass,
  },
  pill: {
    paddingHorizontal: 16,
    height: 38,
    minWidth: 64,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glass,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  pillActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  pillText: {
    color: colors.textMuted,
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
  },
  pillTextActive: {
    color: colors.onPrimaryContainer,
    fontFamily: fonts.bodyBold,
  },
  primaryBtn: {
    height: 54,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: colors.onPrimaryContainer,
    fontSize: 15,
    fontFamily: fonts.bodyExtrabold,
    letterSpacing: 0.2,
  },
  ghostBtn: {
    height: 54,
    paddingHorizontal: 28,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass,
  },
  ghostBtnText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.bodyBold,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 14,
  },
  sectionTitle: {
    ...(type.headlineMd as TextStyle),
  },
  sectionAction: {
    color: colors.accent,
    fontSize: 13,
    fontFamily: fonts.bodyBold,
  },
});
