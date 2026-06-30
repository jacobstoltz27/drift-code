// Feed post detail
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api, useAuth } from "@/src/api/client";
import { colors } from "@/src/theme";
import { TripScoreBadge, PrimaryButton, GhostButton, Avatar } from "@/src/components/ui";
import { PaywallModal } from "@/src/components/paywall-modal";
import { ScheduleModal } from "@/src/components/schedule-modal";

export default function FeedDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any | null>(null);
  const [busy, setBusy] = useState<"save" | "steal" | "schedule" | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const p = await api.feedPost(String(id));
      setPost(p);
    } catch {
      setPost(null);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!post) {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 80 }} />
      </View>
    );
  }

  const onSave = async () => {
    setBusy("save");
    try {
      await api.savePost(post.id);
      router.push("/(tabs)/trips");
    } finally {
      setBusy(null);
    }
  };
  // Performs the steal without re-checking the gate. Used directly after a
  // successful upgrade, where the freshly-set `user` is not yet visible in this
  // render's closure.
  const doSteal = async () => {
    if (busy) return;
    setBusy("steal");
    try {
      const t = await api.stealPost(post.id);
      router.replace(`/trip/${t.id}`);
    } catch (e) {
      console.warn(e);
    } finally {
      setBusy(null);
    }
  };
  const onSteal = () => {
    if (!user?.is_premium) {
      setPaywallOpen(true);
      return;
    }
    doSteal();
  };
  // Scheduling a feed post: save it into trips (non-premium, idempotent),
  // then promote that trip into Upcoming with the chosen dates.
  const onSchedule = async (start: string, end: string) => {
    if (busy) return;
    setBusy("schedule");
    try {
      const saved = await api.savePost(post.id);
      await api.scheduleTrip(saved.id, start, end);
      setScheduleOpen(false);
      router.replace("/(tabs)/trips");
    } catch (e) {
      console.warn(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.hero}>
          <Image source={{ uri: post.image_url }} style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={["rgba(7,11,20,0.2)", "rgba(7,11,20,0.95)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => router.back()}
            testID="feed-detail-back"
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroBottom}>
            <Text style={styles.heroEyebrow}>{post.days} DAYS</Text>
            <Text style={styles.heroTitle}>{post.title}</Text>
            <Text style={styles.heroDest}>{post.destination}</Text>
          </View>
          <View style={styles.scoreFloat}>
            <TripScoreBadge score={post.score} size={64} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <View style={styles.creatorRow}>
            <Avatar uri={post.creator?.avatar} size={42} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.creatorName}>{post.creator?.name}</Text>
              <Text style={styles.creatorHandle}>{post.creator?.handle}</Text>
            </View>
            <View style={styles.creatorStats}>
              <Text style={styles.statTop}>{(post.saves ?? 0).toLocaleString()}</Text>
              <Text style={styles.statBot}>saves</Text>
            </View>
            <View style={styles.creatorStats}>
              <Text style={styles.statTop}>{(post.likes ?? 0).toLocaleString()}</Text>
              <Text style={styles.statBot}>likes</Text>
            </View>
          </View>

          <Text style={styles.summary}>{post.summary}</Text>

          <View style={styles.tagsRow}>
            {(post.tags ?? []).map((t: string) => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <PrimaryButton
              label={busy === "steal" ? "Stealing..." : "Steal Itinerary"}
              onPress={onSteal}
              loading={busy === "steal"}
              testID="feed-detail-steal"
              icon={<Ionicons name="sparkles" size={16} color="#fff" />}
              style={{ flex: 1 }}
            />
            <GhostButton
              label={busy === "save" ? "..." : "Save"}
              onPress={onSave}
              testID="feed-detail-save"
              style={{ width: 90 }}
            />
            <GhostButton
              label="Schedule"
              onPress={() => setScheduleOpen(true)}
              testID="feed-detail-schedule"
              style={{ width: 110 }}
            />
          </View>

          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
            <Text style={styles.noteText}>
              Stealing duplicates this itinerary into your trips so you can remix it with
              AI. Drift is not a booking platform — discover, plan, share.
            </Text>
          </View>
        </View>
      </ScrollView>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason="Steal Itinerary is a Drift Plus feature."
        onSuccess={doSteal}
      />
      <ScheduleModal
        visible={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={onSchedule}
        busy={busy === "schedule"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: { height: 380, justifyContent: "flex-end" },
  backBtn: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(7,11,20,0.6)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottom: { paddingHorizontal: 20, paddingBottom: 24 },
  heroEyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  heroTitle: { color: "#fff", fontSize: 30, fontWeight: "900", letterSpacing: -0.6, marginTop: 4 },
  heroDest: { color: colors.textMuted, fontSize: 14, marginTop: 4, fontWeight: "600" },
  scoreFloat: { position: "absolute", right: 20, bottom: 24 },
  creatorRow: { flexDirection: "row", alignItems: "center" },
  creatorName: { color: "#fff", fontSize: 14, fontWeight: "800" },
  creatorHandle: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  creatorStats: { alignItems: "center", marginLeft: 12 },
  statTop: { color: "#fff", fontSize: 14, fontWeight: "900" },
  statBot: { color: colors.textMuted, fontSize: 10, fontWeight: "600" },
  summary: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: 18 },
  tagsRow: { flexDirection: "row", gap: 8, marginTop: 14, flexWrap: "wrap" },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  tagText: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 22 },
  note: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
    padding: 14,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  noteText: { color: colors.textMuted, fontSize: 12, flex: 1, lineHeight: 17 },
});
