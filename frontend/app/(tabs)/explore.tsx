// Explore — single scrolling discovery experience (no chip tabs, no AI widget)
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
  const [feed, setFeed] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const f = await api.feed();
      setFeed(f.posts ?? []);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const openPost = useCallback(
    (id: string) => router.push(`/feed/${id}`),
    [router],
  );

  const forYou = useMemo(() => {
    const interests = new Set<string>(
      (user?.preferences?.interests ?? []).map((s: string) => s.toLowerCase()),
    );
    if (!interests.size) return feed.slice(0, 6);
    return feed
      .filter((p) => (p.tags ?? []).some((t: string) => interests.has(t.toLowerCase())))
      .slice(0, 6);
  }, [feed, user]);

  // Derive every visible section list in a single pass that only recomputes
  // when the data or the query changes — not on every render/keystroke remount.
  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const applyQuery = (list: any[]) =>
      !q
        ? list
        : list.filter(
            (p) =>
              p.destination?.toLowerCase().includes(q) ||
              p.title?.toLowerCase().includes(q) ||
              p.creator?.name?.toLowerCase().includes(q),
          );
    const base = [
      { title: "For You", posts: forYou },
      ...SECTIONS.map((s) => ({ title: s.title, posts: feed.filter(s.predicate) })),
    ];
    return base
      .map((s) => ({ title: s.title, posts: applyQuery(s.posts) }))
      .filter((s) => s.posts.length > 0);
  }, [feed, forYou, query]);

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

  const forYouSection = sections.find((s) => s.title === "For You");
  const otherSections = sections.filter((s) => s.title !== "For You");

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
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
          {query ? (
            <TouchableOpacity
              onPress={() => setQuery("")}
              testID="explore-search-clear"
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 130 }}
        refreshControl={
          <RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {forYouSection ? (
          <SectionRow
            title={forYouSection.title}
            posts={forYouSection.posts}
            onPressPost={openPost}
          />
        ) : null}

        <SectionHeader title="Popular Creators" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {creators.map((c) => (
            <View key={c.id} style={styles.creatorCard} testID={`creator-${c.id}`}>
              <Avatar uri={c.avatar} size={56} />
              <Text style={styles.creatorName} numberOfLines={1}>{c.name}</Text>
              <Text style={styles.creatorHandle} numberOfLines={1}>{c.handle}</Text>
              <View style={styles.creatorStat}>
                <Text style={styles.creatorStatText}>{c.posts} {c.posts === 1 ? "trip" : "trips"}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {otherSections.map((sec) => (
          <SectionRow
            key={sec.title}
            title={sec.title}
            posts={sec.posts}
            onPressPost={openPost}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const SectionRow = React.memo(
  ({
    title,
    posts,
    onPressPost,
  }: {
    title: string;
    posts: any[];
    onPressPost: (id: string) => void;
  }) => {
    if (!posts.length) return null;
    return (
      <>
        <SectionHeader title={title} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {posts.map((p) => (
            <HeroTile key={p.id} post={p} onPress={() => onPressPost(p.id)} />
          ))}
        </ScrollView>
      </>
    );
  },
);
SectionRow.displayName = "SectionRow";

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
      <Text style={styles.heroDest} numberOfLines={1}>{post.destination}</Text>
      <Text style={styles.heroMeta} numberOfLines={1}>{post.title} · {post.days}d</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 4 },
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
    marginBottom: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
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
