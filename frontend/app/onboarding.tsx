// Multi-step onboarding quiz
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii, IMG } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";
import { api, useAuth } from "@/src/api/client";

const STEPS = [
  {
    key: "travel_frequency",
    title: "How often do you travel?",
    options: ["Never", "Once a year", "2-4 times per year", "5+ times per year", "Constantly traveling"],
  },
  {
    key: "age_range",
    title: "What's your age range?",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"],
  },
  {
    key: "budget",
    title: "What's your typical budget?",
    options: ["Under $500", "$500 - $1,500", "$1,500 - $3,000", "$3,000 - $7,500", "Luxury ($7,500+)"],
  },
  {
    key: "companions",
    title: "Who do you travel with?",
    options: ["Solo", "Couple", "Friends", "Family", "Business"],
  },
] as const;

const INTERESTS = [
  { key: "Beaches", icon: "umbrella-outline" },
  { key: "Mountains", icon: "trail-sign-outline" },
  { key: "Nightlife", icon: "moon-outline" },
  { key: "Luxury", icon: "diamond-outline" },
  { key: "Food", icon: "restaurant-outline" },
  { key: "Adventure", icon: "compass-outline" },
  { key: "Culture", icon: "color-palette-outline" },
  { key: "Wellness", icon: "leaf-outline" },
  { key: "Photography", icon: "camera-outline" },
  { key: "Sports", icon: "football-outline" },
  { key: "Festivals", icon: "ticket-outline" },
  { key: "Road Trips", icon: "car-outline" },
] as const;

export default function Onboarding() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const totalSteps = STEPS.length + 1; // + interests
  const isInterestStep = step === STEPS.length;
  const progress = (step + 1) / totalSteps;

  const next = async () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Finish — submit
    setBusy(true);
    try {
      const updated = await api.saveOnboarding({ ...answers, interests });
      setUser(updated);
      router.replace("/(tabs)/home");
    } catch (e) {
      setBusy(false);
    }
  };

  const back = () => {
    if (step === 0) router.replace("/welcome");
    else setStep((s) => s - 1);
  };

  const canContinue = isInterestStep
    ? interests.length > 0
    : Boolean(answers[STEPS[step].key]);

  const toggleInterest = (k: string) =>
    setInterests((arr) =>
      arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k],
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Image source={{ uri: IMG.splashHero }} style={StyleSheet.absoluteFillObject} blurRadius={20} />
      <LinearGradient
        colors={["rgba(7,11,20,0.85)", "rgba(7,11,20,0.98)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={back}
            style={styles.backBtn}
            testID="onboarding-back"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {isInterestStep ? "What are you interested in?" : STEPS[step].title}
          </Text>
          {isInterestStep ? (
            <Text style={styles.sub}>Select all that apply</Text>
          ) : null}

          {!isInterestStep ? (
            <View style={{ gap: 12, marginTop: 28 }}>
              {STEPS[step].options.map((opt) => {
                const active = answers[STEPS[step].key] === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.9}
                    onPress={() =>
                      setAnswers((a) => ({ ...a, [STEPS[step].key]: opt }))
                    }
                    style={[styles.choice, active && styles.choiceActive]}
                    testID={`onboarding-option-${opt.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
                      {opt}
                    </Text>
                    {active ? (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.interestGrid}>
              {INTERESTS.map((it) => {
                const active = interests.includes(it.key);
                return (
                  <TouchableOpacity
                    key={it.key}
                    activeOpacity={0.9}
                    onPress={() => toggleInterest(it.key)}
                    style={[styles.interestCard, active && styles.interestActive]}
                    testID={`onboarding-interest-${it.key.toLowerCase()}`}
                  >
                    <Ionicons
                      name={it.icon as any}
                      size={26}
                      color={active ? "#fff" : colors.accent}
                    />
                    <Text
                      style={[styles.interestLabel, active && { color: "#fff" }]}
                    >
                      {it.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={step === totalSteps - 1 ? (busy ? "Saving..." : "Start Exploring") : "Next"}
            onPress={next}
            disabled={!canContinue || busy}
            testID="onboarding-next"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.accent },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  title: { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  sub: { color: colors.textMuted, fontSize: 14, marginTop: 6 },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: colors.glass,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  choiceActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  choiceText: { color: colors.text, fontSize: 15, fontWeight: "600" },
  choiceTextActive: { color: "#fff", fontWeight: "800" },
  interestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    gap: 12,
    justifyContent: "space-between",
  },
  interestCard: {
    width: "31%",
    aspectRatio: 1,
    backgroundColor: colors.glass,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  interestActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  interestLabel: { color: colors.text, fontSize: 11, fontWeight: "700", marginTop: 8 },
  footer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
});
