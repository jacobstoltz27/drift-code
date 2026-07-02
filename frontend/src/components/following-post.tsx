// Following feed post — cinematic full-bleed social card
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, shadows, fonts, type } from "@/src/theme";
import { Avatar } from "@/src/components/ui";

const EngageButton = ({
  icon,
  count,
  color,
  onPress,
  label,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  count?: number;
  color: string;
  onPress?: () => void;
  label: string;
  testID?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.engageBtn}
    testID={testID}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={icon} size={26} color={color} />
    {count !== undefined ? (
      <Text style={styles.engageCount}>{count.toLocaleString()}</Text>
    ) : null}
  </TouchableOpacity>
);

export const FollowingPostCard = ({
  post,
  onPress,
  onLike,
  onSave,
  onComment,
  onShare,
  onSteal,
  onFollow,
  liked,
  saved,
  following,
}: {
  post: any;
  onPress?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSteal?: () => void;
  onFollow?: () => void;
  liked?: boolean;
  saved?: boolean;
  following?: boolean;
}) => {
  const isItinerary = post.kind === "itinerary" || post.kind === "trip";
  const heading =
    post.title ??
    (post.days ? `${post.days} days in ${post.destination}` : post.destination);

  return (
    <View style={[styles.wrap, shadows.card]} testID={`following-post-${post.id}`}>
      <Image source={{ uri: post.image_url }} style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={["rgba(6,9,15,0.72)", "transparent", "rgba(6,9,15,0.92)"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top: creator + follow */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.creator}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`View ${post.creator?.name ?? "creator"}'s trip`}
        >
          <Avatar uri={post.creator?.avatar} size={40} />
          <View style={{ marginLeft: 10, flexShrink: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {post.creator?.handle ?? post.creator?.name}
              </Text>
              {post.creator?.verified ? (
                <Ionicons name="checkmark-circle" size={13} color={colors.accent} />
              ) : null}
            </View>
            <View style={styles.locRow}>
              <Ionicons name="location" size={11} color="rgba(255,255,255,0.7)" />
              <Text style={styles.loc} numberOfLines={1}>
                {post.destination}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onFollow}
          style={[styles.followBtn, following && styles.followBtnActive]}
          testID={`following-follow-${post.id}`}
          accessibilityRole="button"
          accessibilityLabel={following ? "Unfollow" : "Follow"}
        >
          <Text style={[styles.followText, following && styles.followTextActive]}>
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right: engagement rail */}
      <View style={styles.rail}>
        <EngageButton
          icon={liked ? "heart" : "heart-outline"}
          color={liked ? colors.danger : colors.text}
          count={(post.likes ?? 0) + (liked ? 1 : 0)}
          onPress={onLike}
          label="Like"
          testID={`following-like-${post.id}`}
        />
        <EngageButton
          icon="chatbubble-outline"
          color={colors.text}
          count={post.comments ?? 0}
          onPress={onComment}
          label="Comment"
          testID={`following-comment-${post.id}`}
        />
        <EngageButton
          icon={saved ? "bookmark" : "bookmark-outline"}
          color={saved ? colors.teal : colors.text}
          count={(post.saves ?? 0) + (saved ? 1 : 0)}
          onPress={onSave}
          label="Save"
          testID={`following-save-${post.id}`}
        />
        <EngageButton
          icon="paper-plane-outline"
          color={colors.text}
          onPress={onShare}
          label="Share"
          testID={`following-share-${post.id}`}
        />
      </View>

      {/* Bottom: content + itinerary CTA */}
      <View style={styles.bottom}>
        <View style={styles.copy}>
          <Text style={styles.heading} numberOfLines={2}>
            {heading}
          </Text>
          {post.text ? (
            <Text style={styles.caption} numberOfLines={2}>
              {post.text}
            </Text>
          ) : null}
        </View>
        <View style={styles.ctaRow}>
          <TouchableOpacity
            onPress={onPress}
            style={styles.itineraryBtn}
            testID={`following-view-${post.id}`}
            accessibilityRole="button"
            accessibilityLabel="View itinerary"
          >
            <Ionicons name="book-outline" size={17} color={colors.text} />
            <Text style={styles.itineraryText}>View itinerary</Text>
          </TouchableOpacity>
          {isItinerary ? (
            <TouchableOpacity
              onPress={onSteal}
              style={styles.stealPill}
              testID={`following-steal-${post.id}`}
              accessibilityRole="button"
              accessibilityLabel="Steal this itinerary"
            >
              <Ionicons name="sparkles" size={14} color={colors.onPrimaryContainer} />
              <Text style={styles.stealText}>Steal</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    aspectRatio: 0.74,
    width: "100%",
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 18,
    backgroundColor: colors.surface,
  },
  topRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  creator: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  name: { color: colors.text, fontSize: 14, fontFamily: fonts.bodyBold },
  locRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  loc: { color: "rgba(255,255,255,0.72)", fontSize: 11, fontFamily: fonts.bodyMedium },
  followBtn: {
    paddingHorizontal: 16,
    height: 34,
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.primaryContainer,
  },
  followBtnActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  followText: { color: colors.onPrimaryContainer, fontSize: 12, fontFamily: fonts.bodyExtrabold },
  followTextActive: { color: colors.text },
  rail: {
    position: "absolute",
    right: 14,
    bottom: 150,
    alignItems: "center",
    gap: 18,
  },
  engageBtn: { alignItems: "center", gap: 3 },
  engageCount: { color: colors.text, fontSize: 11, fontFamily: fonts.bodyBold },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    gap: 14,
  },
  copy: { maxWidth: "82%", gap: 4 },
  heading: { ...type.title, color: colors.text, fontSize: 19 },
  caption: { color: "rgba(255,255,255,0.9)", fontSize: 13, lineHeight: 18, fontFamily: fonts.bodyRegular },
  ctaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itineraryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  itineraryText: { color: colors.text, fontSize: 14, fontFamily: fonts.bodyBold },
  stealPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryContainer,
  },
  stealText: { color: colors.onPrimaryContainer, fontSize: 13, fontFamily: fonts.bodyExtrabold },
});
