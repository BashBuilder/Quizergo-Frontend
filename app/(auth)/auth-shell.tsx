import { Check } from "lucide-react";

const notes = [
  "A paper timed to the minute",
  "Marked on the server, not in the browser",
  "Free to use while you prepare",
];

export default function AuthShell({
  eyebrow,
  headline,
  blurb,
  children,
}: {
  eyebrow: string;
  headline: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-exam text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="printed-grid-dark absolute inset-0" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-6 py-20 lg:py-14">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <aside className="hidden lg:block">
            <p className="eyebrow text-primary-300">{eyebrow}</p>
            <p className="mt-5 max-w-md text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
              {headline}
            </p>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-7 text-white/50">
              {blurb}
            </p>

            <ul className="mt-10 max-w-sm border-t border-white/15">
              {notes.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-3 border-b border-white/10 py-3.5 text-[0.8125rem] leading-6 text-white/60"
                >
                  <Check
                    size={13}
                    className="mt-1 shrink-0 text-primary-400"
                    aria-hidden="true"
                  />
                  {note}
                </li>
              ))}
            </ul>
          </aside>

          <section className="w-full max-w-md justify-self-center rounded-3xl border border-white/10 bg-sheet p-6 text-ink shadow-[0_24px_60px_-24px_rgba(2,6,23,0.85)] sm:p-8">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
