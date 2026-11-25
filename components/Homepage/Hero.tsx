import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

const options = [
  { key: "A", text: "2.0 m/s²" },
  { key: "B", text: "4.0 m/s²" },
  { key: "C", text: "6.0 m/s²" },
  { key: "D", text: "8.0 m/s²" },
];

const sessionSpecs = [
  { label: "Questions", value: "40" },
  { label: "Minutes", value: "45" },
  { label: "Subjects", value: "1" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule bg-paper">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="printed-grid absolute inset-0" />
        <div className="absolute -top-40 right-[-10rem] h-[26rem] w-[26rem] rounded-full bg-primary-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-start gap-16 px-6 pt-14 pb-20 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14 lg:pt-24 lg:pb-28">
        <div className="max-w-[34rem]">
          <div className="flex items-center gap-3">
            <span className="eyebrow text-marker-ink">JAMB</span>
            <span className="h-px w-5 bg-marker-line" aria-hidden="true" />
            <span className="eyebrow eyebrow-quiet">WAEC</span>
            <span className="h-px w-5 bg-rule" aria-hidden="true" />
            <span className="eyebrow eyebrow-quiet">Nigeria</span>
          </div>

          <h1 className="mt-7 text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3rem] lg:text-[3.5rem]">
            Sit the paper.
            <br />
            Then see it
            <br />
            <span className="text-marker-deep">handed back marked.</span>
          </h1>

          <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-8 text-ink-quiet">
            Pick your subjects, a question count and a time limit. Quizergo runs
            the session against a countdown, then returns every question graded
            with a plain-language explanation.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className={buttonVariants({
                className:
                  "h-11 w-full rounded-xl px-6 text-sm font-semibold sm:w-auto",
              })}
            >
              Start a paper
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/subjects"
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-11 w-full rounded-xl border-rule bg-sheet px-6 text-sm font-semibold text-ink-soft hover:bg-well sm:w-auto",
              })}
            >
              Browse subjects
            </Link>
          </div>

          <dl className="mt-11 flex max-w-md items-stretch border-t border-rule">
            {sessionSpecs.map((spec, index) => (
              <div
                key={spec.label}
                className={
                  index === 0
                    ? "pr-6 pt-4"
                    : "border-l border-rule px-6 pt-4 last:pr-0"
                }
              >
                <dd className="text-xl font-semibold tabular-nums tracking-[-0.02em] text-ink">
                  {spec.value}
                </dd>
                <dt className="eyebrow eyebrow-quiet mt-1">{spec.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* The paper artefact */}
        <div className="relative mx-auto w-full max-w-md lg:mt-4 lg:max-w-none">
          <p
            className="absolute -left-14 top-24 hidden w-24 -rotate-3 text-right text-[0.6875rem] font-semibold leading-4 tracking-[0.02em] text-marker-ink xl:block"
            aria-hidden="true"
          >
            about 40s
            <br />
            a question
            <span className="mt-1 block h-px w-full bg-marker-line" />
          </p>

          <div
            className="relative rounded-3xl border border-rule bg-sheet shadow-[0_2px_4px_rgba(15,23,42,0.04),0_24px_60px_-24px_rgba(15,23,42,0.28)]"
            role="img"
            aria-label="Preview of a Quizergo paper: a physics question with four answer options, one selected, and a countdown"
          >
            <div className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
              <div className="min-w-0">
                <p className="eyebrow text-marker-ink">Physics</p>
                <p className="mt-1 text-[0.8125rem] font-medium text-ink-quiet">
                  JAMB past questions
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-well px-2.5 py-1.5 text-xs font-semibold tabular-nums text-ink-soft">
                <Timer
                  size={12}
                  className="text-marker-ink"
                  aria-hidden="true"
                />
                12:48
              </span>
            </div>

            <div className="px-5 pt-5 pb-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow eyebrow-quiet">Question 8 of 40</p>
                <p className="text-[0.6875rem] font-semibold tabular-nums text-ink-quiet">
                  8 answered
                </p>
              </div>

              <p className="mt-3 text-[0.9375rem] font-medium leading-6 text-ink">
                A body starts from rest and reaches a velocity of 20 m/s in 5
                seconds. What is its acceleration?
              </p>

              <div className="mt-5 space-y-2">
                {options.map((option) => {
                  const selected = option.key === "B";

                  return (
                    <div
                      key={option.key}
                      className={
                        selected
                          ? "flex items-center gap-3 rounded-2xl border-2 border-primary-400 bg-marker-wash px-3 py-2.5"
                          : "flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-answer px-3 py-2.5"
                      }
                    >
                      <span
                        className={
                          selected
                            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-[0.6875rem] font-semibold uppercase text-white"
                            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rule bg-sheet text-[0.6875rem] font-semibold uppercase text-ink-quiet"
                        }
                      >
                        {option.key}
                      </span>
                      <span
                        className={
                          selected
                            ? "text-[0.8125rem] font-medium text-primary-950"
                            : "text-[0.8125rem] text-ink-soft"
                        }
                      >
                        {option.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-rule pt-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow eyebrow-quiet">Progress</span>
                  <span className="text-[0.6875rem] font-semibold tabular-nums text-ink-soft">
                    20%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-well">
                  <div className="h-full w-1/5 rounded-full bg-marker" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-7 -right-2 hidden w-[10.5rem] rounded-2xl border border-rule bg-sheet p-3.5 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)] sm:block lg:-right-4">
            <p className="eyebrow eyebrow-quiet">Last paper</p>
            <p className="mt-1.5 text-[1.75rem] font-semibold leading-none tabular-nums tracking-[-0.03em] text-ink">
              78%
            </p>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-well">
              <div className="h-full w-[78%] rounded-full bg-marker" />
            </div>
            <p className="mt-2 text-[0.6875rem] font-medium text-ink-quiet">
              31 of 40 correct
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
