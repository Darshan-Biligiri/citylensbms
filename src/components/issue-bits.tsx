import { Link } from "@tanstack/react-router";
import { CATEGORIES, STATUSES, formatDate, type Issue, type Status } from "@/lib/issues";
import { cn } from "@/lib/utils";

const statusClass: Record<Status, string> = {
  reported: "bg-status-reported-bg text-status-reported",
  in_progress: "bg-status-progress-bg text-status-progress",
  resolved: "bg-status-resolved-bg text-status-resolved",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium", statusClass[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUSES[status]}
    </span>
  );
}

export function CategoryDot({ category }: { category: Issue["category"] }) {
  return <span className="inline-block size-2 rounded-full" style={{ background: CATEGORIES[category].color }} aria-hidden />;
}

export function IssueRow({ issue, active, onHover }: { issue: Issue; active?: boolean; onHover?: (id: string | null) => void }) {
  return (
    <Link
      to="/issues/$id"
      params={{ id: issue.id }}
      onMouseEnter={() => onHover?.(issue.id)}
      onMouseLeave={() => onHover?.(null)}
      className={cn("group grid grid-cols-[88px_1fr] gap-4 border-b p-4 transition-colors hover:bg-paper", active && "bg-paper")}
    >
      <img src={issue.photos[0]} alt="" loading="lazy" className="aspect-square w-full rounded-sm object-cover" />
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>{issue.id}</span><span>·</span><span>{formatDate(issue.reportedAt)}</span>
        </div>
        <h3 className="mt-1 truncate text-[15px] font-medium text-ink group-hover:text-primary">{issue.title}</h3>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CategoryDot category={issue.category} /> {CATEGORIES[issue.category].short} · {issue.locality}
        </p>
        <StatusBadge status={issue.status} className="mt-2" />
      </div>
    </Link>
  );
}

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Link to="/issues/$id" params={{ id: issue.id }} className="group block">
      <div className="overflow-hidden rounded-sm bg-muted">
        <img src={issue.photos[0]} alt="" loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={issue.status} />
        <span className="font-mono text-[11px] text-muted-foreground">{formatDate(issue.reportedAt)}</span>
      </div>
      <h3 className="mt-2 font-medium leading-snug text-ink group-hover:text-primary">{issue.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{issue.locality}</p>
    </Link>
  );
}
