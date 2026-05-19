"use client";
import React, { useState, useEffect } from "react";
import {
  Radio,
  Users,
  Clock,
  Calendar,
  BookOpen,
  Zap,
  ChevronRight,
  Bell,
  BellOff,
  Play,
  Lock,
  Trophy,
  Flame,
  Search,
  Filter,
  Wifi,
  WifiOff,
  Crown,
  Star,
  ArrowRight,
  CheckCircle2,
  Timer,
  X,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const liveSessions = [
  {
    id: "ls1",
    title: "Data Structures — Live Q&A",
    subject: "CSC 301",
    host: "Dr. Okafor Emmanuel",
    hostAvatar: "OE",
    participants: 43,
    maxParticipants: 60,
    status: "live",
    startedAgo: "12 min ago",
    topic: "AVL Trees & Rotation Strategies",
    color: "violet",
    xp: 80,
    difficulty: "medium",
    questions: 20,
    remaining: 14,
  },
  {
    id: "ls2",
    title: "OS Deep Dive — Deadlock",
    subject: "CSC 305",
    host: "Prof. Adeyemi Sola",
    hostAvatar: "AS",
    participants: 29,
    maxParticipants: 50,
    status: "live",
    startedAgo: "5 min ago",
    topic: "Deadlock Detection & Recovery",
    color: "blue",
    xp: 100,
    difficulty: "hard",
    questions: 25,
    remaining: 23,
  },
];

const upcomingSessions = [
  {
    id: "us1",
    title: "Computer Networks Sprint",
    subject: "CSC 311",
    host: "Dr. Babatunde K.",
    hostAvatar: "BK",
    startsIn: "2h 15m",
    date: "Today, 4:00 PM",
    color: "amber",
    xp: 90,
    difficulty: "hard",
    questions: 20,
    enrolled: true,
    participants: 18,
  },
  {
    id: "us2",
    title: "Software Engineering — SOLID",
    subject: "CSC 321",
    host: "Dr. Chinwe Obi",
    hostAvatar: "CO",
    startsIn: "Tomorrow",
    date: "Wed, 10:00 AM",
    color: "emerald",
    xp: 70,
    difficulty: "easy",
    questions: 15,
    enrolled: false,
    participants: 34,
  },
  {
    id: "us3",
    title: "Numerical Methods — Integration",
    subject: "MTH 301",
    host: "Prof. Musa Ibrahim",
    hostAvatar: "MI",
    startsIn: "2 days",
    date: "Thu, 2:00 PM",
    color: "rose",
    xp: 110,
    difficulty: "hard",
    questions: 30,
    enrolled: false,
    participants: 11,
  },
  {
    id: "us4",
    title: "Data Structures — Graphs",
    subject: "CSC 301",
    host: "Dr. Okafor Emmanuel",
    hostAvatar: "OE",
    startsIn: "3 days",
    date: "Fri, 11:00 AM",
    color: "violet",
    xp: 85,
    difficulty: "medium",
    questions: 20,
    enrolled: true,
    participants: 27,
  },
];

const pastSessions = [
  {
    id: "ps1",
    title: "TCP/IP Deep Dive",
    subject: "CSC 311",
    date: "May 15",
    score: 88,
    rank: 3,
    participants: 51,
    color: "amber",
  },
  {
    id: "ps2",
    title: "Process Scheduling",
    subject: "CSC 305",
    date: "May 13",
    score: 74,
    rank: 8,
    participants: 44,
    color: "blue",
  },
  {
    id: "ps3",
    title: "Linked Lists Blitz",
    subject: "CSC 301",
    date: "May 10",
    score: 95,
    rank: 1,
    participants: 58,
    color: "violet",
  },
];

const leaderboard = [
  { rank: 1, name: "Chukwuemeka O.", avatar: "CO", score: 96, xp: 320 },
  { rank: 2, name: "Fatimah A.", avatar: "FA", score: 94, xp: 300 },
  { rank: 3, name: "David I.", avatar: "DI", score: 91, xp: 280 },
  { rank: 4, name: "You", avatar: "AO", score: 88, xp: 240, isMe: true },
  { rank: 5, name: "Ngozi E.", avatar: "NE", score: 85, xp: 210 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const colorMap: Record<
  string,
  {
    bg: string;
    icon: string;
    bar: string;
    border: string;
    pill: string;
    dot: string;
  }
> = {
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    bar: "bg-violet-500",
    border: "border-violet-200",
    pill: "bg-violet-100 text-violet-700",
    dot: "bg-violet-400",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    bar: "bg-blue-500",
    border: "border-blue-200",
    pill: "bg-blue-100 text-blue-700",
    dot: "bg-blue-400",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    bar: "bg-amber-500",
    border: "border-amber-200",
    pill: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-500",
    border: "border-emerald-200",
    pill: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-600",
    bar: "bg-rose-500",
    border: "border-rose-200",
    pill: "bg-rose-100 text-rose-700",
    dot: "bg-rose-400",
  },
};

const diffStyle: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  medium: "text-amber-600 bg-amber-50 ring-amber-200",
  hard: "text-rose-600 bg-rose-50 ring-rose-200",
};

// ── Live pulse indicator ──────────────────────────────────────────────────────
function LivePulse() {
  return (
    <span className="relative flex items-center gap-1.5" aria-label="Live now">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
      </span>
      <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">
        Live
      </span>
    </span>
  );
}

// ── Join modal ────────────────────────────────────────────────────────────────
function JoinModal({
  session,
  onClose,
}: {
  session: (typeof liveSessions)[0];
  onClose: () => void;
}) {
  const c = colorMap[session.color];
  const fillPct = Math.round(
    (session.participants / session.maxParticipants) * 100,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Join ${session.title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Dark header */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X size={14} className="text-white" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <LivePulse />
            <span className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
              {session.subject}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{session.title}</h2>
          <p className="text-sm text-white/60 mb-4">{session.topic}</p>

          <div className="flex items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <Users size={11} aria-hidden="true" />
              {session.participants} in session
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={11} aria-hidden="true" />
              {session.remaining} Qs left
            </span>
            <span className="flex items-center gap-1 text-primary-300 font-semibold">
              <Zap size={11} aria-hidden="true" />+{session.xp} XP
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* Capacity bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Session capacity</span>
              <span className="font-semibold">
                {session.participants}/{session.maxParticipants}
              </span>
            </div>
            <div
              className="h-2 rounded-full bg-slate-100 overflow-hidden"
              role="progressbar"
              aria-valuenow={fillPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  fillPct > 80 ? "bg-rose-400" : "bg-emerald-400",
                )}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            {fillPct > 80 && (
              <p className="text-xs text-rose-500 mt-1 font-medium">
                Almost full — join quickly!
              </p>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Questions", value: `${session.remaining} left` },
              { label: "Difficulty", value: session.difficulty },
              { label: "Started", value: session.startedAgo },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-slate-50 rounded-xl p-2.5 text-center"
              >
                <p className="text-[10px] text-slate-400 mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs font-semibold text-slate-700 capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center mb-4">
            You're joining mid-session. You'll answer remaining questions and
            earn partial XP.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Play size={14} aria-hidden="true" />
            Join Session Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Countdown ticker ──────────────────────────────────────────────────────────
function CountdownBadge({ startsIn }: { startsIn: string }) {
  const isToday = startsIn.includes("h") || startsIn.includes("m");
  return (
    <span
      className={cn(
        "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
        isToday
          ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
          : "bg-slate-100 text-slate-500",
      )}
    >
      <Timer size={10} aria-hidden="true" />
      {startsIn}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LivePage() {
  const [joiningSession, setJoiningSession] = useState<
    (typeof liveSessions)[0] | null
  >(null);
  const [notified, setNotified] = useState<string[]>(["us1", "us4"]);
  const [filter, setFilter] = useState<"all" | "enrolled">("all");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const toggleNotify = (id: string) =>
    setNotified((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const filtered =
    tab === "upcoming"
      ? upcomingSessions.filter((s) => filter === "all" || s.enrolled)
      : pastSessions;

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Hero ── */}
        <div className="mb-8">
          <p className="text-sm text-primary-500 font-semibold tracking-wide uppercase mb-1 flex items-center gap-2">
            <Radio size={13} aria-hidden="true" /> Live
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Live Sessions
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">
            Join real-time quiz sessions hosted by your lecturers, compete with
            classmates, and earn bonus XP.
          </p>
        </div>

        {/* ── Active live sessions ── */}
        {liveSessions.length > 0 && (
          <section aria-label="Currently live sessions" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <LivePulse />
              <h2 className="text-base font-bold text-slate-800">
                Happening Now
              </h2>
              <span className="text-xs text-slate-400">
                {liveSessions.length} active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {liveSessions.map((s) => {
                const c = colorMap[s.color];
                const fillPct = Math.round(
                  (s.participants / s.maxParticipants) * 100,
                );
                return (
                  <article
                    key={s.id}
                    className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-xl"
                    aria-label={`Live: ${s.title}`}
                  >
                    {/* Subtle grid texture */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                      aria-hidden="true"
                    />
                    {/* Color accent blob */}
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2",
                        c.bar,
                      )}
                      aria-hidden="true"
                    />

                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <LivePulse />
                            <span className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">
                              {s.subject}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            {s.title}
                          </h3>
                          <p className="text-sm text-white/60 mt-0.5">
                            {s.topic}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-semibold px-2 py-1 rounded-lg ring-1 shrink-0 ml-3",
                            diffStyle[s.difficulty],
                          )}
                        >
                          {s.difficulty}
                        </span>
                      </div>

                      {/* Host */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70">
                          {s.hostAvatar}
                        </div>
                        <span className="text-xs text-white/50">{s.host}</span>
                        <span className="text-white/20 mx-1">·</span>
                        <span className="text-xs text-white/40">
                          Started {s.startedAgo}
                        </span>
                      </div>

                      {/* Capacity */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] text-white/40 mb-1.5">
                          <span className="flex items-center gap-1">
                            <Users size={10} aria-hidden="true" />
                            {s.participants} joined
                          </span>
                          <span>
                            {s.maxParticipants - s.participants} spots left
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              fillPct > 80 ? "bg-rose-400" : c.bar,
                            )}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-white/40">
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} aria-hidden="true" />
                            {s.remaining} Qs left
                          </span>
                          <span className="flex items-center gap-1 text-primary-300 font-semibold">
                            <Zap size={11} aria-hidden="true" />+{s.xp} XP
                          </span>
                        </div>
                        <button
                          onClick={() => setJoiningSession(s)}
                          className="flex items-center gap-2 bg-white text-slate-900 text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-100 active:scale-[0.97] transition-all"
                          aria-label={`Join ${s.title}`}
                        >
                          <Play size={13} aria-hidden="true" /> Join Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Main 3-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — schedule */}
          <div className="lg:col-span-2">
            {/* Tab bar */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1"
                role="tablist"
                aria-label="Session schedule"
              >
                {(["upcoming", "past"] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize",
                      tab === t
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-800",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tab === "upcoming" && (
                <div
                  className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1"
                  role="group"
                  aria-label="Filter sessions"
                >
                  {(["all", "enrolled"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                        filter === f
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:text-slate-800",
                      )}
                      aria-pressed={filter === f}
                    >
                      {f === "all" ? "All" : "My Sessions"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming sessions */}
            {tab === "upcoming" && (
              <div
                className="flex flex-col gap-3"
                role="list"
                aria-label="Upcoming sessions"
              >
                {(filtered as typeof upcomingSessions).length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                    <p className="text-slate-500 text-sm">No sessions found</p>
                  </div>
                )}
                {(filtered as typeof upcomingSessions).map((s) => {
                  const c = colorMap[s.color];
                  const isNotified = notified.includes(s.id);
                  return (
                    <article
                      key={s.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                      role="listitem"
                      aria-label={s.title}
                    >
                      <div
                        className={cn("h-1 w-full", c.bar)}
                        aria-hidden="true"
                      />
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Date block */}
                          <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase leading-none">
                              {s.date.split(",")[0].slice(0, 3)}
                            </span>
                            <span className="text-lg font-bold text-slate-800 leading-tight">
                              {s.date.includes("Today")
                                ? "•"
                                : s.date.split(" ")[1] || "•"}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  {s.subject}
                                </p>
                                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                  {s.title}
                                </h3>
                              </div>
                              <CountdownBadge startsIn={s.startsIn} />
                            </div>

                            <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold">
                                {s.hostAvatar}
                              </div>
                              <span>{s.host}</span>
                              <span className="text-slate-200">·</span>
                              <span>{s.date}</span>
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Users size={11} aria-hidden="true" />
                                  {s.participants}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen size={11} aria-hidden="true" />
                                  {s.questions} Qs
                                </span>
                                <span
                                  className={cn(
                                    "text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1",
                                    diffStyle[s.difficulty],
                                  )}
                                >
                                  {s.difficulty}
                                </span>
                                <span className="flex items-center gap-1 text-primary-600 font-semibold">
                                  <Zap size={11} aria-hidden="true" />+{s.xp} XP
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleNotify(s.id)}
                                  className={cn(
                                    "p-2 rounded-xl border transition-all",
                                    isNotified
                                      ? "bg-primary-50 border-primary-200 text-primary-600"
                                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-600",
                                  )}
                                  aria-label={
                                    isNotified
                                      ? "Remove reminder"
                                      : "Set reminder"
                                  }
                                  aria-pressed={isNotified}
                                >
                                  {isNotified ? (
                                    <Bell size={14} aria-hidden="true" />
                                  ) : (
                                    <BellOff size={14} aria-hidden="true" />
                                  )}
                                </button>

                                <button
                                  className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                                    s.enrolled
                                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 cursor-default"
                                      : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.97]",
                                  )}
                                  aria-label={
                                    s.enrolled
                                      ? "Already enrolled"
                                      : `Enroll in ${s.title}`
                                  }
                                >
                                  {s.enrolled ? (
                                    <>
                                      <CheckCircle2
                                        size={12}
                                        aria-hidden="true"
                                      />{" "}
                                      Enrolled
                                    </>
                                  ) : (
                                    <>
                                      Enroll{" "}
                                      <ArrowRight
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Past sessions */}
            {tab === "past" && (
              <div
                className="flex flex-col gap-3"
                role="list"
                aria-label="Past sessions"
              >
                {pastSessions.map((s) => {
                  const c = colorMap[s.color];
                  const scoreColor =
                    s.score >= 80
                      ? "text-emerald-600"
                      : s.score >= 65
                        ? "text-amber-600"
                        : "text-rose-600";
                  return (
                    <article
                      key={s.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all"
                      role="listitem"
                      aria-label={`${s.title} — scored ${s.score}%`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            c.icon,
                          )}
                        >
                          <Trophy size={16} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {s.subject}
                          </p>
                          <p className="text-sm font-bold text-slate-900">
                            {s.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {s.date} · {s.participants} participants
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={cn("text-xl font-bold", scoreColor)}>
                            {s.score}%
                          </p>
                          <p className="text-xs text-slate-400">
                            Rank #{s.rank}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", c.bar)}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — leaderboard + stats */}
          <div className="flex flex-col gap-5">
            {/* Live leaderboard */}
            <section aria-label="Live session leaderboard">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Crown
                  size={15}
                  className="text-amber-500"
                  aria-hidden="true"
                />
                Today's Top Scorers
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      entry.isMe && "bg-primary-50/60",
                    )}
                    aria-label={`Rank ${entry.rank}: ${entry.name}, score ${entry.score}%${entry.isMe ? " (you)" : ""}`}
                  >
                    <span
                      className={cn(
                        "w-6 text-center text-sm font-bold shrink-0",
                        entry.rank === 1
                          ? "text-amber-500"
                          : entry.rank === 2
                            ? "text-slate-400"
                            : entry.rank === 3
                              ? "text-amber-700"
                              : "text-slate-400",
                      )}
                    >
                      {entry.rank === 1
                        ? "🥇"
                        : entry.rank === 2
                          ? "🥈"
                          : entry.rank === 3
                            ? "🥉"
                            : `#${entry.rank}`}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 shrink-0">
                      {entry.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold truncate",
                          entry.isMe ? "text-primary-700" : "text-slate-800",
                        )}
                      >
                        {entry.name}{" "}
                        {entry.isMe && (
                          <span className="text-[10px] text-primary-400">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Zap size={9} aria-hidden="true" />+{entry.xp} XP today
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-800 shrink-0">
                      {entry.score}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* My session stats */}
            <section aria-label="My live session stats">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Star
                  size={15}
                  className="text-primary-500"
                  aria-hidden="true"
                />
                My Stats
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Sessions joined",
                    value: 8,
                    icon: Radio,
                    color: "text-primary-600 bg-primary-50",
                  },
                  {
                    label: "Avg live score",
                    value: "82%",
                    icon: Target,
                    color: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    label: "Best rank",
                    value: "#1",
                    icon: Crown,
                    color: "text-amber-600 bg-amber-50",
                  },
                  {
                    label: "XP from live",
                    value: "940",
                    icon: Zap,
                    color: "text-violet-600 bg-violet-50",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm"
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center mb-2",
                          stat.color,
                        )}
                      >
                        <Icon size={14} aria-hidden="true" />
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* No live sessions empty state */}
            {liveSessions.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <WifiOff
                    size={18}
                    className="text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No live sessions right now
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Check back later or enroll in upcoming ones below
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join modal */}
      {joiningSession && (
        <JoinModal
          session={joiningSession}
          onClose={() => setJoiningSession(null)}
        />
      )}
    </div>
  );
}
