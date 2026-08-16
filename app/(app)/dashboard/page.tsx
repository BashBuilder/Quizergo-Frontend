"use client";
import React from "react";
import Link from "next/link";
import {
  Trophy,
  Target,
  ListChecks,
  ArrowRight,
  Calendar,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import { useAuth } from "@/hooks/auth";
import { useGetQuizHistory, type QuizResultSummary } from "@/services/quiz.service";
import { useGetSubjects } from "@/services/question.service";

// ── Helpers ──────────────────────────────────────────────────────────────
function pct(entry: QuizResultSummary) {
  return entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
}

function formatRelativeDate(iso: string) {
  const date = new Date(iso);
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

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
      <div className={cn("p-2.5 rounded-xl shrink-0", accent)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
      </div>
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

  const trend = [...recent].reverse().slice(-6);

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-primary-500 font-semibold tracking-wide uppercase mb-1">
              Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user?.firstName || ""}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              A look at every quiz you&apos;ve taken so far.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
            <Calendar size={15} className="text-slate-400" aria-hidden="true" />
            <span className="text-sm text-slate-600 font-medium">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>

        {historyLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
            <Loader2 className="animate-spin" size={22} aria-hidden="true" />
            <p className="text-sm">Loading your progress...</p>
          </div>
        ) : historyError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-4">
            <AlertCircle size={26} className="text-rose-400" aria-hidden="true" />
            <p className="text-sm text-slate-500 max-w-sm">
              Couldn&apos;t load your quiz history. Try again in a moment.
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors rounded-xl px-4 py-2"
            >
              Try again
            </button>
          </div>
        ) : quizzesTaken === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center px-4">
            <div className="p-3 rounded-2xl bg-primary-50">
              <Target size={26} className="text-primary-500" aria-hidden="true" />
            </div>
            <p className="text-base font-semibold text-slate-800">
              No quizzes yet
            </p>
            <p className="text-sm text-slate-500 max-w-sm">
              Take your first quiz and your progress will show up here.
            </p>
            <Link
              href="/setup"
              className="mt-1 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors rounded-xl px-4 py-2.5 flex items-center gap-1.5"
            >
              Start a quiz <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Stat cards ── */}
            <section
              aria-label="Key stats"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
            >
              <StatCard
                icon={<ListChecks size={18} className="text-primary-600" aria-hidden="true" />}
                label="Quizzes taken"
                value={quizzesTaken}
                accent="bg-primary-50"
              />
              <StatCard
                icon={<Target size={18} className="text-emerald-600" aria-hidden="true" />}
                label="Average score"
                value={`${averageScore}%`}
                accent="bg-emerald-50"
              />
              <StatCard
                icon={<Trophy size={18} className="text-amber-500" aria-hidden="true" />}
                label="Best score"
                value={`${bestScore}%`}
                accent="bg-amber-50"
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left col */}
              <div className="lg:col-span-2 flex flex-col gap-5">
                {trend.length > 1 && (
                  <section aria-label="Recent scores">
                    <h2 className="text-base font-semibold text-slate-800 mb-3">
                      Recent scores
                    </h2>
                    <div
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-end gap-3"
                      role="img"
                      aria-label="Recent quiz scores chart"
                    >
                      {trend.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex-1 flex flex-col items-center gap-1.5"
                        >
                          <span className="text-[11px] font-semibold text-slate-500">
                            {pct(entry)}%
                          </span>
                          <div className="w-full h-24 rounded-md bg-slate-100 flex items-end overflow-hidden">
                            <div
                              className="w-full rounded-md bg-primary-500 transition-all duration-500"
                              style={{ height: `${Math.max(pct(entry), 4)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section aria-label="Recent quizzes">
                  <h2 className="text-base font-semibold text-slate-800 mb-3">
                    Recent quizzes
                  </h2>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                    {recent.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between px-5 py-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {entry.score}/{entry.total} correct
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {formatRelativeDate(entry.submittedAt)} ·{" "}
                            {formatTime(entry.timeTaken)}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary-600 shrink-0">
                          {pct(entry)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right col — quick start */}
              <div className="flex flex-col gap-5">
                <section aria-label="Start a new quiz">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-primary-500" aria-hidden="true" />
                    Start a new quiz
                  </h2>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-sm text-slate-500 mb-4">
                      Pick your subjects, set a time limit, and get instant
                      results with a full answer review.
                    </p>
                    {subjectsLoading ? (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Loader2 className="animate-spin" size={14} aria-hidden="true" />
                        Loading subjects...
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(subjects ?? []).slice(0, 6).map((s) => (
                          <span
                            key={s.id}
                            className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href="/setup"
                      className="w-full text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors rounded-xl py-2.5 flex items-center justify-center gap-1.5"
                    >
                      Start a quiz <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
