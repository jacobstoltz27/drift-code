// Drift AI Planner — 5-step form + review + generate
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api, useAuth } from "@/src/api/client";
import { colors, radii, IMG } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";
import { ItineraryExperience } from "@/src/components/itinerary-experience";
import { PaywallModal } from "@/src/components/paywall-modal";
import { ScheduleModal } from "@/src/components/schedule-modal";

type Step = "basics" | "style" | "finetune" | "more" | "review" | "generating" | "result";

const SCREEN_W = Dimensions.get("window").width;

// ── Data ──────────────────────────────────────────────────────────────────────

const TRIP_TYPES: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Relaxing",     icon: "leaf-outline" },
  { label: "Adventure",    icon: "flash-outline" },
  { label: "Luxury",       icon: "diamond-outline" },
  { label: "Budget",       icon: "wallet-outline" },
  { label: "Romantic",     icon: "heart-outline" },
  { label: "Family",       icon: "people-outline" },
  { label: "Friends Trip", icon: "happy-outline" },
  { label: "Solo Travel",  icon: "person-outline" },
  { label: "Wellness",     icon: "fitness-outline" },
  { label: "Cultural",     icon: "globe-outline" },
  { label: "Foodie",       icon: "restaurant-outline" },
  { label: "Nightlife",    icon: "moon-outline" },
  { label: "Road Trip",    icon: "car-outline" },
  { label: "Backpacking",  icon: "compass-outline" },
  { label: "Wildlife",     icon: "paw-outline" },
  { label: "Photography",  icon: "camera-outline" },
];

const LOOKING_FOR = [
  "Beaches", "Mountains", "Cities", "Islands", "Nature",
  "Hidden Gems", "Historical Sites", "National Parks", "Small Towns", "Countryside",
];

const INTERESTS = [
  "Food", "History", "Architecture", "Museums", "Art",
  "Local Culture", "Shopping", "Nightlife", "Festivals", "Music",
  "Coffee Shops", "Rooftop Views", "Scenic Views", "Street Markets", "Photography", "Sports",
];

const PACE_OPTS = [
  { label: "Relaxing", sub: "Take it slow" },
  { label: "Balanced", sub: "Mix of both" },
  { label: "Packed",   sub: "See everything" },
];

const CROWD_OPTS = ["Tourist Hotspots", "Mix", "Hidden Gems Only"];

const ACCOMMODATION: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Luxury",   icon: "diamond-outline" },
  { label: "Boutique", icon: "flower-outline" },
  { label: "Hotel",    icon: "business-outline" },
  { label: "Airbnb",   icon: "home-outline" },
  { label: "Hostel",   icon: "bed-outline" },
  { label: "Mixed",    icon: "apps-outline" },
];

const TRANSPORT: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Walk",           icon: "walk-outline" },
  { label: "Public Transit", icon: "bus-outline" },
  { label: "Rental Car",     icon: "car-outline" },
  { label: "Private Driver", icon: "person-outline" },
  { label: "Trains",         icon: "train-outline" },
  { label: "Mix",            icon: "shuffle-outline" },
];

const FOOD_PREFS = [
  "Local Cuisine", "Fine Dining", "Street Food", "Seafood",
  "Vegetarian", "Vegan", "No Preference",
];

const GOALS = [
  "Save Money", "Eat Amazing Food", "Relax", "Adventure", "Avoid Crowds",
  "Take Photos", "Explore Culture", "See Landmarks", "Hidden Gems",
  "Meet People", "Celebrate Occasion",
];

