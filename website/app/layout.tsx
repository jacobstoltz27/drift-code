import type { Metadata } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Fraunces is the bold serif brand face (logo, headlines, section titles, nav).
// Inter handles all body, button, and form text.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Plus Jakarta Sans: only used inside the Peregrine app-dashboard preview,
// to match that mockup's own typography exactly.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Drift: Where will you drift to next?",
  description:
    "Drift is permission to explore. Plan trips by your vibe, steal itineraries in seconds, and watch your world map grow with every journey. Collect stories, not souvenirs.",
  keywords: [
    "travel app",
    "itinerary planner",
    "trip planning",
    "travel inspiration",
    "explore",
  ],
  openGraph: {
    title: "Drift: Where will you drift to next?",
    description:
      "The world feels bigger with Drift. Collect stories, not souvenirs.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jakarta.variable}`}
    >
      <body className="font-sans antialiased grain bg-midnight text-ivory">
        {children}
      </body>
    </html>
  );
}
