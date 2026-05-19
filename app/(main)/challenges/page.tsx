"use client";
import React, { useState } from "react";
import {
  Swords,
  Trophy,
  Flame,
  Star,
  Clock,
  Search,
  ChevronRight,
  Zap,
  Shield,
  Crown,
  Target,
  CheckCircle2,
  Lock,
  Send,
  Users,
  CalendarDays,
  TrendingUp,
  Award,
  Circle,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "daily" | "duel" | "achievements";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const dailyChallenges = [
  {
    id: 1,
    title: "Data Structures Sprint",
    subject: "CSC 301",
    description: "Answer 15 questions on trees and graphs within 10 minutes",
    difficulty: "medium",
    xp: 120,
    time: "10 min",
    questions: 15,
    done: false,
    expires: "11h 42m",
    icon: Zap,
    color: "violet",
  },
  {
    id: 2,
    title: "OS Gauntlet",
    subject: "CSC 305",
    description: "Survive 20 OS questions without using hints",
    difficulty: "hard",
    xp: 200,
    time: "15 min",
    questions: 20,
    done: false,
    expires: "11h 42m",
    icon: Shield,
    color: "blue",
  },
  {
    id: 3,
    title: "Morning Warm-up",
    subject: "CSC 321",
    description: "Start your day with 5 quick Software Engineering questions",
    difficulty: "easy",
    xp: 50,
    time: "3 min",
    questions: 5,
    done: true,
    expires: "11h 42m",
    icon: Flame,
    color: "emerald",
  },
  {
    id: 4,
    title: "Network Deep Dive",
    subject: "CSC 311",
    description: "Master TCP/IP with 12 focused questions",
    difficulty: "hard",
    xp: 180,
    time: "12 min",
    questions: 12,
    done: false,
    expires: "11h 42m",
    icon: Target,
    color: "amber",
  },
];

const weeklyQuiz = {
  title: "Week 19 — Mixed Bag",
  description:
    "50 questions across all your enrolled subjects. Top 3 win bonus XP.",
  xp: 500,
  bonusXp: 1000,
  participants: 87,
  timeLeft: "2d 14h",
  questions: 50,
  topScorers: [
    { name: "Chukwuemeka O.", score: 96, rank: 1 },
    { name: "Fatimah A.", score: 94, rank: 2 },
    { name: "David I.", score: 91, rank: 3 },
  ],
};

const peers = [
  {
    id: "u1",
    name: "Chukwuemeka O.",
    level: "300L",
    avgScore: 91,
    streak: 18,
    online: true,
    avatar: "CO",
  },
  {
    id: "u2",
    name: "Fatimah Aliyu",
    level: "300L",
    avgScore: 88,
    streak: 9,
    online: true,
    avatar: "FA",
  },
  {
    id: "u3",
    name: "David Ikenna",
    level: "300L",
    avgScore: 85,
    streak: 14,
    online: false,
    avatar: "DI",
  },
  {
    id: "u4",
    name: "Ngozi Eze",
    level: "300L",
    avgScore: 79,
    streak: 5,
    online: true,
    avatar: "NE",
  },
  {
    id: "u5",
    name: "Seun Adeyemi",
    level: "300L",
    avgScore: 76,
    streak: 3,
    online: false,
    avatar: "SA",
  },
  {
    id: "u6",
    name: "Amaka Obi",
    level: "300L",
    avgScore: 72,
    streak: 7,
    online: true,
    avatar: "AO",
  },
];

const activeDuels = [
  {
    id: "d1",
    opponent: "Fatimah Aliyu",
    avatar: "FA",
    subject: "Data Structures",
    myScore: 88,
    theirScore: 92,
    status: "lost",
    time: "2h ago",
  },
  {
    id: "d2",
    opponent: "David Ikenna",
    avatar: "DI",
    subject: "Software Engineering",
    myScore: 95,
    theirScore: 82,
    status: "won",
    time: "Yesterday",
  },
  {
    id: "d3",
    opponent: "Ngozi Eze",
    avatar: "NE",
    subject: "OS",
    myScore: null,
    theirScore: null,
    status: "pending",
    time: "Waiting…",
  },
];

const achievements = [
  {
    id: "a1",
    title: "First Blood",
    description: "Complete your first quiz session",
    icon: Zap,
    color: "violet",
    xp: 50,
    earned: true,
    earnedDate: "May 1",
    rarity: "common",
  },
  {
    id: "a2",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: Flame,
    color: "orange",
    xp: 150,
    earned: true,
    earnedDate: "May 8",
    rarity: "rare",
  },
  {
    id: "a3",
    title: "Duel Master",
    description: "Win 5 user duels in a row",
    icon: Swords,
    color: "blue",
    xp: 300,
    earned: false,
    progress: 3,
    total: 5,
    rarity: "epic",
  },
  {
    id: "a4",
    title: "Century Club",
    description: "Score 100% on any quiz",
    icon: Crown,
    color: "amber",
    xp: 500,
    earned: false,
    progress: 0,
    total: 1,
    rarity: "legendary",
  },
  {
    id: "a5",
    title: "Scholar",
    description: "Reach 5,000 total XP",
    icon: BookOpen,
    color: "emerald",
    xp: 200,
    earned: false,
    progress: 3840,
    total: 5000,
    rarity: "rare",
  },
  {
    id: "a6",
    title: "Top Gun",
    description: "Rank #1 on the weekly leaderboard",
    icon: Trophy,
    color: "rose",
    xp: 1000,
    earned: false,
    progress: 0,
    total: 1,
    rarity: "legendary",
  },
  {
    id: "a7",
    title: "Speed Demon",
    description: "Finish a 20-question quiz in under 5 minutes",
    icon: Clock,
    color: "cyan",
    xp: 250,
    earned: true,
    earnedDate: "May 12",
    rarity: "epic",
  },
  {
    id: "a8",
    title: "All-Rounder",
    description: "Score above 70% in every enrolled subject",
    icon: Star,
    color: "amber",
    xp: 400,
    earned: false,
    progress: 2,
    total: 5,
    rarity: "epic",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const colorMap: Record<
  string,
  { bg: string; icon: string; bar: string; border: string }
> = {
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    bar: "bg-violet-500",
    border: "border-violet-200",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    bar: "bg-blue-500",
    border: "border-blue-200",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    bar: "bg-amber-500",
    border: "border-amber-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    bar: "bg-emerald-500",
    border: "border-emerald-200",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
    bar: "bg-orange-500",
    border: "border-orange-200",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-600",
    bar: "bg-rose-500",
    border: "border-rose-200",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "bg-cyan-100 text-cyan-600",
    bar: "bg-cyan-500",
    border: "border-cyan-200",
  },
};

const difficultyStyle: Record<string, string> = {
  easy: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  medium: "text-amber-600 bg-amber-50 ring-amber-200",
  hard: "text-rose-600 bg-rose-50 ring-rose-200",
};

const rarityStyle: Record<
  string,
  { label: string; color: string; glow: string }
> = {
  common: { label: "Common", color: "text-slate-500 bg-slate-100", glow: "" },
  rare: {
    label: "Rare",
    color: "text-blue-600 bg-blue-50 ring-blue-200",
    glow: "shadow-blue-100",
  },
  epic: {
    label: "Epic",
    color: "text-violet-600 bg-violet-50 ring-violet-200",
    glow: "shadow-violet-100",
  },
  legendary: {
    label: "Legendary",
    color: "text-amber-600 bg-amber-50 ring-amber-200",
    glow: "shadow-amber-100",
  },
};

// ── Challenge Card ────────────────────────────────────────────────────────────
function DailyCard({ ch }: { ch: (typeof dailyChallenges)[0] }) {
  const c = colorMap[ch.color];
  const Icon = ch.icon;
  return (
    <article
      className={cn(
        "group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200",
        ch.done ? "opacity-60" : "hover:shadow-lg hover:-translate-y-0.5",
      )}
      aria-label={`${ch.title}${ch.done ? " — completed" : ""}`}
    >
      <div className={cn("h-1 w-full", c.bar)} aria-hidden="true" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", c.icon)}>
            <Icon size={18} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5">
            {ch.done ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-200">
                <CheckCircle2 size={10} aria-hidden="true" /> Done
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock size={10} aria-hidden="true" /> {ch.expires}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1",
                    difficultyStyle[ch.difficulty],
                  )}
                >
                  {ch.difficulty}
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">
          {ch.subject}
        </p>
        <h3 className="text-base font-bold text-slate-900 mb-1">{ch.title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          {ch.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <BookOpen size={11} aria-hidden="true" />
            {ch.questions} Qs
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {ch.time}
          </span>
          <span className="flex items-center gap-1 ml-auto font-semibold text-primary-600">
            <Zap size={11} aria-hidden="true" />+{ch.xp} XP
          </span>
        </div>

        <button
          disabled={ch.done}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2",
            ch.done
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]",
          )}
          aria-label={ch.done ? "Already completed" : `Start ${ch.title}`}
        >
          {ch.done ? (
            <>
              <CheckCircle2 size={14} aria-hidden="true" /> Completed
            </>
          ) : (
            <>
              <Zap size={14} aria-hidden="true" /> Start Challenge
            </>
          )}
        </button>
      </div>
    </article>
  );
}

