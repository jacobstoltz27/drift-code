// Explore: chip categories + trending grid (lightweight, per user request)
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/src/api/client";
import { colors, radii } from "@/src/theme";
import { Pill, TripScoreBadge } from "@/src/components/ui";

const CATEGORIES = [
  "All",
  "Beaches",
  "Mountains",
  "Luxury",
  "Food",
  "Adventure",
  "Nightlife",
  "Wellness",
  "Hidden Gems",
  "Culture",
];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const [feed, setFeed] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const f = await api.feed();
      setFeed(f.posts ?? []);
    } catch {}
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = feed;
    if (active !== "All") {
      list = list.filter((p) => (p.tags ?? []).includes(active));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.destination.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.creator?.name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [feed, active, query]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      {/* Sticky-ish header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations, experiences, creators..."
            placeholderTextColor={colors.textDim}
            value={query}
            onChangeText={setQuery}
            testID="explore-search-input"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((c) => (
            <Pill
              key={c}
              label={c}
              active={active === c}
              onPress={() => setActive(c)}
              testID={`explore-chip-${c.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* AI prompts */}
        <View style={styles.aiCard} testID="explore-ai-prompts">
          <LinearGradient
            colors={["rgba(91,103,255,0.18)", "rgba(20,184,166,0.12)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={18} color={colors.accent} />
            <Text style={styles.aiTitle}>AI Destination Discovery</Text>
          </View>
          {[
            "Find me somewhere peaceful",
            "Weekend trip under $1,500",
            "Luxury beach escape",
          ].map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.aiPrompt}
              onPress={() =>
                router.push({ pathname: "/(tabs)/planner", params: { prompt: p } })
              }
              testID={`ai-prompt-${p.split(" ")[0].toLowerCase()}`}
            >
              <Text style={styles.aiPromptText}>{p}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.accent} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending */}
        <Text style={styles.sectionTitle}>Trending Destinations</Text>
        <View style={styles.grid}>
          {filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.92}
              onPress={() => router.push(`/feed/${p.id}`)}
              style={styles.gridTile}
              testID={`explore-tile-${p.id}`}
            >
              <Image source={{ uri: p.image_url }} style={StyleSheet.absoluteFillObject} />
              <LinearGradient
                colors={["transparent", "rgba(7,11,20,0.92)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={{ position: "absolute", top: 10, right: 10 }}>
                <TripScoreBadge score={p.score} size={40} />
              </View>
              <View style={styles.gridTileBottom}>
                <Text style={styles.gridDest} numberOfLines={1}>
                  {p.destination}
                </Text>
                <Text style={styles.gridMeta}>
                  {(p.likes / 1000).toFixed(1)}k · {p.days}d
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>No matches. Try a different filter.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginTop: 6 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginTop: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  chipRow: { gap: 8, paddingVertical: 14, paddingRight: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  aiCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    overflow: "hidden",
    marginBottom: 18,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  aiTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  aiPrompt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(7,11,20,0.4)",
    borderRadius: 12,
    marginBottom: 8,
  },
  aiPromptText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridTile: {
    width: "48%",
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  gridTileBottom: { position: "absolute", left: 12, right: 12, bottom: 10 },
  gridDest: { color: "#fff", fontSize: 14, fontWeight: "800" },
  gridMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: "center", marginTop: 24, width: "100%" },
});
