// Drift AI Planner — luxury concierge multi-step experience
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, useAuth } from "@/src/api/client";
import { colors, radii, IMG } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";
import { ItineraryExperience } from "@/src/components/itinerary-experience";
import { PaywallModal } from "@/src/components/paywall-modal";
import { ScheduleModal } from "@/src/components/schedule-modal";

type Step = "dream" | "convo" | "advanced" | "generating" | "result";

const PLACEHOLDERS = [
  "Luxury Italy honeymoon",
  "Food trip through Japan",
  "Greek island hopping",
  "Weekend getaway under $1,000",
  "Adventure trip in Costa Rica",
  "Hidden gems in Europe",
  "Surprise me",
];
const POPULAR = ["Japan", "Italy", "Bali", "Greece", "Thailand", "Paris", "New York", "Surprise Me"];

const VIBES = ["Amazing Food", "Luxury", "Hidden Gems", "Beaches", "Nightlife", "Adventure", "Wellness", "Culture", "Shopping", "Photography"];
const PACE = ["Relaxed", "Balanced", "Packed Schedule"];
const COMPANIONS = ["Solo", "Couple", "Friends", "Family", "Business"];
const BUDGETS = ["Best Value", "Balanced", "Splurge Sometimes", "Luxury Only"];

const TRAVEL_STYLE = ["Luxury", "Foodie", "Romantic", "Adventure", "Wellness", "Family", "Solo", "Cultural", "Photography", "Road Trip", "Nightlife"];
const DEST_TYPES = ["Beaches", "Mountains", "Islands", "Cities", "Small Towns", "National Parks", "Coastal", "Countryside", "Lakes", "Snow"];
const INTERESTS = ["Hidden Gems", "Museums", "Architecture", "Coffee Shops", "Markets", "Rooftops", "Art", "Festivals", "Wildlife", "Scenic Views", "Local Culture"];
const FOOD = ["Local Cuisine", "Fine Dining", "Street Food", "Michelin", "Seafood", "Vegetarian", "Vegan"];
const STAY = ["Luxury Resort", "Boutique Hotel", "Hotel", "Airbnb", "Hostel", "Mixed"];
const TRANSPORT = ["Walking", "Public Transit", "Rental Car", "Trains", "Private Driver", "Mix"];
const CROWD = ["Tourist Hotspots", "Balanced", "Hidden Gems Only"];

const HERO_IMG = IMG.splashHero;

const heroForDestination = (d: string): string => {
  const s = (d || "").toLowerCase();
  if (s.includes("japan") || s.includes("tokyo") || s.includes("kyoto")) return IMG.tokyo;
  if (s.includes("bali")) return IMG.bali;
  if (s.includes("italy") || s.includes("amalfi") || s.includes("rome") || s.includes("positano")) return IMG.amalfi;
  if (s.includes("ice")) return IMG.iceland;
  if (s.includes("santor") || s.includes("greece") || s.includes("greek")) return IMG.santorini;
  if (s.includes("peru") || s.includes("machu")) return IMG.peru;
  if (s.includes("norway") || s.includes("fjord")) return IMG.norway;
  if (s.includes("maldiv")) return IMG.maldives;
  if (s.includes("lisbon") || s.includes("portugal")) return IMG.lisbon;
  return HERO_IMG;
};

const ChipBtn = ({ label, active, onPress, testID }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[chipStyle.base, active && chipStyle.active]}
    testID={testID}
    activeOpacity={0.85}
  >
    <Text style={[chipStyle.text, active && { color: "#fff", fontWeight: "900" }]}>{label}</Text>
  </TouchableOpacity>
);

