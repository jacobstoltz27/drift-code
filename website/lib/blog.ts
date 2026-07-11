// The Drift Journal. Static editorial content for /blog.
// Cover images reuse URLs already proven elsewhere on the site.

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  displayDate: string;
  readTime: string;
  tag: string;
  img: string;
  body: string[]; // paragraphs
};

export const posts: Post[] = [
  {
    slug: "plan-a-trip-you-will-actually-take",
    title: "How to plan a trip you'll actually take",
    excerpt:
      "Most trips die in the planning stage. Here's how to stop researching and start going.",
    date: "2026-07-06",
    displayDate: "July 6, 2026",
    readTime: "5 min read",
    tag: "Planning",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80",
    body: [
      "There's a version of your trip that exists only in browser tabs. Forty of them: a blog post from 2019, three map pins you'll never find again, a spreadsheet with two rows filled in. That trip doesn't happen. It dissolves somewhere between \"we should go\" and \"maybe next year.\"",
      "The problem isn't that planning is hard. It's that planning is endless. There is always one more list of hidden gems, one more thread of warnings, one more perfect route someone swears by. Research has no natural finish line, so most people never cross it.",
      "The fix is embarrassingly simple: start with a plan that already exists. When you begin from a complete itinerary, a friend's trip, a creator's route, or one Peregrine drafts from a single sentence, the work flips from building to editing. Editing has a finish line. You cut the museum you don't care about, add the extra beach day, and suddenly the trip is real.",
      "This is why stealing itineraries is the heart of Drift. Someone has already done your research. They walked the streets, found the bakery, learned which viewpoint is worth the climb. Their finished trip is a better starting point than your blank page will ever be.",
      "A practical rule we love: give yourself one evening. One evening to pick a starting itinerary, make it yours, and set a date. If a decision doesn't get made that evening, it wasn't blocking the trip; it was just noise.",
      "Perfect trips don't come from perfect plans. They come from plans good enough to say yes to. The rest, the sunset you didn't schedule, the café you found by accident, is the part you'll actually tell stories about.",
    ],
  },
  {
    slug: "the-art-of-stealing-itineraries",
    title: "The art of stealing itineraries",
    excerpt:
      "Copying someone's trip isn't cheating. It's how travelers have always shared the world.",
    date: "2026-06-28",
    displayDate: "June 28, 2026",
    readTime: "4 min read",
    tag: "Community",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Long before apps, travelers stole trips from each other constantly. A napkin sketch of a coastline. A hostel wall covered in notes. \"You have to do the northern loop, skip the town with the port.\" Every great trip is built on someone else's discoveries.",
      "Drift just makes the napkin digital. When you steal an itinerary, every day, every spot, and every note comes with it, fully editable, into your own plans. The person you stole from gets the credit, and honestly, the compliment. On Drift, being stolen from is the point. It means your trip was worth taking twice.",
      "The best part is what stealing does to your confidence. A two-week Japan route feels impossible to plan from scratch. But when it arrives whole, with mornings, trains, and dinner spots already in place, your job shrinks to taste: keep Kyoto, swap the third temple for a record store, stretch Osaka by a day.",
      "Steal from people whose taste you trust, not just people with beautiful photos. A creator who travels the way you do, slow mornings, long dinners, no alarm clocks, is worth ten generic top-ten lists.",
      "And when you get back, close the loop. Publish the version you actually traveled, with your edits and your finds. Someone else's next trip is hiding inside your last one.",
    ],
  },
  {
    slug: "asking-peregrine-better-questions",
    title: "Asking Peregrine better questions",
    excerpt:
      "Your AI travel companion answers whatever you ask. Ask like this and it gets scary good.",
    date: "2026-06-19",
    displayDate: "June 19, 2026",
    readTime: "4 min read",
    tag: "Peregrine",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Peregrine will happily plan a trip from three words. \"Plan Tokyo, spring\" gets you a real, walkable itinerary in seconds. But the travelers who get the most out of Peregrine talk to it a little differently, and it's worth learning their habit.",
      "They lead with feeling, not logistics. \"I want the trip to feel slow, mostly food and neighborhoods, one big nature day\" tells Peregrine more than any list of landmarks. Vibe is signal. Peregrine plans around how you want the days to feel, then fills in the where.",
      "They give it constraints to push against. A budget, a number of days, a person to please. \"Make this fit $2,000.\" \"My mom is coming, she doesn't do stairs.\" \"We land at midnight, be gentle with day one.\" Constraints don't limit Peregrine; they sharpen it.",
      "They treat the first draft as a conversation, not a verdict. Say \"day three feels too packed\" or \"swap the market for something quieter\" and the plan reshapes itself while keeping everything you liked. You never start over; you steer.",
      "And they ask it things mid-trip. \"What's good near me right now?\" might be Peregrine's most-loved question. Standing on a corner, slightly lost, an hour to spare: that's exactly the moment it's built for.",
      "One thing you'll never need to ask: where to buy anything. Peregrine doesn't sell flights or rooms or tours. It's a companion, not a counter. Its only job is that you land like you already know the place.",
    ],
  },
  {
    slug: "solo-but-never-alone",
    title: "Solo, but never alone",
    excerpt:
      "Solo travel is having a moment. The secret is that nobody great at it is really doing it alone.",
    date: "2026-06-10",
    displayDate: "June 10, 2026",
    readTime: "5 min read",
    tag: "Stories",
    img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Every solo traveler knows the moment: you land, the airport doors open, and the whole trip is suddenly, thrillingly, entirely yours. No compromises, no committee. It's the purest form of travel there is.",
      "But talk to people who travel solo well and a pattern shows up. They're alone on the ground and deeply connected everywhere else. Their route came from a traveler they follow. Their dinner spot came from someone's trip notes. Their courage, honestly, came from watching other people go first.",
      "That's the quiet engine of solo travel: borrowed confidence. Seeing a real person, not a brochure, walk the streets you're nervous about makes the unknown feel walkable. On Drift, that proof is the feed. Real trips, real days, real people who went and came back glowing.",
      "Solo travelers are also the best contributors. They notice more, they write things down, and their itineraries have an honesty group trips rarely manage: this is what one person can actually do in a day, including the getting lost.",
      "So the next time the doors open on a city where nobody knows your name, remember that somebody drew you the map. Travel alone. Just don't start from zero, and when you're back, leave the map a little better than you found it.",
    ],
  },
  {
    slug: "in-defense-of-shoulder-season",
    title: "In defense of shoulder season",
    excerpt:
      "The secret months between the crowds and the closures are the best time to go almost anywhere.",
    date: "2026-05-30",
    displayDate: "May 30, 2026",
    readTime: "4 min read",
    tag: "Explore",
    img: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?auto=format&fit=crop&w=1600&q=80",
    body: [
      "There are two versions of the Amalfi Coast. One is July: beautiful, blazing, and shared with what feels like everyone you've ever met. The other is late September: the same cliffs, the same water, the light gone soft and golden, and space at the railing to actually look.",
      "Shoulder season, the weeks on either side of peak, is the closest thing travel has to a cheat code. The weather is usually still lovely. The locals have exhaled. The places that felt like sets feel like towns again.",
      "It changes what kind of traveler you get to be. In peak season you move through a place; in shoulder season you sit in it. Restaurants have time to talk. Trails have silence in them. You stop performing a vacation and start having one.",
      "The catch is that shoulder season is specific. It's not a date on a calendar; it's a rhythm each place keeps, and it shifts year to year. This is exactly the kind of thing to ask Peregrine: \"When does the coast go quiet but the water's still warm?\" is a real question with a real answer.",
      "Peak season exists for a reason, and some things, festivals, snow, the aurora, keep their own calendar. But as a default? Aim for the shoulder. The world is better company when it isn't busy.",
    ],
  },
  {
    slug: "your-map-is-a-diary",
    title: "Your map is a diary",
    excerpt:
      "Why watching your world map light up might be the most meaningful feature we've built.",
    date: "2026-05-18",
    displayDate: "May 18, 2026",
    readTime: "3 min read",
    tag: "Product",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Nobody remembers their trips in chronological order. Memory doesn't work like a camera roll. It works like a map: that corner of Portugal is the summer everything changed, that dot in Japan is the week it snowed and nobody minded.",
      "The World Travel Map in Drift started as a simple idea, light up where you've been, and became the feature people tell us they open when they miss traveling. Not to plan. Just to look.",
      "There's a reason it hits. A lit map is proof of a life in motion, drawn in a language older than photographs. It shows the shape of your curiosity: the coastlines you keep returning to, the whole continents still dark and waiting.",
      "We were careful about one thing: the map is not a scoreboard. There are no ranks, no country counts to beat, no badges for speed. Checking places off is the opposite of what Drift is for. The dark parts of your map aren't a to-do list; they're an invitation.",
      "Your map is a diary that writes itself, one trip at a time. And like the best diaries, it's mostly for you, though we've noticed nobody can resist showing it to a friend.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
