"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Cpu,
  Network,
  Binary,
  FunctionSquare,
  Layers,
  Clock,
  Target,
  ChevronRight,
  Play,
  Star,
  Lock,
  Filter,
  Zap,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import {
  useGetStudySubjects,
  type StudySubject,
} from "@/services/study.service";

type Difficulty = "all" | "easy" | "medium" | "hard";
type SortBy = "recent" | "score" | "questions";
type PracticeMode = "quick" | "full" | "weak";

// ── Config ───────────────────────────────────────────────────────────────────
const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const iconMap: Record<string, React.ElementType> = {
  Binary,
  Cpu,
  Network,
  FunctionSquare,
  Layers,
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
    label: "Quick fire",
    desc: "10 random questions from this subject",
    icon: Zap,
    time: "~5 min",
  },
  {
    id: "full",
    label: "Full paper",
    desc: "All topics covered, exam length",
    icon: BookOpen,
    time: "~30 min",
  },
  {
    id: "weak",
    label: "Weak areas",
    desc: "Focus on the topics you score lowest in",
    icon: Target,
    time: "~15 min",
  },
];

// ── Subject row ──────────────────────────────────────────────────────────────
function SubjectCard({
  subject,
  onSelect,
}: {
  subject: StudySubject;
  onSelect: (id: string) => void;
}) {
  const Icon = iconMap[subject.icon] ?? BookOpen;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border border-rule bg-sheet p-5 transition-colors sm:p-6",
        subject.locked ? "opacity-60" : "hover:border-ink/20",
      )}
      aria-label={`${subject.name} — ${subject.locked ? "locked" : "available"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-marker-line bg-marker-wash text-marker-ink">
          <Icon size={17} aria-hidden="true" />
        </span>
        <div className="flex items-center gap-2">
          {subject.locked && (
            <Lock size={13} className="text-ink-quiet" aria-label="Locked" />
          )}
          <span className="rounded-md border border-rule px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-widest text-ink-quiet">
            {difficultyLabel[subject.difficulty]}
          </span>
        </div>
      </div>

      <p className="eyebrow eyebrow-quiet mt-5">{subject.code}</p>
      <h3 className="mt-1.5 text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
        {subject.name}
      </h3>
      <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
        {subject.description}
      </p>

      {subject.lastScore > 0 && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-quiet">
              Last score
            </span>
            <span className="text-[0.8125rem] font-semibold tabular-nums text-ink">
              {subject.lastScore}%
            </span>
          </div>
          <div className="mt-2 h-px w-full bg-rule">
            <div
              className="h-px bg-marker"
              style={{ width: `${subject.lastScore}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.6875rem] text-ink-quiet">
        <span className="flex items-center gap-1.5 tabular-nums">
          <BookOpen size={11} aria-hidden="true" />
          {subject.questions} questions
        </span>
        <span className="flex items-center gap-1.5 tabular-nums">
          <Clock size={11} aria-hidden="true" />
          {subject.sessions} sessions
        </span>
        {subject.avgScore > 0 && (
          <span className="flex items-center gap-1.5 tabular-nums">
            <Star size={11} aria-hidden="true" />
            Avg {subject.avgScore}%
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics covered">
        {subject.topics.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md bg-well px-2 py-1 text-[0.6875rem] font-medium text-ink-quiet"
          >
            {t}
          </span>
        ))}
        {subject.topics.length > 3 && (
          <span className="rounded-md bg-well px-2 py-1 text-[0.6875rem] font-medium text-ink-quiet">
            +{subject.topics.length - 3}
          </span>
        )}
      </div>

      <button
        onClick={() => !subject.locked && onSelect(subject.id)}
        disabled={subject.locked}
        className={cn(
          "mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[0.8125rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          subject.locked
            ? "cursor-not-allowed border border-rule bg-well text-ink-quiet"
            : "bg-exam text-white hover:bg-exam-edge",
        )}
        aria-label={
          subject.locked
            ? `${subject.name} is locked`
            : `Practice ${subject.name}`
        }
      >
        {subject.locked ? (
          <>
            <Lock size={13} aria-hidden="true" /> Locked
          </>
        ) : (
          <>
            <Play size={13} aria-hidden="true" /> Practice
          </>
        )}
      </button>
    </article>
  );
}

// ── Mode picker ──────────────────────────────────────────────────────────────
function ModePicker({
  subject,
  onClose,
  onStart,
}: {
  subject: StudySubject;
  onClose: () => void;
  onStart: (mode: PracticeMode) => void;
}) {
  const [selected, setSelected] = useState<PracticeMode>("quick");
  const Icon = iconMap[subject.icon] ?? BookOpen;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-exam-deep/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Choose practice mode for ${subject.name}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-rule bg-sheet">
        <div className="border-b border-rule bg-well px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-marker-line bg-sheet text-marker-ink">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow eyebrow-quiet">{subject.code}</p>
              <h2 className="mt-1 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                {subject.name}
              </h2>
            </div>
          </div>
          <p className="mt-3 text-[0.75rem] tabular-nums text-ink-quiet">
            {subject.questions} questions available, {subject.topics.length}{" "}
            topics
          </p>
        </div>

        <div className="px-6 py-5">
          <p className="eyebrow eyebrow-quiet">Choose a mode</p>

          <div
            className="mt-3 flex flex-col gap-2"
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
                    "flex items-center gap-4 rounded-2xl border-2 p-3.5 text-left transition-colors",
                    isSelected
                      ? "border-primary-400 bg-marker-wash"
                      : "border-rule bg-sheet hover:border-ink/20",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      isSelected
                        ? "bg-primary-500 text-white"
                        : "bg-well text-ink-quiet",
                    )}
                  >
                    <MIcon size={15} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.8125rem] font-semibold text-ink">
                      {mode.label}
                    </span>
                    <span className="block text-[0.75rem] text-ink-quiet">
                      {mode.desc}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[0.6875rem] tabular-nums text-ink-quiet">
                    <Clock size={10} aria-hidden="true" /> {mode.time}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="h-10 flex-1 rounded-xl border border-rule bg-sheet text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Cancel
            </button>
            <button
              onClick={() => onStart(selected)}
              className="flex h-10 flex-2 items-center justify-center gap-2 rounded-xl bg-exam text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge"
            >
              <Play size={13} aria-hidden="true" />
              Start session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Loader ──────────────────────────────────────────────────────────
