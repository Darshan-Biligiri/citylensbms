import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentProps } from "react";
import type { IssuesMap as IM, LocationPicker as LP, DetailMap as DM } from "./city-map";

const IssuesMapL = lazy(() => import("./city-map").then((m) => ({ default: m.IssuesMap })));
const LocationPickerL = lazy(() => import("./city-map").then((m) => ({ default: m.LocationPicker })));
const DetailMapL = lazy(() => import("./city-map").then((m) => ({ default: m.DetailMap })));

const Fallback = () => <div className="h-full w-full animate-pulse bg-muted" />;

export function IssuesMapLazy(p: ComponentProps<typeof IM>) {
  return <ClientOnly fallback={<Fallback />}><Suspense fallback={<Fallback />}><IssuesMapL {...p} /></Suspense></ClientOnly>;
}
export function LocationPickerLazy(p: ComponentProps<typeof LP>) {
  return <ClientOnly fallback={<Fallback />}><Suspense fallback={<Fallback />}><LocationPickerL {...p} /></Suspense></ClientOnly>;
}
export function DetailMapLazy(p: ComponentProps<typeof DM>) {
  return <ClientOnly fallback={<Fallback />}><Suspense fallback={<Fallback />}><DetailMapL {...p} /></Suspense></ClientOnly>;
}
