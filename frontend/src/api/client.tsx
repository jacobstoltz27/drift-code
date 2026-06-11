// Drift API client + auth context
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storage } from "@/src/utils/storage";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL ?? "";
const API = `${BASE}/api`;
const TOKEN_KEY = "drift_auth_token";
const DEMO_MODE = !BASE; // no backend URL → always use mock data

export type DriftUser = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  onboarded: boolean;
  is_premium?: boolean;
  preferences: Record<string, any>;
  stats: Record<string, any>;
  created_at: string;
};

// ─────────────────────────────────────────────
// Mock data (used when EXPO_PUBLIC_BACKEND_URL is not set)
// ─────────────────────────────────────────────

const MOCK_USER: DriftUser = {
  id: "demo-user",
  email: "demo@drift.app",
  name: "Alex Rivera",
  avatar_url: "https://i.pravatar.cc/150?img=12",
  bio: "Adventure seeker. 34 countries and counting.",
  onboarded: true,
  preferences: {},
  stats: { trips: 12, countries: 34, followers: 847 },
  created_at: "2024-01-01T00:00:00Z",
};

const MOCK_POSTS = [
  {
    id: "p1",
    title: "Hidden Gems of Kyoto",
    destination: "Kyoto, Japan",
    days: 7,
    image_url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    summary: "Skip the crowds at Fushimi Inari and discover bamboo groves, moss gardens, and sake breweries that most tourists never find.",
    saves: 2341,
    likes: 5820,
    score: 94,
    tags: ["culture", "food", "hidden gems", "temples"],
    creator: { name: "Mia Chen", handle: "@miachen.travels", avatar: "https://i.pravatar.cc/150?img=5" },
  },
  {
    id: "p2",
    title: "Amalfi Coast in 5 Days",
    destination: "Amalfi, Italy",
    days: 5,
    image_url: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800",
    summary: "Cliff-side villages, limoncello, and the bluest water you've ever seen. A complete guide to doing the Amalfi Coast without the tourist traps.",
    saves: 1892,
    likes: 4100,
    score: 91,
    tags: ["beach", "luxury", "food", "europe"],
    creator: { name: "Marco Rossi", handle: "@marco.abroad", avatar: "https://i.pravatar.cc/150?img=8" },
  },
  {
    id: "p3",
    title: "Morocco in a Week",
    destination: "Marrakech, Morocco",
    days: 7,
    image_url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800",
    summary: "Medinas, desert sunsets, and rooftop breakfasts. Everything you need to navigate Morocco's most vibrant city and beyond.",
    saves: 3104,
    likes: 7230,
    score: 96,
    tags: ["adventure", "culture", "desert", "food"],
    creator: { name: "Sara El-Amin", handle: "@sara.wanders", avatar: "https://i.pravatar.cc/150?img=9" },
  },
  {
    id: "p4",
    title: "Bali Beyond Ubud",
    destination: "Bali, Indonesia",
    days: 10,
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    summary: "Rice terraces, fire ceremonies, and secret waterfalls. A 10-day Bali itinerary that goes way beyond the Instagram spots.",
    saves: 4567,
    likes: 9100,
    score: 97,
    tags: ["nature", "spiritual", "beach", "adventure"],
    creator: { name: "Kai Nakamura", handle: "@kairoams", avatar: "https://i.pravatar.cc/150?img=11" },
  },
];

const MOCK_TRIPS = [
  {
    id: "t1",
    destination: "Tokyo, Japan",
    bucket: "upcoming",
    start_date: "2026-08-15",
    end_date: "2026-08-25",
    image_url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    score: 92,
    companions: [
      { avatar: "https://i.pravatar.cc/150?img=3" },
      { avatar: "https://i.pravatar.cc/150?img=7" },
    ],
    summary: "10 days exploring Tokyo's contrasts — neon-lit streets, ancient shrines, and the best ramen in existence.",
    itinerary: null,
  },
  {
    id: "t2",
    destination: "Santorini, Greece",
    bucket: "saved",
    start_date: null,
    end_date: null,
    image_url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800",
    score: 89,
    companions: [],
    summary: "Blue domes, caldera sunsets, and white-washed villages perched on volcanic cliffs.",
    itinerary: null,
    creator: { name: "Marco Rossi", handle: "@marco.abroad", avatar: "https://i.pravatar.cc/150?img=8" },
  },
  {
    id: "t3",
    destination: "Patagonia, Argentina",
    bucket: "past",
    start_date: "2025-11-10",
    end_date: "2025-11-20",
    image_url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
    score: 98,
    companions: [
      { avatar: "https://i.pravatar.cc/150?img=2" },
    ],
    summary: "Torres del Paine, glaciers, and the end of the world. A trek through the most dramatic landscape on earth.",
    itinerary: null,
  },
];

