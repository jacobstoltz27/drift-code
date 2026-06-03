// Real SVG world map for Drift Profile
// Uses world-atlas TopoJSON + d3-geo to project country polygons to SVG paths.
// Visited countries are filled with Drift indigo; rest are dark slate.
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Svg, { Path, G, Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { geoEqualEarth, geoPath, GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import { colors } from "@/src/theme";

// Numeric ISO 3166-1 (UN M49) codes for the countries used by world-atlas.
// We map ISO-2 → numeric here for the most common travel destinations.
const ISO2_TO_NUMERIC: Record<string, string> = {
  US: "840", CA: "124", MX: "484", BR: "076", AR: "032", PE: "604", CO: "170", CL: "152",
  GB: "826", FR: "250", ES: "724", PT: "620", IT: "380", DE: "276", NL: "528", CH: "756",
  GR: "300", IS: "352", NO: "578", SE: "752", FI: "246", IE: "372", BE: "056", AT: "040",
  CZ: "203", PL: "616", HU: "348", DK: "208", HR: "191",
  MA: "504", EG: "818", ZA: "710", KE: "404", NG: "566", TZ: "834", ET: "231", TN: "788",
  RU: "643", TR: "792", AE: "784", IL: "376", SA: "682", QA: "634", JO: "400",
  IN: "356", CN: "156", JP: "392", KR: "410", TH: "764", VN: "704", ID: "360", PH: "608",
  MY: "458", SG: "702", NP: "524", LK: "144",
  AU: "036", NZ: "554",
};

const ISO_NAME: Record<string, string> = {
  US: "USA", GB: "UK", JP: "Japan", ID: "Indonesia", IT: "Italy", GR: "Greece",
  PT: "Portugal", FR: "France", ES: "Spain", TH: "Thailand", VN: "Vietnam",
  PE: "Peru", MX: "Mexico", CA: "Canada", AR: "Argentina", BR: "Brazil",
  ZA: "South Africa", MA: "Morocco", AE: "UAE", IS: "Iceland", NO: "Norway",
  IN: "India", CN: "China", AU: "Australia", NZ: "New Zealand",
};

const WIDTH = 720;
const HEIGHT = 360;

// Pre-compute paths once per module load
type CountryPath = { id: string; d: string; name: string };

const projection = geoEqualEarth().scale(132).translate([WIDTH / 2, HEIGHT / 2]);
const pathGenerator = geoPath(projection);

const COUNTRY_PATHS: CountryPath[] = (() => {
  // world-atlas countries-110m has a 'countries' topology object
  const countries: any = (feature(worldData as any, (worldData as any).objects.countries) as any);
  const features = countries.features ?? [];
  const out: CountryPath[] = [];
  for (const f of features) {
    const d = pathGenerator(f as GeoPermissibleObjects);
    if (!d) continue;
    out.push({
      id: String(f.id),
      d,
      name: f.properties?.name ?? "",
    });
  }
  return out;
})();

export const WorldTravelMap = ({
  visited,
  countriesCount,
  totalCountries = 195,
}: {
  visited: string[];
  countriesCount?: number;
  totalCountries?: number;
}) => {
  const visitedNumeric = useMemo(() => {
    const s = new Set<string>();
    for (const iso2 of visited) {
      const n = ISO2_TO_NUMERIC[iso2];
      if (n) s.add(n);
    }
    return s;
  }, [visited]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const count = countriesCount ?? visited.length;
  const pct = Math.min(100, Math.round((count / totalCountries) * 100));

  const activeCountry = activeId
    ? COUNTRY_PATHS.find((p) => p.id === activeId)
    : null;

  return (
    <View style={styles.wrap} testID="world-travel-map">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>WORLD TRAVEL MAP</Text>
          <Text style={styles.title}>
            {count} countries · {pct}% of the world
          </Text>
        </View>
        <View style={styles.pctBadge}>
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>

      <View style={styles.svgWrap}>
        <Svg
          width="100%"
          height={220}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Defs>
            <LinearGradient id="visitedFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#7C8AFF" stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Background */}
          <Rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="transparent" />

          {/* All countries */}
          <G>
            {COUNTRY_PATHS.map((c) => {
              const isVisited = visitedNumeric.has(c.id);
              const isActive = activeId === c.id;
              return (
                <TouchableWithoutFeedback
                  key={c.id}
                  onPress={() => setActiveId((cur) => (cur === c.id ? null : c.id))}
                >
                  <Path
                    d={c.d}
                    fill={
                      isVisited
                        ? "url(#visitedFill)"
                        : isActive
                          ? "#2A3148"
                          : "#161B2A"
                    }
                    stroke={isVisited ? "#fff" : "rgba(255,255,255,0.06)"}
                    strokeWidth={isVisited ? 0.4 : 0.3}
                    opacity={isVisited ? 1 : 0.92}
                  />
                </TouchableWithoutFeedback>
              );
            })}
          </G>
        </Svg>
      </View>

      {activeCountry ? (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipName}>{activeCountry.name}</Text>
          <Text style={styles.tooltipMeta}>
            {visitedNumeric.has(activeCountry.id) ? "✓ Visited" : "Yet to discover"}
          </Text>
        </View>
      ) : null}

      <View style={styles.recentRow}>
        <Text style={styles.recentLabel}>Recent:</Text>
        <Text style={styles.recentText} numberOfLines={1}>
          {visited
            .slice(0, 6)
            .map((c) => ISO_NAME[c] ?? c)
            .join("  ·  ")}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Countries" value={`${count}`} />
        <Stat label="of the world" value={`${pct}%`} />
        <Stat label="Continents" value={`${Math.min(7, Math.ceil(count / 4))}`} />
      </View>

      <View style={styles.legend}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Visited</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={[styles.legendDot, { backgroundColor: "#161B2A" }]} />
          <Text style={styles.legendText}>Yet to discover</Text>
        </View>
        <Text style={styles.hint}>Tap a country</Text>
      </View>
    </View>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 4 },
  pctBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pctText: { color: colors.accent, fontWeight: "900", fontSize: 12 },
  svgWrap: {
    marginTop: 10,
    backgroundColor: "#070B14",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    paddingVertical: 8,
  },
  tooltip: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  tooltipName: { color: "#fff", fontSize: 13, fontWeight: "800" },
  tooltipMeta: { color: colors.text, fontSize: 11, marginTop: 2, fontWeight: "600" },
  recentRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  recentLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  recentText: { color: colors.text, fontSize: 12, fontWeight: "600", flex: 1 },
  statsRow: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: "rgba(7,11,20,0.5)",
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "900" },
  statLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700", marginTop: 2 },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
    alignItems: "center",
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  hint: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: "auto",
    fontStyle: "italic",
  },
});
