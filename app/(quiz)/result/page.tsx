"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  RotateCcw,
  BookOpen,
  Clock,
  Target,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LessonContent from "@/components/global/LessonContent";

// ── Types matching backend QuizResultReturnType ───────────────────────────
type BreakdownQuestion = {
  questionId: number;
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  solution: string | null;
  status: "correct" | "incorrect" | "skipped";
};

type BreakdownGroup = {
  subject: string;
  questions: BreakdownQuestion[];
};

type SubjectCount = { subject: string; count: number };

type QuizResult = {
  sessionId: string;
  score: number;
  total: number;
  correct: SubjectCount[];
  incorrect: SubjectCount[];
  skipped: SubjectCount[];
  timeTaken: number;
  breakdown: BreakdownGroup[];
  submittedAt: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function scoreColor(pct: number) {
  if (pct >= 80) return "text-emerald-700";
  if (pct >= 50) return "text-ink";
  return "text-rose-700";
}

function StatusMark({ status }: { status: BreakdownQuestion["status"] }) {
  if (status === "correct") {
    return (
      <CheckCircle2
        size={16}
        className="text-emerald-600"
        aria-label="Correct"
      />
    );
  }
  if (status === "incorrect") {
    return (
      <XCircle size={16} className="text-rose-600" aria-label="Wrong" />
    );
  }
  return (
    <MinusCircle size={16} className="text-ink-quiet" aria-label="Skipped" />
  );
}

// ── Question row ──────────────────────────────────────────────────────────
function QuestionRow({ q, idx }: { q: BreakdownQuestion; idx: number }) {
  const [open, setOpen] = useState(q.status !== "correct");

  return (
    <li className="border-b border-rule last:border-b-0">
      <button
        className="grid w-full grid-cols-[2.25rem_1fr_auto] items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-well/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 pt-0.5">
          <span className="w-4 text-right text-[0.75rem] font-semibold tabular-nums text-ink-quiet">
            {idx + 1}
          </span>
          <StatusMark status={q.status} />
        </span>

        <div
          className={cn(
            "min-w-0 text-[0.875rem] leading-6 text-ink-soft",
            !open && "line-clamp-2",
          )}
        >
          <LessonContent content={q.question} compact />
        </div>

        <span className="flex items-center gap-3 pt-0.5">
          <span className="hidden text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-quiet sm:block">
            {q.status === "correct"
              ? "Marked"
              : q.status === "incorrect"
                ? "Wrong"
                : "Skipped"}
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-ink-quiet transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 sm:pl-16">
          <div className="grid gap-2 sm:grid-cols-2">
            {q.status === "correct" ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2.5 sm:col-span-2">
                <p className="eyebrow text-emerald-700">
                  Your answer, marked correct
                </p>
                <p className="mt-1.5 text-[0.875rem] font-semibold uppercase tabular-nums text-ink">
                  {q.correctAnswer}
                </p>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "rounded-xl border px-3.5 py-2.5",
                    q.status === "incorrect"
                      ? "border-rose-100 bg-rose-50/70"
                      : "border-rule bg-well",
                  )}
                >
                  <p
                    className={cn(
                      "eyebrow",
                      q.status === "incorrect"
                        ? "text-rose-700"
                        : "text-ink-quiet",
                    )}
                  >
                    Your answer
                  </p>
                  <p className="mt-1.5 text-[0.875rem] font-semibold uppercase tabular-nums text-ink">
                    {q.userAnswer ?? "No answer"}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2.5">
                  <p className="eyebrow text-emerald-700">Correct answer</p>
                  <p className="mt-1.5 text-[0.875rem] font-semibold uppercase tabular-nums text-ink">
                    {q.correctAnswer}
                  </p>
                </div>
              </>
            )}
          </div>

          {q.solution && (
            <div className="mt-2 rounded-xl border border-rule bg-well px-4 py-3">
              <p className="eyebrow eyebrow-quiet">Why</p>
              <div className="mt-1.5">
                <LessonContent content={q.solution} compact />
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ── Subject section ───────────────────────────────────────────────────────
function SubjectSection({
  group,
  correct,
  incorrect,
  skipped,
}: {
  group: BreakdownGroup;
  correct: number;
  incorrect: number;
  skipped: number;
}) {
  const [open, setOpen] = useState(true);
  const total = group.questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-rule bg-sheet">
      <button
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-well/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink">
            {group.subject}
          </p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-3 text-[0.75rem] tabular-nums">
            <span className="font-medium text-emerald-700">
              {correct} correct
            </span>
            <span className="text-rose-700">{incorrect} wrong</span>
            <span className="text-ink-quiet">{skipped} skipped</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[0.75rem] tabular-nums text-ink-quiet">
            {correct}/{total}
          </span>
          <span
            className={cn(
              "text-[1.125rem] font-semibold tabular-nums tracking-[-0.02em]",
              scoreColor(pct),
            )}
          >
            {pct}%
          </span>
          <ChevronDown
            size={14}
            className={cn(
              "text-ink-quiet transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Correct proportion, one rule */}
      <div className="h-1 bg-well">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>

      {open && (
        <ul className="border-t border-rule">
          {group.questions.map((q, idx) => (
            <QuestionRow key={q.questionId} q={q} idx={idx} />
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────
export default function ResultsPage() {
  const result = useMemo<QuizResult | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("quizResult");
    return raw ? JSON.parse(raw) : null;
  }, []);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rule bg-sheet p-8">
          <p className="eyebrow text-marker-ink">Nothing to mark</p>
          <h1 className="mt-3 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
            This marked paper is no longer here.
          </h1>
          <p className="mt-2 text-[0.875rem] leading-6 text-ink-quiet">
            A result only lives in this tab after you hand a paper in. Your past
            scores are still in the mark book.
          </p>
          <div className="mt-6 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge"
            >
              Open mark book
            </Link>
            <Link
              href="/setup"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-rule bg-sheet px-5 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Sit a paper
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalCorrect = result.correct.reduce((a, c) => a + c.count, 0);
  const totalIncorrect = result.incorrect.reduce((a, c) => a + c.count, 0);
  const totalSkipped = result.skipped.reduce((a, c) => a + c.count, 0);
  const scorePct =
    result.total > 0 ? Math.round((totalCorrect / result.total) * 100) : 0;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="min-h-screen bg-paper pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10">
        <h1 className="sr-only">Your marked paper</h1>
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between border-b border-rule pb-4">
          <p className="eyebrow eyebrow-quiet">Your paper, returned</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-ink-quiet transition-colors hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Mark book
          </Link>
        </div>

        {/* Score slab */}
        <div className="relative overflow-hidden rounded-3xl bg-exam">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="printed-grid-dark absolute inset-0" />
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
          </div>

          <div className="relative border-b border-white/10 px-6 pt-6 pb-5 sm:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="eyebrow text-primary-300">Session complete</p>
              <p className="text-[0.75rem] tabular-nums text-white/55">
                {formatTime(result.timeTaken)} used
              </p>
            </div>

            <div className="mt-5 grid items-center gap-7 sm:grid-cols-[9.5rem_1fr] sm:gap-9">
              {/* Score mark — neutral arc, no colour verdict */}
              <div className="relative mx-auto h-36 w-36 sm:mx-0">
                <svg
                  className="h-36 w-36 -rotate-90"
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="6"
                    strokeDasharray={`${(scorePct / 100) * circumference} ${circumference}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[2.5rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-white">
                    {scorePct}
                    <span className="text-[1.125rem] font-medium text-white/50">
                      %
                    </span>
                  </p>
                  <p className="eyebrow mt-2 text-white/55">Marked</p>
                </div>
              </div>

              <div>
                <p className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-white">
                  {totalCorrect} of {result.total} correct.
                </p>
                <p className="mt-1 text-[0.8125rem] leading-6 text-white/50">
                  {result.breakdown.length} subject
                  {result.breakdown.length === 1 ? "" : "s"}, marked question by
                  question. Wrong and skipped answers are open below.
                </p>

                <dl className="mt-5 grid grid-cols-3 border-t border-white/15 pt-4">
                  {[
                    {
                      label: "Correct",
                      value: totalCorrect,
                      className: "text-emerald-400",
                    },
                    {
                      label: "Wrong",
                      value: totalIncorrect,
                      className: "text-rose-400",
                    },
                    {
                      label: "Skipped",
                      value: totalSkipped,
                      className: "text-white/50",
                    },
                  ].map((s, index) => (
                    <div
                      key={s.label}
                      className={cn(index > 0 && "border-l border-white/15 pl-4")}
                    >
                      <dd
                        className={cn(
                          "text-[1.25rem] font-semibold leading-none tabular-nums",
                          s.className,
                        )}
                      >
                        {s.value}
                      </dd>
                      <dt className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/55">
                        {s.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="relative flex flex-wrap gap-x-6 gap-y-2 px-6 py-3.5 text-[0.6875rem] text-white/55 sm:px-8">
            <span className="flex items-center gap-1.5 tabular-nums">
              <Clock size={11} aria-hidden="true" />
              {formatTime(result.timeTaken)}
            </span>
            <span className="flex items-center gap-1.5 tabular-nums">
              <BookOpen size={11} aria-hidden="true" />
              {result.total} questions
            </span>
            <span className="flex items-center gap-1.5 tabular-nums">
              <Target size={11} aria-hidden="true" />
              {result.breakdown.length} subject
              {result.breakdown.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Marking */}
        <div className="mt-9">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-3">
            <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
              The marking
            </h2>
            <p className="text-[0.75rem] tabular-nums text-ink-quiet">
              {totalIncorrect} wrong, {totalSkipped} skipped
            </p>
          </div>

          <div className="mt-4 space-y-4">
            {result.breakdown.map((group) => {
              const correct =
                result.correct.find((c) => c.subject === group.subject)
                  ?.count ?? 0;
              const incorrect =
                result.incorrect.find((i) => i.subject === group.subject)
                  ?.count ?? 0;
              const skipped =
                result.skipped.find((s) => s.subject === group.subject)?.count ??
                0;
              return (
                <SubjectSection
                  key={group.subject}
                  group={group}
                  correct={correct}
                  incorrect={incorrect}
                  skipped={skipped}
                />
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-rule bg-sheet text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
          >
            <BookOpen size={14} aria-hidden="true" />
            Back to mark book
          </Link>
          <Link
            href="/setup"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-exam text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98]"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Sit another paper
          </Link>
        </div>
      </div>
    </div>
  );
}
