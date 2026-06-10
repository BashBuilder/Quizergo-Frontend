"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Clock,
  Target,
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
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 60) return "text-amber-600";
  return "text-rose-600";
}

function scoreRingColor(pct: number) {
  if (pct >= 80) return "#34d399";
  if (pct >= 60) return "#fbbf24";
  return "#f87171";
}

function scoreLabel(pct: number) {
  if (pct >= 80) return "Excellent";
  if (pct >= 65) return "Good";
  if (pct >= 50) return "Average";
  return "Needs work";
}

// ── Question row ──────────────────────────────────────────────────────────
function QuestionRow({ q, idx }: { q: BreakdownQuestion; idx: number }) {
  const [open, setOpen] = useState(false);

  const icon =
    q.status === "correct" ? (
      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
    ) : q.status === "incorrect" ? (
      <XCircle size={15} className="text-rose-500 shrink-0" />
    ) : (
      <MinusCircle size={15} className="text-slate-400 shrink-0" />
    );

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50/70 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-xs font-bold text-slate-400 w-5 shrink-0 pt-0.5">
          {idx + 1}
        </span>
        {icon}
        <p className="flex-1 text-sm text-slate-700 leading-snug line-clamp-2">
          <LessonContent content={q.question} />
        </p>
        {open ? (
          <ChevronUp size={13} className="text-slate-400 shrink-0 mt-0.5" />
        ) : (
          <ChevronDown size={13} className="text-slate-400 shrink-0 mt-0.5" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 bg-slate-50/50">
          <div className="flex flex-wrap gap-3 text-xs">
            <span
              className={cn(
                "px-2.5 py-1 rounded-lg font-semibold",
                q.status === "correct"
                  ? "bg-emerald-50 text-emerald-700"
                  : q.status === "incorrect"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-slate-100 text-slate-500",
              )}
            >
              Your answer: <strong>{q.userAnswer?.toUpperCase() ?? "—"}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-700">
              Correct: <strong>{q.correctAnswer.toUpperCase()}</strong>
            </span>
          </div>
          {q.solution && (
            <div className="bg-white rounded-xl border border-slate-100 px-3 py-2.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Explanation
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                <LessonContent content={q.solution} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
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
  const pct = Math.round((correct / total) * 100);

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <p className="text-sm font-bold text-slate-800 text-left">
              {group.subject}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="text-emerald-600 font-semibold">
                {correct} correct
              </span>
              <span className="text-rose-500">{incorrect} wrong</span>
              <span className="text-slate-400">{skipped} skipped</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn("text-lg font-bold", scoreColor(pct))}>
            {pct}%
          </span>
          {open ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Score bar */}
      <div className="h-1 bg-slate-100">
        <div
          className={cn(
            "h-full transition-all duration-700",
            pct >= 80
              ? "bg-emerald-400"
              : pct >= 60
                ? "bg-amber-400"
                : "bg-rose-400",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {open && (
        <div>
          {group.questions.map((q, idx) => (
            <QuestionRow key={q.questionId} q={q} idx={idx} />
          ))}
        </div>
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-500">
        <p>No results found.</p>
        <Link
          href="/practice"
          className="text-sm font-semibold text-primary-600 hover:underline"
        >
          Back to Practice
        </Link>
      </div>
    );
  }

  const totalCorrect = result.correct.reduce((a, c) => a + c.count, 0);
  const totalIncorrect = result.incorrect.reduce((a, c) => a + c.count, 0);
  const totalSkipped = result.skipped.reduce((a, c) => a + c.count, 0);
  const scorePct = Math.round((totalCorrect / result.total) * 100);

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] pt-20 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Score hero */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-xl mb-6">
          <div className="px-8 py-8 flex flex-col sm:flex-row items-center gap-8">
            {/* Ring */}
            <div className="relative shrink-0 flex items-center justify-center w-32 h-32">
              <svg
                className="w-32 h-32 -rotate-90"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreRingColor(scorePct)}
                  strokeWidth="8"
                  strokeDasharray={`${(scorePct / 100) * 339.3} 339.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-3xl font-bold text-white">{scorePct}%</p>
                <p className="text-[10px] text-white/50 font-semibold uppercase">
                  {scoreLabel(scorePct)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 w-full">
              <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">
                Session Complete
              </p>
              <p className="text-white text-sm mb-4">
                {totalCorrect} of {result.total} questions correct
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    label: "Correct",
                    value: totalCorrect,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Wrong",
                    value: totalIncorrect,
                    color: "text-rose-400",
                  },
                  {
                    label: "Skipped",
                    value: totalSkipped,
                    color: "text-slate-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/5 rounded-xl p-2.5 text-center"
                  >
                    <p className={cn("text-xl font-bold", s.color)}>
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/40 font-medium">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div className="border-t border-white/10 px-8 py-3 flex flex-wrap gap-6 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Clock size={12} aria-hidden="true" />
              Time: {formatTime(result.timeTaken)}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} aria-hidden="true" />
              {result.total} questions
            </span>
            <span className="flex items-center gap-1.5">
              <Target size={12} aria-hidden="true" />
              {result.breakdown.length} subject
              {result.breakdown.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Per-subject breakdown */}
        <div className="space-y-4 mb-6">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest px-1">
            Review by Subject
          </h2>
          {result.breakdown.map((group) => {
            const correct =
              result.correct.find((c) => c.subject === group.subject)?.count ??
              0;
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

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/practice"
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-center flex items-center justify-center gap-2"
          >
            <BookOpen size={14} aria-hidden="true" />
            Back to Practice
          </Link>
          <Link
            href="/practice"
            className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
