// Trip detail (a saved/stolen/upcoming trip)
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/src/api/client";
import { colors, radii } from "@/src/theme";
import { TripScoreBadge, PrimaryButton, GhostButton, Avatar } from "@/src/components/ui";
import { ItineraryView } from "@/app/(tabs)/planner";

export default function TripDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [remixOpen, setRemixOpen] = useState(false);
  const [remixNote, setRemixNote] = useState("");
  const [remixing, setRemixing] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const t = await api.tripById(String(id));
      setTrip(t);
    } catch {
      setTrip(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const remix = async () => {
    if (!trip || !remixNote.trim()) return;
    setRemixing(true);
    try {
      const job = await api.remixTripJob(trip.id, remixNote);
      // poll up to ~3.5 min
      for (let i = 0; i < 70; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const status = await api.plannerJobStatus(job.job_id);
          if (status.status === "done" && status.trip) {
            setRemixOpen(false);
            setRemixNote("");
            router.replace(`/trip/${status.trip.id}`);
            return;
          }
          if (status.status === "error") throw new Error(status.error ?? "Remix failed");
        } catch (e) {
          /* keep polling */
        }
      }
      throw new Error("Remix timed out — try a shorter note");
    } catch (e) {
      console.warn(e);
    } finally {
      setRemixing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.wrap}>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }
  if (!trip) {
    return (
      <SafeAreaView style={styles.wrap}>
        <Text style={{ color: "#fff", padding: 20 }}>Trip not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.wrap}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.hero}>
          <Image source={{ uri: trip.image_url }} style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={["rgba(7,11,20,0.2)", "rgba(7,11,20,0.95)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 8 }]}
            onPress={() => router.back()}
            testID="trip-detail-back"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.heroBottom, { paddingBottom: 20 }]}>
            <View style={styles.heroRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroEyebrow}>
                  {trip.bucket?.toUpperCase()}
                </Text>
                <Text style={styles.heroTitle}>{trip.destination}</Text>
                {trip.start_date ? (
                  <Text style={styles.heroDates}>
                    {trip.start_date} — {trip.end_date}
                  </Text>
                ) : null}
              </View>
              <TripScoreBadge score={trip.score ?? 90} size={68} />
            </View>
            {trip.creator ? (
              <View style={styles.creator}>
                <Avatar uri={trip.creator.avatar} size={28} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.creatorName}>by {trip.creator.name}</Text>
                  <Text style={styles.creatorHandle}>{trip.creator.handle}</Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {trip.summary ? <Text style={styles.summary}>{trip.summary}</Text> : null}

          <View style={styles.actionRow}>
            <PrimaryButton
              label={remixOpen ? "Cancel" : "Remix with AI"}
              onPress={() => setRemixOpen((v) => !v)}
              testID="trip-detail-remix-toggle"
              icon={<Ionicons name="sparkles" size={16} color="#fff" />}
              style={{ flex: 1 }}
            />
            <GhostButton
              label="Share"
              onPress={() => {}}
              testID="trip-detail-share"
              style={{ width: 110 }}
            />
          </View>

          {remixOpen ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.remixBox}
            >
              <Text style={styles.remixTitle}>How should we remix it?</Text>
              <TextInput
                value={remixNote}
                onChangeText={setRemixNote}
                placeholder="e.g. add more hidden gems, swap luxury for boutique, focus on food..."
                placeholderTextColor={colors.textDim}
                style={styles.remixInput}
                multiline
                testID="trip-detail-remix-input"
              />
              <PrimaryButton
                label={remixing ? "Remixing..." : "Remix"}
                onPress={remix}
                disabled={remixing || !remixNote.trim()}
                testID="trip-detail-remix-submit"
              />
            </KeyboardAvoidingView>
          ) : null}

          {trip.itinerary ? <ItineraryView itinerary={trip.itinerary} /> : (
            <View style={styles.noItinerary}>
              <Ionicons name="sparkles-outline" size={28} color={colors.accent} />
              <Text style={styles.noItinTitle}>No itinerary yet</Text>
              <Text style={styles.noItinSub}>
                Use the AI Planner to generate a detailed itinerary for this trip.
              </Text>
              <PrimaryButton
                label="Generate with AI"
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/planner",
                    params: { prompt: `Plan a trip to ${trip.destination}` },
                  })
                }
                testID="trip-detail-generate"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: { height: 360, justifyContent: "flex-end" },
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
  heroBottom: { paddingHorizontal: 20 },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  heroEyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  heroTitle: { color: "#fff", fontSize: 32, fontWeight: "900", letterSpacing: -0.6, marginTop: 4 },
  heroDates: { color: colors.textMuted, fontSize: 13, marginTop: 2, fontWeight: "600" },
  creator: { flexDirection: "row", alignItems: "center", marginTop: 14 },
  creatorName: { color: "#fff", fontSize: 13, fontWeight: "700" },
  creatorHandle: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  summary: { color: colors.text, fontSize: 15, lineHeight: 22 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  remixBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  remixTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },
  remixInput: {
    minHeight: 80,
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.glass,
    borderRadius: 12,
    textAlignVertical: "top",
  },
  noItinerary: {
    marginTop: 24,
    padding: 24,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    gap: 10,
  },
  noItinTitle: { color: "#fff", fontSize: 17, fontWeight: "800" },
  noItinSub: { color: colors.textMuted, fontSize: 13, textAlign: "center", lineHeight: 18 },
});
