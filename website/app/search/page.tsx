import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search everything on Drift: pages, features, destinations, journal stories, and FAQs.",
};

export default function SearchPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Search"
        title={
          <>
            Find your
            <br />
            <span className="italic text-gradient-gold">bearings.</span>
          </>
        }
      />
      <section className="bg-midnight px-6 pb-32">
        <SearchClient />
      </section>
    </PageShell>
  );
}
