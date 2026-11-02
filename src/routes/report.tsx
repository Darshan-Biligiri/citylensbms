import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ImagePlus, X } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { CATEGORIES, nextId, saveReport, useIssues, type Category } from "@/lib/issues";
import { CategoryDot } from "@/components/issue-bits";
import { LocationPickerLazy } from "@/components/lazy-maps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an issue — CityLens Bengaluru" },
      { name: "description", content: "Report a damaged footpath, blocked walkway, unsafe crossing, pothole or accessibility barrier in Bengaluru." },
      { property: "og:title", content: "Report a street issue in Bengaluru" },
      { property: "og:description", content: "Photo, category, pin. Under a minute." },
    ],
  }),
  component: Report,
});

const MAX_PHOTOS = 3;

function resize(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 1200 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      res(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

type Errors = Partial<Record<"category" | "title" | "description" | "location" | "photos", string>>;

const field = "w-full rounded-sm border border-input bg-paper px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink aria-[invalid=true]:border-destructive";

function Report() {
  const issues = useIssues();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState("");
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const big = imgs.find((f) => f.size > 10 * 1024 * 1024);
    if (big) return setErrors((e) => ({ ...e, photos: "Each photo must be under 10 MB." }));
    const urls = await Promise.all(imgs.slice(0, MAX_PHOTOS - photos.length).map(resize));
    setPhotos((p) => [...p, ...urls].slice(0, MAX_PHOTOS));
    setErrors((e) => ({ ...e, photos: undefined }));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!category) e.category = "Choose the type of issue.";
    if (title.trim().length < 6) e.title = "Add a short title (at least 6 characters).";
    if (description.trim().length < 20) e.description = "Describe the problem in at least 20 characters.";
    if (!pin && address.trim().length < 5) e.location = "Enter an address or drop a pin on the map.";
    if (!photos.length) e.photos = "Add at least one photo.";
    return e;
  }

  function submit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true], [data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const id = nextId(issues);
    const today = new Date().toISOString().slice(0, 10);
    try {
      saveReport({
        id, title: title.trim(), category: category!, status: "reported", description: description.trim(),
        locality: locality.trim() || "Bengaluru", address: address.trim() || "Pinned on map",
        lat: pin?.[0] ?? 12.9716, lng: pin?.[1] ?? 77.5946, reportedAt: today, updatedAt: today,
        ward: "Pending assignment", reporter: "You", photos, supporters: 1,
      });
    } catch {
      return setErrors({ photos: "Your browser storage is full. Try fewer or smaller photos." });
    }
    setDone(id);
    window.scrollTo({ top: 0 });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center rise">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"><Check /></span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Report submitted</h1>
        <p className="mt-3 text-muted-foreground">Thank you. Your report is now public with the reference</p>
        <p className="mt-2 font-mono text-lg text-ink">{done}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/issues/$id" params={{ id: done }} className="rounded-sm bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-primary">View report</Link>
          <button onClick={() => { setDone(null); setCategory(null); setTitle(""); setDescription(""); setAddress(""); setLocality(""); setPin(null); setPhotos([]); }} className="rounded-sm border border-input bg-paper px-5 py-3 text-sm font-medium hover:border-ink">
            Report another
          </button>
        </div>
      </div>
    );
  }

  const Err = ({ k }: { k: keyof Errors }) => errors[k] ? <p data-error className="mt-1.5 text-xs text-destructive" role="alert">{errors[k]}</p> : null;

  return (
    <div className="mx-auto max-w-6xl px-5 pt-14">
      <p className="eyebrow">New report</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Report an issue</h1>
      <p className="mt-2 max-w-lg text-muted-foreground">One problem per report. Clear photos and an accurate location make it much easier to act on.</p>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 md:grid-cols-[1fr_1fr]">
        <div className="space-y-8">
          <fieldset>
            <legend className="text-sm font-medium text-ink">Type of issue</legend>
            <div className="mt-3 grid grid-cols-2 gap-2" data-error={errors.category ? "" : undefined}>
              {(Object.keys(CATEGORIES) as Category[]).map((c) => (
                <label key={c} className={cn("flex cursor-pointer items-center gap-2 rounded-sm border bg-paper px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring", category === c ? "border-ink" : "border-input hover:border-muted-foreground")}>
                  <input type="radio" name="category" className="sr-only" checked={category === c} onChange={() => { setCategory(c); setErrors((e) => ({ ...e, category: undefined })); }} />
                  <CategoryDot category={c} /> {CATEGORIES[c].label}
                </label>
              ))}
            </div>
            <Err k="category" />
          </fieldset>

          <div>
            <label htmlFor="title" className="text-sm font-medium text-ink">Title</label>
            <input id="title" value={title} maxLength={90} onChange={(e) => setTitle(e.target.value)} aria-invalid={!!errors.title} placeholder="e.g. Broken slab outside bus stop" className={cn(field, "mt-2")} />
            <Err k="title" />
          </div>

          <div>
            <label htmlFor="desc" className="flex justify-between text-sm font-medium text-ink">
              Description <span className="font-mono text-xs font-normal text-muted-foreground">{description.length}/600</span>
            </label>
            <textarea id="desc" rows={5} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!errors.description} placeholder="What's wrong, who is affected, and since when?" className={cn(field, "mt-2 resize-none")} />
            <Err k="description" />
          </div>

          <div>
            <span className="text-sm font-medium text-ink">Photos <span className="font-normal text-muted-foreground">(up to {MAX_PHOTOS})</span></span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-sm">
                  <img src={p} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`} className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink text-paper">
                    <X size={13} />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                  className={cn("flex aspect-square flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed bg-paper text-xs text-muted-foreground transition-colors hover:border-ink hover:text-ink", errors.photos ? "border-destructive" : "border-input")}
                >
                  <ImagePlus size={20} /> Add photo
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            <Err k="photos" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <div>
              <label htmlFor="address" className="text-sm font-medium text-ink">Street / landmark</label>
              <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} aria-invalid={!!errors.location} placeholder="e.g. CMH Rd, near metro exit" className={cn(field, "mt-2")} />
            </div>
            <div>
              <label htmlFor="locality" className="text-sm font-medium text-ink">Locality</label>
              <input id="locality" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Indiranagar" className={cn(field, "mt-2")} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-ink">Pin on map</span>
              <span className="font-mono text-xs text-muted-foreground">{pin ? `${pin[0].toFixed(4)}, ${pin[1].toFixed(4)}` : "Click to place"}</span>
            </div>
            <div className={cn("mt-2 h-80 overflow-hidden rounded-sm border", errors.location && "border-destructive")}>
              <LocationPickerLazy value={pin} onChange={(v) => { setPin(v); setErrors((e) => ({ ...e, location: undefined })); }} />
            </div>
            <Err k="location" />
          </div>
          <div className="border-t pt-6">
            <button type="submit" className="w-full rounded-sm bg-ink px-5 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-primary">Submit report</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Demo: your report is saved in this browser only.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
