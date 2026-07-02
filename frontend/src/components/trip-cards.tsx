// Drift trip-related cards: large hero upcoming card, feed card, mini saved tile.
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows, fonts, type } from "@/src/theme";
import { TripScoreBadge, Avatar } from "@/src/components/ui";

const { width } = Dimensions.get("window");
const HERO_W = Math.min(280, width - 80);

const countdownLabel = (days: number | null): string | null => {
  if (days === null) return null;
  if (days < 0) return "Past";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 45) return `In ${days} days`;
  return `In ${Math.round(days / 30)} months`;
};

const fmtDate = (s?: string) => {
  if (!s) return "";
  try {
    const d = new Date(s);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  } catch {
    return s;
  }
};

const countdownDays = (start?: string) => {
  if (!start) return null;
  const d = new Date(start).getTime();
  const now = Date.now();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  return diff;
};

export const UpcomingTripCard = ({
  trip,
  onPress,
  testID,
}: {
  trip: any;
  onPress?: () => void;
  testID?: string;
}) => {
  const days = countdownDays(trip.start_date);
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      testID={testID}
      style={[heroStyles.wrap, shadows.card]}
    >
      <ImageBackground
        source={{ uri: trip.image_url }}
        style={heroStyles.bg}
        imageStyle={{ borderRadius: radii.lg }}
      >
        <LinearGradient
          colors={["rgba(7,11,20,0.05)", "rgba(7,11,20,0.85)"]}
          style={heroStyles.overlay}
        />
        <View style={heroStyles.topRow}>
          {countdownLabel(days) ? (
            <View style={heroStyles.countdown}>
              <Ionicons name="time-outline" size={12} color={colors.text} />
              <Text style={heroStyles.countdownText}>{countdownLabel(days)}</Text>
            </View>
          ) : (
            <View />
          )}
          <TripScoreBadge score={trip.score ?? 90} size={50} testID={`trip-score-${trip.id ?? trip.destination}`} />
        </View>

        <View style={heroStyles.bottom}>
          <Text style={heroStyles.dest} numberOfLines={1}>
            {trip.destination}
          </Text>
          <Text style={heroStyles.dates}>
            {fmtDate(trip.start_date)} — {fmtDate(trip.end_date)}
          </Text>
          <View style={heroStyles.companionRow}>
            {(trip.companions ?? []).slice(0, 4).map((c: any, idx: number) => (
              <Avatar
                key={idx}
                uri={c.avatar}
                size={26}
                style={{ marginLeft: idx === 0 ? 0 : -8 }}
              />
            ))}
            {(trip.companions ?? []).length > 0 ? (
              <Text style={heroStyles.companionText}>
                with {trip.companions.map((c: any) => c.name).join(" & ")}
              </Text>
            ) : (
              <Text style={heroStyles.companionText}>Solo trip</Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const heroStyles = StyleSheet.create({
  wrap: {
    width: HERO_W,
    height: 330,
    borderRadius: radii.xl,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  bg: { flex: 1, justifyContent: "space-between" },
  overlay: { ...StyleSheet.absoluteFillObject, borderRadius: radii.xl },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
  },
  countdown: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "rgba(10,14,23,0.55)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  countdownText: {
    color: colors.text,
    fontSize: 11,
    fontFamily: fonts.bodyBold,
    marginLeft: 5,
    letterSpacing: 0.2,
  },
  bottom: { padding: 18 },
  dest: { ...type.headlineMd, color: colors.text },
  dates: { color: colors.textDim, fontSize: 12, marginTop: 3, fontFamily: fonts.bodyMedium },
  companionRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  companionText: { color: colors.textMuted, fontSize: 12, marginLeft: 8, fontFamily: fonts.bodyMedium },
});

// ---------------- Feed card ----------------

export const FeedCard = ({
  post,
  onPress,
  onSave,
  onSteal,
  onShare,
  saved,
  testID,
}: {
  post: any;
  onPress?: () => void;
  onSave?: () => void;
  onSteal?: () => void;
  onShare?: () => void;
  saved?: boolean;
  testID?: string;
}) => (
  <TouchableOpacity
    activeOpacity={0.92}
    onPress={onPress}
    testID={testID}
    style={feedStyles.wrap}
  >
    <View style={feedStyles.imgWrap}>
      <Image source={{ uri: post.image_url }} style={feedStyles.img} />
      <LinearGradient
        colors={["rgba(7,11,20,0.0)", "rgba(7,11,20,0.65)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={feedStyles.scoreAbs}>
        <TripScoreBadge score={post.score} size={48} />
      </View>
      <View style={feedStyles.titleAbs}>
        <Text style={feedStyles.titleText} numberOfLines={1}>
          {post.title}
        </Text>
        <Text style={feedStyles.destText} numberOfLines={1}>
          {post.destination} · {post.days}d
        </Text>
      </View>
    </View>

    <View style={feedStyles.creatorRow}>
      <Avatar uri={post.creator?.avatar} size={28} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={feedStyles.creatorName}>{post.creator?.name}</Text>
        <Text style={feedStyles.creatorHandle}>{post.creator?.handle}</Text>
      </View>
      <Text style={feedStyles.metaText}>
        {(post.saves ?? 0).toLocaleString()} saves
      </Text>
    </View>

    <Text style={feedStyles.summary} numberOfLines={2}>
      {post.summary}
    </Text>

    <View style={feedStyles.actionRow}>
      <TouchableOpacity
        onPress={onSave}
        style={feedStyles.actionBtn}
        testID={`save-${post.id}`}
      >
        <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={16} color={saved ? colors.teal : colors.text} />
        <Text style={feedStyles.actionText}>{saved ? "Saved" : "Save"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSteal}
        style={[feedStyles.actionBtn, feedStyles.primaryAction]}
        testID={`steal-${post.id}`}
      >
        <Ionicons name="sparkles-outline" size={16} color="#fff" />
        <Text style={[feedStyles.actionText, { color: "#fff" }]}>Steal Itinerary</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShare}
        style={feedStyles.actionBtn}
        testID={`share-${post.id}`}
      >
        <Ionicons name="share-outline" size={16} color={colors.text} />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const feedStyles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 18,
  },
  imgWrap: { height: 240, width: "100%" },
  img: { width: "100%", height: "100%" },
  scoreAbs: { position: "absolute", top: 14, right: 14 },
  titleAbs: { position: "absolute", left: 16, right: 16, bottom: 14 },
  titleText: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.4 },
  destText: { color: colors.textMuted, fontSize: 12, marginTop: 2, fontWeight: "600" },
  creatorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  creatorName: { color: colors.text, fontSize: 13, fontWeight: "700" },
  creatorHandle: { color: colors.textMuted, fontSize: 11, fontWeight: "500" },
  metaText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  summary: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  primaryAction: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    flex: 1,
    justifyContent: "center",
  },
  actionText: { color: colors.text, fontSize: 12, fontWeight: "700" },
});

