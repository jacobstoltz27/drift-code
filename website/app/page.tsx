import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import DestinationReel from "@/components/DestinationReel";
import JourneyTimeline from "@/components/JourneyTimeline";
import Features from "@/components/Features";
import StolenTrips from "@/components/StolenTrips";
import VibeSelector from "@/components/VibeSelector";
import Pricing from "@/components/Pricing";
import WaitlistCTA from "@/components/WaitlistCTA";
import Footer from "@/components/Footer";
import ScrollCompass from "@/components/ScrollCompass";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <ScrollCompass />
      <Hero />
      <Manifesto />
      <Stats />
      <DestinationReel />
      <JourneyTimeline />
      <Features />
      <StolenTrips />
      <VibeSelector />
      <Pricing />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
