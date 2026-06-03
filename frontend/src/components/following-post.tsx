// Following feed post — fully interactive social card
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/src/theme";
import { Avatar } from "@/src/components/ui";

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