const NIGHTLIFE_OPTS = ["None", "Casual", "Bars", "Clubs", "Late Night"];
const CLIMATE_OPTS   = ["Warm", "Hot", "Cool", "Cold", "No Preference"];
const BUDGETS        = ["Under $500", "$500 - $1.5k", "$1.5k - $3k", "$3k+"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

const heroForDestination = (d: string): string => {
  const s = (d || "").toLowerCase();
  if (s.includes("japan") || s.includes("tokyo") || s.includes("kyoto")) return IMG.tokyo;
  if (s.includes("bali")) return IMG.bali;
  if (s.includes("italy") || s.includes("amalfi") || s.includes("rome")) return IMG.amalfi;
  if (s.includes("ice")) return IMG.iceland;
  if (s.includes("santor") || s.includes("greece")) return IMG.santorini;
  if (s.includes("peru") || s.includes("machu")) return IMG.peru;
  if (s.includes("norway") || s.includes("fjord")) return IMG.norway;
  if (s.includes("maldiv")) return IMG.maldives;
  if (s.includes("lisbon") || s.includes("portugal")) return IMG.lisbon;
  return IMG.splashHero;
};

const toggleItem = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

// ── Sub-components ────────────────────────────────────────────────────────────

const StepIndicator = ({
  current, total, onBack, onClose,
}: { current: number; total: number; onBack: () => void; onClose: () => void }) => (
  <View style={ind.row}>
    <TouchableOpacity onPress={onBack} style={ind.iconBtn} testID="step-back">
      <Ionicons name="chevron-back" size={20} color="#fff" />
    </TouchableOpacity>
    <View style={ind.track}>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <React.Fragment key={i}>
            <View style={[ind.dot, (active || done) && ind.dotOn]}>
              {done
                ? <Ionicons name="checkmark" size={10} color="#fff" />
                : <Text style={[ind.dotNum, active && { color: "#fff" }]}>{n}</Text>}
            </View>
            {i < total - 1 && <View style={[ind.seg, done && ind.segOn]} />}
          </React.Fragment>
        );
      })}
    </View>
    <TouchableOpacity onPress={onClose} style={ind.iconBtn} testID="step-close">
      <Ionicons name="close" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

const BackHeader = ({ onBack }: { onBack: () => void }) => (
  <TouchableOpacity onPress={onBack} style={bh.btn} testID="back-btn">
    <Ionicons name="chevron-back" size={20} color="#fff" />
  </TouchableOpacity>
);

const Q = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <View style={q.wrap}>
    <Text style={q.title}>{title}</Text>
    {sub ? <Text style={q.sub}>{sub}</Text> : null}
    <View style={{ marginTop: 12 }}>{children}</View>
  </View>
);

const Wrap = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{children}</View>
);

const Chip = ({ label, active, onPress, icon, testID }: {
  label: string; active?: boolean; onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap; testID?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[ch.pill, active && ch.pillOn]}
    activeOpacity={0.82}
    testID={testID}
  >
    {icon ? <Ionicons name={icon} size={13} color={active ? "#fff" : colors.textMuted} /> : null}
    <Text style={[ch.text, active && ch.textOn]}>{label}</Text>
  </TouchableOpacity>
);

