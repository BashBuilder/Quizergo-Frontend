"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Flame,
  Trophy,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Target,
  Zap,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  subjects,
  recentSessions,
  student,
  todos,
  weeklyActivity,
  lastRead,
} from "./constant";
import PageWrapper from "@/components/global/PageWrapper";
import { useAuth } from "@/hooks/auth";

// ── Helpers ──────────────────────────────────────────────────────────────────
const subjectColors: Record<string, string> = {
  violet: "bg-violet-100 text-violet-700 border-violet-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  rose: "bg-rose-100 text-rose-700 border-rose-200",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const subjectBar: Record<string, string> = {
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-emerald-700 bg-emerald-50 ring-emerald-200"
      : score >= 65
        ? "text-amber-700 bg-amber-50 ring-amber-200"
        : "text-rose-700 bg-rose-50 ring-rose-200";
  return (
    <span
      className={cn(
        "text-xs font-semibold px-2 py-0.5 rounded-full ring-1",
        color,
      )}
    >
      {score}%
    </span>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return (
      <TrendingUp
        size={14}
        className="text-emerald-500"
        aria-label="Improving"
      />
    );
  if (trend === "down")
    return (
      <TrendingDown
        size={14}
        className="text-rose-500"
        aria-label="Declining"
      />
    );
  return <Minus size={14} className="text-slate-400" aria-label="Stable" />;
}

function PriorityDot({ priority }: { priority: string }) {
  const color =
    priority === "high"
      ? "bg-rose-400"
      : priority === "medium"
        ? "bg-amber-400"
        : "bg-slate-300";
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5",
        color,
      )}
      aria-hidden="true"
    />
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 shadow-sm">
      <div
        className={cn("p-2.5 rounded-xl shrink-0", accent ?? "bg-primary-50")}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function XPBar({ xp, xpToNext }: { xp: number; xpToNext: number }) {
  const pct = Math.round((xp / xpToNext) * 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-primary-50">
            <Zap size={18} className="text-primary-600" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">XP Progress</p>
            <p className="text-2xl font-bold text-slate-900">
              {xp.toLocaleString()}
            </p>
          </div>
        </div>
        <span className="text-xs text-slate-400">
          {xpToNext.toLocaleString()} to next level
        </span>
      </div>
      <div
        className="h-2 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% to next XP level`}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-primary-400 to-primary-600 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5 text-right">{pct}%</p>
    </div>
  );
}

