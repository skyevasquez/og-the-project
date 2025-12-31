import { Article, NavItem } from './types';

// Local images themed for Ocala and Gainesville
export const ASSETS = {
  banner: "/images/banner.png", // Ocala-Gainesville split scene
  logoRound: "/images/banner.png", // Reusing banner for now
  logoRect: "/images/banner.png", // Reusing banner for now
  promo: "/images/banner.png", // Reusing banner for now
  horse: "/images/horse.png", // Horse Country Festival
  gator: "/images/gator.png", // UF Campus
  food: "/images/food.png", // Coffee shop / dining
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Local News', value: 'News' },
  { label: 'Lifestyle', value: 'Lifestyle' },
  { label: 'Events', value: 'Events' },
  { label: 'Spotlight', value: 'Spotlight' },
  { label: 'Hot Topics', value: 'Hot Topic' },
];

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: "The OG Project: Your New Weekly Cheat Sheet",
    excerpt: "Launching Q1 2026: If it matters this week in Ocala or Gainesville, it's in The OG Project.",
    content: [
      "Welcome to The OG Project (Ocala.Gainesville Project). We are your new free email newsletter, sent 1-2 times per week to start.",
      "Our focus is simple: Lifestyle, local news, hot topics, events, and culture in the Ocala and Gainesville metro areas. Our core promise to you is that if it matters this week in Ocala or Gainesville, it's here.",
      "Think of us as your local news digest, your guide on things to do, and a list of people and businesses to know. We provide a weekly 'vibe check' on what the community is talking about.",
      "Whether you are a student at UF enjoying the nightlife, a family in Ocala looking for weekend plans, or a local business owner wanting to keep a pulse on the community, The OG Project is designed for you."
    ],
    category: 'News',
    author: 'OG Team',
    date: 'Oct 24, 2025',
    image: ASSETS.banner,
    isFeatured: true,
  },
  {
    id: '2',
    title: "Events Radar: What's Happening This Weekend",
    excerpt: "From Downtown Ocala Date Nights to Midtown Gainesville madness. Here is what is on the radar.",
    content: [
      "Plan your next 7 days with our Events Radar.",
      "**Tonight:** Live Jazz at the Square. A perfect relaxing evening for couples.",
      "**This Weekend:** The Annual Horse Country Festival kicks off Saturday morning. Expect food trucks, live demonstrations, and family activities.",
      "**Next Week:** City Council meets to discuss the new downtown development project. Stay tuned for our 'Hot Topic' breakdown."
    ],
    category: 'Events',
    author: 'Sarah Jenkins',
    date: 'Oct 23, 2025',
    image: ASSETS.horse,
  },
  {
    id: '3',
    title: "Spotlight: Local Business of the Week",
    excerpt: "Nominate a local business or local hero. This week we focus on the innovators.",
    content: [
      "This week we are spotlighting 'The Daily Grind', a new coffee shop that doubles as a community workspace.",
      "Located in the heart of the innovation district, they offer not just caffeine, but connection.",
      "Do you know a local creator, artist, or musician who deserves the spotlight? Reply to our newsletter or submit your nomination on our site."
    ],
    category: 'Spotlight',
    author: 'Mike Ross',
    date: 'Oct 22, 2025',
    image: ASSETS.food,
  },
  {
    id: '4',
    title: "The OG Debate: Downtown Parking",
    excerpt: "What is the issue? Why people care. And what might happen next.",
    content: [
      "This week's hot topic is the proposed changes to downtown parking meters.",
      "**The Issue:** City officials are proposing extending meter hours until 10 PM.",
      "**Why People Care:** Business owners fear it will drive away dinner crowds, while residents argue it will reduce congestion.",
      "**What Might Happen Next:** A public hearing is scheduled for next Tuesday. Make your voice heard."
    ],
    category: 'Hot Topic',
    author: 'Editorial Board',
    date: 'Oct 21, 2025',
    image: ASSETS.gator,
  },
  {
    id: '5',
    title: "Culture Check: The Arts Scene Explodes",
    excerpt: "New murals are popping up across Gainesville. Here is where to find them.",
    content: [
      "Gainesville's street art scene is having a moment. Three new large-scale murals were unveiled this week.",
      "Artists from around the state have descended on the 352 area code to add color to our walls.",
      "Take a walking tour this Sunday starting at Depot Park."
    ],
    category: 'Culture',
    author: 'Jessica Lee',
    date: 'Oct 20, 2025',
    image: '/images/culture.png',
  },
  {
    id: '6',
    title: "Living in Midtown: A Guide",
    excerpt: "Everything you need to know about the heartbeat of student life.",
    content: [
      "Midtown isn't just for undergraduates anymore. With new dining options and luxury living, the demographic is shifting.",
      "We break down the best spots for a quiet lunch versus a rowdy game day experience."
    ],
    category: 'Lifestyle',
    author: 'Tom Brady',
    date: 'Oct 19, 2025',
    image: '/images/lifestyle.png',
  }
];