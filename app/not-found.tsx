import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <p className="font-sans text-[11px] tracking-[0.32em] text-panko uppercase">
        No signal
      </p>
      <h1 className="type-grit font-sans mt-6 text-6xl font-extrabold tracking-[0.06em] text-rice uppercase">
        404
      </h1>
      <Link
        href="/"
        className="mt-8 text-panko transition-colors hover:text-rice"
      >
        Back to Radio Crunchy
      </Link>
    </main>
  );
}