const MOCK_ITINERARY = {
  days: [
    {
      day: 1,
      title: "Arrival & First Impressions",
      experiences: [
        { time: "14:00", title: "Check in to hotel", type: "accommodation", duration: "1h", description: "Settle in and freshen up." },
        { time: "16:00", title: "Explore the neighborhood", type: "exploration", duration: "2h", description: "Walk the local streets, grab a coffee, get oriented." },
        { time: "19:00", title: "Welcome dinner", type: "food", duration: "2h", description: "Local restaurant recommended by the hotel — try the regional specialty." },
      ],
    },
    {
      day: 2,
      title: "Culture & History",
      experiences: [
        { time: "09:00", title: "Morning museum visit", type: "culture", duration: "2.5h", description: "World-class collection spanning thousands of years of history." },
        { time: "12:00", title: "Street food lunch", type: "food", duration: "1h", description: "Hit the local market for cheap, delicious bites." },
        { time: "15:00", title: "Hidden viewpoint hike", type: "nature", duration: "2h", description: "A 30-min walk to a secret viewpoint most tourists miss." },
        { time: "20:00", title: "Rooftop cocktails", type: "nightlife", duration: "2h", description: "Sunset drinks with panoramic city views." },
      ],
    },
    {
      day: 3,
      title: "Day Trip & Departure",
      experiences: [
        { time: "08:00", title: "Early day trip", type: "exploration", duration: "5h", description: "A nearby town or natural area that's worth the journey." },
        { time: "14:00", title: "Souvenir shopping", type: "shopping", duration: "1.5h", description: "Local artisan market — skip the tourist shops." },
        { time: "19:00", title: "Farewell dinner", type: "food", duration: "2h", description: "Splurge on the best restaurant in town for your last night." },
      ],
    },
  ],
};

function mockDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

async function mockRequest(path: string, body?: any): Promise<any> {
  if (path === "/auth/login" || path === "/auth/register") {
    return mockDelay({ access_token: "demo-token", user: MOCK_USER });
  }
  if (path === "/auth/me") return mockDelay(MOCK_USER);
  if (path === "/auth/onboarding") return mockDelay(MOCK_USER);
  if (path === "/feed") return mockDelay({ posts: MOCK_POSTS });
  if (path.startsWith("/feed/") && path.endsWith("/save")) return mockDelay({ ok: true });
  if (path.startsWith("/feed/") && path.endsWith("/steal")) return mockDelay(MOCK_TRIPS[0]);
  if (path.startsWith("/feed/")) {
    const id = path.split("/")[2];
    return mockDelay(MOCK_POSTS.find((p) => p.id === id) ?? MOCK_POSTS[0]);
  }
  if (path === "/trips" && !body) return mockDelay({ trips: MOCK_TRIPS });
  if (path === "/trips" && body) return mockDelay({ ...MOCK_TRIPS[0], id: "new-" + Date.now(), ...body });
  if (path.startsWith("/trips/") && path.endsWith("/schedule")) {
    return mockDelay({ ...MOCK_TRIPS[0], bucket: "upcoming" });
  }
  if (path.startsWith("/trips/") && path.endsWith("/remix/jobs")) {
    return mockDelay({ job_id: "demo-job-1", status: "running" });
  }
  if (path.startsWith("/planner/jobs/")) {
    return mockDelay({
      id: path.split("/").pop(),
      status: "done",
      trip: { ...MOCK_TRIPS[0], id: "ai-trip-" + Date.now(), itinerary: MOCK_ITINERARY },
    });
  }
  if (path === "/planner/jobs") {
    return mockDelay({ job_id: "demo-planner-job", status: "running" });
  }
  if (path === "/planner/generate") {
    return mockDelay({ itinerary: MOCK_ITINERARY });
  }
  if (path.startsWith("/trips/")) {
    const id = path.split("/")[2];
    const found = MOCK_TRIPS.find((t) => t.id === id);
    return mockDelay(found ?? { ...MOCK_TRIPS[0], id });
  }
  if (path === "/invites") return mockDelay({ remaining: 3, used: 2, total: 5 });
  if (path === "/invites/send") return mockDelay({ ok: true });
  if (path === "/following/feed") return mockDelay({ posts: MOCK_POSTS.slice(0, 2) });
  if (path === "/subscription/upgrade") return mockDelay({ ...MOCK_USER, is_premium: true });
  return mockDelay({});
}