function WeeklyChart() {
  const max = Math.max(...weeklyActivity.map((d) => d.sessions));
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={16} className="text-primary-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-slate-700">
          This week&apos;s activity
        </h2>
      </div>
      <div
        className="flex items-end gap-2 h-20"
        role="img"
        aria-label="Weekly activity chart"
      >
        {weeklyActivity.map((d) => {
          const heightPct = Math.round((d.sessions / max) * 100);
          const isToday = d.day === "Thu";
          return (
            <div
              key={d.day}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: 64 }}
              >
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-500",
                    isToday ? "bg-primary-500" : "bg-primary-100",
                  )}
                  style={{ height: `${heightPct}%` }}
                  title={`${d.sessions} sessions`}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isToday ? "text-primary-600" : "text-slate-400",
                )}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SummaryPage() {
  const { user, isLoading } = useAuth();
  const [completedTodos, setCompletedTodos] = useState<number[]>(
    todos.filter((t) => t.done).map((t) => t.id),
  );
  const [activeSubject, setActiveSubject] = useState<number | null>(null);

  const toggleTodo = (id: number) =>
    setCompletedTodos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const avgScore = Math.round(
    subjects.reduce((a, s) => a + s.score, 0) / subjects.length,
  );

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-primary-500 font-semibold tracking-wide uppercase mb-1">
                Summary
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Good afternoon, {user?.firstName || ""}
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm">
              <Calendar
                size={15}
                className="text-slate-400"
                aria-hidden="true"
              />
              <span className="text-sm text-slate-600 font-medium">
                {new Date().toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <section
          aria-label="Key stats"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <StatCard
            icon={
              <Star size={18} className="text-primary-600" aria-hidden="true" />
            }
            label="Avg. Score"
            value={`${avgScore}%`}
            sub="Across all subjects"
            accent="bg-primary-50"
          />
          <StatCard
            icon={
              <Flame size={18} className="text-orange-500" aria-hidden="true" />
            }
            label="Day Streak"
            value={student.streak}
            sub="Keep it going!"
            accent="bg-orange-50"
          />
          <StatCard
            icon={
              <Trophy size={18} className="text-amber-500" aria-hidden="true" />
            }
            label="Leaderboard"
            value={`#${student.rank}`}
            sub={`Top ${Math.round((student.rank / student.totalStudents) * 100)}% of class`}
            accent="bg-amber-50"
          />
          <StatCard
            icon={
              <Target
                size={18}
                className="text-emerald-600"
                aria-hidden="true"
              />
            }
            label="Sessions"
            value={subjects.reduce((a, s) => a + s.sessions, 0)}
            sub="Total completed"
            accent="bg-emerald-50"
          />
        </section>

        {/* ── XP + Activity row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <XPBar xp={student.xp} xpToNext={student.xpToNext} />
          <WeeklyChart />
        </div>

        {/* ── Main 3-col grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left col — Subjects + Sessions */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Subject performance */}
            <section aria-label="Subject performance">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <BookOpen
                    size={16}
                    className="text-primary-500"
                    aria-hidden="true"
                  />
                  Subject Performance
                </h2>
                <button className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:underline">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {subjects.map((s) => {
                  const isExpanded = activeSubject === s.id;
                  return (
                    <div key={s.id}>
                      <button
                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-50/70 transition-colors text-left"
                        onClick={() =>
                          setActiveSubject(isExpanded ? null : s.id)
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`subject-detail-${s.id}`}
                      >
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-1 rounded-lg border shrink-0",
                            subjectColors[s.color],
                          )}
                        >
                          {s.code}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-800 truncate">
                              {s.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <TrendIcon trend={s.trend} />
                              <ScoreBadge score={s.score} />
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                subjectBar[s.color],
                              )}
                              style={{ width: `${s.score}%` }}
                            />
                          </div>
                        </div>
                        <ChevronRight
                          size={14}
                          className={cn(
                            "text-slate-300 shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-90",
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && (
                        <div
                          id={`subject-detail-${s.id}`}
                          className="px-5 pb-4 bg-slate-50/60 border-t border-slate-100"
                        >
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            {[
                              { label: "Score", value: `${s.score}%` },
                              { label: "Sessions", value: s.sessions },
                              {
                                label: "Trend",
                                value:
                                  s.trend === "up"
                                    ? "↑ Improving"
                                    : s.trend === "down"
                                      ? "↓ Declining"
                                      : "→ Stable",
                              },
                            ].map((item) => (
                              <div
                                key={item.label}
                                className="bg-white rounded-xl p-3 border border-slate-100 text-center"
                              >
                                <p className="text-[11px] text-slate-400 mb-0.5">
                                  {item.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                  {item.value}
                                </p>
                              </div>
                            ))}
                          </div>
                          <button className="mt-3 w-full text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                            Practice {s.name} <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent sessions */}
            <section aria-label="Recent quiz sessions">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Clock
                    size={16}
                    className="text-primary-500"
                    aria-hidden="true"
                  />
                  Recent Sessions
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    tabIndex={0}
                    role="article"
                    aria-label={`${s.subject} session — ${s.topic}, scored ${s.score}%`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-medium">
                          {s.subject}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {s.topic}
                        </p>
                      </div>
                      <ScoreBadge score={s.score} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {s.correct}/{s.questions} correct
                      </span>
                      <span>{s.time}</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          s.score >= 80
                            ? "bg-emerald-400"
                            : s.score >= 65
                              ? "bg-amber-400"
                              : "bg-rose-400",
                        )}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right col — Last read + To-do */}
          <div className="flex flex-col gap-5">
            {/* Continue reading */}
            <section aria-label="Continue where you left off">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <TrendingUp
                  size={16}
                  className="text-primary-500"
                  aria-hidden="true"
                />
                Continue Reading
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    {lastRead.subject}
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-800 mt-2">
                  {lastRead.topic}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lastRead.chapter}
                </p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Progress</span>
                    <span>{lastRead.progress}%</span>
                  </div>
                  <div
                    className="h-2 rounded-full bg-slate-100 overflow-hidden"
                    role="progressbar"
                    aria-valuenow={lastRead.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${lastRead.progress}% through ${lastRead.topic}`}
                  >
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all duration-700"
                      style={{ width: `${lastRead.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={11} aria-hidden="true" />{" "}
                    {lastRead.estimatedTime}
                  </span>
                  <button className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1">
                    Resume <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </section>

            {/* What to do */}
            <section aria-label="Tasks and recommendations">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-primary-500"
                    aria-hidden="true"
                  />
                  What to do next
                </h2>
                <span className="text-xs text-slate-400">
                  {completedTodos.length}/{todos.length} done
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {todos.map((t) => {
                  const done = completedTodos.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50/70 transition-colors text-left group"
                      onClick={() => toggleTodo(t.id)}
                      aria-pressed={done}
                      aria-label={`${done ? "Mark incomplete" : "Mark complete"}: ${t.task}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {done ? (
                          <CheckCircle2
                            size={16}
                            className="text-primary-500"
                            aria-hidden="true"
                          />
                        ) : t.priority === "high" ? (
                          <AlertCircle
                            size={16}
                            className="text-rose-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            size={16}
                            className="text-slate-300 group-hover:text-slate-400 transition-colors"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm text-slate-700 leading-snug",
                            done && "line-through text-slate-400",
                          )}
                        >
                          {t.task}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <PriorityDot priority={t.priority} />
                          <span className="text-[11px] text-slate-400">
                            {t.due}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Completion bar */}
              <div className="mt-2 h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-400 transition-all duration-500"
                  style={{
                    width: `${Math.round((completedTodos.length / todos.length) * 100)}%`,
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
