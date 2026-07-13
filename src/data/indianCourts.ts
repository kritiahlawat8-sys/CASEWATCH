/// <reference types="vite/client" />

export interface Court {
  id: string;
  label: string;
  category: string;
  icon: string;
  state?: string;
}

export interface CourtsSearchResult {
  count: number;
  courts: Court[];
}

// ── Change this to your Render URL when deployed ──────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─────────────────────────────────────────────────────────────
// searchCourts
// Replaces the old client-side INDIAN_COURTS.filter(...) logic.
// Called whenever user types in the search box or changes category.
// ─────────────────────────────────────────────────────────────
export async function searchCourts(
  q: string = "",
  category: string = ""
): Promise<Court[]> {
  const params = new URLSearchParams();

  if (q.trim())        params.set("q", q.trim());
  if (category.trim()) params.set("category", category.trim());

  const res = await fetch(`${API_BASE}/api/courts/search?${params.toString()}`);

  if (!res.ok) {
    throw new Error(`Court search failed: ${res.status}`);
  }

  const data: CourtsSearchResult = await res.json();
  return data.courts;
}

// ─────────────────────────────────────────────────────────────
// getCategories
// Returns the filter pill labels:
// ["Supreme Court", "High Court", "District Court", ...]
// Call once on page load and cache in component state.
// ─────────────────────────────────────────────────────────────
export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/courts/categories`);

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.status}`);
  }

  const data: { categories: string[] } = await res.json();
  return data.categories;
}

// ─────────────────────────────────────────────────────────────
// getCourtById
// Called when user selects a court and moves to Step 2 (Enter CRN).
// ─────────────────────────────────────────────────────────────
export async function getCourtById(courtId: string): Promise<Court> {
  const res = await fetch(`${API_BASE}/api/courts/${courtId}`);

  if (res.status === 404) {
    throw new Error(`Court not found: ${courtId}`);
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch court: ${res.status}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────
// COURT_CATEGORIES — kept as a constant for TypeScript typing
// only. Do NOT use this to render the filter pills —
// use getCategories() instead so DB is the source of truth.
// ─────────────────────────────────────────────────────────────
export const COURT_CATEGORIES = [
  "Supreme Court",
  "High Court",
  "District Court",
  "Family Court",
  "Tribunal",
  "Consumer Forum",
  "Lok Adalat",
] as const;

export type CourtCategory = (typeof COURT_CATEGORIES)[number];