// ─────────────────────────────────────────────
// Real HTTP request
// ─────────────────────────────────────────────

let cachedToken: string | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  const t = await storage.secureGet<string>(TOKEN_KEY, "");
  cachedToken = t && t.length > 0 ? t : null;
  return cachedToken;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await storage.secureSet(TOKEN_KEY, token);
  else await storage.secureRemove(TOKEN_KEY);
}

async function request<T>(
  path: string,
  opts: { method?: string; body?: any; auth?: boolean } = {},
): Promise<T> {
  if (DEMO_MODE) return mockRequest(path, opts.body) as Promise<T>;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    // Network error (backend unreachable) — fall back to mock data so the
    // app is previewable without a running backend.
    return mockRequest(path, opts.body) as Promise<T>;
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data.detail ?? msg;
    } catch {}
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: DriftUser }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  register: (email: string, password: string, name: string) =>
    request<{ access_token: string; user: DriftUser }>("/auth/register", {
      method: "POST",
      body: { email, password, name },
      auth: false,
    }),
  me: () => request<DriftUser>("/auth/me"),
  saveOnboarding: (prefs: any) =>
    request<DriftUser>("/auth/onboarding", { method: "POST", body: prefs }),
  feed: () => request<{ posts: any[] }>("/feed"),
  feedPost: (id: string) => request<any>(`/feed/${id}`),
  trips: (bucket?: string) =>
    request<{ trips: any[] }>(`/trips${bucket ? `?bucket=${bucket}` : ""}`),
  tripById: (id: string) => request<any>(`/trips/${id}`),
  createTrip: (trip: any) =>
    request<any>("/trips", { method: "POST", body: trip }),
  deleteTrip: (id: string) => request<any>(`/trips/${id}`, { method: "DELETE" }),
  savePost: (id: string) =>
    request<any>(`/feed/${id}/save`, { method: "POST", body: {} }),
  stealPost: (id: string) =>
    request<any>(`/feed/${id}/steal`, { method: "POST", body: {} }),
  remixTrip: (id: string, note: string) =>
    request<any>(`/trips/${id}/remix`, {
      method: "POST",
      body: { trip_id: id, note },
    }),
  remixTripJob: (id: string, note: string) =>
    request<{ job_id: string; status: string }>(`/trips/${id}/remix/jobs`, {
      method: "POST",
      body: { trip_id: id, note },
    }),
  plannerGenerate: (body: any) =>
    request<{ itinerary: any }>("/planner/generate", {
      method: "POST",
      body,
    }),
  plannerCreateJob: (body: any) =>
    request<{ job_id: string; status: string }>("/planner/jobs", {
      method: "POST",
      body,
    }),
  plannerJobStatus: (job_id: string) =>
    request<{
      id: string;
      status: "running" | "done" | "error";
      itinerary?: any;
      trip?: any;
      error?: string;
    }>(`/planner/jobs/${job_id}`),
  invites: () =>
    request<{ remaining: number; used: number; total: number }>("/invites"),
  sendInvite: (email: string) =>
    request<any>("/invites/send", { method: "POST", body: { email } }),
  followingFeed: () =>
    request<{ posts: any[] }>("/following/feed"),
  scheduleTrip: (id: string, start: string, end: string) =>
    request<any>(`/trips/${id}/schedule`, {
      method: "POST",
      body: { start_date: start, end_date: end },
    }),
  upgrade: (plan: "monthly" | "annual") =>
    request<DriftUser>("/subscription/upgrade", { method: "POST", body: { plan } }),
};

// ─────────────────────────────────────────────
// Auth Context
// ─────────────────────────────────────────────

type AuthCtx = {
  user: DriftUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (u: DriftUser) => void;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DriftUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const t = await getToken();
      if (!t) {
        // No stored token — auto-login as demo user so the app is always usable
        setUser(MOCK_USER);
        return;
      }
      const me = await api.me();
      setUser(me);
    } catch {
      await setToken(null);
      setUser(MOCK_USER);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api.login(email, password);
    await setToken(r.access_token);
    setUser(r.user);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const r = await api.register(email, password, name);
      await setToken(r.access_token);
      setUser(r.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    await setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({ user, loading, login, register, logout, refresh, setUser }),
    [user, loading, login, register, logout, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
};
