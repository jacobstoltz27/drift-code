// Profile — header, stats grid, travel map (countries highlighted), saved tiles
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api, useAuth } from "@/src/api/client";
import { colors, radii, IMG } from "@/src/theme";
import { Avatar, TripScoreBadge, SectionHeader, GhostButton } from "@/src/components/ui";
import { TripTile } from "@/src/components/trip-cards";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);
  const [stolen, setStolen] = useState<any[]>([]);

  const load = useCallback(async () => {
    try {
      const [s, st] = await Promise.all([api.trips("saved"), api.trips("stolen")]);
      setSaved(s.trips ?? []);
      setStolen(st.trips ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = user?.stats ?? {};

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        {/* Hero banner */}
        <View style={styles.banner}>
          <Image source={{ uri: IMG.splashHero }} style={StyleSheet.absoluteFillObject} blurRadius={4} />
          <LinearGradient
            colors={["rgba(7,11,20,0.4)", "rgba(7,11,20,0.95)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            onPress={logout}
            style={styles.logoutBtn}
            testID="profile-logout-button"
          >
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <View style={styles.bannerContent}>
            <Avatar uri={user?.avatar_url ?? undefined} size={88} />
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.handle}>@{user?.email?.split("@")[0]}</Text>
            <Text style={styles.bio} numberOfLines={2}>
              {user?.bio ?? "Travel enthusiast • Building my passion passport with Drift."}
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: "Trips", value: stats.trips ?? 0 },
            { label: "Countries", value: stats.countries ?? 0 },
            { label: "Cities", value: stats.cities ?? 0 },
            {
              label: "Followers",
              value:
                (stats.followers ?? 0) >= 1000
                  ? `${((stats.followers as number) / 1000).toFixed(1)}K`
                  : stats.followers ?? 0,
            },
          ].map((s) => (
            <View key={s.label} style={styles.statCol} testID={`stat-${s.label.toLowerCase()}`}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Trip Score + Travel Score card */}
        <View style={styles.scoreCard} testID="profile-trip-score-card">
          <View style={{ flex: 1 }}>
            <Text style={styles.scoreEyebrow}>YOUR TRAVEL SCORE</Text>
            <Text style={styles.scoreTitle}>
              {stats.trip_score >= 90
                ? "Excellent"
                : stats.trip_score >= 75
                  ? "Adventurous"
                  : "Building"}
            </Text>
            <Text style={styles.scoreSub}>
              Based on diversity, hidden gems & travel days.
            </Text>
          </View>
          <TripScoreBadge score={stats.trip_score ?? 88} size={84} />
        </View>

        {/* Travel Map (mock world grid) */}
        <SectionHeader title="Travel Map" action="View all" />
        <View style={styles.mapCard} testID="profile-travel-map">
          <Text style={styles.mapTitle}>
            {stats.countries ?? 0} countries · {stats.cities ?? 0} cities
          </Text>
          <View style={styles.mapGrid}>
            {Array.from({ length: 42 }).map((_, i) => {
              const visited = i % 3 === 0;
              return (
                <View
                  key={i}
                  style={[
                    styles.mapPixel,
                    visited && { backgroundColor: colors.teal, opacity: 0.95 },
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.mapLegend}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={[styles.legendDot, { backgroundColor: colors.teal }]} />
              <Text style={styles.legendText}>Visited</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Yet to discover</Text>
            </View>
          </View>
        </View>

        {/* Statistics breakdown */}
        <SectionHeader title="Statistics" />
        <View style={styles.statsBreakdown}>
          {[
            { icon: "airplane-outline", label: "Itineraries Shared", value: stats.shared_count ?? 0 },
            { icon: "sparkles-outline", label: "Itineraries Stolen", value: stats.stolen_count ?? 0 },
            { icon: "calendar-outline", label: "Total Travel Days", value: stats.travel_days ?? 0 },
          ].map((s) => (
            <View key={s.label} style={styles.statsBreakdownRow}>
              <View style={styles.statsIcon}>
                <Ionicons name={s.icon as any} size={16} color={colors.accent} />
              </View>
              <Text style={styles.statsLabel}>{s.label}</Text>
              <Text style={styles.statsValue}>{s.value}</Text>
            </View>
          ))}
        </View>

        {/* Saved grid */}
        <SectionHeader
          title="Saved Trips"
          action={`${saved.length}`}
          onAction={() => router.push("/(tabs)/trips")}
        />
        <View style={styles.tileGrid}>
          {saved.length === 0 ? (
            <Text style={styles.empty}>You haven't saved any trips yet.</Text>
          ) : (
            saved.slice(0, 4).map((t) => (
              <TripTile
                key={t.id}
                trip={t}
                onPress={() => router.push(`/trip/${t.id}`)}
                testID={`profile-saved-${t.id}`}
              />
            ))
          )}
        </View>

        {/* Stolen */}
        <SectionHeader
          title="Stolen Itineraries"
          action={`${stolen.length}`}
          onAction={() => router.push("/(tabs)/trips")}
        />
        <View style={styles.tileGrid}>
          {stolen.length === 0 ? (
            <Text style={styles.empty}>
              Steal a creator's itinerary to claim it as your own.
            </Text>
          ) : (
            stolen.slice(0, 4).map((t) => (
              <TripTile
                key={t.id}
                trip={t}
                onPress={() => router.push(`/trip/${t.id}`)}
                testID={`profile-stolen-${t.id}`}
              />
            ))
          )}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <GhostButton label="Log out" onPress={logout} testID="profile-logout-bottom" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  banner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    minHeight: 260,
    overflow: "hidden",
  },
  logoutBtn: {
    position: "absolute",
    top: 14,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(7,11,20,0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerContent: { alignItems: "center", marginTop: 18 },
  name: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 12, letterSpacing: -0.3 },
  handle: { color: colors.textMuted, fontSize: 13, fontWeight: "600", marginTop: 2 },
  bio: {
    color: colors.text,
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: -8,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
  },
  statCol: { flex: 1, alignItems: "center" },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "900" },
  statLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "700", marginTop: 2, letterSpacing: 0.3 },
  scoreCard: {
    marginHorizontal: 20,
    marginTop: 14,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreEyebrow: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  scoreTitle: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 4 },
  scoreSub: { color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 16 },
  mapCard: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginBottom: 12 },
  mapGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  mapPixel: {
    width: 28,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  mapLegend: { flexDirection: "row", gap: 18, marginTop: 14 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  statsBreakdown: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  statsBreakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  statsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  statsLabel: { color: colors.text, fontSize: 14, flex: 1, fontWeight: "600" },
  statsValue: { color: "#fff", fontSize: 16, fontWeight: "900" },
  tileGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  empty: { color: colors.textMuted, fontSize: 13, paddingHorizontal: 0, paddingVertical: 8 },
});
