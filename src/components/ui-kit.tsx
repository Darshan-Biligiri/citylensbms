import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex select-none items-center justify-center gap-2 rounded-sm font-medium transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-primary",
  secondary: "border border-input bg-paper text-ink hover:border-ink",
  ghost: "text-muted-foreground hover:bg-secondary hover:text-ink",
  inverse: "bg-paper text-ink hover:bg-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

export function btn({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Arrow that nudges right on button hover. */
export const nudge = "group-hover/btn:translate-x-0.5";

export function PageIntro({ eyebrow, title, children, aside }: { eyebrow: string; title: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="rise border-b pb-10 pt-12 md:pb-14 md:pt-16">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.022em] text-ink md:text-[2.6rem]">{title}</h1>
          {children && <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted-foreground">{children}</p>}
        </div>
        {aside}
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.015em] text-ink md:text-[1.75rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Panel({ step, title, hint, children, className }: { step?: string; title: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-md border bg-paper", className)}>
      <div className="flex items-baseline gap-3 border-b px-5 py-3.5">
        {step && <span className="font-mono text-xs text-primary">{step}</span>}
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {hint && <span className="ml-auto text-xs text-muted-foreground">{hint}</span>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export const container = "mx-auto w-full max-w-6xl px-5 md:px-8";