// ---------------- Mini Trip Tile ----------------

export const TripTile = ({
  trip,
  onPress,
  testID,
}: {
  trip: any;
  onPress?: () => void;
  testID?: string;
}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} testID={testID} style={tileStyles.wrap}>
    <Image source={{ uri: trip.image_url }} style={tileStyles.img} />
    <LinearGradient colors={["transparent", "rgba(7,11,20,0.9)"]} style={tileStyles.overlay} />
    <View style={tileStyles.scoreAbs}>
      <TripScoreBadge score={trip.score ?? 88} size={40} />
    </View>
    <View style={tileStyles.bottom}>
      <Text style={tileStyles.dest} numberOfLines={1}>
        {trip.destination}
      </Text>
      <Text style={tileStyles.dates} numberOfLines={1}>
        {trip.start_date ? fmtDate(trip.start_date) : trip.creator?.name ?? ""}
      </Text>
    </View>
  </TouchableOpacity>
);

const tileStyles = StyleSheet.create({
  wrap: {
    width: (Dimensions.get("window").width - 56) / 2,
    height: 200,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: 12,
  },
  img: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject },
  scoreAbs: { position: "absolute", top: 10, right: 10 },
  bottom: { position: "absolute", left: 12, right: 12, bottom: 10 },
  dest: { color: "#fff", fontSize: 14, fontWeight: "800" },
  dates: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
