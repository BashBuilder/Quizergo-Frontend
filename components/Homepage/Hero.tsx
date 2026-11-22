import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CircleCheck,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

const options = [
  { key: "A", text: "2.0 m/s²" },
  { key: "B", text: "4.0 m/s²" },
  { key: "C", text: "6.0 m/s²" },
  { key: "D", text: "8.0 m/s²" },
];

const assurances = [
  "Timed mock exams",
  "Instant scoring",
  "Answer explanations",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-stone-50">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary-200/50 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-primary-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pt-12 pb-16 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-20 lg:pb-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-800 shadow-xs backdrop-blur">
            <Sparkles size={13} aria-hidden="true" />
            Built for JAMB &amp; WAEC
          </span>

          <h1 className="mt-6 text-3xl font-semibold leading-[1.06] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem]">
            Real past questions.
            <br />
            Real exam conditions.
            <br />
            <span className="text-primary-600">Real progress.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            QuizerGo is a focused way to prepare for JAMB and WAEC — timed mock
            exams, instant scoring, and a clear explanation for every answer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-11 w-full rounded-xl px-6 text-sm font-semibold shadow-sm sm:w-auto",
              })}
            >
              Start practising
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="/subjects"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-11 w-full rounded-xl border-slate-300 bg-white/70 px-6 text-sm font-semibold text-slate-700 backdrop-blur hover:bg-white sm:w-auto",
              })}
            >
              Browse subjects
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check
                  size={14}
                  className="text-primary-600"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Product preview */}
        <div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          role="img"
          aria-label="Preview of a QuizerGo timed mock exam showing a physics question, four answer options, and a countdown timer"
        >
          <div
            className="absolute -inset-4 rounded-[2.25rem] bg-linear-to-br from-primary-200/60 via-white/40 to-transparent blur-2xl"
            aria-hidden="true"
          />

          <div className="relative rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-[0_2px_4px_rgba(15,23,42,0.04),0_24px_60px_-24px_rgba(15,23,42,0.28)]">
            <div className="rounded-[1.4rem] border border-slate-100 bg-white">
              {/* Session bar */}
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                    <BookOpen size={14} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Physics mock
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      JAMB · 40 questions
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700">
                  <Timer
                    size={12}
                    className="text-primary-600"
                    aria-hidden="true"
                  />
                  12:48
                </span>
              </div>

              {/* Question */}
              <div className="px-4 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-12">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em]">
                  <span className="text-slate-500">Question 8 of 40</span>
                  <span className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-700">
                    Physics
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-800">
                  A body starts from rest and reaches a velocity of 20 m/s in 5
                  seconds. What is its acceleration?
                </p>

                <div className="mt-4 space-y-2">
                  {options.map((option) => {
                    const selected = option.key === "B";

                    return (
                      <div
                        key={option.key}
                        className={
                          selected
                            ? "flex items-center gap-3 rounded-xl border border-primary-300 bg-primary-50/70 px-3 py-2.5"
                            : "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
                        }
                      >
                        <span
                          className={
                            selected
                              ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-600 text-[11px] font-semibold text-white"
                              : "flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600"
                          }
                        >
                          {option.key}
                        </span>
                        <span className="text-sm text-slate-700">
                          {option.text}
                        </span>
                        {selected && (
                          <CircleCheck
                            size={15}
                            className="ml-auto text-primary-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                    <span>Progress</span>
                    <span className="tabular-nums">20%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-1/5 rounded-full bg-primary-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating score card */}
          <div className="absolute -right-3 -bottom-6 hidden w-40 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur sm:block lg:-right-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Last mock
              </p>
              <TrendingUp
                size={13}
                className="text-emerald-600"
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
              78%
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[78%] rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-[10px] font-medium text-slate-500">
              31 of 40 correct
            </p>
          </div>

          {/* Floating review card */}
          <div className="absolute -bottom-6 -left-3 hidden items-center gap-2.5 rounded-2xl border border-slate-200 bg-white/95 px-3.5 py-3 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur sm:flex lg:-left-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <CircleCheck size={16} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Every answer explained
              </p>
              <p className="text-[10px] text-slate-500">
                Review after you submit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