// ── Duel Modal ────────────────────────────────────────────────────────────────
function DuelModal({
  peer,
  onClose,
}: {
  peer: (typeof peers)[0];
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("CSC 301");
  const [questions, setQuestions] = useState("10");
  const subjects = ["CSC 301", "CSC 305", "CSC 311", "MTH 301", "CSC 321"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Challenge ${peer.name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-6 pb-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 text-lg font-bold">
              {peer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-0.5">
                Challenge
              </p>
              <p className="text-lg font-bold truncate">{peer.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-white/50">{peer.level}</span>
                <span className="text-xs text-white/50">·</span>
                <span className="text-xs text-white/60">
                  Avg {peer.avgScore}%
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <Swords size={24} className="text-white/30" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="px-6 py-5 -mt-2">
          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold text-slate-600 mb-1.5"
                htmlFor="duel-subject"
              >
                Subject
              </label>
              <select
                id="duel-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white"
              >
                {subjects.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Questions
              </label>
              <div
                className="flex gap-2"
                role="group"
                aria-label="Number of questions"
              >
                {["5", "10", "20"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestions(q)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                      questions === q
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-100 text-slate-600 hover:border-slate-200",
                    )}
                    aria-pressed={questions === q}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Send size={14} aria-hidden="true" />
            Send Challenge
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            {peer.name} will be notified to accept
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Achievement Badge ─────────────────────────────────────────────────────────
function AchievementCard({ a }: { a: (typeof achievements)[0] }) {
  const c = colorMap[a.color] ?? colorMap.violet;
  const Icon = a.icon;
  const rarity = rarityStyle[a.rarity];
  const hasProgress = !a.earned && "progress" in a && a.total;
  const pct = hasProgress
    ? Math.round(((a as any).progress / (a as any).total) * 100)
    : 0;

  return (
    <article
      className={cn(
        "bg-white rounded-2xl border border-slate-100 p-4 shadow-sm transition-all duration-200",
        a.earned ? "hover:shadow-md" : "opacity-75 hover:opacity-90",
      )}
      aria-label={`${a.title} achievement — ${a.earned ? "earned" : "not yet earned"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2.5 rounded-xl relative shrink-0",
            a.earned ? c.icon : "bg-slate-100 text-slate-400",
          )}
        >
          <Icon size={18} aria-hidden="true" />
          {a.earned && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center"
              aria-hidden="true"
            >
              <CheckCircle2 size={10} className="text-white" />
            </span>
          )}
          {!a.earned && (
            <Lock
              size={10}
              className="absolute -top-1 -right-1 text-slate-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <h3 className="text-sm font-bold text-slate-800">{a.title}</h3>
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full ring-1",
                rarity.color,
              )}
            >
              {rarity.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-snug">{a.description}</p>

          {hasProgress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>
                  {(a as any).progress.toLocaleString()} /{" "}
                  {(a as any).total.toLocaleString()}
                </span>
                <span>{pct}%</span>
              </div>
              <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    c.bar,
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] font-semibold text-primary-600 flex items-center gap-0.5">
              <Zap size={10} aria-hidden="true" />+{a.xp} XP
            </span>
            {a.earned && "earnedDate" in a && (
              <span className="text-[10px] text-slate-400">
                Earned {(a as any).earnedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChallengesPage() {
  const [tab, setTab] = useState<Tab>("daily");
  const [search, setSearch] = useState("");
  const [duelTarget, setDuelTarget] = useState<(typeof peers)[0] | null>(null);

  const filteredPeers = peers.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const earnedCount = achievements.filter((a) => a.earned).length;

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ElementType;
    count?: number;
  }[] = [
    {
      id: "daily",
      label: "Daily",
      icon: CalendarDays,
      count: dailyChallenges.filter((c) => !c.done).length,
    },
    {
      id: "duel",
      label: "Duels",
      icon: Swords,
      count: activeDuels.filter((d) => d.status === "pending").length,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Award,
      count: earnedCount,
    },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Hero ── */}
        <div className="mb-8">
          <p className="text-sm text-primary-500 font-semibold tracking-wide uppercase mb-1">
            Arena
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Challenges
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">
            Daily challenges, head-to-head duels, and achievements. Compete,
            earn XP, and climb the ranks.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 w-fit mb-8"
          role="tablist"
          aria-label="Challenge sections"
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800",
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {t.label}
                {t.count !== undefined && t.count > 0 && (
                  <span
                    className={cn(
                      "text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Daily Tab ── */}
        {tab === "daily" && (
          <div id="panel-daily" role="tabpanel" aria-label="Daily challenges">
            {/* Weekly quiz banner */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-primary-900 rounded-3xl p-6 mb-8 overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-primary-300 uppercase tracking-widest">
                      Weekly Quiz
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white/50">
                      <Clock size={10} aria-hidden="true" />{" "}
                      {weeklyQuiz.timeLeft} left
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {weeklyQuiz.title}
                  </h2>
                  <p className="text-sm text-white/60 mb-3 max-w-sm">
                    {weeklyQuiz.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Users size={11} aria-hidden="true" />
                      {weeklyQuiz.participants} students
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} aria-hidden="true" />
                      {weeklyQuiz.questions} questions
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Crown size={11} aria-hidden="true" />+
                      {weeklyQuiz.bonusXp} bonus XP for top 3
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <p className="text-[11px] text-white/40 mb-2 uppercase tracking-wider">
                      Top scorers
                    </p>
                    {weeklyQuiz.topScorers.map((s) => (
                      <div
                        key={s.rank}
                        className="flex items-center gap-2 mb-1"
                      >
                        <span
                          className={cn(
                            "text-[11px] font-bold w-4",
                            s.rank === 1
                              ? "text-amber-400"
                              : s.rank === 2
                                ? "text-slate-300"
                                : "text-amber-700",
                          )}
                        >
                          #{s.rank}
                        </span>
                        <span className="text-xs text-white/70 truncate">
                          {s.name}
                        </span>
                        <span className="text-xs font-bold text-white ml-auto">
                          {s.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Zap size={14} aria-hidden="true" /> Join Quiz
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-primary-500"
                  aria-hidden="true"
                />
                Today&apos;s Challenges
                <span className="text-xs font-normal text-slate-400">
                  {dailyChallenges.filter((c) => c.done).length}/
                  {dailyChallenges.length} done
                </span>
              </h2>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={11} aria-hidden="true" /> Resets in 11h 42m
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dailyChallenges.map((ch) => (
                <DailyCard key={ch.id} ch={ch} />
              ))}
            </div>
          </div>
        )}

        {/* ── Duel Tab ── */}
        {tab === "duel" && (
          <div id="panel-duel" role="tabpanel" aria-label="Duels">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — challenge a peer */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Users
                      size={16}
                      className="text-primary-500"
                      aria-hidden="true"
                    />
                    Challenge a Classmate
                  </h2>
                </div>

                <div className="relative mb-4">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search by name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    aria-label="Search classmates"
                  />
                </div>

                <div
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50"
                  role="list"
                  aria-label="Classmates"
                >
                  {filteredPeers.map((peer) => (
                    <div
                      key={peer.id}
                      className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50/70 transition-colors"
                      role="listitem"
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                          {peer.avatar}
                        </div>
                        <span
                          className={cn(
                            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white",
                            peer.online ? "bg-emerald-400" : "bg-slate-300",
                          )}
                          aria-label={peer.online ? "Online" : "Offline"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          {peer.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{peer.level}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <TrendingUp size={10} aria-hidden="true" />
                            Avg {peer.avgScore}%
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Flame
                              size={10}
                              className="text-orange-400"
                              aria-hidden="true"
                            />
                            {peer.streak}d
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDuelTarget(peer)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all"
                        aria-label={`Challenge ${peer.name}`}
                      >
                        <Swords size={12} aria-hidden="true" /> Challenge
                      </button>
                    </div>
                  ))}
                  {filteredPeers.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-8">
                      No classmates found
                    </p>
                  )}
                </div>
              </div>

              {/* Right — active duels */}
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Swords
                    size={16}
                    className="text-primary-500"
                    aria-hidden="true"
                  />
                  Recent Duels
                </h2>
                <div className="flex flex-col gap-3">
                  {activeDuels.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
                      role="article"
                      aria-label={`Duel against ${d.opponent} — ${d.status}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                          {d.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {d.opponent}
                          </p>
                          <p className="text-xs text-slate-400">{d.subject}</p>
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-bold px-2 py-0.5 rounded-full ring-1",
                            d.status === "won"
                              ? "text-emerald-600 bg-emerald-50 ring-emerald-200"
                              : d.status === "lost"
                                ? "text-rose-600 bg-rose-50 ring-rose-200"
                                : "text-amber-600 bg-amber-50 ring-amber-200",
                          )}
                        >
                          {d.status === "pending"
                            ? "Pending"
                            : d.status === "won"
                              ? "Won"
                              : "Lost"}
                        </span>
                      </div>
                      {d.status !== "pending" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 text-center">
                            <p className="text-lg font-bold text-slate-900">
                              {d.myScore}%
                            </p>
                            <p className="text-[10px] text-slate-400">You</p>
                          </div>
                          <div className="text-xs font-bold text-slate-300">
                            VS
                          </div>
                          <div className="flex-1 text-center">
                            <p className="text-lg font-bold text-slate-900">
                              {d.theirScore}%
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {d.opponent.split(" ")[0]}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-1">
                          Waiting for opponent to accept
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 text-right mt-2">
                        {d.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Achievements Tab ── */}
        {tab === "achievements" && (
          <div
            id="panel-achievements"
            role="tabpanel"
            aria-label="Achievements"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  Your Achievements
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {earnedCount} of {achievements.length} unlocked
                </p>
              </div>
              <div
                className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(
                  (earnedCount / achievements.length) * 100,
                )}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${earnedCount} of ${achievements.length} achievements earned`}
              >
                <div
                  className="h-full rounded-full bg-primary-500 transition-all duration-700"
                  style={{
                    width: `${Math.round((earnedCount / achievements.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Earned */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle2
                  size={12}
                  className="text-emerald-500"
                  aria-hidden="true"
                />{" "}
                Earned
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements
                  .filter((a) => a.earned)
                  .map((a) => (
                    <AchievementCard key={a.id} a={a} />
                  ))}
              </div>
            </div>

            {/* In progress */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Circle
                  size={12}
                  className="text-slate-400"
                  aria-hidden="true"
                />{" "}
                In Progress
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements
                  .filter((a) => !a.earned)
                  .map((a) => (
                    <AchievementCard key={a.id} a={a} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Duel modal */}
      {duelTarget && (
        <DuelModal peer={duelTarget} onClose={() => setDuelTarget(null)} />
      )}
    </div>
  );
}
