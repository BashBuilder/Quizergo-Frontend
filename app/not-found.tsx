import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-lg">
        <p className="eyebrow text-marker-ink">Page not found</p>

        <div className="mt-6 rounded-3xl border border-rule bg-sheet p-8">
          <p className="text-[4.5rem] font-semibold leading-none tabular-nums tracking-[-0.05em] text-ink">
            404
          </p>
          <h1 className="mt-5 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
            This page isn&apos;t on the timetable.
          </h1>
          <p className="mt-2 text-[0.875rem] leading-7 text-ink-quiet">
            The link may have changed or the page may have been removed. Your
            papers are still in the mark book.
          </p>

          <div className="mt-7 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to home
            </Link>
            <Link
              href="/subjects"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-rule bg-sheet px-5 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Browse subjects
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