const chipStyle = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  text: { color: colors.text, fontSize: 13, fontWeight: "700" },
});

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ prompt?: string }>();

  const [step, setStep] = useState<Step>("dream");
  const [prompt, setPrompt] = useState("");
  const [days, setDays] = useState(5);
  const [vibes, setVibes] = useState<string[]>([]);
  const [pace, setPace] = useState<string>("Balanced");
  const [companions, setCompanions] = useState<string>(user?.preferences?.companions ?? "Couple");
  const [budgetStyle, setBudgetStyle] = useState<string>("Balanced");
  const [advanced, setAdvanced] = useState<Record<string, string[]>>({});
  const [specialRequest, setSpecialRequest] = useState("");

  const [phIdx, setPhIdx] = useState(0);
  useEffect(() => {
    if (step !== "dream") return;
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (params.prompt) {
      setPrompt(String(params.prompt));
    }
  }, [params.prompt]);

  // Generation
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleArr = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  const toggleAdvanced = (key: string, val: string) =>
    setAdvanced((a) => ({ ...a, [key]: toggleArr(a[key] ?? [], val) }));

  const startElapsed = () => {
    setElapsed(0);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    elapsedTimer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopElapsed = () => {
    if (elapsedTimer.current) { clearInterval(elapsedTimer.current); elapsedTimer.current = null; }
  };
  useEffect(() => () => stopElapsed(), []);

  const generate = async () => {
    const dreamText = prompt.trim() || "Surprise me with somewhere magical";
    const fullPrompt =
      `${dreamText}. ` +
      (vibes.length ? `Most important: ${vibes.join(", ")}. ` : "") +
      `Pace: ${pace}. Travelers: ${companions}. Budget style: ${budgetStyle}. ` +
      (Object.entries(advanced).filter(([_, v]) => v.length).map(([k, v]) => `${k}: ${v.join(", ")}`).join(". ") || "") +
      (specialRequest.trim() ? ` Special: ${specialRequest.trim()}.` : "");

    setStep("generating");
    setItinerary(null);
    startElapsed();
    try {
      const job = await api.plannerCreateJob({
        prompt: fullPrompt,
        destination: prompt.trim() || undefined,
        days,
        travelers: companions === "Solo" ? 1 : companions === "Couple" ? 2 : 3,
        budget: budgetStyle,
      });
      for (let i = 0; i < 90; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const status = await api.plannerJobStatus(job.job_id);
          if (status.status === "done" && status.itinerary) {
            setItinerary(status.itinerary);
            setStep("result");
            return;
          }
          if (status.status === "error") throw new Error(status.error ?? "Generation failed");
        } catch { /* keep polling */ }
      }
      throw new Error("Generation timed out");
    } catch (e) {
      console.warn(e);
      setStep("convo");
    } finally {
      stopElapsed();
    }
  };

  // Save flows
  const saveTrip = async (bucket: "saved" | "upcoming", dates?: { start: string; end: string }) => {
    if (!itinerary) return;
    setBusy(true);
    try {
      const heroImg = heroForDestination(itinerary.destination);
      const t = await api.createTrip({
        destination: itinerary.destination,
        country: itinerary.country,
        image_url: heroImg,
        score: itinerary.trip_score ?? 92,
        summary: itinerary.summary,
        itinerary,
        bucket,
        start_date: dates?.start,
        end_date: dates?.end,
      });
      router.push(`/trip/${t.id}`);
    } finally { setBusy(false); }
  };

  const onSteal = () => {
    if (!user?.is_premium) { setPaywallOpen(true); return; }
    saveTrip("saved");
  };

  // Reset
  const reset = () => {
    setStep("dream");
    setItinerary(null);
    setPrompt("");
    setVibes([]);
  };

  // ============= RESULT =============
  if (step === "result" && itinerary) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={resStyles.topBar}>
            <TouchableOpacity onPress={reset} style={resStyles.iconBtn} testID="planner-new">
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={resStyles.iconBtn}><Ionicons name="share-outline" size={18} color="#fff" /></View>
          </View>
          <ItineraryExperience
            itinerary={itinerary}
            heroImage={heroForDestination(itinerary.destination)}
            travelers={companions === "Solo" ? 1 : companions === "Couple" ? 2 : 3}
            onSave={() => saveTrip("saved")}
            onSchedule={() => setScheduleOpen(true)}
            onSteal={onSteal}
            onRemix={() => saveTrip("saved")}
          />
        </ScrollView>
        <PaywallModal visible={paywallOpen} onClose={() => setPaywallOpen(false)} reason="Steal Itinerary is a Drift Plus feature." onSuccess={() => saveTrip("saved")} />
        <ScheduleModal
          visible={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onConfirm={async (s, e) => { await saveTrip("upcoming", { start: s, end: e }); setScheduleOpen(false); }}
          busy={busy}
        />
      </SafeAreaView>
    );
  }

  // ============= GENERATING =============
  if (step === "generating") {
    const checks = [
      "Finding hidden gems",
      "Building daily routes",
      "Selecting restaurants",
      "Matching your travel style",
      "Calculating budget",
      "Optimizing transportation",
      "Creating local recommendations",
      "Personalizing experiences",
    ];
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Image source={{ uri: heroForDestination(prompt) }} style={StyleSheet.absoluteFillObject} blurRadius={14} />
        <LinearGradient colors={["rgba(7,11,20,0.6)", "rgba(7,11,20,0.97)"]} style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "center" }}>
            <Text style={genStyles.eyebrow}>DRIFT IS DESIGNING</Text>
            <Text style={genStyles.title}>{prompt.trim() || "Your dream trip"}</Text>
            <Text style={genStyles.sub}>Usually 60-180 seconds for a fully detailed plan.</Text>

            <View style={{ marginTop: 36, gap: 14 }}>
              {checks.map((c, i) => {
                const phase = Math.floor(elapsed / 12);
                const lit = i <= phase;
                return (
                  <View key={c} style={genStyles.row}>
                    <View style={[genStyles.checkCircle, lit && { backgroundColor: colors.teal, borderColor: colors.teal }]}>
                      {lit ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                    </View>
                    <Text style={[genStyles.checkText, lit && { color: "#fff", fontWeight: "700" }]}>{c}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={genStyles.elapsed}>{elapsed}s</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============= MULTI-STEP CONVO/ADVANCED/DREAM =============
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        {/* ===== DREAM ===== */}
        {step === "dream" ? (
          <View style={{ minHeight: 700 }}>
            <Image source={{ uri: HERO_IMG }} style={[StyleSheet.absoluteFillObject, { height: 360 }]} />
            <LinearGradient colors={["rgba(7,11,20,0.15)", "rgba(7,11,20,0.85)", "rgba(7,11,20,1)"]} style={[StyleSheet.absoluteFillObject, { height: 360 }]} />
            <View style={{ paddingHorizontal: 24, paddingTop: 28 }}>
              <Text style={dreamStyles.eyebrow}>DRIFT AI PLANNER</Text>
              <Text style={dreamStyles.title}>Where do you want{"\n"}to go?</Text>
              <Text style={dreamStyles.sub}>Describe your dream trip. We'll build the rest.</Text>

              <View style={dreamStyles.inputCard}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <TextInput
                  value={prompt}
                  onChangeText={setPrompt}
                  placeholder={PLACEHOLDERS[phIdx]}
                  placeholderTextColor={colors.textDim}
                  style={dreamStyles.input}
                  multiline
                  testID="dream-input"
                />
              </View>

              <Text style={dreamStyles.popularLabel}>POPULAR</Text>
              <View style={dreamStyles.popularGrid}>
                {POPULAR.map((p) => (
                  <ChipBtn
                    key={p}
                    label={p}
                    onPress={() => setPrompt(p === "Surprise Me" ? "Surprise me with somewhere magical" : p)}
                    active={prompt.toLowerCase().includes(p.toLowerCase())}
                    testID={`popular-${p.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                ))}
              </View>

              {/* Days */}
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 24, gap: 12 }}>
                <Text style={dreamStyles.popularLabel}>HOW MANY DAYS?</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {[3, 5, 7, 10, 14].map((d) => (
                  <ChipBtn key={d} label={`${d} days`} active={days === d} onPress={() => setDays(d)} testID={`days-${d}`} />
                ))}
              </View>

              <PrimaryButton
                label="Continue"
                onPress={() => setStep("convo")}
                disabled={!prompt.trim()}
                testID="dream-continue"
                style={{ marginTop: 28 }}
                icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
              />
            </View>
          </View>
        ) : null}

        {/* ===== CONVO ===== */}
        {step === "convo" ? (
          <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
            <BackHeader onBack={() => setStep("dream")} step={2} total={4} />

            <Question title="What matters most on this trip?" sub="Tap as many as you like.">
              <Wrap>
                {VIBES.map((v) => (
                  <ChipBtn
                    key={v}
                    label={v}
                    active={vibes.includes(v)}
                    onPress={() => setVibes((s) => toggleArr(s, v))}
                    testID={`vibe-${v.toLowerCase().replace(/\s+/g, "-")}`}
                  />
                ))}
              </Wrap>
            </Question>

            <Question title="What pace do you prefer?">
              <Wrap>{PACE.map((p) => <ChipBtn key={p} label={p} active={pace === p} onPress={() => setPace(p)} />)}</Wrap>
            </Question>

            <Question title="Who are you traveling with?">
              <Wrap>{COMPANIONS.map((c) => <ChipBtn key={c} label={c} active={companions === c} onPress={() => setCompanions(c)} />)}</Wrap>
            </Question>

            <Question title="What is your budget style?">
              <Wrap>{BUDGETS.map((b) => <ChipBtn key={b} label={b} active={budgetStyle === b} onPress={() => setBudgetStyle(b)} />)}</Wrap>
            </Question>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 24 }}>
              <TouchableOpacity style={ghost.btn} onPress={() => setStep("advanced")} testID="convo-advanced">
                <Text style={ghost.text}>Advanced preferences</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  label="Generate Itinerary"
                  onPress={generate}
                  disabled={vibes.length === 0}
                  testID="convo-generate"
                  icon={<Ionicons name="sparkles" size={14} color="#fff" />}
                />
              </View>
            </View>
          </View>
        ) : null}

        {/* ===== ADVANCED ===== */}
        {step === "advanced" ? (
          <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
            <BackHeader onBack={() => setStep("convo")} step={3} total={4} />
            <Text style={dreamStyles.title}>Advanced{"\n"}preferences</Text>
            <Text style={dreamStyles.sub}>Optional — skip if you want a surprise.</Text>

            {[
              ["Travel Style", TRAVEL_STYLE, "travel_style"],
              ["Destination Types", DEST_TYPES, "dest_types"],
              ["Interests", INTERESTS, "interests"],
              ["Food Preferences", FOOD, "food"],
              ["Accommodation Style", STAY, "stay"],
              ["Transportation", TRANSPORT, "transport"],
              ["Crowd Preference", CROWD, "crowd"],
            ].map(([title, opts, key]: any) => (
              <Question key={key} title={title}>
                <Wrap>
                  {opts.map((o: string) => (
                    <ChipBtn
                      key={o}
                      label={o}
                      active={(advanced[key] ?? []).includes(o)}
                      onPress={() => toggleAdvanced(key, o)}
                    />
                  ))}
                </Wrap>
              </Question>
            ))}

            <View style={{ marginTop: 22 }}>
              <Text style={qStyles.title}>Special requests (optional)</Text>
              <TextInput
                value={specialRequest}
                onChangeText={setSpecialRequest}
                placeholder="e.g. traveling with toddlers, love coffee shops, hate crowds..."
                placeholderTextColor={colors.textDim}
                style={dreamStyles.specialInput}
                multiline
                testID="special-request"
              />
            </View>

            <PrimaryButton
              label="Generate Itinerary"
              onPress={generate}
              testID="advanced-generate"
              style={{ marginTop: 22 }}
              icon={<Ionicons name="sparkles" size={14} color="#fff" />}
            />
          </View>
        ) : null}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ===== Sub-components =====
const Wrap = ({ children }: any) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
);

const Question = ({ title, sub, children }: any) => (
  <View style={{ marginTop: 20 }}>
    <Text style={qStyles.title}>{title}</Text>
    {sub ? <Text style={qStyles.sub}>{sub}</Text> : null}
    <View style={{ marginTop: 10 }}>{children}</View>
  </View>
);

const BackHeader = ({ onBack, step, total }: any) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
    <TouchableOpacity onPress={onBack} style={resStyles.iconBtn} testID="back-btn">
      <Ionicons name="chevron-back" size={20} color="#fff" />
    </TouchableOpacity>
    <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.surface }}>
      <View style={{ height: 6, width: `${(step / total) * 100}%`, backgroundColor: colors.accent, borderRadius: 3 }} />
    </View>
    <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: "800" }}>{step}/{total}</Text>
  </View>
);

const dreamStyles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2.5 },
  title: { color: "#fff", fontSize: 40, fontWeight: "900", letterSpacing: -1, marginTop: 8, lineHeight: 44 },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 10, lineHeight: 20, fontWeight: "600" },
  inputCard: {
    marginTop: 24,
    backgroundColor: "rgba(14,19,34,0.92)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    minHeight: 80,
  },
  input: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600", lineHeight: 22, paddingTop: 2 },
  popularLabel: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2, marginTop: 28 },
  popularGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  specialInput: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    color: "#fff",
    minHeight: 80,
    marginTop: 8,
    textAlignVertical: "top",
  },
});

const qStyles = StyleSheet.create({
  title: { color: "#fff", fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 4, fontWeight: "600" },
});

const ghost = StyleSheet.create({
  btn: {
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.glass,
  },
  text: { color: colors.text, fontWeight: "700", fontSize: 13 },
});

const genStyles = StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2.5, textAlign: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, textAlign: "center", marginTop: 10, lineHeight: 32 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 8, textAlign: "center", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
  elapsed: { color: colors.accent, fontSize: 12, fontWeight: "900", textAlign: "center", marginTop: 28, letterSpacing: 1 },
});

const resStyles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(7,11,20,0.7)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
});
