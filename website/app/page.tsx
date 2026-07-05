import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import GlobeSection from "@/components/GlobeSection";
import DestinationShowcase from "@/components/DestinationShowcase";
import JourneyTimeline from "@/components/JourneyTimeline";
import Features from "@/components/Features";
import StolenTrips from "@/components/StolenTrips";
import VibeSelector from "@/components/VibeSelector";
import Stories from "@/components/Stories";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Roadmap from "@/components/Roadmap";
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
      <GlobeSection />
      <DestinationShowcase />
      <JourneyTimeline />
      <Features />
      <StolenTrips />
      <VibeSelector />
      <Stories />
      <Pricing />
      <FAQ />
      <Roadmap />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
