// Following feed post card — used on Home tab
import React from "react";
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
  liked,
}: {
  post: any;
  onPress?: () => void;
  onLike?: () => void;
  liked?: boolean;
}) => (
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
      <View style={styles.kindBadge}>
        <Text style={styles.kindText}>{kindLabel(post.kind)}</Text>
      </View>
    </View>

    <Text style={styles.text}>{post.text}</Text>

    {post.image_url ? (
      <Image source={{ uri: post.image_url }} style={styles.img} />
    ) : null}

    <View style={styles.actions}>
      <TouchableOpacity
        onPress={onLike}
        style={styles.actBtn}
        testID={`following-like-${post.id}`}
      >
        <Ionicons name={liked ? "heart" : "heart-outline"} size={18} color={liked ? "#EF4444" : colors.text} />
        <Text style={styles.actText}>{(post.likes ?? 0).toLocaleString()}</Text>
      </TouchableOpacity>
      <View style={styles.actBtn}>
        <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
        <Text style={styles.actText}>{(post.comments ?? 0).toLocaleString()}</Text>
      </View>
      <View style={styles.actBtn}>
        <Ionicons name="bookmark-outline" size={16} color={colors.text} />
        <Text style={styles.actText}>{(post.saves ?? 0).toLocaleString()}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <Ionicons name="share-outline" size={16} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const kindLabel = (k: string) =>
  ({ trip: "Trip", photo: "Photo", recommendation: "Rec", itinerary: "Itinerary", update: "Update" }[k] ??
    "Post");

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
  kindBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
  },
  kindText: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginTop: 12,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
  actBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
});
