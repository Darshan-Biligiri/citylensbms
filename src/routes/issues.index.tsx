import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { CATEGORIES, STATUSES, filterIssues, useIssues, type Category, type Status } from "@/lib/issues";
import { CategoryDot, IssueRow } from "@/components/issue-bits";
import { IssuesMapLazy } from "@/components/lazy-maps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/issues/")({
  head: () => ({
    meta: [
      { title: "Explore issues — CityLens Bengaluru" },
      { name: "description", content: "Map of reported footpath, crossing and accessibility issues across Bengaluru. Search and filter by category and status." },
      { property: "og:title", content: "Explore issues across Bengaluru" },
      { property: "og:description", content: "Search and filter citizen reports on an interactive map." },
    ],
  }),
  component: Explore,
});

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors",
        on ? "border-ink bg-ink text-paper" : "border-input bg-paper text-foreground hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

function Explore() {
  const issues = useIssues();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [sts, setSts] = useState<Status[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const list = useMemo(() => filterIssues(issues, q, cats, sts), [issues, q, cats, sts]);
  const onSelect = useCallback((id: string) => navigate({ to: "/issues/$id", params: { id } }), [navigate]);
  const dirty = q || cats.length || sts.length;

  return (
    <div className="grid border-b md:h-[calc(100vh-3.5rem)] md:grid-cols-[420px_1fr]">
      <aside className="flex min-h-0 flex-col border-r bg-background">
        <div className="space-y-4 border-b p-4">
          <div className="flex items-baseline justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-ink">Explore issues</h1>
            <span className="font-mono text-xs text-muted-foreground" aria-live="polite">{list.length} of {issues.length}</span>
          </div>
          <label className="relative block">
            <span className="sr-only">Search issues</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search locality, street or ID"
              className="w-full rounded-sm border border-input bg-paper py-2 pl-9 pr-3 text-sm outline-none focus:border-ink"
            />
          </label>
          <div>
            <p className="eyebrow mb-2">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(STATUSES) as Status[]).map((s) => (
                <Chip key={s} on={sts.includes(s)} onClick={() => setSts(toggle(sts, s))}>{STATUSES[s]}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-2">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                <Chip key={c} on={cats.includes(c)} onClick={() => setCats(toggle(cats, c))}>
                  <CategoryDot category={c} /> {CATEGORIES[c].short}
                </Chip>
              ))}
            </div>
          </div>
          {dirty ? (
            <button onClick={() => { setQ(""); setCats([]); setSts([]); }} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink">
              <X size={12} /> Clear filters
            </button>
          ) : null}
        </div>
        <div className="order-last min-h-0 flex-1 overflow-y-auto">
          {list.length ? (
            list.map((i) => <IssueRow key={i.id} issue={i} active={active === i.id} onHover={setActive} />)
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">No issues match these filters.</p>
          )}
        </div>
      </aside>
      <div className="relative h-[420px] md:order-none md:h-auto max-md:order-first">
        <IssuesMapLazy issues={list} activeId={active} onSelect={onSelect} />
      </div>
    </div>
  );
}
