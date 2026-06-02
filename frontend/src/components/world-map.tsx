// Drift World Travel Map — react-native-svg world outline + highlighted countries
// Approach: simple dotted-continent SVG with country marker dots at lat/lng → svg coords.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Circle, G, Defs, RadialGradient, Stop } from "react-native-svg";
import { colors } from "@/src/theme";

// Compact simplified continent paths (equirectangular, 720x360 viewBox)
const CONTINENTS: string[] = [
  // North America
  "M105,72 L175,68 L210,86 L218,118 L196,150 L160,162 L132,168 L108,154 L88,128 L82,98 Z",
  // Central America / Caribbean
  "M148,170 L186,178 L196,200 L184,212 L166,206 L150,194 Z",
  // South America
  "M186,210 L228,210 L246,238 L240,278 L222,308 L204,316 L188,300 L182,266 L178,238 Z",
  // Europe
  "M334,82 L386,80 L408,98 L402,118 L376,128 L348,124 L330,108 Z",
  // Africa
  "M348,144 L408,142 L432,168 L432,220 L416,256 L388,272 L368,260 L352,234 L344,196 Z",
  // Middle East / Asia
  "M420,84 L546,86 L596,118 L606,158 L584,184 L548,180 L498,170 L456,158 L432,140 L426,112 Z",
  // South Asia
  "M508,158 L548,162 L552,196 L532,210 L514,200 Z",
  // Southeast Asia
  "M572,196 L612,200 L618,224 L598,234 L580,222 Z",
  // Oceania / Australia
  "M610,250 L666,254 L678,282 L660,298 L622,296 L608,278 Z",
];

// Approx lat/lng for ISO-2 country codes we care about.
const COUNTRY_LATLNG: Record<string, [number, number]> = {
  US: [38, -97], CA: [56, -106], MX: [23, -102],
  BR: [-10, -55], AR: [-34, -64], PE: [-10, -76], CO: [4, -72], CL: [-30, -71],
  GB: [54, -2], FR: [46, 2], ES: [40, -4], PT: [39.5, -8], IT: [42, 12], DE: [51, 10],
  NL: [52, 5], CH: [47, 8], GR: [39, 22], IS: [65, -18], NO: [62, 10], SE: [62, 17],
  FI: [64, 26], IE: [53, -8],
  MA: [32, -6], EG: [27, 30], ZA: [-29, 24], KE: [0, 38], NG: [9, 8], TZ: [-6, 35],
  RU: [60, 100], TR: [39, 35], AE: [24, 54], IL: [31, 35], SA: [24, 45],
  IN: [22, 79], CN: [35, 105], JP: [36, 138], KR: [37, 128], TH: [15, 100],
  VN: [16, 108], ID: [-2, 118], PH: [13, 122], MY: [4, 102],
  AU: [-25, 134], NZ: [-41, 174], LK: [7, 81],
};

const PROJECT_W = 720;
const PROJECT_H = 360;

function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * PROJECT_W;
  const y = ((90 - lat) / 180) * PROJECT_H;
  return [x, y];
}

export const WorldTravelMap = ({
  visited,
  countriesCount,
  totalCountries = 195,
}: {
  visited: string[];
  countriesCount?: number;
  totalCountries?: number;
}) => {
  const count = countriesCount ?? visited.length;
  const pct = Math.min(100, Math.round((count / totalCountries) * 100));

  return (
    <View style={styles.wrap} testID="world-travel-map">
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>WORLD TRAVEL MAP</Text>
          <Text style={styles.title}>{count} countries · {pct}% of the world</Text>
        </View>
        <View style={styles.pctBadge}>
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>

      <View style={styles.svgWrap}>
        <Svg
          width="100%"
          height={180}
          viewBox={`0 0 ${PROJECT_W} ${PROJECT_H}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <Defs>
            <RadialGradient id="dot" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={colors.accent} stopOpacity="0.9" />
              <Stop offset="100%" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Continents */}
          <G fill="#1B2030" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5">
            {CONTINENTS.map((d, i) => (
              <Path key={i} d={d} />
            ))}
          </G>

          {/* Visited country markers */}
          {visited.map((code) => {
            const ll = COUNTRY_LATLNG[code];
            if (!ll) return null;
            const [x, y] = project(ll[0], ll[1]);
            return (
              <G key={code}>
                <Circle cx={x} cy={y} r={14} fill="url(#dot)" />
                <Circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill={colors.accent}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </G>
            );
          })}
        </Svg>
      </View>

      <View style={styles.recentRow}>
        <Text style={styles.recentLabel}>Recent:</Text>
        <Text style={styles.recentText} numberOfLines={1}>
          {visited.slice(0, 6).map(codeToName).join("  ·  ")}
        </Text>
      </View>

      <View style={styles.legend}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
          <Text style={styles.legendText}>Visited</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={[styles.legendDot, { backgroundColor: "#1B2030" }]} />
          <Text style={styles.legendText}>Yet to discover</Text>
        </View>
      </View>
    </View>
  );
};

const NAME: Record<string, string> = {
  US: "USA", GB: "UK", JP: "Japan", ID: "Indonesia", IT: "Italy", GR: "Greece",
  PT: "Portugal", FR: "France", ES: "Spain", TH: "Thailand", VN: "Vietnam",
  PE: "Peru", MX: "Mexico", CA: "Canada", AR: "Argentina", BR: "Brazil",
  ZA: "S. Africa", MA: "Morocco", AE: "UAE", IS: "Iceland", NO: "Norway",
};

function codeToName(c: string) {
  return NAME[c] ?? c;
}

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
    backgroundColor: "rgba(7,11,20,0.5)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    paddingVertical: 8,
  },
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
  legend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
});
