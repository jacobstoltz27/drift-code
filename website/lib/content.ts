// Shared content for the Drift marketing site.
// Images are commercially-free (Unsplash / Pexels) — no attribution required.

export const destinations = [
  {
    name: "Iceland",
    tag: "Land of fire & ice",
    coords: "64.9631° N, 19.0208° W",
    img: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Amalfi Coast",
    tag: "Italy, slowly",
    coords: "40.6340° N, 14.6027° E",
    img: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Bali",
    tag: "Temples at first light",
    coords: "8.4095° S, 115.1889° E",
    img: "https://images.unsplash.com/photo-1711609110590-5ad5c4599e56?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Patagonia",
    tag: "The edge of the map",
    coords: "49.3300° S, 73.0000° W",
    img: "https://d8j0ntlcm91z4.cloudfront.net/user_3EBkRDT9DW01OCu9b0Wi6DO1TJo/hf_20260628_193922_bf6df2e0-86df-4837-898c-c7b1c0785a2e.png",
  },
  {
    name: "Morocco",
    tag: "Color & dust",
    coords: "31.6295° N, 7.9811° W",
    img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Japan",
    tag: "Winter in Kyoto",
    coords: "35.0116° N, 135.7681° E",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
  },
];

export const stats = [
  { value: 12400, suffix: "+", label: "Waitlist Members" },
  { value: 180, suffix: "+", label: "Countries Covered" },
  { value: 50000, suffix: "+", label: "Trips Generated" },
  { value: 98, suffix: "%", label: "Would Recommend" },
];

