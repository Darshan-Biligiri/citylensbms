import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/issues", label: "Explore issues" },
  { to: "/about", label: "About" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-ink" aria-label="CityLens home">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="11" cy="11" r="4" className="fill-primary" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">CityLens</span>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-[1000] border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-muted-foreground transition-colors hover:text-ink" activeProps={{ className: "text-ink font-medium" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/report" className="rounded-sm bg-ink px-3.5 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-primary">
            Report an issue
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="border-t px-5 py-3 md:hidden">
          {[...NAV, { to: "/report", label: "Report an issue" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            See your city. Make it better. A citizen record of Bengaluru's walking infrastructure.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Platform</p>
          <ul className="space-y-2">
            <li><Link to="/report" className="hover:text-primary">Report an issue</Link></li>
            <li><Link to="/issues" className="hover:text-primary">Explore issues</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="eyebrow mb-3">Note</p>
          <p className="text-muted-foreground">Demo build. Reports are saved in this browser only and are not sent to any authority.</p>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl justify-between px-5 py-4 font-mono text-xs text-muted-foreground">
          <span>© 2026 CityLens</span>
          <span>12.9716° N, 77.5946° E</span>
        </div>
      </div>
    </footer>
  );
}
