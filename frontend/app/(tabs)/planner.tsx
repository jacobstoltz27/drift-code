// AI Planner — chat UI that generates a detailed Drift itinerary using Claude
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
import { PrimaryButton, TripScoreBadge } from "@/src/components/ui";

const SUGGESTIONS = [
  "Plan a 7-day trip to Italy for under $3,000",
  "Best beaches in Southeast Asia in December",
  "Weekend getaway from New York",
  "Adventure trip in Costa Rica",
];

type Msg = { from: "user" | "ai"; text: string };

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ prompt?: string }>();
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "ai",
      text: `Hi ${user?.name?.split(" ")[0] ?? "there"}! Where do you want to go?\n\nDescribe your dream trip.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (params.prompt) setInput(String(params.prompt));
  }, [params.prompt]);

  const generate = async (prompt: string) => {
    if (!prompt.trim()) return;
    setMessages((m) => [...m, { from: "user", text: prompt }]);
    setInput("");
    Keyboard.dismiss();
    setGenerating(true);
    setItinerary(null);
    try {
      const res = await api.plannerGenerate({ prompt });
      setItinerary(res.itinerary);
      setMessages((m) => [
        ...m,
        {
          from: "ai",
          text: `Done! Built your ${res.itinerary?.days?.length ?? "multi"}-day ${res.itinerary?.destination ?? "trip"} itinerary. Scroll down to view it.`,
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { from: "ai", text: `Couldn't generate — ${e?.message ?? "try again"}.` },
      ]);
    } finally {
      setGenerating(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const saveItinerary = async () => {
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
        bucket: "saved",
      });
      router.push(`/trip/${t.id}`);
    } catch (e) {
      console.warn(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.wrap} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Planner</Text>
        <View style={styles.headerBadge}>
          <Ionicons name="sparkles" size={14} color={colors.accent} />
          <Text style={styles.headerBadgeText}>Claude Sonnet 4.5</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
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
              <Text style={styles.generatingTitle}>Generating your itinerary…</Text>
              {[
                "Finding best routes",
                "Selecting top experiences",
                "Curating restaurants",
                "Planning daily activities",
                "Calculating budget",
              ].map((s) => (
                <View key={s} style={styles.checkRow}>
                  <Ionicons name="checkmark-circle" size={14} color={colors.teal} />
                  <Text style={styles.checkText}>{s}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {!itinerary && messages.length <= 1 && !generating ? (
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => generate(s)}
                  testID={`planner-suggestion-${s.split(" ")[0].toLowerCase()}`}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {itinerary ? <ItineraryView itinerary={itinerary} /> : null}
          {itinerary ? (
            <View style={{ paddingTop: 16 }}>
              <PrimaryButton
                label={saving ? "Saving..." : "Save to My Trips"}
                onPress={saveItinerary}
                disabled={saving}
                testID="planner-save-button"
              />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <Ionicons name="sparkles-outline" size={16} color={colors.accent} />
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Describe your dream trip..."
              placeholderTextColor={colors.textDim}
              style={styles.input}
              multiline
              testID="planner-input"
            />
          </View>
          <TouchableOpacity
            disabled={generating || !input.trim()}
            onPress={() => generate(input)}
            style={[
              styles.sendBtn,
              (!input.trim() || generating) && { opacity: 0.4 },
            ]}
            testID="planner-send-button"
          >
            <LinearGradient
              colors={[colors.accent, "#7C8AFF"]}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons name="arrow-up" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// pick an image based on destination keyword
function itineraryHeroImage(dest: string): string {
  const d = dest.toLowerCase();
  if (d.includes("bali")) return "https://images.unsplash.com/photo-1711609110590-5ad5c4599e56?w=1200&q=85";
  if (d.includes("japan") || d.includes("tokyo")) return "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85";
  if (d.includes("ital") || d.includes("rome") || d.includes("amalfi"))
    return "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?w=1200&q=85";
  if (d.includes("ice")) return "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=85";
  if (d.includes("santor") || d.includes("greece"))
    return "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85";
  if (d.includes("peru") || d.includes("machu"))
    return "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85";
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
          {itinerary.days?.length ?? 0} days · est. ${itinerary.total_estimated_cost_usd}
        </Text>
      </View>
      <TripScoreBadge score={itinerary.trip_score ?? 92} size={56} />
    </View>
    <Text style={iv.summary}>{itinerary.summary}</Text>

    {Array.isArray(itinerary.budget_breakdown) ? (
      <View style={iv.budgetCard}>
        <Text style={iv.budgetTitle}>Budget Breakdown</Text>
        {itinerary.budget_breakdown.map((b: any) => (
          <View key={b.category} style={iv.budgetRow}>
            <View
              style={[
                iv.budgetDot,
                { backgroundColor: budgetColor(b.category) },
              ]}
            />
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
          <Text style={iv.dayTitle}>{d.title}</Text>
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
                    <View style={{ flexDirection: "row", alignItems: "baseline", flexWrap: "wrap" }}>
                      <Text style={iv.actTime}>{it.time}</Text>
                      <Text style={iv.actName}>  {it.activity}</Text>
                    </View>
                    {it.detail ? <Text style={iv.actDetail}>{it.detail}</Text> : null}
                    <View style={iv.actMetaRow}>
                      {it.cost_usd ? (
                        <Text style={iv.actCost}>${it.cost_usd}</Text>
                      ) : null}
                      {it.tip ? (
                        <Text style={iv.actTip} numberOfLines={2}>💡 {it.tip}</Text>
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
  generatingTitle: { color: "#fff", fontSize: 14, fontWeight: "700", marginVertical: 8 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  checkText: { color: colors.textMuted, fontSize: 12 },
  suggestions: { marginTop: 12, gap: 8 },
  suggestionChip: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  suggestionText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  inputBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 92,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    maxHeight: 120,
  },
  input: { flex: 1, color: "#fff", fontSize: 14, paddingVertical: 4 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
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
  eyebrow: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.4, marginTop: 4 },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 4, fontWeight: "600" },
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
  budgetAmt: { color: colors.text, fontSize: 13, fontWeight: "800", marginRight: 8 },
  budgetPct: { color: colors.textMuted, fontSize: 11, width: 36, textAlign: "right" },
  dayCard: {
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  dayBadge: { backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  dayBadgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  dayTitle: { color: "#fff", fontSize: 16, fontWeight: "800", flex: 1 },
  slotBlock: { marginTop: 10 },
  slotLabel: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.5, marginBottom: 6 },
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
  actName: { color: "#fff", fontSize: 14, fontWeight: "700" },
  actDetail: { color: colors.textMuted, fontSize: 12, marginTop: 2, lineHeight: 17 },
  actMetaRow: { flexDirection: "row", gap: 8, marginTop: 4, flexWrap: "wrap" },
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
  tipRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  tipText: { color: colors.text, fontSize: 12, flex: 1 },
});
