import { useCallback, useEffect, useState } from "react";
import footpathImg from "@/assets/issue-footpath.jpg";
import potholeImg from "@/assets/issue-pothole.jpg";
import blockedImg from "@/assets/issue-blocked.jpg";

export type Category = "footpath" | "blocked" | "crossing" | "pothole" | "accessibility";
export type Status = "reported" | "in_progress" | "resolved";

export interface Issue {
  id: string;
  title: string;
  category: Category;
  status: Status;
  description: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  reportedAt: string;
  updatedAt: string;
  ward: string;
  reporter: string;
  photos: string[];
  supporters: number;
}

export const CATEGORIES: Record<Category, { label: string; color: string; short: string }> = {
  footpath: { label: "Damaged footpath", short: "Footpath", color: "oklch(0.52 0.13 60)" },
  blocked: { label: "Blocked walkway", short: "Blocked", color: "oklch(0.5 0.16 30)" },
  crossing: { label: "Unsafe crossing", short: "Crossing", color: "oklch(0.45 0.12 250)" },
  pothole: { label: "Pothole", short: "Pothole", color: "oklch(0.3 0.02 150)" },
  accessibility: { label: "Accessibility barrier", short: "Access", color: "oklch(0.43 0.09 152)" },
};

export const STATUSES: Record<Status, string> = {
  reported: "Reported",
  in_progress: "In progress",
  resolved: "Resolved",
};

export const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];