export const vibes = [
  { name: "Adventure", color: "#24356B", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1600&q=80" },
  { name: "Food", color: "#38BDF8", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80" },
  { name: "Luxury", color: "#24356B", img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80" },
  { name: "Nature", color: "#24356B", img: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1600&q=80" },
  { name: "Nightlife", color: "#24356B", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80" },
  { name: "Relaxing", color: "#38BDF8", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" },
  { name: "Culture", color: "#38BDF8", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80" },
  { name: "Backpacking", color: "#24356B", img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1600&q=80" },
];

export const journey = [
  { step: "Dream", text: "Open Drift and let the world wander past. Save what stops you." },
  { step: "Plan", text: "Tell us your vibe. Get a real itinerary back in seconds, never a blank page." },
  { step: "Experience", text: "Day-by-day plans in your pocket. Costs, timing, the spots locals love." },
  { step: "Remember", text: "Your trips become a living map. Every place you've been, lit up." },
  { step: "Share", text: "Drop your itinerary for a friend. They steal it in one tap." },
];

export const stories = [
  {
    quote:
      "I almost didn't go. Peregrine handed me a plan good enough that I stopped overthinking and just went.",
    name: "Maya R.",
    place: "Lisbon → Morocco",
  },
  {
    quote:
      "Stole my friend's whole Japan itinerary in one tap. Two weeks of his research, mine in seconds.",
    name: "Devin K.",
    place: "Tokyo & Kyoto",
  },
  {
    quote:
      "My map lighting up after Patagonia did something to me. I want to fill the whole thing now.",
    name: "Sofia L.",
    place: "Patagonia",
  },
  {
    quote:
      "Planned a ten-day Iceland trip in one afternoon. It used to take me weeks of open tabs and second-guessing.",
    name: "Noah T.",
    place: "Reykjavík, Iceland",
  },
  {
    quote:
      "The vibe quiz nailed it. Every place it suggested felt like it was picked just for me.",
    name: "Priya M.",
    place: "Bali, Indonesia",
  },
  {
    quote:
      "We planned the whole group trip together without a single chaotic group chat. That alone sold me.",
    name: "Marco L.",
    place: "Amalfi Coast",
  },
  {
    quote:
      "I found a town I'd never heard of and it became the best week of my whole year.",
    name: "Elena K.",
    place: "Marrakech, Morocco",
  },
  {
    quote:
      "Trip Score talked me out of one plan and into a much better one. It just gets what makes a trip good.",
    name: "James O.",
    place: "Queenstown, NZ",
  },
  {
    quote:
      "Stealing a creator's itinerary felt like cheating, in the best possible way.",
    name: "Aisha R.",
    place: "Lisbon, Portugal",
  },
];

// Example prompts for the "Ask Peregrine" demo.
export const peregrineAsks = [
  "Plan my Tokyo trip",
  "Find hidden beaches in Greece",
  "Make this itinerary fit $2,000",
  "Three days in Lisbon, food-focused",
  "What's good near me right now?",
];

export const faqs = [
  {
    q: "Who is Peregrine?",
    a: "Peregrine is your AI travel companion inside Drift. Ask it anything — plan a whole trip, find hidden gems, fit a budget, or \"what's good near me\" — and it answers with a real, personal itinerary, not a wall of text. Think of it as a local who's already there.",
  },
  {
    q: "Do I have to pay to ask Peregrine?",
    a: "No. Asking Peregrine is core to Drift. Drift Plus adds power features like unlimited plans and the World Map, but the concierge is there from day one.",
  },
  {
    q: "How is this different from ChatGPT or a travel blog?",
    a: "Peregrine is built for travel and current on real local spots, and it hands back a structured itinerary that lives in Drift — one you can tweak, save, and share. It's a conversation, not an article, and it's shaped to your taste, not the same ten tourist stops.",
  },
  {
    q: "Do I need to be an experienced traveler?",
    a: "Not at all. Drift is built for the opposite. If planning has ever stopped you from going, that's exactly who this is for. You tell Peregrine the vibe, and it handles the hard part.",
  },
  {
    q: "What does \"stealing\" an itinerary actually mean?",
    a: "You copy someone's trip, whether it's a friend's or a creator's, into your own plans in one tap. Every day and every spot comes with it, fully editable. It's the fastest way from inspiration to a real plan.",
  },
  {
    q: "Is Drift free?",
    a: "Yes. The Free plan covers the feed, discovery, and AI planning for your first trips. You unlock more by inviting friends, or go Pro for unlimited everything.",
  },
  {
    q: "When does Drift launch?",
    a: "We're rolling out access in waves to early members first. Join the waitlist and you'll be near the front of the line, with founding-member perks.",
  },
  {
    q: "Will my data be private?",
    a: "Your trips are yours. We don't sell your data, and your email only ever gets the occasional spark of travel inspiration, never spam.",
  },
];

export const roadmap = [
  { phase: "Now", title: "Early access", text: "Waitlist members get in first, in waves.", done: true },
  { phase: "Next", title: "AI planner v2", text: "Smarter plans that learn your taste over time.", done: false },
  { phase: "Soon", title: "Live group trips", text: "Plan together in real time, anywhere in the world.", done: false },
  { phase: "Later", title: "Local Guides", text: "Verified locals who shape your trip from the inside.", done: false },
];

export const features = [
  {
    name: "The Feed",
    kicker: "Home",
    desc: "A travel feed that actually moves you. Real trips from real explorers and creators, not ads. See where the world is going, and steal what speaks to you.",
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Explore",
    kicker: "Discovery",
    desc: "Search the planet by feeling, not just place. Hidden gems, seasonal inspiration, and a map that rewards curiosity over checklists.",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Ask Peregrine",
    kicker: "Your AI travel companion",
    desc: "Peregrine is the AI inside Drift. Ask it anything — \"plan my Tokyo trip,\" \"find hidden beaches in Greece,\" \"make this fit $2,000\" — and get a real day-by-day itinerary in minutes, planned with a local's instinct.",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "My Trips",
    kicker: "Upcoming · Saved · Stolen · Past",
    desc: "Every journey in one place. Count down to what's next, hold onto what you saved, keep what you stole, and revisit where you've been.",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "World Travel Map",
    kicker: "Your world, growing",
    desc: "Every trip lights up another corner of the globe. Your map is the story of your life in motion, and it grows with every place you go.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Group Planning",
    kicker: "Together",
    desc: "Plan with the people you'd actually fly across the world with. One shared trip, everyone's input, zero group-chat chaos.",
    img: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1400&q=80",
  },
];
