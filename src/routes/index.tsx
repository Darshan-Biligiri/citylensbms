import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero-street.jpg";
import { useIssues } from "@/lib/issues";
import { IssueCard } from "@/components/issue-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CityLens — Make every street better in Bengaluru" },
      { name: "description", content: "Report damaged footpaths, blocked walkways, unsafe crossings and potholes across Bengaluru, and follow them to resolution." },
      { property: "og:title", content: "CityLens — Make every street better" },
      { property: "og:description", content: "A citizen record of Bengaluru's walking infrastructure." },
    ],
  }),
  component: Home,
});

const STEPS = [
  { n: "01", t: "Spot it", d: "A broken slab, a blocked footpath, a crossing without a signal. If it makes walking harder, it counts." },
  { n: "02", t: "Report it", d: "Add a photo, pick a category and drop a pin. It takes under a minute and needs no account." },
  { n: "03", t: "Track it", d: "Every report gets a public ID and status, so neighbours can see it and ward offices can act on it." },
];

function Home() {
  const issues = useIssues();
  const resolved = issues.filter((i) => i.status === "resolved").length;
  const progress = issues.filter((i) => i.status === "in_progress").length;
  const localities = new Set(issues.map((i) => i.locality)).size;
  const recent = [...issues].sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)).slice(0, 4);

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 md:grid-cols-[1.05fr_1fr] md:items-end md:pt-20">
        <div className="rise">
          <p className="eyebrow">Bengaluru · Pedestrian infrastructure</p>
          <h1 className="mt-5 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.025em] text-ink md:text-6xl">
            Make every<br />street better.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            CityLens is a public record of what makes Bengaluru hard to walk. Report a problem in a minute, and follow it until it's fixed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/report" className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-primary">
              Report an issue <ArrowRight size={16} />
            </Link>
            <Link to="/issues" className="inline-flex items-center gap-2 rounded-sm border border-input bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink">
              Explore issues
            </Link>
          </div>
        </div>
        <figure className="rise [animation-delay:120ms]">
          <img src={hero} alt="Pedestrians on an uneven footpath in Bengaluru" width={1600} height={1104} className="aspect-[4/3] w-full rounded-sm object-cover" />
          <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">Cunningham Road, 08:40 — slabs lifted by tree roots, reported Oct 2026</figcaption>
        </figure>
      </section>

      <section className="border-y bg-paper">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4">
          {[
            ["Issues reported", issues.length],
            ["In progress", progress],
            ["Resolved", resolved],
            ["Localities", localities],
          ].map(([k, v], i) => (
            <div key={k} className={`py-8 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i % 2 ? "border-l pl-6 md:pl-8" : ""}`}>
              <dt className="eyebrow">{k}</dt>
              <dd className="mt-2 font-mono text-4xl font-medium tracking-tight text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Latest</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Recently reported</h2>
          </div>
          <Link to="/issues" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((i) => <IssueCard key={i.id} issue={i} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 max-w-lg text-2xl font-semibold tracking-tight text-ink">Three steps from a bad footpath to a fixed one.</h2>
        <ol className="mt-10 grid border-t md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`py-8 md:pr-8 ${i > 0 ? "border-t md:border-l md:border-t-0 md:pl-8" : ""}`}>
              <span className="font-mono text-sm text-primary">{s.n}</span>
              <h3 className="mt-3 text-lg font-medium text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
