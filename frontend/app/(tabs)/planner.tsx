// AI Planner — structured inputs + async job polling for rich, detailed itineraries
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, useAuth } from "@/src/api/client";
import { colors, radii } from "@/src/theme";
import { PrimaryButton, TripScoreBadge, Pill, GhostButton } from "@/src/components/ui";
import { PaywallModal } from "@/src/components/paywall-modal";
import { ScheduleModal } from "@/src/components/schedule-modal";

const BUDGETS = ["Under $500", "$500-$1.5k", "$1.5k-$3k", "$3k-$7.5k", "Luxury $7.5k+"];

type Msg = { from: "user" | "ai"; text: string };

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ prompt?: string }>();

  // Structured inputs
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("5");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState<string>(user?.preferences?.budget ?? "$1.5k-$3k");
  const [extraNotes, setExtraNotes] = useState("");

  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "ai",
      text: `Hi ${user?.name?.split(" ")[0] ?? "there"}! Tell me about your dream trip — destination, dates, vibe — and I'll build a cinematic, day-by-day itinerary with hidden gems, restaurants, transport and tips.`,
    },
  ]);
  const [generating, setGenerating] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [busyAction, setBusyAction] = useState<null | "save" | "schedule" | "remix">(null);
  const scrollRef = useRef<ScrollView>(null);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (params.prompt) setExtraNotes(String(params.prompt));
  }, [params.prompt]);

  useEffect(() => () => {
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
  }, []);

  const startElapsed = () => {
    setElapsed(0);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    elapsedTimer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopElapsed = () => {
    if (elapsedTimer.current) {
      clearInterval(elapsedTimer.current);
      elapsedTimer.current = null;
    }
  };

  const generate = async () => {
    if (!destination.trim() && !extraNotes.trim()) return;
    const prompt =
      `Plan a ${days}-day trip to ${destination || "an inspiring destination"} for ${travelers} travelers. Budget: ${budget}.` +
      (extraNotes.trim() ? ` Notes: ${extraNotes.trim()}` : "");

    setMessages((m) => [...m, { from: "user", text: prompt }]);
    Keyboard.dismiss();
    setGenerating(true);
    setItinerary(null);
    startElapsed();

    try {
      const job = await api.plannerCreateJob({
        prompt,
        destination: destination || undefined,
        days: parseInt(days, 10) || 5,
        travelers: parseInt(travelers, 10) || 2,
        budget,
      });

      // Poll up to ~3.5 minutes
      const MAX_ATTEMPTS = 70;
      const POLL_MS = 3000;
      for (let i = 0; i < MAX_ATTEMPTS; i++) {
        await new Promise((r) => setTimeout(r, POLL_MS));
        try {
          const status = await api.plannerJobStatus(job.job_id);
          if (status.status === "done" && status.itinerary) {
            setItinerary(status.itinerary);
            setMessages((m) => [
              ...m,
              {
                from: "ai",
                text: `Built your ${status.itinerary?.days?.length ?? days}-day ${status.itinerary?.destination ?? destination} itinerary ✨ Scroll down to view it.`,
              },
            ]);
            return;
          }
          if (status.status === "error") {
            throw new Error(status.error ?? "Generation failed");
          }
        } catch (pollErr) {
          // transient — keep polling
        }
      }
      throw new Error("Timed out generating — please try again with fewer days");
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: `Couldn't generate — ${e?.message ?? "try again"}. Tip: shorter prompts and 3-5 days work best.`,
        },
      ]);
    } finally {
      setGenerating(false);
      stopElapsed();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const saveItinerary = async (bucket: "saved" | "upcoming", dates?: { start: string; end: string }) => {
    if (!itinerary) return;
    setSaving(true);
    try {
      const t = await api.createTrip({
        destination: itinerary.destination,
        country: itinerary.country,
        image_url: itineraryHeroImage(itinerary.destination),
        score: itinerary.trip_score ?? 92,
        summary: itinerary.summary,
        itinerary,
        bucket,
        start_date: dates?.start,
        end_date: dates?.end,
      });
      router.push(`/trip/${t.id}`);
    } catch (e) {
      console.warn(e);
    } finally {
      setSaving(false);
    }
  };

  const onStealClick = () => {
    if (!user?.is_premium) {
      setPaywallOpen(true);
      return;
    }
    // For premium users, "Steal" just saves a copy
    saveItinerary("saved");
  };

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>AI Planner</Text>
          <Text style={styles.sub}>Detailed itineraries, in minutes.</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="sparkles" size={12} color={colors.accent} />
          <Text style={styles.headerBadgeText}>Claude 4.5</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Structured inputs */}
          <View style={styles.inputsCard} testID="planner-inputs">
            <Text style={styles.inputsLabel}>Where to?</Text>
            <TextInput
              style={styles.bigInput}
              placeholder="e.g. Tokyo, Bali, Amalfi Coast..."
              placeholderTextColor={colors.textDim}
              value={destination}
              onChangeText={setDestination}
              testID="planner-destination-input"
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Days</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="number-pad"
                  value={days}
                  onChangeText={(v) => setDays(v.replace(/[^0-9]/g, "").slice(0, 1) || "1")}
                  testID="planner-days-input"
                  maxLength={1}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>Travelers</Text>
                <TextInput
                  style={styles.numInput}
                  keyboardType="number-pad"
                  value={travelers}
                  onChangeText={(v) => setTravelers(v.replace(/[^0-9]/g, "").slice(0, 2) || "1")}
                  testID="planner-travelers-input"
                  maxLength={2}
                />
              </View>
            </View>

            <Text style={[styles.smallLabel, { marginTop: 6 }]}>Budget</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.budgetRow}
            >
              {BUDGETS.map((b) => (
                <Pill
                  key={b}
                  label={b}
                  active={budget === b}
                  onPress={() => setBudget(b)}
                  testID={`planner-budget-${b.split(" ")[0].toLowerCase()}`}
                />
              ))}
            </ScrollView>

            <Text style={[styles.smallLabel, { marginTop: 4 }]}>Notes (optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. foodie focus, with toddlers, hate crowds..."
              placeholderTextColor={colors.textDim}
              value={extraNotes}
              onChangeText={setExtraNotes}
              multiline
              testID="planner-notes-input"
            />

            <PrimaryButton
              label={generating ? `Generating… ${elapsed}s` : "Generate Itinerary"}
              onPress={generate}
              disabled={generating || (!destination.trim() && !extraNotes.trim())}
              testID="planner-generate-button"
              icon={<Ionicons name="sparkles" size={16} color="#fff" />}
              style={{ marginTop: 16 }}
            />
          </View>

          {/* Conversation */}
          {messages.map((m, i) => (
            <View
              key={i}
              style={[
                styles.bubble,
                m.from === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={[styles.bubbleText, m.from === "user" && { color: "#fff" }]}>
                {m.text}
              </Text>
            </View>
          ))}

          {generating ? (
            <View style={styles.generating}>
              <ActivityIndicator color={colors.accent} />
              <Text style={styles.generatingTitle}>
                Generating your itinerary — usually 60-90 seconds…
              </Text>
              {[
                "Researching real restaurants and hidden gems",
                "Planning transport between every stop",
                "Calculating realistic costs per activity",
                "Adding weather tips and alternatives",
                "Curating 9-12 activities per day",
              ].map((s, idx) => {
                const phase = Math.floor(elapsed / 18);
                const lit = idx <= phase;
                return (
                  <View key={s} style={styles.checkRow}>
                    <Ionicons
                      name={lit ? "checkmark-circle" : "ellipse-outline"}
                      size={14}
                      color={lit ? colors.teal : colors.textDim}
                    />
                    <Text
                      style={[
                        styles.checkText,
                        lit && { color: colors.text, fontWeight: "600" },
                      ]}
                    >
                      {s}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          {itinerary ? <ItineraryView itinerary={itinerary} /> : null}
          {itinerary ? (
            <View style={styles.actionGrid} testID="planner-actions">
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => saveItinerary("saved")}
                disabled={saving}
                testID="planner-action-save"
              >
                <Ionicons name="bookmark-outline" size={20} color={colors.accent} />
                <Text style={styles.actionLabel}>Save Trip</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => setScheduleOpen(true)}
                disabled={saving}
                testID="planner-action-schedule"
              >
                <Ionicons name="calendar-outline" size={20} color={colors.teal} />
                <Text style={styles.actionLabel}>Add to Upcoming</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={onStealClick}
                disabled={saving}
                testID="planner-action-steal"
              >
                <View style={styles.actionProBadge}>
                  <Text style={styles.actionProBadgeText}>PRO</Text>
                </View>
                <Ionicons name="sparkles-outline" size={20} color="#F59E0B" />
                <Text style={styles.actionLabel}>Steal Itinerary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  // Save first, then go to trip detail to remix
                  saveItinerary("saved");
                }}
                disabled={saving}
                testID="planner-action-remix"
              >
                <Ionicons name="color-wand-outline" size={20} color="#7C8AFF" />
                <Text style={styles.actionLabel}>Remix Trip</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <PaywallModal
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason="Steal Itinerary is a Drift Plus feature."
        onSuccess={() => saveItinerary("saved")}
      />

      <ScheduleModal
        visible={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={async (start, end) => {
          await saveItinerary("upcoming", { start, end });
          setScheduleOpen(false);
        }}
        busy={saving}
      />
    </SafeAreaView>
  );
}

// pick an image based on destination keyword
function itineraryHeroImage(dest: string): string {
  const d = (dest || "").toLowerCase();
  if (d.includes("bali")) return "https://images.unsplash.com/photo-1711609110590-5ad5c4599e56?w=1200&q=85";
  if (d.includes("japan") || d.includes("tokyo") || d.includes("kyoto"))
    return "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85";
  if (d.includes("ital") || d.includes("rome") || d.includes("amalfi") || d.includes("positano"))
    return "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?w=1200&q=85";
  if (d.includes("ice")) return "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=85";
  if (d.includes("santor") || d.includes("greece"))
    return "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85";
  if (d.includes("peru") || d.includes("machu"))
    return "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85";
  if (d.includes("norway") || d.includes("fjord"))
    return "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=1200&q=85";
  if (d.includes("maldiv"))
    return "https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&w=1200";
  if (d.includes("lisbon") || d.includes("portugal"))
    return "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85";
  return "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=85";
}

// Inline view of the generated itinerary
export const ItineraryView = ({ itinerary }: { itinerary: any }) => (
  <View style={iv.wrap}>
    <View style={iv.heroRow}>
      <View style={{ flex: 1 }}>
        <Text style={iv.eyebrow}>YOUR ITINERARY</Text>
        <Text style={iv.title}>{itinerary.destination}</Text>
        <Text style={iv.sub}>
          {itinerary.days?.length ?? 0} days · est. $
          {itinerary.total_estimated_cost_usd?.toLocaleString?.() ?? "—"}
        </Text>
        {itinerary.best_time ? (
          <Text style={iv.bestTime}>Best time: {itinerary.best_time}</Text>
        ) : null}
      </View>
      <TripScoreBadge score={itinerary.trip_score ?? 92} size={64} />
    </View>
    <Text style={iv.summary}>{itinerary.summary}</Text>

    {Array.isArray(itinerary.budget_breakdown) ? (
      <View style={iv.budgetCard}>
        <Text style={iv.budgetTitle}>Budget Breakdown</Text>
        {itinerary.budget_breakdown.map((b: any) => (
          <View key={b.category} style={iv.budgetRow}>
            <View style={[iv.budgetDot, { backgroundColor: budgetColor(b.category) }]} />
            <Text style={iv.budgetCat}>{b.category}</Text>
            <Text style={iv.budgetAmt}>${b.amount}</Text>
            <Text style={iv.budgetPct}>{b.pct}%</Text>
          </View>
        ))}
      </View>
    ) : null}

    {(itinerary.days ?? []).map((d: any) => (
      <View key={d.day} style={iv.dayCard}>
        <View style={iv.dayHeader}>
          <View style={iv.dayBadge}>
            <Text style={iv.dayBadgeText}>Day {d.day}</Text>
          </View>
          <Text style={iv.dayTitle} numberOfLines={2}>
            {d.title}
          </Text>
        </View>

        {["morning", "afternoon", "evening"].map((slot) => {
          const items: any[] = d[slot] ?? [];
          if (!items.length) return null;
          return (
            <View key={slot} style={iv.slotBlock}>
              <Text style={iv.slotLabel}>{slot.toUpperCase()}</Text>
              {items.map((it: any, idx: number) => (
                <View key={idx} style={iv.activity}>
                  <View style={iv.timeDot} />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text style={iv.actTime}>{it.time}</Text>
                      <Text style={iv.actName}>  {it.activity}</Text>
                    </View>
                    {it.detail ? <Text style={iv.actDetail}>{it.detail}</Text> : null}
                    <View style={iv.actMetaRow}>
                      {it.cost_usd ? <Text style={iv.actCost}>${it.cost_usd}</Text> : null}
                      {it.tip ? (
                        <Text style={iv.actTip}>💡 {it.tip}</Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {d.transport ? (
          <View style={iv.factRow}>
            <Ionicons name="car-outline" size={14} color={colors.accent} />
            <Text style={iv.factText}>{d.transport}</Text>
          </View>
        ) : null}
        {d.hidden_gem ? (
          <View style={iv.factRow}>
            <Ionicons name="diamond-outline" size={14} color={colors.teal} />
            <Text style={iv.factText}>Hidden gem: {d.hidden_gem}</Text>
          </View>
        ) : null}
        {d.weather_tip ? (
          <View style={iv.factRow}>
            <Ionicons name="rainy-outline" size={14} color="#7C8AFF" />
            <Text style={iv.factText}>{d.weather_tip}</Text>
          </View>
        ) : null}
        {d.alternative ? (
          <View style={iv.factRow}>
            <Ionicons name="swap-horizontal-outline" size={14} color={colors.gold} />
            <Text style={iv.factText}>Alt: {d.alternative}</Text>
          </View>
        ) : null}
      </View>
    ))}

    {Array.isArray(itinerary.packing_tips) ? (
      <View style={iv.tipsCard}>
        <Text style={iv.budgetTitle}>Packing Tips</Text>
        {itinerary.packing_tips.map((t: string, i: number) => (
          <View key={i} style={iv.tipRow}>
            <Ionicons name="checkmark" size={14} color={colors.teal} />
            <Text style={iv.tipText}>{t}</Text>
          </View>
        ))}
      </View>
    ) : null}

    {Array.isArray(itinerary.local_phrases) && itinerary.local_phrases.length ? (
      <View style={iv.tipsCard}>
        <Text style={iv.budgetTitle}>Local Phrases</Text>
        {itinerary.local_phrases.map((p: any, i: number) => (
          <View key={i} style={iv.phraseRow}>
            <Text style={iv.phraseText}>{p.phrase}</Text>
            <Text style={iv.phraseMeaning}>{p.meaning}</Text>
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

const budgetColor = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes("flight")) return colors.accent;
  if (c.includes("stay") || c.includes("hotel")) return colors.teal;
  if (c.includes("activ")) return colors.gold;
  if (c.includes("food")) return "#EF4444";
  return "#7C8AFF";
};

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontSize: 26, fontWeight: "900", letterSpacing: -0.5 },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerBadgeText: { color: colors.accent, fontSize: 11, fontWeight: "800" },
  inputsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 8,
    marginTop: 6,
    marginBottom: 18,
  },
  inputsLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  smallLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 4,
  },
  bigInput: {
    backgroundColor: colors.glass,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  numInput: {
    backgroundColor: colors.glass,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "center",
  },
  budgetRow: { gap: 8, paddingVertical: 4 },
  notesInput: {
    backgroundColor: colors.glass,
    borderRadius: 14,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 60,
    textAlignVertical: "top",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "85%",
  },
  userBubble: { backgroundColor: colors.accent, alignSelf: "flex-end" },
  aiBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
  },
  bubbleText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  generating: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginTop: 12,
  },
  generatingTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginVertical: 8,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
  },
  checkText: { color: colors.textMuted, fontSize: 12, flex: 1 },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "flex-start",
    gap: 8,
    position: "relative",
  },
  actionLabel: { color: "#fff", fontWeight: "800", fontSize: 13 },
  actionProBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.teal,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  actionProBadgeText: { color: "#fff", fontWeight: "900", fontSize: 9, letterSpacing: 0.5 },
});

const iv = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 18,
  },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginTop: 4,
  },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 4, fontWeight: "600" },
  bestTime: { color: colors.teal, fontSize: 11, marginTop: 4, fontWeight: "700" },
  summary: { color: colors.text, fontSize: 14, lineHeight: 20, marginTop: 12 },
  budgetCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  budgetTitle: { color: "#fff", fontWeight: "800", fontSize: 14, marginBottom: 10 },
  budgetRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  budgetDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  budgetCat: { color: colors.text, fontSize: 13, flex: 1, fontWeight: "600" },
  budgetAmt: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    marginRight: 8,
  },
  budgetPct: { color: colors.textMuted, fontSize: 11, width: 36, textAlign: "right" },
  dayCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  dayBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dayBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  dayTitle: { color: "#fff", fontSize: 16, fontWeight: "800", flex: 1 },
  slotBlock: { marginTop: 10 },
  slotLabel: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  activity: { flexDirection: "row", paddingVertical: 6 },
  timeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 8,
    marginRight: 10,
  },
  actTime: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  actName: { color: "#fff", fontSize: 14, fontWeight: "700", flex: 1 },
  actDetail: { color: colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  actMetaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
  },
  actCost: { color: colors.teal, fontSize: 11, fontWeight: "800" },
  actTip: { color: colors.gold, fontSize: 11, fontWeight: "600", flex: 1 },
  factRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    marginTop: 4,
  },
  factText: { color: colors.textMuted, fontSize: 12, flex: 1 },
  tipsCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.glass,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  tipText: { color: colors.text, fontSize: 12, flex: 1 },
  phraseRow: {
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  phraseText: { color: "#fff", fontSize: 13, fontWeight: "800" },
  phraseMeaning: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
