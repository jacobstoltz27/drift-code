// Trips screen — 4 tabs: Upcoming, Past, Saved, Stolen
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { api } from "@/src/api/client";
import { colors } from "@/src/theme";
import { Pill } from "@/src/components/ui";
import { TripTile } from "@/src/components/trip-cards";

const TABS = ["upcoming", "past", "saved", "stolen"] as const;
type TabKey = (typeof TABS)[number];
const LABEL: Record<TabKey, string> = {
  upcoming: "Upcoming",
  past: "Past",
  saved: "Saved",
  stolen: "Stolen",
};

export default function TripsScreen() {
  const router = useRouter();
  const [active, setActive] = useState<TabKey>("upcoming");
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (b: TabKey) => {
    try {
      const r = await api.trips(b);
      setTrips(r.trips ?? []);
    } catch {
      setTrips([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load(active);
      setLoading(false);
    })();
  }, [active, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(active);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.sub}>Manage your travels, all in one place.</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {TABS.map((t) => (
            <Pill
              key={t}
              label={LABEL[t]}
              active={active === t}
              onPress={() => setActive(t)}
              testID={`trips-tab-${t}`}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 48 }} />
        ) : trips.length === 0 ? (
          <View style={styles.empty} testID="trips-empty">
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySub}>
              {active === "saved"
                ? "Save trips from your feed to revisit later."
                : active === "stolen"
                  ? "Steal an itinerary from a creator to claim it."
                  : active === "past"
                    ? "Your travel history will appear here."
                    : "Plan your next adventure with the AI Planner."}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {trips.map((t) => (
              <TripTile
                key={t.id}
                trip={t}
                onPress={() => router.push(`/trip/${t.id}`)}
                testID={`trip-tile-${t.id}`}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 6 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4, fontWeight: "600" },
  chipRow: { paddingVertical: 14, gap: 8, paddingRight: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  empty: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  emptySub: { color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 6 },
});