const SEED: Issue[] = [
  { id: "CL-1042", title: "Collapsed slab over storm drain", category: "footpath", status: "reported", description: "Two footpath slabs have caved in over the drain outside the bus stop. Commuters are stepping onto the road to get around it, especially during evening rush hour.", locality: "Indiranagar", address: "100 Feet Rd, near HAL 2nd Stage bus stop", lat: 12.9719, lng: 77.6412, reportedAt: "2026-10-28", updatedAt: "2026-10-28", ward: "Ward 80 · Hoysala Nagar", reporter: "Ananya R.", photos: [footpathImg], supporters: 38 },
  { id: "CL-1039", title: "Debris and bikes block entire footpath", category: "blocked", status: "in_progress", description: "Construction debris has been dumped on the footpath for three weeks. Two-wheelers park on the remaining strip. Pedestrians, including school children, walk on the carriageway.", locality: "Koramangala", address: "80 Feet Rd, 4th Block", lat: 12.9352, lng: 77.6245, reportedAt: "2026-10-21", updatedAt: "2026-10-30", ward: "Ward 151 · Koramangala", reporter: "Mohammed S.", photos: [blockedImg], supporters: 64 },
  { id: "CL-1036", title: "Deep pothole at junction turn", category: "pothole", status: "reported", description: "Water-logged pothole roughly 1.5 m wide right at the left turn. Two-wheelers swerve towards the kerb where people are waiting to cross.", locality: "Jayanagar", address: "11th Main & 30th Cross, 4th Block", lat: 12.925, lng: 77.5838, reportedAt: "2026-10-19", updatedAt: "2026-10-19", ward: "Ward 169 · Jayanagar East", reporter: "Kavya N.", photos: [potholeImg], supporters: 21 },
  { id: "CL-1031", title: "No pedestrian signal at six-lane crossing", category: "crossing", status: "in_progress", description: "The zebra crossing has faded and the pedestrian signal has been off since August. Elderly residents wait several minutes for a gap in traffic.", locality: "Malleshwaram", address: "Sampige Rd at 8th Cross", lat: 13.0035, lng: 77.5709, reportedAt: "2026-10-12", updatedAt: "2026-10-26", ward: "Ward 45 · Malleshwaram", reporter: "Raghav K.", photos: [footpathImg], supporters: 47 },
  { id: "CL-1027", title: "Kerb ramp missing at metro exit", category: "accessibility", status: "resolved", description: "Exit B has a 30 cm kerb with no ramp. Wheelchair users and people with prams cannot reach the footpath. A ramp was added on 24 Oct.", locality: "MG Road", address: "MG Road Metro, Exit B", lat: 12.9755, lng: 77.6068, reportedAt: "2026-09-30", updatedAt: "2026-10-24", ward: "Ward 111 · Shantala Nagar", reporter: "Priya D.", photos: [blockedImg], supporters: 92 },
  { id: "CL-1024", title: "Broken tiles along hospital stretch", category: "footpath", status: "resolved", description: "Loose interlocking tiles along a 200 m stretch near the hospital gate. Relaid by the contractor after ward engineer inspection.", locality: "Basavanagudi", address: "Bull Temple Rd, near Gandhi Bazaar", lat: 12.9421, lng: 77.5737, reportedAt: "2026-09-22", updatedAt: "2026-10-15", ward: "Ward 154 · Basavanagudi", reporter: "Suresh B.", photos: [footpathImg], supporters: 29 },
  { id: "CL-1019", title: "Vendor carts occupy footpath at signal", category: "blocked", status: "reported", description: "The full width of the footpath is taken up near the signal between 5 and 10 pm. Pedestrians walk in the bus lane.", locality: "HSR Layout", address: "27th Main, Sector 1", lat: 12.9116, lng: 77.6473, reportedAt: "2026-10-30", updatedAt: "2026-10-30", ward: "Ward 174 · HSR Layout", reporter: "Neha G.", photos: [blockedImg], supporters: 12 },
  { id: "CL-1015", title: "Open manhole beside school gate", category: "pothole", status: "in_progress", description: "Manhole cover missing next to the school entrance, partially covered with a plank. Extremely dangerous at drop-off time.", locality: "Whitefield", address: "ITPL Main Rd, near Hope Farm", lat: 12.9698, lng: 77.75, reportedAt: "2026-10-25", updatedAt: "2026-10-31", ward: "Ward 84 · Hagadur", reporter: "Arjun M.", photos: [potholeImg], supporters: 71 },
  { id: "CL-1011", title: "Footpath ends abruptly at flyover", category: "accessibility", status: "reported", description: "The footpath stops at the flyover ramp with a 50 cm drop and no continuation. Pedestrians walk inside the flyover lane.", locality: "Hebbal", address: "Bellary Rd service road", lat: 13.0358, lng: 77.597, reportedAt: "2026-10-17", updatedAt: "2026-10-17", ward: "Ward 19 · Ganganagar", reporter: "Lakshmi P.", photos: [footpathImg], supporters: 33 },
  { id: "CL-1008", title: "Faded zebra crossing near market", category: "crossing", status: "resolved", description: "Crossing markings were barely visible. Repainted with reflective paint and a speed table added.", locality: "Rajajinagar", address: "Dr Rajkumar Rd, 2nd Block", lat: 12.9915, lng: 77.5525, reportedAt: "2026-09-10", updatedAt: "2026-10-02", ward: "Ward 99 · Rajajinagar", reporter: "Vinay H.", photos: [potholeImg], supporters: 18 },
];

const KEY = "citylens.reports.v1";

function readLocal(): Issue[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Issue[]) : [];
  } catch {
    return [];
  }
}

export function saveReport(issue: Issue) {
  const all = [issue, ...readLocal()];
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("citylens:update"));
}

export function nextId(existing: Issue[]) {
  const max = existing.reduce((m, i) => Math.max(m, Number(i.id.split("-")[1]) || 0), 0);
  return `CL-${max + 1}`;
}

/** Seed data on the server; seed + locally saved reports after hydration. */
export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>(SEED);
  const load = useCallback(() => setIssues([...readLocal(), ...SEED]), []);
  useEffect(() => {
    load();
    window.addEventListener("citylens:update", load);
    return () => window.removeEventListener("citylens:update", load);
  }, [load]);
  return issues;
}

export function getSeedIssue(id: string) {
  return SEED.find((i) => i.id === id);
}

export function formatDate(iso: string) {
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function filterIssues(list: Issue[], q: string, cats: Category[], statuses: Status[]) {
  const s = q.trim().toLowerCase();
  return list.filter(
    (i) =>
      (!cats.length || cats.includes(i.category)) &&
      (!statuses.length || statuses.includes(i.status)) &&
      (!s || [i.title, i.locality, i.address, i.id, i.ward].some((f) => f.toLowerCase().includes(s))),
  );
}
