// Home: Upcoming Trips + Invite Unlock + Following Feed (focused & personal)
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api, useAuth } from "@/src/api/client";
import { colors } from "@/src/theme";
import { Avatar, SectionHeader } from "@/src/components/ui";
import { UpcomingTripCard } from "@/src/components/trip-cards";
import { InviteUnlockCard } from "@/src/components/invite-card";
import { FollowingPostCard } from "@/src/components/following-post";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [followingPosts, setFollowingPosts] = useState<any[]>([]);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [invites, setInvites] = useState({ remaining: 5, used: 0, total: 5 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [u, f, inv] = await Promise.all([
        api.trips("upcoming"),
        api.followingFeed(),
        api.invites(),
      ]);
      setUpcoming(u.trips ?? []);
      setFollowingPosts(f.posts ?? []);
      setInvites(inv);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  // Refresh upcoming when navigating back to Home (so newly scheduled trips appear)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const toggleLike = (id: string) =>
    setLiked((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            tintColor={colors.accent}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* Header */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>DRIFT</Text>
            <Text style={styles.greeting}>
              Good morning, {user?.name?.split(" ")[0] ?? "Traveler"} 👋
            </Text>
            <Text style={styles.greetingSub}>Where to next?</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            testID="home-avatar-button"
          >
            <Avatar uri={user?.avatar_url ?? undefined} size={44} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 48 }} />
        ) : (
          <>
            <SectionHeader
              title="Upcoming Trips"
              action="See all"
              onAction={() => router.push("/(tabs)/trips")}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 4 }}
            >
              {upcoming.length === 0 ? (
                <View style={styles.emptyHero} testID="upcoming-empty">
                  <Ionicons name="airplane-outline" size={28} color={colors.accent} />
                  <Text style={styles.emptyText}>No upcoming trips yet</Text>
                  <Text style={styles.emptySub}>
                    Plan your next escape with the AI Planner.
                  </Text>
                </View>
              ) : (
                upcoming.map((t) => (
                  <UpcomingTripCard
                    key={t.id}
                    trip={t}
                    onPress={() => router.push(`/trip/${t.id}`)}
                    testID={`upcoming-card-${t.id}`}
                  />
                ))
              )}
            </ScrollView>

            <InviteUnlockCard
              remaining={invites.remaining}
              onInvite={() => router.push("/invite")}
            />

            <SectionHeader title="Following" />
            <View style={{ paddingHorizontal: 20 }}>
              {followingPosts.length === 0 ? (
                <View style={styles.emptyFollow}>
                  <Text style={styles.emptyText}>No new posts yet</Text>
                  <Text style={styles.emptySub}>
                    Follow creators & guides on Explore to fill your feed.
                  </Text>
                </View>
              ) : (
                followingPosts.map((p) => (
                  <FollowingPostCard
                    key={p.id}
                    post={p}
                    liked={liked.has(p.id)}
                    onLike={() => toggleLike(p.id)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  brand: { color: colors.accent, fontSize: 14, fontWeight: "900", letterSpacing: 3 },
  greeting: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: -0.3,
  },
  greetingSub: { color: colors.textMuted, fontSize: 13, fontWeight: "600", marginTop: 2 },
  emptyHero: {
    width: 320,
    height: 200,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginRight: 16,
  },
  emptyText: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 10 },
  emptySub: { color: colors.textMuted, fontSize: 12, marginTop: 4, textAlign: "center" },
  emptyFollow: {
    padding: 30,
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
