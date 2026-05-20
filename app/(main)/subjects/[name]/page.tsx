"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Cpu,
  Network,
  Binary,
  FlaskConical,
  FunctionSquare,
  Layers,
  Zap,
  Clock,
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  Star,
  Lock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const subjects = [
  {
    id: "csc301",
    code: "CSC 301",
    name: "Data Structures",
    description:
      "Arrays, linked lists, trees, graphs and algorithmic complexity",
    icon: Binary,
    color: "violet",
    questions: 240,
    avgScore: 87,
    lastScore: 92,
    difficulty: "medium",
    sessions: 14,
    trending: true,
    locked: false,
    topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting"],
  },
  {
    id: "csc305",
    code: "CSC 305",
    name: "Operating Systems",
    description: "Process management, memory, file systems and concurrency",
    icon: Cpu,
    color: "blue",
    questions: 185,
    avgScore: 72,
    lastScore: 74,
    difficulty: "hard",
    sessions: 9,
    trending: false,
    locked: false,
    topics: ["Processes", "Threads", "Memory", "Deadlock", "File Systems"],
  },
  {
    id: "csc311",
    code: "CSC 311",
    name: "Computer Networks",
    description: "TCP/IP, routing protocols, network security and architecture",
    icon: Network,
    color: "amber",
    questions: 160,
    avgScore: 61,
    lastScore: 60,
    difficulty: "hard",
    sessions: 6,
    trending: false,
    locked: false,
    topics: ["TCP/IP", "Routing", "DNS", "HTTP", "Security"],
  },
  {
    id: "mth301",
    code: "MTH 301",
    name: "Numerical Methods",
    description: "Root finding, interpolation, numerical integration and ODEs",
    icon: FunctionSquare,
    color: "rose",
    questions: 120,
    avgScore: 55,
    lastScore: 58,
    difficulty: "hard",
    sessions: 4,
    trending: false,
    locked: false,
    topics: ["Newton-Raphson", "Bisection", "Integration", "ODEs"],
  },
  {
    id: "csc321",
    code: "CSC 321",
    name: "Software Engineering",
    description: "SDLC, design patterns, testing methodologies and agile",
    icon: Layers,
    color: "emerald",
    questions: 200,
    avgScore: 90,
    lastScore: 88,
    difficulty: "easy",
    sessions: 18,
    trending: true,
    locked: false,
    topics: ["SDLC", "Design Patterns", "Testing", "Agile", "UML"],
  },
  {
    id: "csc331",
    code: "CSC 331",
    name: "Compiler Design",
    description: "Lexical analysis, parsing, semantic analysis and code gen",
    icon: FlaskConical,
    color: "cyan",
    questions: 95,
    avgScore: 0,
    lastScore: 0,
    difficulty: "hard",
    sessions: 0,
    trending: false,
    locked: true,
    topics: ["Lexer", "Parser", "AST", "Code Generation"],
  },
];

type Difficulty = "all" | "easy" | "medium" | "hard";
type SortBy = "recent" | "score" | "questions";
type PracticeMode = "quick" | "full" | "weak";

// ── Config ───────────────────────────────────────────────────────────────────
const colorMap = {
  violet: {
    bg: "bg-violet-50",
    icon: "bg-violet-100 text-violet-600",
    badge: "bg-violet-100 text-violet-700",
    bar: "bg-violet-500",
    ring: "ring-violet-200",
    hover: "hover:ring-violet-300",
    glow: "shadow-violet-100",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    bar: "bg-blue-500",
    ring: "ring-blue-200",
    hover: "hover:ring-blue-300",
    glow: "shadow-blue-100",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    bar: "bg-amber-500",
    ring: "ring-amber-200",
    hover: "hover:ring-amber-300",
    glow: "shadow-amber-100",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "bg-rose-100 text-rose-600",
    badge: "bg-rose-100 text-rose-700",
    bar: "bg-rose-500",
    ring: "ring-rose-200",
    hover: "hover:ring-rose-300",
    glow: "shadow-rose-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "bg-emerald-100 text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    bar: "bg-emerald-500",
    ring: "ring-emerald-200",
    hover: "hover:ring-emerald-300",
    glow: "shadow-emerald-100",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "bg-cyan-100 text-cyan-600",
    badge: "bg-cyan-100 text-cyan-700",
    bar: "bg-cyan-500",
    ring: "ring-cyan-200",
    hover: "hover:ring-cyan-300",
    glow: "shadow-cyan-100",
  },
};

