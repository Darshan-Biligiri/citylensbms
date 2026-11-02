import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, formatDate, getSeedIssue, useIssues, type Status } from "@/lib/issues";
import { CategoryDot, StatusBadge } from "@/components/issue-bits";
import { DetailMapLazy } from "@/components/lazy-maps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/issues/$id")({
  head: ({ params }) => {
    const i = getSeedIssue(params.id);
    const title = i ? `${i.title} — ${i.locality} · CityLens` : `Issue ${params.id} · CityLens`;
    const desc = i ? i.description.slice(0, 155) : "Citizen-reported pedestrian infrastructure issue in Bengaluru.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }] };
  },
  component: Detail,
});

const TIMELINE: Status[] = ["reported", "in_progress", "resolved"];

function Detail() {
  const { id } = Route.useParams();
  const issues = useIssues();
  const issue = issues.find((i) => i.id === id);
  const [photo, setPhoto] = useState(0);

  if (!issue) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-mono text-sm text-muted-foreground">{id}</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Issue not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been reported on another device.</p>
        <Link to="/issues" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Back to all issues</Link>
      </div>
    );
  }

  const step = TIMELINE.indexOf(issue.status);
  const cat = CATEGORIES[issue.category];

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Link to="/issues" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft size={15} /> All issues
      </Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{issue.id}</span><span>·</span>
            <span className="inline-flex items-center gap-1.5"><CategoryDot category={issue.category} />{cat.label}</span>
          </div>
          <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-ink">{issue.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin size={15} /> {issue.address}, {issue.locality}</p>
        </div>
        <StatusBadge status={issue.status} className="px-3 py-1 text-sm" />
      </header>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <img src={issue.photos[photo]} alt={`Photo of ${issue.title}`} className="aspect-[4/3] w-full rounded-sm bg-muted object-cover" />
          {issue.photos.length > 1 && (
            <div className="mt-3 flex gap-2">
              {issue.photos.map((p, i) => (
                <button key={i} onClick={() => setPhoto(i)} aria-label={`Photo ${i + 1}`} className={cn("size-16 overflow-hidden rounded-sm border-2", i === photo ? "border-ink" : "border-transparent")}>
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <h2 className="eyebrow mt-10">Description</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-foreground">{issue.description}</p>
        </div>

        <aside className="space-y-8">
          <dl className="divide-y border-y text-sm">
            {[
              ["Reported", formatDate(issue.reportedAt)],
              ["Last update", formatDate(issue.updatedAt)],
              ["Ward", issue.ward],
              ["Reported by", issue.reporter],
              ["Supporters", String(issue.supporters)],
              ["Coordinates", `${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h2 className="eyebrow mb-4">Progress</h2>
            <ol className="space-y-4">
              {TIMELINE.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={cn("grid size-5 place-items-center rounded-full border font-mono text-[10px]", i <= step ? "border-primary bg-primary text-primary-foreground" : "border-input text-muted-foreground")}>{i + 1}</span>
                  <span className={i <= step ? "font-medium text-ink" : "text-muted-foreground"}>
                    {s === "reported" ? "Reported by citizen" : s === "in_progress" ? "Acknowledged, work in progress" : "Resolved and verified"}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="h-56 overflow-hidden rounded-sm border">
            <DetailMapLazy lat={issue.lat} lng={issue.lng} color={cat.color} />
          </div>
        </aside>
      </div>
    </div>
  );
}
