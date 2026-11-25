import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

const notes = [
  { label: "Sessions", value: "Timed" },
  { label: "Marking", value: "Server-side" },
  { label: "Access", value: "Free" },
];

export default function CTA() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-exam px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="printed-grid-dark absolute inset-0" />
            <div className="absolute -top-28 right-10 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <p className="eyebrow text-primary-300">Start today</p>
              <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:text-[2.5rem] lg:text-[2.75rem]">
                Your exam date won&apos;t move.
                <br />
                Your preparation can.
              </h2>
              <p className="mt-5 max-w-md text-[0.9375rem] leading-7 text-white/60">
                Create an account, verify your email, and sit your first timed
                paper in minutes.
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register"
                  className={buttonVariants({
                    className:
                      "h-11 w-full rounded-xl bg-white px-6 text-sm font-semibold text-exam hover:bg-white/90",
                  })}
                >
                  Create a free account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>

                <Link
                  href="/subjects"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-11 w-full rounded-xl border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white",
                  })}
                >
                  Browse subjects
                </Link>
              </div>

              <dl className="mt-8 grid grid-cols-3 border-t border-white/15">
                {notes.map((note, index) => (
                  <div
                    key={note.label}
                    className={
                      index === 0
                        ? "pt-4"
                        : "border-l border-white/15 pl-4 pt-4"
                    }
                  >
                    <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                      {note.label}
                    </dt>
                    <dd className="mt-1 text-[0.8125rem] font-medium text-white/80">
                      {note.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
