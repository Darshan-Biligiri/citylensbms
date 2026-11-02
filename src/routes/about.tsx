import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CityLens — Walkable Bengaluru, one report at a time" },
      { name: "description", content: "Why CityLens exists and how citizens can help improve pedestrian infrastructure in Bengaluru." },
      { property: "og:title", content: "About CityLens" },
      { property: "og:description", content: "Why CityLens exists and how citizens can help improve Bengaluru's footpaths." },
    ],
  }),
  component: About,
});

const WAYS = [
  ["Report precisely", "One issue per report. A clear photo, the nearest landmark and an accurate pin make it actionable for a ward engineer."],
  ["Describe the impact", "Say who is affected and when — school drop-off, wheelchair users, night-time. Impact is what gets things prioritised."],
  ["Follow up", "Check back on the status. If something is marked resolved but isn't, report it again with a new photo."],
  ["Bring your neighbours", "Issues with more local support are harder to ignore. Share report links with your RWA or local groups."],
];

function About() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-16">
      <p className="eyebrow">About</p>
      <div className="mt-4 grid gap-12 md:grid-cols-[1fr_1fr]">
        <h1 className="text-4xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-5xl">
          Walking is how most of Bengaluru gets around. The city should be built for it.
        </h1>
        <div className="space-y-5 text-[17px] leading-relaxed text-muted-foreground md:pt-2">
          <p>Almost every trip in the city starts and ends on foot — to the bus stop, the metro, the market. Yet footpaths are broken, blocked or missing, and crossings are designed around vehicles.</p>
          <p>CityLens turns everyday frustration into a shared, public record. Each report is located, photographed and tracked, so patterns become visible and the people responsible can act on evidence rather than anecdotes.</p>
          <p>It is an independent, citizen-led project. This version is a working demo; reports are stored in your browser.</p>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">How you can help</h2>
        <dl className="mt-8 grid border-t sm:grid-cols-2">
          {WAYS.map(([t, d], i) => (
            <div key={t} className={`border-b py-8 sm:pr-10 ${i % 2 ? "sm:border-l sm:pl-10" : ""}`}>
              <dt className="flex gap-3 font-medium text-ink"><span className="font-mono text-sm text-primary">0{i + 1}</span>{t}</dt>
              <dd className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-sm bg-ink px-8 py-10 text-paper">
        <p className="text-xl font-medium">Seen something on your walk today?</p>
        <Link to="/report" className="rounded-sm bg-paper px-5 py-3 text-sm font-medium text-ink hover:bg-accent">Report an issue</Link>
      </div>
    </div>
  );
}
