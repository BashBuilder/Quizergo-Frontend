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
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-7 sm:px-6 sm:py-8">
        <h1 className="sr-only">Your marked paper</h1>

        {/* Score slab */}
        <div className="relative overflow-hidden rounded-3xl bg-exam mb-6">
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
              {/* Score mark */}
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
                  {result.breakdown.length === 1 ? "" : "s"}, {totalIncorrect} wrong, {totalSkipped} skipped
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

        {/* Question view */}
        {currentQ && (
          <QuestionView
            q={currentQ}
            idx={questionIndexInSubject}
            totalQ={totalQInSubject}
            subject={activeSubject}
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
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

        {/* Question number navigation */}
        <div
          className="mt-4 flex flex-wrap gap-1.5"
          role="list"
          aria-label="Question navigation"
        >
          {allQuestions.map((q, idx) => {
            const isCurrent = idx === currentQuestionIdx;
            return (
              <button
                key={q.questionId}
                onClick={() => goTo(idx)}
                role="listitem"
                aria-current={isCurrent ? "true" : undefined}
                aria-label={`Question ${idx + 1}`}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-[0.6875rem] font-semibold tabular-nums transition-colors",
                  isCurrent
                    ? "bg-exam text-white ring-2 ring-exam ring-offset-1"
                    : "bg-well text-ink-quiet hover:bg-rule",
                )}
              >
                {idx + 1}
              </button>
            );
          })}
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
      </main>
    </div>
  );
}