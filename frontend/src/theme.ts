// Drift design tokens — keep in one place, import via @/src/theme
export const colors = {
  background: "#090C1A",
  surface: "#0D1120",
  surfaceElevated: "#111828",
  primary: "#181D38",
  primarySoft: "rgba(24,29,56,0.8)",
  accent: "#6C63FF",
  accentSoft: "rgba(108,99,255,0.16)",
  teal: "#14B8A6",
  tealSoft: "rgba(20,184,166,0.15)",
  text: "#F5F7FA",
  textMuted: "#A1A1AA",
  textDim: "#6B7280",
  border: "rgba(108,99,255,0.1)",
  borderStrong: "rgba(108,99,255,0.2)",
  glass: "rgba(255,255,255,0.04)",
  danger: "#EF4444",
  success: "#22C55E",
  gold: "#F59E0B",
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const space = (n: number) => n * 4;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 10,
  },
};

export const fonts = {
  // System fallbacks — Clash Display / Satoshi / Inter aren't bundled, but
  // platform sans-serif (San Francisco / Roboto) reads as premium in the dark theme.
  display: undefined as string | undefined,
  body: undefined as string | undefined,
};

export const motion = {
  spring: { damping: 18, stiffness: 140, mass: 0.9 },
  fast: 220,
  base: 320,
};

// Curated Unsplash imagery
export const IMG = {
  bali: "https://images.unsplash.com/photo-1711609110590-5ad5c4599e56?w=1200&q=85",
  maldives:
    "https://images.pexels.com/photos/1287455/pexels-photo-1287455.jpeg?auto=compress&cs=tinysrgb&w=1200",
  iceland: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200&q=85",
  amalfi: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?w=1200&q=85",
  swiss:
    "https://images.pexels.com/photos/2600506/pexels-photo-2600506.jpeg?auto=compress&cs=tinysrgb&w=1200",
  tokyo: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?w=1200&q=85",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85",
  peru: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&q=85",
  norway: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?w=1200&q=85",
  lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=85",
  splashHero:
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=85",
};
