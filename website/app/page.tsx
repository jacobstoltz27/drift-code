import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import GlobeSection from "@/components/GlobeSection";
import DestinationShowcase from "@/components/DestinationShowcase";
import FeedSection from "@/components/FeedSection";
import TripsSection from "@/components/TripsSection";
import PeregrineSection from "@/components/PeregrineSection";
import Features from "@/components/Features";
import StolenTrips from "@/components/StolenTrips";
import VibeSelector from "@/components/VibeSelector";
import Testimonials from "@/components/ui/testimonial-v2";
import Pricing from "@/components/ui/pricing-section-4";
import FAQ from "@/components/FAQ";
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
      <FeedSection />
      <TripsSection />
      <PeregrineSection />
      <Features />
      <StolenTrips />
      <VibeSelector />
      <Testimonials />
      <Pricing />
      <FAQ />
      <WaitlistCTA />
      <Footer />
    </main>
  );
}