const difficultyLabel: Record<string, { label: string; color: string }> = {
  easy: {
    label: "Easy",
    color: "text-emerald-600 bg-emerald-50 ring-emerald-200",
  },
  medium: {
    label: "Medium",
    color: "text-amber-600 bg-amber-50 ring-amber-200",
  },
  hard: { label: "Hard", color: "text-rose-600 bg-rose-50 ring-rose-200" },
};

const practiceModes: {
  id: PracticeMode;
  label: string;
  desc: string;
  icon: React.ElementType;
  time: string;
}[] = [
  {
    id: "quick",
    label: "Quick Fire",
    desc: "10 random questions",
    icon: Zap,
    time: "~5 min",
  },
  {
    id: "full",
    label: "Full Practice",
    desc: "All topics covered",
    icon: BookOpen,
    time: "~30 min",
  },
  {
    id: "weak",
    label: "Weak Areas",
    desc: "Focus on low scores",
    icon: Target,
    time: "~15 min",
  },
];

// ── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({
  subject,
  onSelect,
}: {
  subject: (typeof subjects)[0];
  onSelect: (id: string) => void;
}) {
  const c = colorMap[subject.color as keyof typeof colorMap];
  const Icon = subject.icon;
  const diff = difficultyLabel[subject.difficulty];
  const scoreColor =
    subject.lastScore >= 80
      ? "text-emerald-600"
      : subject.lastScore >= 60
        ? "text-amber-600"
        : subject.lastScore > 0
          ? "text-rose-600"
          : "text-slate-400";

  return (
    <article
      className={cn(
        "group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5",
        subject.locked && "opacity-60 cursor-not-allowed",
      )}
      aria-label={`${subject.name} — ${subject.locked ? "locked" : "available"}`}
    >
      {/* Top accent strip */}
      <div className={cn("h-1 w-full", c.bar)} aria-hidden="true" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", c.icon)}>
            <Icon size={20} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5">
            {subject.trending && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-semibold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full"
                aria-label="Trending"
              >
                <TrendingUp size={9} aria-hidden="true" /> HOT
              </span>
            )}
            {subject.locked && (
              <Lock size={14} className="text-slate-400" aria-label="Locked" />
            )}
            <span
              className={cn(
                "text-[11px] font-semibold px-2 py-0.5 rounded-full ring-1",
                diff.color,
              )}
            >
              {diff.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-1">
          <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
            {subject.code}
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {subject.name}
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          {subject.description}
        </p>

        {/* Score bar */}
        {subject.lastScore > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Last score</span>
              <span className={cn("font-bold", scoreColor)}>
                {subject.lastScore}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  c.bar,
                )}
                style={{ width: `${subject.lastScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen size={11} aria-hidden="true" />
            {subject.questions} Qs
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} aria-hidden="true" />
            {subject.sessions} sessions
          </span>
          {subject.avgScore > 0 && (
            <span className="flex items-center gap-1">
              <Star size={11} aria-hidden="true" />
              Avg {subject.avgScore}%
            </span>
          )}
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-1 mb-4" aria-label="Topics covered">
          {subject.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                c.badge,
              )}
            >
              {t}
            </span>
          ))}
          {subject.topics.length > 3 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              +{subject.topics.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => !subject.locked && onSelect(subject.id)}
          disabled={subject.locked}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
            subject.locked
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]",
          )}
          aria-label={
            subject.locked
              ? `${subject.name} is locked`
              : `Practice ${subject.name}`
          }
        >
          {subject.locked ? (
            <>
              <Lock size={14} aria-hidden="true" /> Locked
            </>
          ) : (
            <>
              <Play size={14} aria-hidden="true" /> Practice
            </>
          )}
        </button>
      </div>
    </article>
  );
}

// ── Mode Picker Modal ─────────────────────────────────────────────────────────
function ModePicker({
  subject,
  onClose,
  onStart,
}: {
  subject: (typeof subjects)[0];
  onClose: () => void;
  onStart: (mode: PracticeMode) => void;
}) {
  const [selected, setSelected] = useState<PracticeMode>("quick");
  const c = colorMap[subject.color as keyof typeof colorMap];
  const Icon = subject.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Choose practice mode for ${subject.name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className={cn("px-6 pt-6 pb-5", c.bg)}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-2.5 rounded-xl", c.icon)}>
              <Icon size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                {subject.code}
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                {subject.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{subject.questions} questions available</span>
            <span>·</span>
            <span>{subject.topics.length} topics</span>
          </div>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Choose practice mode
          </p>

          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="Practice modes"
          >
            {practiceModes.map((mode) => {
              const MIcon = mode.icon;
              const isSelected = selected === mode.id;
              return (
                <button
                  key={mode.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelected(mode.id)}
                  className={cn(
                    "flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all duration-150 text-left",
                    isSelected
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-100 hover:border-slate-200 bg-white",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl shrink-0",
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <MIcon size={16} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {mode.label}
                    </p>
                    <p className="text-xs text-slate-400">{mode.desc}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock size={10} aria-hidden="true" /> {mode.time}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onStart(selected)}
              className="flex-[2] py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Play size={14} aria-hidden="true" />
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedSubject = subjects.find((s) => s.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    let list = [...subjects];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (difficulty !== "all")
      list = list.filter((s) => s.difficulty === difficulty);
    if (sortBy === "score") list.sort((a, b) => b.lastScore - a.lastScore);
    else if (sortBy === "questions")
      list.sort((a, b) => b.questions - a.questions);
    else list.sort((a, b) => b.sessions - a.sessions);
    return list;
  }, [search, difficulty, sortBy]);

  const handleStart = (mode: PracticeMode) => {
    // TODO: navigate to quiz session with subject + mode
    console.log("Start:", selectedId, mode);
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-sm text-primary-500 font-semibold tracking-wide uppercase mb-1">
            Practice
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Choose a subject
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">
            Pick any subject and start practising. Your progress is saved
            automatically after each session.
          </p>
        </div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm">
          {[
            {
              label: "Subjects",
              value: subjects.filter((s) => !s.locked).length,
            },
            {
              label: "Questions",
              value: subjects.reduce((a, s) => a + s.questions, 0),
            },
            {
              label: "Sessions done",
              value: subjects.reduce((a, s) => a + s.sessions, 0),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm"
            >
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search subjects or topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              aria-label="Search subjects"
            />
          </div>

          {/* Difficulty filter */}
          <div
            className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1"
            role="group"
            aria-label="Filter by difficulty"
          >
            {(["all", "easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                  difficulty === d
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-800",
                )}
                aria-pressed={difficulty === d}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto text-xs text-slate-500">
            <Filter size={12} aria-hidden="true" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
              aria-label="Sort subjects by"
            >
              <option value="recent">Recent</option>
              <option value="score">Score</option>
              <option value="questions">Questions</option>
            </select>
          </div>
        </div>

        {/* ── Results count ── */}
        <p
          className="text-xs text-slate-400 mb-4"
          aria-live="polite"
          aria-atomic="true"
        >
          {filtered.length} subject{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* ── Subject grid ── */}
        {filtered.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Available subjects"
          >
            {filtered.map((subject) => (
              <div key={subject.id} role="listitem">
                <SubjectCard subject={subject} onSelect={setSelectedId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-slate-100 rounded-2xl mb-4">
              <Search size={24} className="text-slate-400" aria-hidden="true" />
            </div>
            <p className="text-slate-700 font-semibold">No subjects found</p>
            <p className="text-slate-400 text-sm mt-1">
              Try a different search or filter
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("all");
              }}
              className="mt-4 text-sm text-primary-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Mode picker modal ── */}
      {selectedSubject && (
        <ModePicker
          subject={selectedSubject}
          onClose={() => setSelectedId(null)}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
