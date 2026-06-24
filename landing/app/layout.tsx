import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Drift — The AI-Powered Travel Community',
  description:
    'Drift is where explorers discover trips, create personalized itineraries, and experience the world together. The world feels bigger with Drift.',
  keywords: 'travel, AI, itinerary, community, explore, trips',
  openGraph: {
    title: 'Drift — The AI-Powered Travel Community',
    description: 'Discover places. Build memories. Share the journey.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-drift-bg text-drift-text antialiased">{children}</body>
    </html>
  )
}
