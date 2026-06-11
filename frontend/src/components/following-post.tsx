// Following feed post — fully interactive social card
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/src/theme";
import { Avatar } from "@/src/components/ui";

const SCREEN_W = Dimensions.get("window").width;

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
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={styles.wrap}
      testID={`following-post-${post.id}`}
    >
      <View style={styles.headerRow}>
        <Avatar uri={post.creator?.avatar} size={40} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={styles.name}>{post.creator?.name}</Text>
            {post.creator?.verified ? (
              <Ionicons name="checkmark-circle" size={14} color={colors.accent} />
            ) : null}
          </View>
          <Text style={styles.meta}>
            {post.creator?.role} · {post.time_ago} · {post.destination}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onFollow}
          style={[styles.followBtn, following && styles.followBtnActive]}
          testID={`following-follow-${post.id}`}
        >
          <Text style={[styles.followText, following && { color: colors.text }]}>
            {following ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.text}>{post.text}</Text>

      {post.image_url ? (
        <Image source={{ uri: post.image_url }} style={styles.img} />
      ) : null}

      {/* Steal Itinerary callout (only for itinerary/trip posts) */}
      {post.kind === "itinerary" || post.kind === "trip" ? (
        <TouchableOpacity
          onPress={onSteal}
          style={styles.stealBar}
          testID={`following-steal-${post.id}`}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text style={styles.stealText}>Steal this itinerary</Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onLike}
          style={styles.actBtn}
          testID={`following-like-${post.id}`}
        >
          <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "#EF4444" : colors.text} />
          <Text style={styles.actText}>{((post.likes ?? 0) + (liked ? 1 : 0)).toLocaleString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onComment}
          style={styles.actBtn}
          testID={`following-comment-${post.id}`}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
          <Text style={styles.actText}>{(post.comments ?? 0).toLocaleString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          style={styles.actBtn}
          testID={`following-save-${post.id}`}
        >
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={18} color={saved ? colors.teal : colors.text} />
          <Text style={styles.actText}>{((post.saves ?? 0) + (saved ? 1 : 0)).toLocaleString()}</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={onShare}
          style={styles.actBtn}
          testID={`following-share-${post.id}`}
        >
          <Ionicons name="share-outline" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  name: { color: "#fff", fontSize: 14, fontWeight: "800" },
  meta: { color: colors.textMuted, fontSize: 11, marginTop: 2, fontWeight: "600" },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  followBtnActive: { backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  followText: { color: "#fff", fontSize: 12, fontWeight: "800" },
  text: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 12 },
  img: { width: "100%", height: 220, borderRadius: 16, marginTop: 12 },
  stealBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  stealText: { color: colors.accent, fontWeight: "800", fontSize: 13 },
  proBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.teal,
  },
  proBadgeText: { color: "#fff", fontWeight: "900", fontSize: 9, letterSpacing: 0.5 },
  actions: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 14 },
  actBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  actText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
});

// ─── For You card (Instagram/Reels-style) ────────────────────────────────────

export const ForYouPostCard = ({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onComment,
  onShare,
  onSteal,
  onPress,
}: {
  post: any;
  liked?: boolean;
  saved?: boolean;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSteal?: () => void;
  onPress?: () => void;
}) => (
  <View style={fyStyles.wrap} testID={`foryou-post-${post.id}`}>
    {/* Header */}
    <View style={fyStyles.header}>
      <Avatar uri={post.creator?.avatar} size={40} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={fyStyles.name}>{post.creator?.name}</Text>
        <View style={fyStyles.locationRow}>
          <Ionicons name="location-sharp" size={11} color={colors.textMuted} />
          <Text style={fyStyles.location}>{post.destination}</Text>
        </View>
      </View>
      <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>

    {/* Image + all overlays */}
    <TouchableOpacity activeOpacity={0.95} onPress={onPress} style={fyStyles.imageWrap}>
      <Image source={{ uri: post.image_url }} style={fyStyles.image} />
      <LinearGradient
        colors={["transparent", "rgba(9,12,26,0.9)"]}
        locations={[0.35, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Right-side vertical actions */}
      <View style={fyStyles.sideActions}>
        <TouchableOpacity onPress={onLike} style={fyStyles.sideBtn}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#EF4444" : "#fff"}
          />
          <Text style={fyStyles.sideCount}>{((post.likes ?? 128) + (liked ? 1 : 0)).toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onComment} style={fyStyles.sideBtn}>
          <Ionicons name="chatbubble-outline" size={25} color="#fff" />
          <Text style={fyStyles.sideCount}>{(post.comments ?? 12).toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave} style={fyStyles.sideBtn}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={25}
            color={saved ? colors.accent : "#fff"}
          />
          <Text style={fyStyles.sideCount}>{((post.saves ?? 47) + (saved ? 1 : 0)).toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={fyStyles.sideBtn}>
          <Ionicons name="arrow-redo-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom overlay */}
      <View style={fyStyles.bottomOverlay}>
        <Text style={fyStyles.title} numberOfLines={2}>{post.title}</Text>
        <Text style={fyStyles.caption} numberOfLines={2}>{post.text}</Text>
        <View style={fyStyles.footerRow}>
          {/* Pagination dots */}
          <View style={fyStyles.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[fyStyles.dot, i === 0 && fyStyles.dotActive]} />
            ))}
          </View>
          {/* View itinerary button */}
          <TouchableOpacity onPress={onSteal} style={fyStyles.viewBtn}>
            <Ionicons name="map-outline" size={13} color="#fff" />
            <Text style={fyStyles.viewBtnText}>View itinerary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const fyStyles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  name: { color: "#fff", fontSize: 14, fontWeight: "800" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  location: { color: colors.textMuted, fontSize: 11, fontWeight: "500" },
  imageWrap: {
    width: "100%",
    height: SCREEN_W * 0.95,
  },
  image: { width: "100%", height: "100%" },
  sideActions: {
    position: "absolute",
    right: 14,
    bottom: 72,
    alignItems: "center",
    gap: 20,
  },
  sideBtn: { alignItems: "center", gap: 4 },
  sideCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 70,
    bottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -0.3,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  caption: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  dots: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: { backgroundColor: "#fff", width: 18, borderRadius: 3 },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(9,12,26,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  viewBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