function SubjectSkeleton() {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-rule bg-sheet p-5 animate-pulse sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rule bg-well" />
        <div className="h-5 w-16 rounded-md border border-rule bg-well" />
      </div>
      <div className="mt-5 h-3 w-24 rounded bg-well" />
      <div className="mt-1.5 h-5 w-3/4 rounded bg-well" />
      <div className="mt-1.5 h-4 w-full rounded bg-well" />
      <div className="mt-4 h-4 w-1/2 rounded bg-well" />
      <div className="mt-4 flex flex-wrap gap-1.5">
        <div className="h-5 w-16 rounded bg-well" />
        <div className="h-5 w-16 rounded bg-well" />
        <div className="h-5 w-20 rounded bg-well" />
      </div>
      <div className="mt-5 h-10 w-full rounded bg-well" />
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PracticePage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: subjects, isLoading, error } = useGetStudySubjects();
  const selectedSubject = subjects?.find((s) => s.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    if (!subjects) return [];
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
  }, [subjects, search, difficulty, sortBy]);

  const handleStart = (mode: PracticeMode) => {
    // TODO: navigate to quiz session with subject + mode
    console.log("Start:", selectedId, mode);
    setSelectedId(null);
  };

  const availableCount = subjects?.filter((s) => !s.locked).length ?? 0;
  const questionCount = subjects?.reduce((a, s) => a + s.questions, 0) ?? 0;
  const sessionCount = subjects?.reduce((a, s) => a + s.sessions, 0) ?? 0;

  return (
    <PageWrapper className="bg-paper pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        {/* Page header */}
        <div className="grid gap-8 border-b border-rule pb-9 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="eyebrow text-marker-ink">Practice index</p>
            <h1 className="mt-3 max-w-xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              Choose a subject to sit.
            </h1>
            <p className="mt-3 max-w-md text-[0.875rem] leading-6 text-ink-quiet">
              Every session is marked on the server and saved to your mark book.
            </p>
          </div>

          <dl className="grid grid-cols-3 border-t border-rule md:justify-self-end md:border-t-0">
            {[
              { label: "Subjects", value: availableCount },
              { label: "Questions", value: questionCount },
              { label: "Sessions", value: sessionCount },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "pt-4 md:pt-0",
                  index > 0 && "border-l border-rule pl-5",
                )}
              >
                <dd className="text-[1.5rem] font-semibold leading-none tabular-nums tracking-[-0.02em] text-ink">
                  {stat.value}
                </dd>
                <dt className="eyebrow eyebrow-quiet mt-2">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-quiet"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search subjects or topics"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-rule bg-sheet pl-9 pr-4 text-[0.8125rem] text-ink outline-none transition-colors placeholder:text-ink-quiet focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              aria-label="Search subjects"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 text-[0.75rem] text-ink-quiet">
            <Filter size={12} aria-hidden="true" />
            <label htmlFor="sort-subjects" className="font-medium">
              Sort
            </label>
            <select
              id="sort-subjects"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="cursor-pointer rounded-md border border-rule bg-sheet px-2 py-1.5 text-[0.75rem] font-semibold text-ink-soft outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="recent">Recent</option>
              <option value="score">Score</option>
              <option value="questions">Questions</option>
            </select>
          </div>
        </div>

        <p
          className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-quiet"
          aria-live="polite"
          aria-atomic="true"
        >
          {filtered.length} subject{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {isLoading ? (
          <div
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Available subjects"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} role="listitem" className="h-full">
                <SubjectSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-rule bg-sheet px-6 py-16 text-center">
            <AlertCircle
              size={20}
              className="mx-auto text-rose-500"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-semibold text-ink">
              Could not load subjects
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-ink-quiet">
              Please try again later or check your connection.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-rule bg-sheet px-4 py-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Retry
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label="Available subjects"
          >
            {filtered.map((subject) => (
              <div key={subject.id} role="listitem" className="h-full">
                <SubjectCard subject={subject} onSelect={setSelectedId} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-rule bg-sheet px-6 py-16 text-center">
            <Search
              size={20}
              className="mx-auto text-ink-quiet"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-semibold text-ink">
              No subject matches that search.
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-ink-quiet">
              Try a different subject name or topic.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("all");
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-rule bg-sheet px-4 py-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Clear filters
              <ChevronRight size={13} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {selectedSubject && (
        <ModePicker
          subject={selectedSubject}
          onClose={() => setSelectedId(null)}
          onStart={handleStart}
        />
      )}
    </PageWrapper>
  );
}
