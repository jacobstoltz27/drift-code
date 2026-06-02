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

export type DriftUser = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  onboarded: boolean;
  preferences: Record<string, any>;
  stats: Record<string, any>;
  created_at: string;
};

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
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
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
  plannerGenerate: (body: any) =>
    request<{ itinerary: any }>("/planner/generate", {
      method: "POST",
      body,
    }),
  invites: () =>
    request<{ remaining: number; used: number; total: number }>("/invites"),
  sendInvite: (email: string) =>
    request<any>("/invites/send", { method: "POST", body: { email } }),
};

// ---------------- Auth Context ----------------

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
        setUser(null);
        return;
      }
      const me = await api.me();
      setUser(me);
    } catch {
      await setToken(null);
      setUser(null);
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
