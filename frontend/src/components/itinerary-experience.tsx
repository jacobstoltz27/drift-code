// Drift Itinerary Experience — flagship itinerary view
// Hero + day selector + 4 internal tabs (Itinerary / Map / Budget / Insights)
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, G } from "react-native-svg";
import { colors, radii } from "@/src/theme";

const { width } = Dimensions.get("window");

// ----- helpers -----
const CATEGORY_IMG: Record<string, string> = {
  food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  walk: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
  attraction: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?w=400&q=80",
  view: "https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=400&q=80",
  bar: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&q=80",
  shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  culture: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400&q=80",
  view_sunset: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&q=80",
  wellness: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",
  adventure: "https://images.unsplash.com/photo-1530841344095-71d4dba1f1ea?w=400&q=80",
  transport: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&q=80",
};

const imageForActivity = (it: any): string => {
  const lower = `${it.activity || ""} ${it.detail || ""}`.toLowerCase();
  if (lower.includes("sunset") || lower.includes("sunrise"))
    return CATEGORY_IMG.view_sunset;
  if (lower.includes("dinner") || lower.includes("lunch") || lower.includes("brunch") || lower.includes("breakfast") || lower.includes("restaurant"))
    return CATEGORY_IMG.food;
  return CATEGORY_IMG[it.category || ""] ?? CATEGORY_IMG.attraction;
};

