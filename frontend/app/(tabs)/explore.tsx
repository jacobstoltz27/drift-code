// Explore — Discovery hub: For You + multiple curated sections
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
import { api, useAuth } from "@/src/api/client";
import { colors, radii } from "@/src/theme";
import { Avatar, TripScoreBadge, SectionHeader } from "@/src/components/ui";

const FILTERS = ["All", "Destinations", "Itineraries", "Creators", "Guides"];

const SECTIONS: { title: string; predicate: (p: any) => boolean }[] = [
  { title: "Trending Trips", predicate: () => true },
  { title: "Hidden Gems", predicate: (p) => (p.tags ?? []).includes("Hidden Gems") },
  { title: "Luxury Escapes", predicate: (p) => (p.tags ?? []).includes("Luxury") },
  { title: "Weekend Getaways", predicate: (p) => (p.days ?? 0) <= 5 },
  { title: "Adventure Trips", predicate: (p) => (p.tags ?? []).includes("Adventure") },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
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

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // For You: posts that match user's interest tags
  const forYou = useMemo(() => {
    const interests = new Set<string>(
      (user?.preferences?.interests ?? []).map((s: string) => s.toLowerCase()),
    );
    if (!interests.size) return feed.slice(0, 4);
    return feed
      .filter((p) =>
        (p.tags ?? []).some((t: string) => interests.has(t.toLowerCase())),
      )
      .slice(0, 6);
  }, [feed, user]);

  const filtered = (list: any[]) => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.destination?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.creator?.name?.toLowerCase().includes(q),
    );
  };

  // Popular creators derived from feed
  const creators = useMemo(() => {
    const map = new Map<string, any>();
    feed.forEach((p) => {
      if (!p.creator) return;
      const c = map.get(p.creator.id) ?? { ...p.creator, posts: 0, saves: 0 };
      c.posts += 1;
      c.saves += p.saves ?? 0;
      map.set(p.creator.id, c);
    });
    return Array.from(map.values()).sort((a, b) => b.saves - a.saves).slice(0, 8);
  }, [feed]);

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      {/* Sticky header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.sub}>Discover trips, creators & hidden gems.</Text>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Destinations, itineraries, creators, guides..."
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
          {FILTERS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setFilter(c)}
              style={[styles.chip, filter === c && styles.chipActive]}
              testID={`explore-filter-${c.toLowerCase()}`}
            >
              <Text style={[styles.chipText, filter === c && styles.chipTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* AI Discovery */}
        <View style={styles.aiCard} testID="explore-ai-prompts">
          <LinearGradient
            colors={["rgba(91,103,255,0.22)", "rgba(20,184,166,0.14)"]}
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

        {/* For You */}
        {forYou.length > 0 ? (
          <>
            <SectionHeader title="For You" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
              {filtered(forYou).map((p) => (
                <HeroTile
                  key={p.id}
                  post={p}
                  onPress={() => router.push(`/feed/${p.id}`)}
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        {/* Popular Creators */}
        <SectionHeader title="Popular Creators" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {creators.map((c) => (
            <View key={c.id} style={styles.creatorCard} testID={`creator-${c.id}`}>
              <Avatar uri={c.avatar} size={56} />
              <Text style={styles.creatorName} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.creatorHandle} numberOfLines={1}>
                {c.handle}
              </Text>
              <View style={styles.creatorStat}>
                <Text style={styles.creatorStatText}>
                  {c.posts} {c.posts === 1 ? "trip" : "trips"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Discovery sections */}
        {SECTIONS.map((sec) => {
          const list = filtered(feed.filter(sec.predicate));
          if (!list.length) return null;
          return (
            <View key={sec.title}>
              <SectionHeader title={sec.title} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              >
                {list.map((p) => (
                  <HeroTile
                    key={p.id}
                    post={p}
                    onPress={() => router.push(`/feed/${p.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const HeroTile = ({ post, onPress }: { post: any; onPress?: () => void }) => (
  <TouchableOpacity
    activeOpacity={0.92}
    onPress={onPress}
    style={styles.heroTile}
    testID={`hero-tile-${post.id}`}
  >
    <Image source={{ uri: post.image_url }} style={StyleSheet.absoluteFillObject} />
    <LinearGradient
      colors={["transparent", "rgba(7,11,20,0.95)"]}
      style={StyleSheet.absoluteFillObject}
    />
    <View style={{ position: "absolute", top: 10, right: 10 }}>
      <TripScoreBadge score={post.score} size={40} />
    </View>
    <View style={styles.heroTileBottom}>
      <Text style={styles.heroDest} numberOfLines={1}>
        {post.destination}
      </Text>
      <Text style={styles.heroMeta} numberOfLines={1}>
        {post.title} · {post.days}d
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginTop: 6 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 4, fontWeight: "600" },
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
  chip: {
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.textMuted, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "800" },
  aiCard: {
    marginHorizontal: 20,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    overflow: "hidden",
    marginTop: 4,
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
  heroTile: {
    width: 220,
    height: 280,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  heroTileBottom: { position: "absolute", left: 14, right: 14, bottom: 14 },
  heroDest: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  heroMeta: { color: colors.textMuted, fontSize: 11, marginTop: 4, fontWeight: "600" },
  creatorCard: {
    width: 124,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  creatorName: { color: "#fff", fontSize: 13, fontWeight: "800", marginTop: 10 },
  creatorHandle: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  creatorStat: {
    marginTop: 8,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  creatorStatText: { color: colors.accent, fontSize: 11, fontWeight: "800" },
});
