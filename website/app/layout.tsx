import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Satoshi (the brand display face) is served from Fontshare, its foundry —
// loaded via <link> below. Inter handles all body/UI text.
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
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        />
      </head>
      <body className="font-sans antialiased grain bg-midnight text-ivory">
        {children}
      </body>
    </html>
  );
}