const IconTile = ({ label, icon, active, onPress }: {
  label: string; icon: keyof typeof Ionicons.glyphMap; active?: boolean; onPress?: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={[it.wrap, active && it.wrapOn]} activeOpacity={0.82}>
    <Ionicons name={icon} size={20} color={active ? "#fff" : colors.textMuted} />
    <Text style={[it.label, active && it.labelOn]} numberOfLines={2}>{label}</Text>
  </TouchableOpacity>
);

const PaceSlider = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <View>
    <View style={ps.row}>
      <Ionicons name="body-outline" size={22} color={value === 0 ? "#fff" : colors.textMuted} />
      <View style={ps.track}>
        <TouchableOpacity onPress={() => onChange(0)} style={ps.dotWrap}>
          <View style={[ps.dot, value >= 0 && ps.dotOn, value === 0 && ps.dotCurrent]} />
        </TouchableOpacity>
        <View style={[ps.seg, value >= 1 && ps.segOn]} />
        <TouchableOpacity onPress={() => onChange(1)} style={ps.dotWrap}>
          <View style={[ps.dot, value >= 1 && ps.dotOn, value === 1 && ps.dotCurrent]} />
        </TouchableOpacity>
        <View style={[ps.seg, value >= 2 && ps.segOn]} />
        <TouchableOpacity onPress={() => onChange(2)} style={ps.dotWrap}>
          <View style={[ps.dot, value >= 2 && ps.dotOn, value === 2 && ps.dotCurrent]} />
        </TouchableOpacity>
      </View>
      <Ionicons name="flash-outline" size={22} color={value === 2 ? "#fff" : colors.textMuted} />
    </View>
    <View style={ps.labels}>
      {PACE_OPTS.map((o, i) => (
        <TouchableOpacity key={o.label} onPress={() => onChange(i)} style={ps.labelItem}>
          <Text style={[ps.labelMain, i === value && ps.labelActive]}>{o.label}</Text>
          <Text style={ps.labelSub}>{o.sub}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={rv.section}>
    <Text style={rv.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const PrefRow = ({ items }: { items: { label: string; value: string }[] }) => (
  <View style={rv.prefGrid}>
    {items.filter((i) => i.value).map((item) => (
      <View key={item.label} style={rv.prefItem}>
        <Text style={rv.prefLabel}>{item.label}</Text>
        <Text style={rv.prefValue}>{item.value}</Text>
      </View>
    ))}
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function PlannerScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ prompt?: string }>();

  // Navigation
  const [step, setStep] = useState<Step>("basics");

  // Step 1 — Basics
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("$500 - $1.5k");
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(null);

  // Step 2 — Style
  const [tripTypes, setTripTypes] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // Step 3 — Fine tune
  const [pace, setPace] = useState(1);
  const [crowdPref, setCrowdPref] = useState("Mix");
  const [accommodation, setAccommodation] = useState("Hotel");
  const [transport, setTransport] = useState<string[]>(["Walk"]);
  const [foodPrefs, setFoodPrefs] = useState<string[]>([]);

  // Step 4 — More
  const [goals, setGoals] = useState<string[]>([]);
  const [nightlife, setNightlife] = useState("Casual");
  const [climate, setClimate] = useState("Warm");
  const [specialRequest, setSpecialRequest] = useState("");

  // Generation
  const [itinerary, setItinerary] = useState<any | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (params.prompt) setDestination(String(params.prompt));
  }, [params.prompt]);

  const startElapsed = () => {
    setElapsed(0);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    elapsedTimer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopElapsed = () => {
    if (elapsedTimer.current) { clearInterval(elapsedTimer.current); elapsedTimer.current = null; }
  };
  useEffect(() => () => stopElapsed(), []);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") setActivePicker(null);
    if (event.type === "dismissed" || !date) { setActivePicker(null); return; }
    if (activePicker === "start") {
      setStartDate(date);
      if (endDate && endDate <= date) setEndDate(null);
    } else {
      setEndDate(date);
    }
    if (Platform.OS === "ios") setActivePicker(null);
  };

  const tripDays = startDate && endDate
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 5;

  const generate = async () => {
    const dest = destination.trim() || "Surprise me";
    const parts = [
      `${dest}.`,
      tripTypes.length ? `Travel style: ${tripTypes.join(", ")}.` : "",
      lookingFor.length ? `Looking for: ${lookingFor.join(", ")}.` : "",
      interests.length ? `Interests: ${interests.join(", ")}.` : "",
      `Pace: ${PACE_OPTS[pace].label}.`,
      `Budget: ${budget}.`,
      `Accommodation: ${accommodation}.`,
      `Crowd: ${crowdPref}.`,
      transport.length ? `Transport: ${transport.join(", ")}.` : "",
      foodPrefs.length ? `Food: ${foodPrefs.join(", ")}.` : "",
      goals.length ? `Goals: ${goals.join(", ")}.` : "",
      `Nightlife: ${nightlife}. Climate: ${climate}.`,
      specialRequest.trim() ? `Special: ${specialRequest.trim()}.` : "",
    ].filter(Boolean).join(" ");

    setStep("generating");
    setItinerary(null);
    startElapsed();
    try {
      const job = await api.plannerCreateJob({
        prompt: parts,
        destination: dest,
        days: tripDays,
        travelers,
        budget,
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
      setStep("review");
    } finally {
      stopElapsed();
    }
  };

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

  const reset = () => {
    setStep("basics");
    setItinerary(null);
    setDestination("");
    setTripTypes([]);
    setLookingFor([]);
    setInterests([]);
    setPace(1);
    setFoodPrefs([]);
    setGoals([]);
    setSpecialRequest("");
  };

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (step === "result" && itinerary) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
          <View style={res.topBar}>
            <TouchableOpacity onPress={reset} style={res.iconBtn} testID="planner-new">
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={res.iconBtn}>
              <Ionicons name="share-outline" size={18} color="#fff" />
            </View>
          </View>
          <ItineraryExperience
            itinerary={itinerary}
            heroImage={heroForDestination(itinerary.destination)}
            travelers={travelers}
            onSave={() => saveTrip("saved")}
            onSchedule={() => setScheduleOpen(true)}
            onSteal={onSteal}
            onRemix={() => saveTrip("saved")}
          />
        </ScrollView>
        <PaywallModal
          visible={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          reason="Steal Itinerary is a Drift Plus feature."
          onSuccess={() => saveTrip("saved")}
        />
        <ScheduleModal
          visible={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          onConfirm={async (s, e) => { await saveTrip("upcoming", { start: s, end: e }); setScheduleOpen(false); }}
          busy={busy}
        />
      </SafeAreaView>
    );
  }

  // ── GENERATING ─────────────────────────────────────────────────────────────
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
        <Image source={{ uri: heroForDestination(destination) }} style={StyleSheet.absoluteFillObject} blurRadius={14} />
        <LinearGradient colors={["rgba(9,12,26,0.5)", "rgba(9,12,26,0.98)"]} style={StyleSheet.absoluteFillObject} />
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "center" }}>
            <Text style={gen.eyebrow}>DRIFT IS DESIGNING</Text>
            <Text style={gen.title}>{destination.trim() || "Your dream trip"}</Text>
            <Text style={gen.sub}>Usually 60–180 seconds for a fully detailed plan.</Text>
            <View style={{ marginTop: 36, gap: 14 }}>
              {checks.map((c, i) => {
                const lit = i <= Math.floor(elapsed / 12);
                return (
                  <View key={c} style={gen.row}>
                    <View style={[gen.circle, lit && { backgroundColor: colors.teal, borderColor: colors.teal }]}>
                      {lit ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                    </View>
                    <Text style={[gen.checkText, lit && { color: "#fff", fontWeight: "700" }]}>{c}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={gen.elapsed}>{elapsed}s</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ── FORM STEPS ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>

            {/* ── STEP 1: BASICS ────────────────────────────────────────────── */}
            {step === "basics" && (
              <View>
                <StepIndicator current={1} total={3} onBack={reset} onClose={reset} />
                <Text style={sc.eyebrow}>Step 1 of 3</Text>
                <Text style={sc.title}>Trip Basics</Text>
                <Text style={sc.sub}>Let's start with the essentials.</Text>

                <Q title="Where are you going?">
                  <View style={sc.inputWrap}>
                    <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                    <TextInput
                      value={destination}
                      onChangeText={setDestination}
                      placeholder="e.g. Bali, Japan, Amalfi Coast..."
                      placeholderTextColor={colors.textDim}
                      style={sc.input}
                      testID="destination-input"
                    />
                  </View>
                </Q>

                <Q title="When are you traveling?">
                  <View style={sc.dateRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={sc.dateLabel}>Start Date</Text>
                      <TouchableOpacity
                        style={sc.dateBtn}
                        onPress={() => setActivePicker("start")}
                        testID="start-date-btn"
                      >
                        <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
                        <Text style={[sc.dateBtnText, !startDate && sc.datePlaceholder]}>
                          {fmtDate(startDate) ?? "Select date"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={sc.dateLabel}>End Date</Text>
                      <TouchableOpacity
                        style={sc.dateBtn}
                        onPress={() => setActivePicker("end")}
                        testID="end-date-btn"
                      >
                        <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
                        <Text style={[sc.dateBtnText, !endDate && sc.datePlaceholder]}>
                          {fmtDate(endDate) ?? "Select date"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Q>

                <Q title="Travelers">
                  <View style={sc.travelerRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                    <Text style={sc.travelerText}>{travelers} Traveler{travelers !== 1 ? "s" : ""}</Text>
                    <View style={sc.counter}>
                      <TouchableOpacity
                        onPress={() => setTravelers((v) => Math.max(1, v - 1))}
                        style={sc.counterBtn}
                        testID="traveler-minus"
                      >
                        <Ionicons name="remove" size={18} color={travelers > 1 ? "#fff" : colors.textDim} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setTravelers((v) => Math.min(20, v + 1))}
                        style={sc.counterBtn}
                        testID="traveler-plus"
                      >
                        <Ionicons name="add" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Q>

                <Q title="Budget" sub="(total for the trip)">
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {BUDGETS.map((b) => (
                      <Chip key={b} label={b} active={budget === b} onPress={() => setBudget(b)} testID={`budget-${b}`} />
                    ))}
                  </View>
                </Q>

                <TouchableOpacity style={sc.budgetHint} onPress={() => {}}>
                  <Ionicons name="wallet-outline" size={20} color={colors.accent} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={sc.budgetHintTitle}>Not sure about budget?</Text>
                    <Text style={sc.budgetHintSub}>No worries! You can adjust this later.</Text>
                  </View>
                </TouchableOpacity>

                <PrimaryButton
                  label="Next: Preferences"
                  onPress={() => setStep("style")}
                  disabled={!destination.trim()}
                  testID="basics-next"
                  style={{ marginTop: 28 }}
                  icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
                />
              </View>
            )}

            {/* ── STEP 2: TRAVEL STYLE ──────────────────────────────────────── */}
            {step === "style" && (
              <View>
                <StepIndicator current={2} total={3} onBack={() => setStep("basics")} onClose={reset} />
                <Text style={sc.eyebrow}>Step 2 of 3</Text>
                <Text style={sc.title}>Tell us your travel style</Text>
                <Text style={sc.sub}>This helps AI craft your perfect itinerary.</Text>

                <Q title="What kind of trip is this?">
                  <Wrap>
                    {TRIP_TYPES.map((t) => (
                      <Chip
                        key={t.label}
                        label={t.label}
                        icon={t.icon}
                        active={tripTypes.includes(t.label)}
                        onPress={() => setTripTypes((s) => toggleItem(s, t.label))}
                        testID={`triptype-${t.label}`}
                      />
                    ))}
                  </Wrap>
                </Q>

                <Q title="What are you looking for?" sub="Select all that apply">
                  <Wrap>
                    {LOOKING_FOR.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        active={lookingFor.includes(item)}
                        onPress={() => setLookingFor((s) => toggleItem(s, item))}
                      />
                    ))}
                  </Wrap>
                </Q>

                <Q title="What interests you most?" sub="Select up to 5">
                  <Wrap>
                    {INTERESTS.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        active={interests.includes(item)}
                        onPress={() => {
                          if (interests.includes(item)) {
                            setInterests((s) => s.filter((v) => v !== item));
                          } else if (interests.length < 5) {
                            setInterests((s) => [...s, item]);
                          }
                        }}
                      />
                    ))}
                  </Wrap>
                </Q>

                <PrimaryButton
                  label="Next: Fine Tune"
                  onPress={() => setStep("finetune")}
                  testID="style-next"
                  style={{ marginTop: 28 }}
                  icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
                />
              </View>
            )}

            {/* ── STEP 3: FINE TUNE ─────────────────────────────────────────── */}
            {step === "finetune" && (
              <View>
                <StepIndicator current={3} total={3} onBack={() => setStep("style")} onClose={reset} />
                <Text style={sc.eyebrow}>Step 3 of 3</Text>
                <Text style={sc.title}>Fine tune your trip</Text>
                <Text style={sc.sub}>Almost done! A few final details.</Text>

                <Q title="Travel pace" sub="How fast-paced do you want your trip to be?">
                  <PaceSlider value={pace} onChange={setPace} />
                </Q>

                <Q title="Crowd preference">
                  <Wrap>
                    {CROWD_OPTS.map((c) => (
                      <Chip key={c} label={c} active={crowdPref === c} onPress={() => setCrowdPref(c)} />
                    ))}
                  </Wrap>
                </Q>

                <Q title="Accommodation style">
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {ACCOMMODATION.map((a) => (
                      <IconTile
                        key={a.label}
                        label={a.label}
                        icon={a.icon}
                        active={accommodation === a.label}
                        onPress={() => setAccommodation(a.label)}
                      />
                    ))}
                  </View>
                </Q>

                <Q title="Transportation preference">
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {TRANSPORT.map((t) => (
                      <IconTile
                        key={t.label}
                        label={t.label}
                        icon={t.icon}
                        active={transport.includes(t.label)}
                        onPress={() => setTransport((s) => toggleItem(s, t.label))}
                      />
                    ))}
                  </View>
                </Q>

                <Q title="Food preferences" sub="Select all that apply">
                  <Wrap>
                    {FOOD_PREFS.map((f) => (
                      <Chip
                        key={f}
                        label={f}
                        active={foodPrefs.includes(f)}
                        onPress={() => setFoodPrefs((s) => toggleItem(s, f))}
                      />
                    ))}
                  </Wrap>
                </Q>

                <PrimaryButton
                  label="Generate My Itinerary ✦"
                  onPress={() => setStep("more")}
                  testID="finetune-next"
                  style={{ marginTop: 28 }}
                />
              </View>
            )}

            {/* ── MORE ABOUT YOUR TRIP ──────────────────────────────────────── */}
            {step === "more" && (
              <View>
                <BackHeader onBack={() => setStep("finetune")} />
                <Text style={sc.title}>More about your trip</Text>
                <Text style={sc.sub}>Optional details to make it even better.</Text>

                <Q title="Trip goals" sub="Choose up to 3">
                  <Wrap>
                    {GOALS.map((g) => (
                      <Chip
                        key={g}
                        label={g}
                        active={goals.includes(g)}
                        onPress={() => {
                          if (goals.includes(g)) {
                            setGoals((s) => s.filter((v) => v !== g));
                          } else if (goals.length < 3) {
                            setGoals((s) => [...s, g]);
                          }
                        }}
                      />
                    ))}
                  </Wrap>
                </Q>

                <Q title="Nightlife preference">
                  <Wrap>
                    {NIGHTLIFE_OPTS.map((n) => (
                      <Chip key={n} label={n} active={nightlife === n} onPress={() => setNightlife(n)} />
                    ))}
                  </Wrap>
                </Q>

                <Q title="Climate preference">
                  <Wrap>
                    {CLIMATE_OPTS.map((c) => (
                      <Chip key={c} label={c} active={climate === c} onPress={() => setClimate(c)} />
                    ))}
                  </Wrap>
                </Q>

                <Q title="Any special requests?">
                  <View style={sc.specialWrap}>
                    <TextInput
                      value={specialRequest}
                      onChangeText={(t) => setSpecialRequest(t.slice(0, 250))}
                      placeholder="e.g. celebrating anniversary, gluten free, mobility friendly, want incredible sunsets..."
                      placeholderTextColor={colors.textDim}
                      style={sc.specialInput}
                      multiline
                      testID="special-request"
                    />
                    <Text style={sc.charCount}>{specialRequest.length}/250</Text>
                  </View>
                </Q>

                <PrimaryButton
                  label="Review Trip Summary"
                  onPress={() => setStep("review")}
                  testID="more-review"
                  style={{ marginTop: 28 }}
                  icon={<Ionicons name="arrow-forward" size={16} color="#fff" />}
                />
              </View>
            )}

            {/* ── REVIEW YOUR TRIP ──────────────────────────────────────────── */}
            {step === "review" && (
              <View>
                <BackHeader onBack={() => setStep("more")} />
                <Text style={sc.title}>Review your trip</Text>
                <Text style={sc.sub}>Here's what we'll use to plan your perfect trip.</Text>

                {/* Trip overview card */}
                <View style={rv.overviewCard}>
                  <Image
                    source={{ uri: heroForDestination(destination) }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient
                    colors={["rgba(9,12,26,0.25)", "rgba(9,12,26,0.92)"]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <View style={rv.overviewBody}>
                    <Text style={rv.overviewDest}>{destination || "Your Dream Trip"}</Text>
                    {(startDate || endDate) && (
                      <Text style={rv.overviewMeta}>
                        {fmtDate(startDate) ?? "—"} – {fmtDate(endDate) ?? "—"} • {travelers} Traveler{travelers !== 1 ? "s" : ""}
                      </Text>
                    )}
                    {!startDate && (
                      <Text style={rv.overviewMeta}>{travelers} Traveler{travelers !== 1 ? "s" : ""}</Text>
                    )}
                    <Text style={rv.overviewBudget}>Budget: {budget}</Text>
                  </View>
                </View>

                {/* Travel Style */}
                {tripTypes.length > 0 && (
                  <ReviewSection title="Travel Style">
                    <Text style={rv.bodyText}>{tripTypes.join(", ")}</Text>
                  </ReviewSection>
                )}

                {/* Interests */}
                {(lookingFor.length > 0 || interests.length > 0) && (
                  <ReviewSection title="Interests">
                    <Text style={rv.bodyText}>
                      {[...lookingFor, ...interests].join(", ")}
                    </Text>
                  </ReviewSection>
                )}

                {/* Preferences grid */}
                <ReviewSection title="Preferences">
                  <PrefRow items={[
                    { label: "Pace",          value: PACE_OPTS[pace].label },
                    { label: "Food",          value: foodPrefs.join(", ") || "Any" },
                    { label: "Crowd",         value: crowdPref },
                    { label: "Nightlife",     value: nightlife },
                    { label: "Accommodation", value: accommodation },
                    { label: "Climate",       value: climate },
                    { label: "Transport",     value: transport.join(", ") },
                    { label: "Goals",         value: goals.join(", ") },
                  ]} />
                </ReviewSection>

                {/* Special requests */}
                {specialRequest.trim() ? (
                  <ReviewSection title="Special Requests">
                    <Text style={rv.specialText}>"{specialRequest.trim()}"</Text>
                  </ReviewSection>
                ) : null}

                <PrimaryButton
                  label="Generate Itinerary ✦"
                  onPress={generate}
                  testID="review-generate"
                  style={{ marginTop: 28 }}
                />
                <TouchableOpacity
                  onPress={() => setStep("more")}
                  style={rv.editBtn}
                  testID="review-edit"
                >
                  <Text style={rv.editBtnText}>Edit Selections</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date picker — Android (auto-dialog) */}
      {activePicker !== null && Platform.OS === "android" && (
        <DateTimePicker
          value={activePicker === "start" ? (startDate ?? new Date()) : (endDate ?? new Date())}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={activePicker === "end" ? (startDate ?? new Date()) : new Date()}
        />
      )}

      {/* Date picker — iOS (bottom sheet) */}
      {activePicker !== null && Platform.OS === "ios" && (
        <Modal transparent animationType="slide" visible>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)" }}
              onPress={() => setActivePicker(null)}
            />
            <View style={dp.sheet}>
              <View style={dp.sheetHeader}>
                <Text style={dp.sheetTitle}>
                  {activePicker === "start" ? "Start Date" : "End Date"}
                </Text>
                <TouchableOpacity onPress={() => setActivePicker(null)}>
                  <Text style={dp.done}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={activePicker === "start" ? (startDate ?? new Date()) : (endDate ?? new Date())}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={activePicker === "end" ? (startDate ?? new Date()) : new Date()}
                themeVariant="dark"
                style={{ backgroundColor: colors.surface }}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const TILE_W = Math.floor((SCREEN_W - 40 - 40) / 6); // 6 tiles in a row

const ind = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
  },
  track: { flex: 1, flexDirection: "row", alignItems: "center" },
  dot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.borderStrong,
    alignItems: "center", justifyContent: "center",
    backgroundColor: colors.surface,
  },
  dotOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotNum: { color: colors.textMuted, fontSize: 11, fontWeight: "800" },
  seg: { flex: 1, height: 2, backgroundColor: colors.borderStrong },
  segOn: { backgroundColor: colors.accent },
});

const bh = StyleSheet.create({
  btn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
});

const q = StyleSheet.create({
  wrap: { marginTop: 24 },
  title: { color: "#fff", fontSize: 16, fontWeight: "800" },
  sub: { color: colors.textMuted, fontSize: 12, marginTop: 3, fontWeight: "500" },
});

const ch = StyleSheet.create({
  pill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  pillOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  text: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  textOn: { color: "#fff", fontWeight: "800" },
});

const it = StyleSheet.create({
  wrap: {
    width: TILE_W, alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
    gap: 5,
  },
  wrapOn: { backgroundColor: "rgba(108,99,255,0.2)", borderColor: colors.accent },
  label: { color: colors.textMuted, fontSize: 9, fontWeight: "600", textAlign: "center" },
  labelOn: { color: "#fff", fontWeight: "800" },
});

const ps = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  track: { flex: 1, flexDirection: "row", alignItems: "center" },
  dotWrap: { padding: 6 },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  dotOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  dotCurrent: { width: 24, height: 24, borderRadius: 12, borderWidth: 2.5 },
  seg: { flex: 1, height: 2, backgroundColor: colors.borderStrong },
  segOn: { backgroundColor: colors.accent },
  labels: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  labelItem: { flex: 1, alignItems: "center" },
  labelMain: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  labelActive: { color: "#fff" },
  labelSub: { color: colors.textDim, fontSize: 10, marginTop: 2 },
});

const sc = StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 1.5, marginTop: 14 },
  title: { color: "#fff", fontSize: 30, fontWeight: "900", letterSpacing: -0.6, marginTop: 8, lineHeight: 36 },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 6, fontWeight: "500" },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, height: 52,
  },
  input: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "500" },
  dateRow: { flexDirection: "row", gap: 12 },
  dateLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "700", marginBottom: 6 },
  dateBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, height: 48,
  },
  dateBtnText: { color: "#fff", fontSize: 13, fontWeight: "600", flex: 1 },
  datePlaceholder: { color: colors.textDim },
  travelerRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, height: 52, gap: 10,
  },
  travelerText: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600" },
  counter: { flexDirection: "row", gap: 4 },
  counterBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: "center", justifyContent: "center",
  },
  budgetHint: {
    flexDirection: "row", alignItems: "center",
    marginTop: 18, padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(108,99,255,0.1)",
    borderWidth: 1, borderColor: "rgba(108,99,255,0.2)",
    gap: 0,
  },
  budgetHintTitle: { color: colors.accent, fontSize: 14, fontWeight: "800" },
  budgetHintSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  specialWrap: {
    backgroundColor: colors.surface,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    padding: 14,
  },
  specialInput: {
    color: "#fff", fontSize: 14, lineHeight: 20,
    minHeight: 90, textAlignVertical: "top",
  },
  charCount: { color: colors.textDim, fontSize: 11, textAlign: "right", marginTop: 6 },
});

