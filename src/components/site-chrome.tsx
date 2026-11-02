import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { btn, container, nudge } from "./ui-kit";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", exact: true },
  { to: "/issues", label: "Explore issues", exact: false },
  { to: "/about", label: "About", exact: false },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5 text-ink" aria-label="CityLens home">
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.5" className="fill-primary" />
      </svg>
      <span className="text-[15px] font-semibold tracking-[-0.01em]">CityLens</span>
      <span className="hidden rounded-sm border px-1.5 py-px font-mono text-[10px] text-muted-foreground sm:inline">BLR</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-[1000] border-b bg-background/85 backdrop-blur-md">
      <div className={cn(container, "flex h-16 items-center justify-between gap-6")}>
        <Logo />
        <nav aria-label="Main" className="hidden h-full items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="relative flex h-full items-center px-3 text-sm text-muted-foreground transition-colors hover:text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:scale-x-0 after:bg-ink after:transition-transform data-[status=active]:text-ink data-[status=active]:after:scale-x-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/report" className={btn({ size: "sm", className: "hidden sm:inline-flex" })}>
            <Plus size={15} /> Report an issue
          </Link>
          <button
            className="grid size-9 place-items-center rounded-sm text-ink hover:bg-secondary md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="animate-in fade-in slide-in-from-top-2 h-[calc(100dvh-4rem)] border-t bg-background px-5 pt-4 duration-200 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} onClick={() => setOpen(false)} className="flex items-center justify-between border-b py-4 text-lg font-medium text-ink data-[status=active]:text-primary">
              {n.label} <ArrowRight size={18} className="text-muted-foreground" />
            </Link>
          ))}
          <Link to="/report" onClick={() => setOpen(false)} className={btn({ size: "lg", className: "mt-6 w-full" })}>
            <Plus size={16} /> Report an issue
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t bg-paper">
      <div className={cn(container, "grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr_1fr]")}>
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            See your city. Make it better. A citizen record of Bengaluru's walking infrastructure.
          </p>
          <Link to="/report" className={cn(btn({ variant: "secondary", size: "sm" }), "mt-6")}>
            Report an issue <ArrowRight size={14} className={nudge} />
          </Link>
        </div>
        <FooterCol title="Platform" links={[["/report", "Report an issue"], ["/issues", "Explore issues"], ["/about", "About"]]} />
        <div className="text-sm">
          <p className="eyebrow mb-4">Coverage</p>
          <ul className="space-y-2.5 text-muted-foreground">
            <li>Bengaluru Urban</li><li>198 wards</li><li>5 issue categories</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-4">Status</p>
          <p className="leading-relaxed text-muted-foreground">Demo build. Reports stay in this browser and are not sent to any authority.</p>
        </div>
      </div>
      <div className="border-t">
        <div className={cn(container, "flex flex-col gap-1 py-5 font-mono text-[11px] text-muted-foreground sm:flex-row sm:justify-between")}>
          <span>© 2026 CityLens · Independent civic project</span>
          <span>12.9716° N, 77.5946° E</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [ "/report" | "/issues" | "/about", string][] }) {
  return (
    <div className="text-sm">
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map(([to, l]) => (
          <li key={to}><Link to={to} className="text-foreground transition-colors hover:text-primary">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
