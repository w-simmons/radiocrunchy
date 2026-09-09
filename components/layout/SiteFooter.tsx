import { copy } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-start justify-between gap-4 border-t border-panko/40 px-6 py-8 text-sm text-rice-dim md:flex-row md:items-center">
      <p className="type-grit font-display tracking-[0.18em] text-rice uppercase">
        Radio Crunchy
      </p>
      <p>{copy.tagline}</p>
    </footer>
  );
}