const rv = StyleSheet.create({
  overviewCard: {
    height: 180, borderRadius: radii.lg, overflow: "hidden",
    marginTop: 20,
  },
  overviewBody: { position: "absolute", left: 18, right: 18, bottom: 16 },
  overviewDest: { color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: -0.4 },
  overviewMeta: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4, fontWeight: "600" },
  overviewBudget: { color: colors.accent, fontSize: 12, marginTop: 3, fontWeight: "700" },
  section: {
    marginTop: 18,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.accent, fontSize: 11, fontWeight: "900",
    letterSpacing: 1.5, marginBottom: 10,
  },
  bodyText: { color: colors.text, fontSize: 14, lineHeight: 20 },
  prefGrid: { flexDirection: "row", flexWrap: "wrap", gap: 0 },
  prefItem: { width: "50%", paddingVertical: 5, paddingRight: 8 },
  prefLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  prefValue: { color: "#fff", fontSize: 13, fontWeight: "700", marginTop: 2 },
  specialText: { color: colors.textMuted, fontSize: 13, fontStyle: "italic", lineHeight: 20 },
  editBtn: {
    height: 52, borderRadius: 999,
    borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
    marginTop: 12, backgroundColor: colors.glass,
  },
  editBtnText: { color: colors.text, fontWeight: "700", fontSize: 15 },
});

const dp = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 36,
    borderWidth: 1, borderColor: colors.border,
  },
  sheetHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  sheetTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
  done: { color: colors.accent, fontSize: 15, fontWeight: "700" },
});

const gen = StyleSheet.create({
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2.5, textAlign: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5, textAlign: "center", marginTop: 10, lineHeight: 34 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 8, textAlign: "center", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  circle: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  checkText: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
  elapsed: { color: colors.accent, fontSize: 12, fontWeight: "900", textAlign: "center", marginTop: 28, letterSpacing: 1 },
});

const res = StyleSheet.create({
  topBar: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 4, gap: 10 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(9,12,26,0.7)",
    borderWidth: 1, borderColor: colors.border,
    alignItems: "center", justifyContent: "center",
  },
});
