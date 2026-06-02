// Drift Plus — premium paywall modal
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api, useAuth } from "@/src/api/client";
import { colors, radii } from "@/src/theme";

type Plan = "monthly" | "annual";

const FREE_FEATURES = [
  "Social feed and discovery",
  "Browse any community trip",
  "AI planner (2 trips)",
  "Basic profile page",
];

const PRO_FEATURES = [
  "Unlimited itinerary steals",
  "AI itinerary remixing",
  "Advanced trip customization",
  "Hidden gem recommendations",
  "Detailed AI planning",
  "Full Trip Score with AI insights",
  "World Travel Map (no invites needed)",
  "Group planning for any size",
  "Verified local Guides",
  "Offline itineraries",
  "Priority support",
];

export const PaywallModal = ({
  visible,
  onClose,
  reason = "Steal Itinerary is a Drift Plus feature.",
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  reason?: string;
  onSuccess?: () => void;
}) => {
  const { setUser } = useAuth();
  const [plan, setPlan] = useState<Plan>("annual");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const upgrade = async () => {
    setBusy(true);
    try {
      const updated = await api.upgrade(plan);
      setUser(updated);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onClose();
        onSuccess?.();
      }, 1200);
    } catch (e) {
      // ignore — preview only
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheet} edges={["bottom"]}>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Close */}
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.eyebrow}>DRIFT PLUS</Text>
                <Text style={styles.title}>Unlock unlimited travel</Text>
                <Text style={styles.reason}>{reason}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} testID="paywall-close">
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Toggle */}
            <View style={styles.toggle}>
              {(["monthly", "annual"] as Plan[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPlan(p)}
                  style={[styles.toggleBtn, plan === p && styles.toggleActive]}
                  testID={`paywall-toggle-${p}`}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      plan === p && { color: "#fff", fontWeight: "900" },
                    ]}
                  >
                    {p === "monthly" ? "Monthly" : "Annual"}
                  </Text>
                  {p === "annual" ? (
                    <LinearGradient
                      colors={[colors.teal, "#0EA5E9"]}
                      style={styles.saveBadge}
                    >
                      <Text style={styles.saveBadgeText}>Save 20%</Text>
                    </LinearGradient>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>

            {/* Plan cards */}
            <View style={{ gap: 14 }}>
              {/* Free */}
              <View style={styles.planCard} testID="paywall-plan-free">
                <Text style={styles.planName}>Free</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceMain}>$0</Text>
                  <Text style={styles.priceSuffix}>/mo</Text>
                </View>
                <Text style={styles.priceSub}>Always free</Text>
                <Text style={styles.featuresHeader}>INCLUDED</Text>
                {FREE_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Text style={[styles.checkmark, { color: colors.teal }]}>✓</Text>
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              {/* Pro */}
              <View style={[styles.planCard, styles.proCard]} testID="paywall-plan-pro">
                <View style={styles.popularBadge}>
                  <LinearGradient
                    colors={[colors.accent, "#7C8AFF"]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>

                <Text style={styles.planName}>Pro</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceMain}>
                    ${plan === "monthly" ? "8" : "7"}
                    <Text style={styles.priceCents}>
                      .{plan === "monthly" ? "99" : "19"}
                    </Text>
                  </Text>
                  <Text style={styles.priceSuffix}>/mo</Text>
                  {plan === "annual" ? (
                    <Text style={styles.strike}>$8.99</Text>
                  ) : null}
                </View>
                <Text style={styles.priceSub}>
                  {plan === "monthly" ? "Billed monthly" : "One payment of $86.28/year"}
                  {plan === "annual" ? "  ·  " : ""}
                  {plan === "annual" ? (
                    <Text style={{ color: colors.teal, fontWeight: "800" }}>Save $21.60</Text>
                  ) : (
                    ""
                  )}
                </Text>

                <Text style={styles.featuresHeader}>EVERYTHING IN FREE, PLUS</Text>
                {PRO_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Ionicons name="sparkles" size={12} color={colors.accent} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={upgrade}
                  disabled={busy || done}
                  testID="paywall-upgrade-button"
                  style={styles.ctaWrap}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[colors.teal, "#0EA5E9"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cta}
                  >
                    <Text style={styles.ctaText}>
                      {done
                        ? "✓ Welcome to Drift Plus"
                        : busy
                          ? "Processing..."
                          : plan === "monthly"
                            ? "Unlock Drift Plus — $8.99/mo"
                            : "Start Free Trial — $86.28/yr"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.legal}>
              No real payment is processed in this preview. Cancel anytime.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(7,11,20,0.85)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxHeight: "92%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", letterSpacing: -0.4, marginTop: 4 },
  reason: { color: colors.textMuted, fontSize: 13, marginTop: 6, maxWidth: 280, lineHeight: 18 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    alignSelf: "center",
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleActive: { backgroundColor: colors.accent },
  toggleText: { color: colors.textMuted, fontWeight: "700", fontSize: 13 },
  saveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
  },
  saveBadgeText: { color: "#fff", fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    position: "relative",
  },
  proCard: {
    borderColor: colors.accent,
    backgroundColor: "rgba(91,103,255,0.08)",
  },
  popularBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  popularText: { color: "#fff", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  planName: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.3 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 8 },
  priceMain: { color: "#fff", fontSize: 48, fontWeight: "900", letterSpacing: -1 },
  priceCents: { fontSize: 22, fontWeight: "900" },
  priceSuffix: { color: colors.textMuted, fontSize: 14, fontWeight: "700" },
  strike: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "line-through",
    marginLeft: 4,
  },
  priceSub: { color: colors.textMuted, fontSize: 12, fontWeight: "600", marginTop: 4 },
  featuresHeader: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 16,
    marginBottom: 8,
  },
  featureRow: { flexDirection: "row", gap: 10, paddingVertical: 6, alignItems: "center" },
  featureText: { color: colors.text, fontSize: 13, fontWeight: "600", flex: 1 },
  checkmark: { fontSize: 14, fontWeight: "900" },
  ctaWrap: { marginTop: 16, borderRadius: 999, overflow: "hidden" },
  cta: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "900", letterSpacing: 0.2 },
  legal: {
    color: colors.textDim,
    fontSize: 11,
    textAlign: "center",
    marginTop: 14,
  },
});
