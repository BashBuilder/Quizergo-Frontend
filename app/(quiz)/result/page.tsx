"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LessonContent from "@/components/global/LessonContent";

// ── Helpers ───────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ── Session storage helpers ───────────────────────────────────────────────
const optionLabels = ["a", "b", "c", "d", "e"];

// ── Question view component (matches quiz page design) ───────────────────
function QuestionView({
  q,
  idx,
  totalQ,
  subject,
}: {
  q: BreakdownQuestion;
  idx: number;
  totalQ: number;
  subject: string;
}) {
  const isCorrectAnswer = (label: string) =>
    label.toLowerCase() === q.correctAnswer.toLowerCase();
  const isUserAnswer = (label: string) =>
    q.userAnswer && q.userAnswer.toUpperCase() === label.toUpperCase();

  return (
    <div className="mb-4 overflow-hidden rounded-3xl border border-rule bg-sheet">
      <div className="border-b border-rule px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-exam text-[0.8125rem] font-semibold tabular-nums text-white">
              {idx + 1}
            </span>
            <p className="text-[0.75rem] tabular-nums text-ink-quiet">
              Question {idx + 1} of {totalQ}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="text-[1.0625rem] font-medium leading-7 text-ink">
          <LessonContent content={q.question} />
        </div>
        {q.image && (
          <img
            src={q.image}
            alt={`${subject} question ${idx + 1} diagram`}
            className="mt-4 max-w-full rounded-xl border border-rule object-contain"
          />
        )}
      </div>

      <div
        className="space-y-2.5 px-5 pb-6 sm:px-6"
        role="radiogroup"
        aria-label="Answer options"
      >
        {q.option &&
          Object.values(q.option).map((option, idx) => {
            const optKey = optionLabels[idx];
            const selected = isUserAnswer(optKey);
            const isCorrect = isCorrectAnswer(optKey);

            // Always show the right answer; also show the user's pick when wrong.
            let borderClass = "border-slate-100 bg-answer";
            let textClass = "text-ink-soft";
            let badgeClass = "border border-rule bg-sheet text-ink-quiet";

            if (isCorrect) {
              if (q.status === "correct") {
                borderClass = "border-primary-400 bg-marker-wash";
                textClass = "font-medium text-primary-950";
                badgeClass = "bg-primary-500 text-white";
              } else {
                borderClass = "border-emerald-400 bg-emerald-50";
                textClass = "font-medium text-emerald-700";
                badgeClass = "bg-emerald-500 text-white";
              }
            } else if (selected) {
              borderClass = "border-rose-400 bg-rose-50";
              textClass = "font-medium text-rose-700";
              badgeClass = "bg-rose-500 text-white";
            }

            return (
              <button
                key={idx}
                type="button"
                className={cn(
                  "group flex w-full items-start gap-4 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors",
                  borderClass,
                )}
                role="radio"
                aria-checked={selected ? "true" : "false"}
                disabled
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-[0.6875rem] font-semibold uppercase transition-colors",
                    badgeClass,
                  )}
                  aria-hidden="true"
                >
                  {optKey}
                </span>
                <div className={cn("pt-0.5 text-[0.875rem] leading-6", textClass)}>
                  <LessonContent content={option as string} compact />
                </div>
              </button>
            );
          })}
      </div>

      {q.solution && (
        <div className="rounded-b-xl border-x border-rule bg-well px-5 py-4">
          <p className="eyebrow eyebrow-quiet mb-2">Solution</p>
          <div className="text-[0.875rem] leading-6 text-ink">
            <LessonContent content={q.solution} compact />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────
export default function ResultsPage() {
  const result = useMemo<QuizResult | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("quizResult");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

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

  // Get all questions and current question
  const allQuestions = result.breakdown.flatMap((g) =>
    g.questions.map((q) => ({ ...q, subject: g.subject }))
  );
  const currentQ = allQuestions[currentQuestionIdx];
  const activeSubject = result.breakdown[activeSubjectIdx]?.subject ?? "";
  const totalQ = allQuestions.length;

  // Calculate question index within subject
  const questionIndexInSubject = currentQuestionIdx -
    result.breakdown.slice(0, activeSubjectIdx).reduce((sum, g) => sum + g.questions.length, 0);

  const goTo = (idx: number) => setCurrentQuestionIdx(Math.max(0, Math.min(allQuestions.length - 1, idx)));
  const goToSubject = (idx: number) => {
    setActiveSubjectIdx(idx);
    const firstQuestionInSubject = result.breakdown.slice(0, idx).reduce((sum, g) => sum + g.questions.length, 0);
    setCurrentQuestionIdx(firstQuestionInSubject);
  };

  // Build session from result for navigation
  const questions: SubjectGroup[] = result.breakdown.map(g => ({
    subject: g.subject,
    questions: g.questions as unknown as QuestionType[]
  }));

  // Calculate current subject question count from result
  const totalQInSubject = questions[activeSubjectIdx]?.questions.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow truncate text-marker-ink">
              {activeSubject}
            </p>
            <p className="mt-1 text-[0.75rem] font-medium tabular-nums text-ink-quiet">
              Question {questionIndexInSubject + 1} of {totalQInSubject}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/dashboard"
              className="flex h-9 items-center gap-1.5 rounded-lg border border-rule bg-sheet px-3 text-[0.75rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              <BookOpen size={12} aria-hidden="true" />
              <span className="hidden sm:inline">Mark book</span>
            </Link>
            <Link
              href="/setup"
              className="flex h-9 items-center gap-1.5 rounded-lg bg-exam px-3 text-[0.75rem] font-semibold text-white transition-colors hover:bg-exam-edge"
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span className="hidden sm:inline">Sit another</span>
            </Link>
          </div>
        </div>

        {/* Subject tabs — only shown when multiple subjects */}
        {result.breakdown.length > 1 && (
          <div className="overflow-x-auto border-t border-rule">
            <div className="mx-auto flex max-w-5xl px-4 sm:px-6">
              {result.breakdown.map((group, idx) => {
                const isActive = idx === activeSubjectIdx;
                const correctCount = group.questions.filter(q => q.status === "correct").length;
                return (
                  <button
                    key={group.subject}
                    onClick={() => goToSubject(idx)}
                    className={cn(
                      "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-[0.75rem] font-semibold transition-colors",
                      isActive
                        ? "border-exam text-ink"
                        : "border-transparent text-ink-quiet hover:text-ink",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {group.subject}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular-nums",
                        isActive
                          ? "bg-exam text-white"
                          : "bg-well text-ink-quiet",
                      )}
                    >
                      {correctCount}/{group.questions.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-8">
        <h1 className="sr-only">Your marked paper</h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Question panel & navigation */}
          <div>
            {currentQ && (
              <QuestionView
                q={currentQ}
                idx={questionIndexInSubject}
                totalQ={totalQInSubject}
                subject={activeSubject}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <button
                onClick={() => goTo(currentQuestionIdx - 1)}
                disabled={currentQuestionIdx === 0}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-xl border border-rule bg-sheet px-4 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well disabled:cursor-not-allowed disabled:opacity-40",
                )}
                aria-label="Previous question"
              >
                <ChevronLeft size={15} aria-hidden="true" /> Previous
              </button>

              <button
                onClick={() => goTo(currentQuestionIdx + 1)}
                disabled={currentQuestionIdx === allQuestions.length - 1}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40",
                )}
                aria-label="Next question"
              >
                Next <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Sidebar / Session Complete Card & Question Navigation */}
          <aside className="space-y-6">
            {/* Session Complete Card */}
            <div className="relative overflow-hidden rounded-3xl bg-exam p-5 text-white">
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                <div className="printed-grid-dark absolute inset-0" />
                <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
              </div>

              <div className="relative">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="eyebrow text-primary-300">Session complete</p>
                  <p className="text-[0.6875rem] tabular-nums text-white/55">
                    {formatTime(result.timeTaken)}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-5">
                  {/* Score mark */}
                  <div className="relative h-24 w-24 shrink-0">
                    <svg
                      className="h-24 w-24 -rotate-90"
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
                      <p className="text-[1.75rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-white">
                        {scorePct}
                        <span className="text-[0.875rem] font-medium text-white/50">
                          %
                        </span>
                      </p>
                      <p className="text-[0.625rem] uppercase tracking-[0.1em] text-white/55 mt-0.5">Marked</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-white">
                      {totalCorrect} of {result.total} correct
                    </p>
                    <p className="mt-0.5 text-[0.75rem] leading-5 text-white/60">
                      {totalIncorrect} wrong, {totalSkipped} skipped
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-3 border-t border-white/15 pt-3">
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
                      className={cn(index > 0 && "border-l border-white/15 pl-3")}
                    >
                      <dd
                        className={cn(
                          "text-[1rem] font-semibold leading-none tabular-nums",
                          s.className,
                        )}
                      >
                        {s.value}
                      </dd>
                      <dt className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-white/55">
                        {s.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Question navigator */}
            <div className="rounded-2xl border border-rule bg-sheet p-5">
              <h2 className="eyebrow eyebrow-quiet">Questions</h2>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {[
                  { color: "bg-emerald-500", label: "Correct" },
                  { color: "bg-rose-500", label: "Wrong" },
                  { color: "bg-well", label: "Skipped" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span
                      className={cn("h-2.5 w-2.5 rounded-sm", l.color)}
                      aria-hidden="true"
                    />
                    <span className="text-[0.6875rem] text-ink-quiet">
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 flex flex-wrap gap-1.5"
                role="list"
                aria-label="Question navigation"
              >
                {allQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  let bgClass = "bg-well text-ink-quiet hover:bg-rule";
                  if (q.status === "correct") {
                    bgClass = isCurrent ? "bg-primary-500 text-white" : "bg-primary-100 text-primary-900 hover:bg-primary-200";
                  } else if (q.status === "incorrect") {
                    bgClass = isCurrent ? "bg-rose-600 text-white" : "bg-rose-100 text-rose-900 hover:bg-rose-200";
                  } else {
                    bgClass = isCurrent ? "bg-exam text-white" : "bg-well text-ink-quiet hover:bg-rule";
                  }

                  return (
                    <button
                      key={q.questionId}
                      onClick={() => goTo(idx)}
                      role="listitem"
                      aria-current={isCurrent ? "true" : undefined}
                      aria-label={`Question ${idx + 1}`}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-[0.6875rem] font-semibold tabular-nums transition-colors",
                        isCurrent && "ring-2 ring-exam ring-offset-1",
                        bgClass,
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}