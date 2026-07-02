// Drift design tokens — single source of truth, import via @/src/theme
// Direction: cinematic dark glassmorphism. Material-3 tonal dark palette,
// light-indigo accent, mint secondary, Space Grotesk (display) + Manrope (body).

export const colors = {
  // Base surfaces (darkest -> elevated)
  background: "#0F131D",
  surfaceLowest: "#0A0E17",
  surface: "#171C25", // cards / inputs
  surfaceElevated: "#1B2029",
  surfaceHigh: "#262A34",

  // Brand
  primary: "#7B85FF", // vivid indigo (solid fills)
  primarySoft: "rgba(123,133,255,0.16)",
  primaryContainer: "#7B85FF",
  onPrimaryContainer: "#000694",
  accent: "#BEC2FF", // light indigo — logo, icons, active, links
  accentSoft: "rgba(190,194,255,0.14)",
  accentGlow: "rgba(190,194,255,0.40)",

  // Secondary (mint)
  teal: "#4FDBC8",
  tealSoft: "rgba(79,219,200,0.15)",

  // Text
  text: "#F5F7FA", // soft white — headings / primary
  textMuted: "#A8ADBF", // secondary copy
  textDim: "#7B8191", // slate — meta / captions

  // Lines & glass
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.10)",
  glowIndigo: "rgba(91,103,255,0.30)",

  // Status
  danger: "#FFB4AB",
  success: "#22C55E",
  gold: "#F59E0B",
};

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24, // rounded-3xl hero cards
  xxl: 30,
  pill: 999,
};

export const space = (n: number) => n * 4;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 28,
    elevation: 10,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 22,
    elevation: 12,
  },
  dock: {
    shadowColor: colors.glowIndigo,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 16,
  },
};

// Font family names — registered in use-icon-fonts.ts.
// Space Grotesk stands in for Clash Display; Manrope for Satoshi. Swap the
// registered files to the exact Fontshare faces without touching call sites.
export const fonts = {
  displayMedium: "SpaceGrotesk-Medium",
  displaySemibold: "SpaceGrotesk-SemiBold",
  displayBold: "SpaceGrotesk-Bold",
  bodyRegular: "Manrope-Regular",
  bodyMedium: "Manrope-Medium",
  bodySemibold: "Manrope-SemiBold",
  bodyBold: "Manrope-Bold",
  bodyExtrabold: "Manrope-ExtraBold",
};

// Typography presets — spread into a Text style: style={type.headline}.
// Custom fonts encode weight in the family, so we set fontFamily (not
// fontWeight) to get the right cut.
export const type = {
  displayLg: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.8,
    color: colors.text,
  },
  headline: {
    fontFamily: fonts.displaySemibold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: colors.text,
  },
  headlineMd: {
    fontFamily: fonts.displaySemibold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: colors.text,
  },
  title: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  bodyStrong: {
    fontFamily: fonts.bodySemibold,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  bodySm: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.bodyExtrabold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
    color: colors.textDim,
  },
} as const;

// Glass surface primitive — spread onto a View style. Pair with <BlurView>
// underneath for true frosted depth where performance allows.
export const glass = {
  backgroundColor: colors.glass,
  borderWidth: 1,
  borderColor: colors.glassBorder,
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
