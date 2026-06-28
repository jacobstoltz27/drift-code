import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans antialiased grain bg-midnight text-ivory">
        {children}
      </body>
    </html>
  );
}