const fmtDateRange = (start?: string, end?: string) => {
  if (!start || !end) return null;
  try {
    const s = new Date(start);
    const e = new Date(end);
    const f = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${f(s)} — ${f(e)}`;
  } catch {
    return `${start} — ${end}`;
  }
};

const dayLabel = (start: string | undefined, dayIndex: number) => {
  if (!start) return `Day ${dayIndex + 1}`;
  try {
    const d = new Date(start);
    d.setDate(d.getDate() + dayIndex);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return `Day ${dayIndex + 1}`;
  }
};

// ----- Trip score gauge -----
const ScoreGauge = ({ score, size = 76 }: { score: number; size?: number }) => {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={4}
            fill="transparent"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors.accent}
            strokeWidth={4}
            fill="transparent"
            strokeDasharray={`${c * pct} ${c}`}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: size * 0.32, fontWeight: "900" }}>
          {Math.round(score)}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 9, fontWeight: "700", marginTop: -2, letterSpacing: 0.5 }}>
          Trip Score
        </Text>
      </View>
    </View>
  );
};

// ----- Budget donut -----
const BudgetDonut = ({ breakdown, size = 96 }: { breakdown: any[]; size?: number }) => {
  const colorsList = [colors.accent, "#7C8AFF", colors.teal, "#F59E0B", "#EF4444"];
  const total = breakdown.reduce((s, b) => s + (b.amount || 0), 0) || 1;
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={10} fill="transparent" />
        {breakdown.map((b, i) => {
          const frac = (b.amount || 0) / total;
          const seg = c * frac;
          const dash = `${seg} ${c - seg}`;
          const el = (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={colorsList[i % colorsList.length]}
              strokeWidth={10}
              fill="transparent"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += seg;
          return el;
        })}
      </G>
    </Svg>
  );
};

// ----- Main -----
type Props = {
  itinerary: any;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  heroImage?: string;
  onSave?: () => void;
  onSchedule?: () => void;
  onSteal?: () => void;
  onRemix?: () => void;
};

export const ItineraryExperience = ({
  itinerary,
  startDate,
  endDate,
  travelers = 2,
  heroImage,
  onSave,
  onSchedule,
  onSteal,
  onRemix,
}: Props) => {
  const days = itinerary?.days ?? [];
  const [dayIdx, setDayIdx] = useState(0);
  const [tab, setTab] = useState<"itinerary" | "map" | "budget" | "insights">("itinerary");
  const day = days[dayIdx] ?? null;

  const dateRange = fmtDateRange(startDate, endDate);
  const vibes: string[] = itinerary?.vibes ?? ["Romantic", "Ocean View", "Relaxing", "Luxury"];

  return (
    <View style={styles.wrap}>
      {/* HERO */}
      <View style={styles.hero}>
        {heroImage ? (
          <Image source={{ uri: heroImage }} style={StyleSheet.absoluteFillObject} />
        ) : null}
        <LinearGradient
          colors={["rgba(7,11,20,0.15)", "rgba(7,11,20,0.65)", "rgba(7,11,20,0.98)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroBottom}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroDest} numberOfLines={1}>
                {itinerary?.destination?.split(",")[0]}
              </Text>
              <Text style={styles.heroCountry} numberOfLines={1}>
                {itinerary?.country ?? itinerary?.destination?.split(",")[1]?.trim() ?? ""}
              </Text>
              <View style={styles.metaRow}>
                {dateRange ? (
                  <View style={styles.metaChip}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.metaText}>{dateRange}</Text>
                  </View>
                ) : (
                  <View style={styles.metaChip}>
                    <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.metaText}>{days.length} days</Text>
                  </View>
                )}
                <View style={styles.metaChip}>
                  <Ionicons name="people-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.metaText}>{travelers} Travelers</Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: "center" }}>
              <ScoreGauge score={itinerary?.trip_score ?? 92} size={84} />
              <Text style={styles.scoreLabel}>{itinerary?.score_label ?? "Excellent Match"}</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vibeRow}
          >
            {vibes.map((v, i) => (
              <View key={i} style={[styles.vibeChip, vibeStyles[i % vibeStyles.length]]}>
                <Text style={[styles.vibeText, { color: vibeStyles[i % vibeStyles.length].color }]}>{v}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onSave} testID="ix-save">
          <Ionicons name="bookmark-outline" size={16} color="#fff" />
          <Text style={styles.actionLabel}>Save Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionPrimary]}
          onPress={onSchedule}
          testID="ix-schedule"
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={[styles.actionLabel, { color: "#fff", fontWeight: "900" }]}>Add to Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onSteal} testID="ix-steal">
          <Ionicons name="sparkles-outline" size={16} color="#fff" />
          <Text style={styles.actionLabel}>Steal</Text>
        </TouchableOpacity>
      </View>

      {/* DAY SELECTOR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysRow}
      >
        {days.map((d: any, i: number) => {
          const active = i === dayIdx;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setDayIdx(i)}
              style={[styles.dayPill, active && styles.dayPillActive]}
              testID={`day-${i + 1}`}
            >
              <Text style={[styles.dayPillTop, active && { color: "#fff", fontWeight: "900" }]}>
                Day {d.day ?? i + 1}
              </Text>
              <Text style={[styles.dayPillBottom, active && { color: "#fff" }]}>
                {dayLabel(startDate, i)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* INTERNAL TABS */}
      <View style={styles.tabsRow}>
        {(["itinerary", "map", "budget", "insights"] as const).map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              testID={`tab-${t}`}
            >
              <Text style={[styles.tabText, active && { color: "#fff", fontWeight: "900" }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB CONTENT */}
      {tab === "itinerary" && day ? <ItineraryTab day={day} /> : null}
      {tab === "map" && day ? <MapTab day={day} /> : null}
      {tab === "budget" && itinerary ? (
        <BudgetTab breakdown={itinerary.budget_breakdown ?? []} total={itinerary.total_estimated_cost_usd ?? 0} days={days.length} />
      ) : null}
      {tab === "insights" && day ? (
        <InsightsTab itinerary={itinerary} day={day} />
      ) : null}
    </View>
  );
};

// ===== ITINERARY TAB =====
const ItineraryTab = ({ day }: { day: any }) => (
  <View style={ix.tabContent}>
    {day.drift_insight ? (
      <View style={ix.driftInsight}>
        <Ionicons name="sparkles" size={14} color={colors.accent} />
        <Text style={ix.driftInsightText}>{day.drift_insight}</Text>
      </View>
    ) : null}

    {(["morning", "afternoon", "evening"] as const).map((slot) => {
      const items: any[] = day[slot] ?? [];
      if (!items.length) return null;
      const icon = slot === "morning" ? "sunny-outline" : slot === "afternoon" ? "partly-sunny-outline" : "moon-outline";
      return (
        <View key={slot} style={{ marginTop: 8 }}>
          <View style={ix.slotHeader}>
            <Ionicons name={icon as any} size={14} color={colors.accent} />
            <Text style={ix.slotLabel}>{slot.toUpperCase()}</Text>
          </View>
          {items.map((it, idx) => (
            <View key={idx} style={ix.actRow}>
              <View style={ix.timeCol}>
                <Text style={ix.timeText}>{it.time}</Text>
              </View>
              <View style={ix.actCard}>
                <Image source={{ uri: imageForActivity(it) }} style={ix.actImg} />
                <View style={{ flex: 1, padding: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                    <Text style={ix.actName} numberOfLines={2}>
                      {it.activity}
                    </Text>
                    <TouchableOpacity style={ix.actSave}>
                      <Ionicons name="bookmark-outline" size={14} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                  <View style={ix.actMetaRow}>
                    <Ionicons name="location-outline" size={11} color={colors.textMuted} />
                    <Text style={ix.actLoc}>{it.location ?? "Local area"}</Text>
                  </View>
                  <View style={ix.actMetaRow}>
                    <Ionicons name="car-outline" size={11} color={colors.textMuted} />
                    <Text style={ix.actMetaText}>{it.travel_time}</Text>
                    <Text style={ix.actDot}> · </Text>
                    <Text style={[ix.actMetaText, { color: it.cost_usd ? colors.teal : colors.textMuted, fontWeight: "800" }]}>
                      {it.cost_usd ? `$${it.cost_usd}` : "Free"}
                    </Text>
                  </View>
                  {it.detail ? <Text style={ix.actDetail} numberOfLines={2}>{it.detail}</Text> : null}
                  {it.tip ? (
                    <View style={ix.tipRow}>
                      <Ionicons name="bulb-outline" size={11} color={colors.gold} />
                      <Text style={ix.tipText} numberOfLines={2}>{it.tip}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      );
    })}

    {Array.isArray(day.alternatives) && day.alternatives.length > 0 ? (
      <View style={{ marginTop: 16 }}>
        <Text style={ix.sectionEyebrow}>ALTERNATIVE OPTIONS</Text>
        {day.alternatives.map((a: any, i: number) => (
          <View key={i} style={ix.altCard}>
            <View style={ix.altIcon}>
              <Ionicons
                name={a.kind === "Luxury" ? "diamond-outline" : a.kind === "Budget" ? "cash-outline" : "compass-outline"}
                size={16}
                color={a.kind === "Luxury" ? colors.gold : a.kind === "Budget" ? colors.teal : colors.accent}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ix.altKind}>{a.kind} Option</Text>
              <Text style={ix.altTitle}>{a.title}</Text>
              <Text style={ix.altDetail} numberOfLines={2}>{a.detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

// ===== MAP TAB =====
const MapTab = ({ day }: { day: any }) => {
  const points: any[] = [
    ...(day.morning ?? []),
    ...(day.afternoon ?? []),
    ...(day.evening ?? []),
  ].slice(0, 8);
  return (
    <View style={ix.tabContent}>
      <View style={ix.mapWrap}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=900&q=80" }}
          style={StyleSheet.absoluteFillObject}
          blurRadius={1}
        />
        <LinearGradient colors={["rgba(7,11,20,0.55)", "rgba(7,11,20,0.85)"]} style={StyleSheet.absoluteFillObject} />
        <View style={ix.mapHeader}>
          <Ionicons name="map-outline" size={14} color={colors.accent} />
          <Text style={ix.mapHeaderText}>DAY MAP · {points.length} STOPS</Text>
        </View>
        <View style={ix.routeContainer}>
          {points.map((p, i) => {
            const angle = (i / Math.max(1, points.length - 1)) * Math.PI;
            const x = 18 + (i * (width - 90)) / Math.max(1, points.length - 1);
            const y = 60 + Math.sin(angle) * 36;
            return (
              <View key={i} style={[ix.pin, { left: x, top: y }]}>
                <Text style={ix.pinText}>{i + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        {points.map((p, i) => (
          <View key={i} style={ix.routeRow}>
            <View style={ix.routePin}>
              <Text style={ix.routePinText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ix.routeName} numberOfLines={1}>{p.activity}</Text>
              <Text style={ix.routeMeta}>{p.location} · {p.travel_time}</Text>
            </View>
            <Text style={ix.routeTime}>{p.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ===== BUDGET TAB =====
const BudgetTab = ({ breakdown, total, days }: { breakdown: any[]; total: number; days: number }) => {
  const dailyAvg = Math.round(total / Math.max(1, days));
  const colorsList = [colors.accent, "#7C8AFF", colors.teal, "#F59E0B", "#EF4444"];
  return (
    <View style={ix.tabContent}>
      <View style={ix.budgetTop}>
        <View style={{ flex: 1 }}>
          <Text style={ix.budgetEyebrow}>TOTAL BUDGET</Text>
          <Text style={ix.budgetTotal}>${total.toLocaleString()}</Text>
          <Text style={ix.budgetDaily}>~${dailyAvg.toLocaleString()}/day · est.</Text>
        </View>
        <BudgetDonut breakdown={breakdown} size={108} />
      </View>

      <View style={{ marginTop: 16 }}>
        {breakdown.map((b, i) => (
          <View key={b.category} style={ix.budgetRow}>
            <View style={[ix.budgetDot, { backgroundColor: colorsList[i % colorsList.length] }]} />
            <Text style={ix.budgetCat}>{b.category}</Text>
            <Text style={ix.budgetAmt}>${b.amount?.toLocaleString?.() ?? b.amount}</Text>
            <Text style={ix.budgetPct}>{b.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ===== INSIGHTS TAB =====
const InsightsTab = ({ itinerary, day }: { itinerary: any; day: any }) => (
  <View style={ix.tabContent}>
    <View style={ix.insight}>
      <View style={ix.insightLeft}>
        <Ionicons name="cloud-outline" size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ix.insightTitle}>Weather</Text>
        <Text style={ix.insightVal}>
          {day.weather?.temp_low_f ?? 64}° — {day.weather?.temp_high_f ?? 78}°F · {day.weather?.condition ?? "Partly Cloudy"}
        </Text>
      </View>
    </View>

    <View style={ix.insight}>
      <View style={ix.insightLeft}>
        <Ionicons name="people-outline" size={20} color={colors.teal} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ix.insightTitle}>Crowd Level</Text>
        <Text style={ix.insightVal}>{day.crowd_level ?? "Moderate"}</Text>
        <Text style={ix.insightSub}>{day.crowd_note ?? "Some popular spots busy."}</Text>
      </View>
    </View>

    <View style={ix.insight}>
      <View style={ix.insightLeft}>
        <Ionicons name="bulb-outline" size={20} color={colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ix.insightTitle}>Local Tip</Text>
        <Text style={ix.insightSub}>{day.weather_tip ?? "Carry layers — temps swing fast."}</Text>
      </View>
    </View>

    {day.hidden_gem ? (
      <View style={ix.insight}>
        <View style={ix.insightLeft}>
          <Ionicons name="diamond-outline" size={20} color="#7C8AFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ix.insightTitle}>Hidden Gem</Text>
          <Text style={ix.insightSub}>{day.hidden_gem}</Text>
        </View>
      </View>
    ) : null}

    {itinerary?.best_time ? (
      <View style={ix.insight}>
        <View style={ix.insightLeft}>
          <Ionicons name="calendar-outline" size={20} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ix.insightTitle}>Best Time To Visit</Text>
          <Text style={ix.insightSub}>{itinerary.best_time}</Text>
        </View>
      </View>
    ) : null}

    {Array.isArray(itinerary?.packing_tips) ? (
      <View style={ix.tipsBlock}>
        <Text style={ix.sectionEyebrow}>PACKING TIPS</Text>
        {itinerary.packing_tips.map((t: string, i: number) => (
          <View key={i} style={ix.tipsRow}>
            <Ionicons name="checkmark" size={14} color={colors.teal} />
            <Text style={ix.tipsText}>{t}</Text>
          </View>
        ))}
      </View>
    ) : null}
  </View>
);

// ----- styles -----
const vibeStyles = [
  { backgroundColor: "rgba(91,103,255,0.18)", borderColor: "rgba(91,103,255,0.55)", color: "#A5B0FF" },
  { backgroundColor: "rgba(20,184,166,0.18)", borderColor: "rgba(20,184,166,0.55)", color: "#5EEAD4" },
  { backgroundColor: "rgba(124,138,255,0.18)", borderColor: "rgba(124,138,255,0.55)", color: "#C7CDFF" },
  { backgroundColor: "rgba(245,158,11,0.18)", borderColor: "rgba(245,158,11,0.55)", color: "#FCD34D" },
];

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  hero: { height: 380, position: "relative" },
  heroBottom: { position: "absolute", left: 20, right: 20, bottom: 16 },
  heroDest: { color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: -0.8 },
  heroCountry: { color: colors.textMuted, fontSize: 16, fontWeight: "700", marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(7,11,20,0.5)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  scoreLabel: { color: colors.teal, fontSize: 10, fontWeight: "900", marginTop: 4, letterSpacing: 0.5 },
  vibeRow: { gap: 8, marginTop: 12, paddingRight: 12 },
  vibeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  vibeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  actionRow: { flexDirection: "row", paddingHorizontal: 20, marginTop: -4, gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPrimary: { backgroundColor: colors.accent, borderColor: colors.accent, flex: 1.4 },
  actionLabel: { color: colors.text, fontWeight: "700", fontSize: 13 },
  daysRow: { gap: 8, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 },
  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 64,
    alignItems: "center",
  },
  dayPillActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayPillTop: { color: colors.text, fontWeight: "800", fontSize: 13 },
  dayPillBottom: { color: colors.textMuted, fontSize: 10, marginTop: 2, fontWeight: "700" },
  tabsRow: { flexDirection: "row", marginHorizontal: 20, marginTop: 14, marginBottom: 8, backgroundColor: colors.surface, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: colors.border },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  tabBtnActive: { backgroundColor: colors.accent },
  tabText: { color: colors.textMuted, fontWeight: "700", fontSize: 12 },
});

const ix = StyleSheet.create({
  tabContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 },
  driftInsight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: "rgba(91,103,255,0.4)",
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    marginBottom: 6,
  },
  driftInsightText: { color: "#fff", fontSize: 13, fontWeight: "700", flex: 1 },
  slotHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, marginBottom: 8 },
  slotLabel: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  actRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  timeCol: { width: 50, paddingTop: 14 },
  timeText: { color: colors.textMuted, fontSize: 11, fontWeight: "800", textAlign: "right" },
  actCard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  actImg: { width: 96, height: "100%" },
  actName: { color: "#fff", fontSize: 14, fontWeight: "800", flex: 1, paddingRight: 6 },
  actSave: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  actMetaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4, flexWrap: "wrap" },
  actLoc: { color: colors.textMuted, fontSize: 11, fontWeight: "700" },
  actMetaText: { color: colors.textMuted, fontSize: 11, fontWeight: "700" },
  actDot: { color: colors.textDim, fontSize: 11 },
  actDetail: { color: colors.textMuted, fontSize: 12, marginTop: 6, lineHeight: 16 },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "rgba(245,158,11,0.08)",
    borderRadius: 8,
  },
  tipText: { color: colors.gold, fontSize: 11, fontWeight: "600", flex: 1, lineHeight: 14 },
  sectionEyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  altCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  altIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  altKind: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  altTitle: { color: "#fff", fontSize: 14, fontWeight: "800", marginTop: 2 },
  altDetail: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  mapWrap: { height: 180, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  mapHeader: { flexDirection: "row", alignItems: "center", gap: 6, padding: 12 },
  mapHeaderText: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  routeContainer: { flex: 1 },
  pin: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pinText: { color: "#fff", fontWeight: "900", fontSize: 11 },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  routePin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  routePinText: { color: "#fff", fontSize: 12, fontWeight: "900" },
  routeName: { color: "#fff", fontSize: 13, fontWeight: "800" },
  routeMeta: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  routeTime: { color: colors.textMuted, fontSize: 11, fontWeight: "800" },
  budgetTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  budgetEyebrow: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  budgetTotal: { color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: -1, marginTop: 4 },
  budgetDaily: { color: colors.textMuted, fontSize: 12, marginTop: 2, fontWeight: "600" },
  budgetRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  budgetDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  budgetCat: { color: "#fff", fontSize: 13, flex: 1, fontWeight: "700" },
  budgetAmt: { color: "#fff", fontSize: 13, fontWeight: "900", marginRight: 8 },
  budgetPct: { color: colors.textMuted, fontSize: 11, width: 36, textAlign: "right" },
  insight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  insightLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 0.5 },
  insightVal: { color: "#fff", fontSize: 16, fontWeight: "900", marginTop: 4 },
  insightSub: { color: colors.textMuted, fontSize: 12, marginTop: 4, lineHeight: 17 },
  tipsBlock: {
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 6,
  },
  tipsRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  tipsText: { color: colors.text, fontSize: 12, flex: 1 },
});
