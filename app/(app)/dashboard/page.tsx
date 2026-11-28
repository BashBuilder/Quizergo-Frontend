"use client";
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import { useAuth } from "@/hooks/auth";
import {
  useGetQuizHistory,
  type QuizResultSummary,
} from "@/services/quiz.service";
import { useGetSubjects } from "@/services/question.service";

// ── Helpers ──────────────────────────────────────────────────────────────
function pct(entry: QuizResultSummary) {
  return entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
}

function formatRelativeDate(timestamp: number | string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "--";
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "Last week";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ── Ledger cell ──────────────────────────────────────────────────────────
function RecordCell({
  label,
  value,
  note,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "px-6 py-6 sm:px-7",
        accent && "bg-marker-wash",
      )}
    >
      <p className="eyebrow eyebrow-quiet">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold leading-none tabular-nums tracking-[-0.03em] text-ink">
        {value}
      </p>
      <p className="mt-2 text-[0.6875rem] leading-5 text-ink-quiet">{note}</p>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch,
  } = useGetQuizHistory();
  const { data: subjects, isLoading: subjectsLoading } = useGetSubjects();

  const quizzesTaken = history?.length ?? 0;
  const averageScore = history?.length
    ? Math.round(history.reduce((sum, h) => sum + pct(h), 0) / history.length)
    : 0;
  const bestScore = history?.length ? Math.max(...history.map(pct)) : 0;

  const recent = [...(history ?? [])]
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    )
    .slice(0, 8);

  return (
    <PageWrapper className="pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
          <div>
            <p className="eyebrow text-marker-ink">Mark book</p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              Welcome back, {user?.firstName || "there"}.
            </h1>
            <p className="mt-2 max-w-md text-[0.875rem] leading-6 text-ink-quiet">
              Every paper you have sat, kept in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-rule bg-sheet px-4 py-2.5">
            <Calendar size={14} className="text-ink-quiet" aria-hidden="true" />
            <span className="text-[0.8125rem] font-medium tabular-nums text-ink-soft">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>

        {historyLoading ? (
          <div
            className="mt-8 overflow-hidden rounded-3xl border border-rule bg-sheet"
            aria-busy="true"
            aria-live="polite"
          >
            <span className="sr-only">Loading your mark book</span>
            <div className="grid sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "px-6 py-6",
                    i > 0 && "border-t border-rule sm:border-l sm:border-t-0",
                  )}
                >
                  <div className="h-2.5 w-20 rounded-sm bg-well" />
                  <div className="mt-4 h-8 w-16 rounded-sm bg-well" />
                  <div className="mt-3 h-2.5 w-24 rounded-sm bg-well" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-rule px-6 py-4 text-[0.8125rem] text-ink-quiet">
              <Loader2 className="animate-spin" size={14} aria-hidden="true" />
              Loading your papers…
            </div>
          </div>
        ) : historyError ? (
          <div className="mt-8 rounded-3xl border border-rule bg-sheet px-6 py-14 text-center">
            <AlertCircle
              size={22}
              className="mx-auto text-rose-400"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-semibold text-ink">
              Your mark book didn&apos;t load.
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-6 text-ink-quiet">
              Nothing was lost. Your papers are on the server — try again in a
              moment.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-lg border border-rule bg-sheet px-4 py-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Try again
            </button>
          </div>
        ) : quizzesTaken === 0 ? (
          <div className="mt-8 overflow-hidden rounded-3xl border border-rule bg-sheet">
            <div className="px-7 py-10 sm:px-10 sm:py-12">
              <p className="eyebrow eyebrow-quiet">Nothing marked yet</p>
              <h2 className="mt-4 max-w-md text-[1.5rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                Your first paper goes here.
              </h2>
              <p className="mt-2 max-w-md text-[0.875rem] leading-7 text-ink-quiet">
                Sit one timed session and the score, the time you used, and the
                full marking will be filed in this book.
              </p>
              <Link
                href="/setup"
                className="mt-7 inline-flex h-10 items-center gap-2 rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                Start your first paper
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="space-y-3 px-7 pb-10 sm:px-10" aria-hidden="true">
              {[92, 78, 64].map((w) => (
                <div key={w} className="h-px bg-rule" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Record strip */}
            <section
              aria-label="Key stats"
              className="mt-8 grid divide-y divide-rule overflow-hidden rounded-3xl border border-rule bg-sheet sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              <RecordCell
                label="Papers taken"
                value={String(quizzesTaken)}
                note="Completed and marked"
              />
              <RecordCell
                label="Average score"
                value={`${averageScore}%`}
                note={
                  quizzesTaken === 1
                    ? "From one paper"
                    : `Across ${quizzesTaken} papers`
                }
                accent
              />
              <RecordCell
                label="Best paper"
                value={`${bestScore}%`}
                note="Your highest so far"
              />
            </section>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
              {/* Recent papers */}
              <section aria-label="Recent papers">
                <div className="flex items-baseline justify-between border-b border-rule pb-3">
                  <h2 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                    Recent papers
                  </h2>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-quiet">
                    Newest first
                  </span>
                </div>

                <ul>
                  {recent.map((entry) => (
                    <li
                      key={entry.sessionId}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-rule py-4"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="w-[6.5rem] text-[0.8125rem] font-medium tabular-nums text-ink-quiet">
                          {formatRelativeDate(entry.submittedAt)}
                        </span>
                        <span className="text-[0.875rem] font-semibold text-ink">
                          {entry.score} of {entry.total} correct
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <span className="hidden text-[0.75rem] tabular-nums text-ink-quiet sm:block">
                          {formatTime(entry.timeTaken)}
                        </span>
                        <span className="hidden h-px w-10 bg-rule sm:block">
                          <span
                            className="block h-px bg-marker"
                            style={{
                              width: `${Math.min(pct(entry), 100)}%`,
                            }}
                          />
                        </span>
                        <span className="text-[0.9375rem] font-semibold tabular-nums text-ink">
                          {pct(entry)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[0.6875rem] leading-5 text-ink-quiet">
                  Opening a past paper is not available yet. The scores and times
                  above are read from your saved history.
                </p>
              </section>

              {/* Start another */}
              <aside aria-label="Start a new paper">
                <div className="rounded-2xl border border-rule bg-well p-6">
                  <BookOpen
                    size={18}
                    className="text-marker-ink"
                    aria-hidden="true"
                  />
                  <h2 className="mt-4 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                    Start another paper
                  </h2>
                  <p className="mt-2 text-[0.8125rem] leading-6 text-ink-quiet">
                    Choose your subjects, a question count and a time limit. The
                    paper comes back marked.
                  </p>

                  {subjectsLoading ? (
                    <div className="mt-5 flex items-center gap-2 text-[0.8125rem] text-ink-quiet">
                      <Loader2
                        className="animate-spin"
                        size={13}
                        aria-hidden="true"
                      />
                      Loading subjects…
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {(subjects ?? []).slice(0, 6).map((s) => (
                        <span
                          key={s.id}
                          className="rounded-md border border-rule bg-sheet px-2 py-1 text-[0.6875rem] font-medium text-ink-soft"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/setup"
                    className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-exam text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-well"
                  >
                    Start a paper
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-6 border-t border-rule pt-4">
                  <p className="text-[0.6875rem] leading-5 text-ink-quiet">
                    Average is calculated across every completed paper in your
                    history. Best is the highest percentage, not a separate
                    attempt.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
