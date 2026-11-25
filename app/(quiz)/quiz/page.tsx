"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  CalculatorIcon,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  Send,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Calculator from "./calculator";
import SubmitModal from "./submitModal";
import LessonContent from "@/components/global/LessonContent";
import Timer from "./timer";
import axios from "@/config/axios";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────
type SubjectGroup = {
  subject: string;
  questions: QuestionType[];
};

type Session = {
  sessionId: string;
  totalQuestions: number;
  duration: number | null;
  expiresAt: number | string | null;
  questions: SubjectGroup[];
};

// answers shape matches backend: { subject, answers: { [mockId]: "a"|"b"|"c"|"d" } }
type AnswersMap = Record<string, Record<string, string>>;

// ── Session storage ────────────────────────────────────────────────────────
const SESSION_KEY = "quizSession";
const DURATION_KEY = "quizDuration";
const DEADLINE_KEY = "quizDeadline";
const ANSWERS_KEY = "quizAnswers";
const FLAGS_KEY = "quizFlags";
const RESULT_KEY = "quizResult";

const SYNC_INTERVAL = 30_000; // 30s

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode / quota). The exam still works.
  }
}

/**
 * Backends disagree about units, so accept epoch seconds, epoch milliseconds
 * or an ISO date, and discard anything that is not plausibly this session.
 */
function normalizeExpiry(raw: Session["expiresAt"]): number | null {
  if (raw === null || raw === undefined) return null;

  let ms: number | null = null;
  if (typeof raw === "string") {
    const parsed = Date.parse(raw);
    // A parsed date before 2000 is not a real session expiry.
    ms = Number.isNaN(parsed) || parsed < 946_684_800_000 ? null : parsed;
  } else if (typeof raw === "number" && Number.isFinite(raw)) {
    // Below 1e9 this is a duration, not an epoch timestamp.
    if (raw < 1_000_000_000) {
      ms = null;
    } else {
      ms = raw < 1_000_000_000_000 ? raw * 1000 : raw;
    }
  }

  if (ms === null) return null;

  // Absurdly far future values are a broken contract, not a long exam.
  if (ms > Date.now() + 7 * 24 * 60 * 60 * 1000) return null;
  return ms;
}

function resolveDeadline(
  session: Session | null,
  minutes: number,
): number | null {
  // A previously stored deadline wins, so refreshing does not restart the clock.
  const stored = Number(sessionStorage.getItem(DEADLINE_KEY));
  if (Number.isFinite(stored) && stored > 0) return stored;

  const fromServer = normalizeExpiry(session?.expiresAt ?? null);
  if (fromServer !== null) {
    sessionStorage.setItem(DEADLINE_KEY, String(fromServer));
    return fromServer;
  }

  if (minutes > 0) {
    const derived = Date.now() + minutes * 60_000;
    sessionStorage.setItem(DEADLINE_KEY, String(derived));
    return derived;
  }

  // 0 / invalid duration means the paper is untimed.
  return null;
}

export default function QuizPage() {
  const router = useRouter();

  const session = useMemo<Session | null>(() => {
    if (typeof window === "undefined") return null;
    return readJson<Session>(SESSION_KEY);
  }, []);

  const duration = useMemo(() => {
    if (typeof window === "undefined") return 0;
    const stored = sessionStorage.getItem(DURATION_KEY);
    if (stored !== null) {
      const parsed = Number(stored);
      if (Number.isFinite(parsed)) return parsed;
    }
    return typeof session?.duration === "number" &&
      Number.isFinite(session.duration)
      ? session.duration
      : 0;
  }, [session?.duration]);

  // The paper's real deadline. Null means no countdown.
  const [deadline] = useState<number | null>(() => {
    if (typeof window === "undefined" || !session) return null;
    return resolveDeadline(session, duration);
  });

  const subjects = session?.questions ?? [];
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const activeGroup = subjects[activeSubjectIdx];
  const [current, setCurrent] = useState(0);

  // answers: { [subject]: { [questionId]: "a"|"b"|"c"|"d" } }
  const [answers, setAnswers] = useState<AnswersMap>(() => {
    if (typeof window === "undefined") return {};
    const stored = readJson<AnswersMap>(ANSWERS_KEY);
    return stored && typeof stored === "object" ? stored : {};
  });
  // Mirror of the latest answers for the auto-submit path: a click that lands
  // in the same tick as the deadline must still make it onto the paper.
  const answersRef = useRef<AnswersMap>(answers);
  const [flagged, setFlagged] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const stored = readJson<string[]>(FLAGS_KEY);
    return new Set(Array.isArray(stored) ? stored : []);
  });
  const [showCalc, setShowCalc] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastSyncedRef = useRef<AnswersMap>({});
  const submittingRef = useRef(false);
  const submittedRef = useRef(false);

  const locked = submitted || isSubmitting;

  const question = activeGroup?.questions[current] ?? ({} as QuestionType);
  const totalQ = activeGroup?.questions.length ?? 0;

  // Switch subject — reset question index
  const switchSubject = (idx: number) => {
    setActiveSubjectIdx(idx);
    setCurrent(0);
  };

  const selectAnswer = (optionKey: string, q: QuestionType) => {
    if (locked) return;
    setAnswers((prev) => {
      const next: AnswersMap = {
        ...prev,
        [activeGroup.subject]: {
          ...(prev[activeGroup.subject] ?? {}),
          [String(q.id)]: optionKey,
        },
      };
      answersRef.current = next;
      return next;
    });
  };

  const toggleFlag = () => {
    if (locked) return;
    const key = `${activeGroup.subject}:${question.id}`;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const goTo = useCallback(
    (idx: number) => setCurrent(Math.max(0, Math.min(totalQ - 1, idx))),
    [totalQ],
  );

  // Build answers payload for backend
  const buildAnswerPayload = (src: AnswersMap) =>
    Object.entries(src).map(([subject, ans]) => ({ subject, answers: ans }));

  // Periodic sync
  useEffect(() => {
    if (!session?.sessionId || submitted) return;

    const sync = async () => {
      const diff: AnswersMap = {};
      for (const [subject, ans] of Object.entries(answersRef.current)) {
        const lastAns = lastSyncedRef.current[subject] ?? {};
        const changed = Object.fromEntries(
          Object.entries(ans).filter(([k, v]) => lastAns[k] !== v),
        );
        if (Object.keys(changed).length) diff[subject] = changed;
      }
      if (!Object.keys(diff).length) return;

      try {
        await axios.patch(`/quiz/${session.sessionId}/sync`, {
          answers: buildAnswerPayload(diff),
        });
        lastSyncedRef.current = {
          ...lastSyncedRef.current,
          ...Object.fromEntries(
            Object.entries(diff).map(([s, a]) => [
              s,
              { ...(lastSyncedRef.current[s] ?? {}), ...a },
            ]),
          ),
        };
      } catch {
        // silent — answers safe in local state, will send on submit
      }
    };

    const timer = setInterval(sync, SYNC_INTERVAL);
    return () => clearInterval(timer);
  }, [session?.sessionId, submitted]);

  // Keep the paper on this device so a refresh restores the answers,
  // the flags and the remaining time instead of handing in a blank paper.
  useEffect(() => {
    if (typeof window === "undefined" || submitted) return;
    writeJson(ANSWERS_KEY, answers);
  }, [answers, submitted]);

  useEffect(() => {
    if (typeof window === "undefined" || submitted) return;
    writeJson(FLAGS_KEY, [...flagged]);
  }, [flagged, submitted]);

  const submitPaper = async () => {
    if (!session?.sessionId || submittingRef.current || submittedRef.current) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);
    // Guarantee the exact paper being handed in survives a refresh, even if
    // the last tap has not been committed and persisted by the effect yet.
    writeJson(ANSWERS_KEY, answersRef.current);

    try {
      const res = await axios.post(`/quiz/${session.sessionId}/submit`, {
        answers: buildAnswerPayload(answersRef.current),
      });

      submittedRef.current = true;
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(res.data));
      for (const key of [
        SESSION_KEY,
        DURATION_KEY,
        DEADLINE_KEY,
        ANSWERS_KEY,
        FLAGS_KEY,
      ]) {
        sessionStorage.removeItem(key);
      }
      setSubmitted(true);
      setShowSubmit(false);
      router.push("/result");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      const text =
        message ||
        "We couldn't hand the paper in. Your answers are still saved on this device.";
      setSubmitError(text);
      toast.error(text);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    void submitPaper();
  };

  // The clock reached zero: freeze the paper first, then hand it in.
  const handleTimeout = () => {
    setTimedOut(true);
    setSubmitted(true);
    setShowCalc(false);
    setShowSubmit(false);
    void submitPaper();
  };

  const optionLabels = ["a", "b", "c", "d", "e"];

  const totalAnswered = Object.values(answers).reduce(
    (acc, ans) => acc + Object.keys(ans).length,
    0,
  );
  const totalQuestions = subjects.reduce(
    (acc, g) => acc + g.questions.length,
    0,
  );
  const progressPct =
    totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-rule bg-sheet p-8">
          <p className="eyebrow text-marker-ink">No paper open</p>
          <h1 className="mt-3 text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
            There is no session to sit.
          </h1>
          <p className="mt-2 text-[0.875rem] leading-6 text-ink-quiet">
            A paper only exists after you set one up. Your saved history is
            still in the mark book.
          </p>
          <div className="mt-6 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row">
            <Link
              href="/setup"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge"
            >
              Set up a paper
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-rule bg-sheet px-5 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well"
            >
              Open mark book
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-rule bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow truncate text-marker-ink">
              {activeGroup?.subject}
            </p>
            <p className="mt-1 text-[0.75rem] font-medium tabular-nums text-ink-quiet">
              Question {current + 1} of {totalQ}
            </p>
          </div>

          <Timer
            deadline={deadline}
            submitted={submitted}
            onExpire={handleTimeout}
          />

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setShowCalc((s) => !s)}
              disabled={locked}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40",
                showCalc
                  ? "border-marker-line bg-marker-wash text-marker-ink"
                  : "border-rule bg-sheet text-ink-quiet hover:text-ink",
              )}
              aria-label={showCalc ? "Hide calculator" : "Show calculator"}
              aria-pressed={showCalc}
            >
              <CalculatorIcon size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowSubmit(true)}
              disabled={locked}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-exam px-3 text-[0.75rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
              ) : (
                <Send size={12} aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isSubmitting ? "Submitting…" : "Submit"}
              </span>
            </button>
          </div>
        </div>

        {/* The progress rule */}
        <div
          className="h-0.5 w-full bg-well"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
          aria-label={`${totalAnswered} of ${totalQuestions} questions answered`}
        >
          <div
            className="h-full bg-marker"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Subject tabs — only shown when multiple subjects */}
        {subjects.length > 1 && (
          <div className="overflow-x-auto border-t border-rule">
            <div className="mx-auto flex max-w-5xl px-4 sm:px-6">
              {subjects.map((group, idx) => {
                const answered = Object.keys(
                  answers[group.subject] ?? {},
                ).length;
                const isActive = idx === activeSubjectIdx;
                return (
                  <button
                    key={group.subject}
                    onClick={() => switchSubject(idx)}
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
                      {answered}/{group.questions.length}
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
        <h1 className="sr-only">
          Timed paper: {activeGroup?.subject ?? "practice"}
        </h1>

        {timedOut && (
          <div
            role="alert"
            className={cn(
              "mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5",
              submitError
                ? "border-rose-200 bg-rose-50"
                : "border-amber-200 bg-amber-50",
            )}
          >
            {isSubmitting ? (
              <Loader2
                size={16}
                className="mt-0.5 shrink-0 animate-spin text-ink-quiet"
                aria-hidden="true"
              />
            ) : (
              <TriangleAlert
                size={16}
                className={cn(
                  "mt-0.5 shrink-0",
                  submitError ? "text-rose-600" : "text-amber-600",
                )}
                aria-hidden="true"
              />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-[0.8125rem] font-semibold leading-5",
                  submitError ? "text-rose-800" : "text-amber-900",
                )}
              >
                {submitError
                  ? "Time's up. The paper is locked, but handing it in failed."
                  : isSubmitting
                    ? "Time's up. Handing your paper in…"
                    : "Time's up. Your paper is locked."}
              </p>
              <p
                className={cn(
                  "mt-1 text-[0.75rem] leading-5",
                  submitError ? "text-rose-700" : "text-amber-800",
                )}
              >
                {submitError
                  ? `${submitError} Your answers are saved on this device.`
                  : "Answers can no longer be changed. The marked result opens as soon as the server responds."}
              </p>
            </div>
            {submitError && (
              <div className="flex shrink-0 flex-col items-end gap-2 self-center">
                <button
                  type="button"
                  onClick={() => void submitPaper()}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-[0.75rem] font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
                >
                  Try again
                </button>
                <Link
                  href="/dashboard"
                  className="text-[0.6875rem] font-semibold text-rose-700 underline decoration-rose-300 underline-offset-2 hover:decoration-rose-700"
                >
                  Mark book
                </Link>
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Question panel */}
          <div>
            <div className="mb-4 overflow-hidden rounded-3xl border border-rule bg-sheet">
              <div className="border-b border-rule px-5 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-exam text-[0.8125rem] font-semibold tabular-nums text-white">
                      {current + 1}
                    </span>
                    <p className="text-[0.75rem] tabular-nums text-ink-quiet">
                      Question {current + 1} of {totalQ}
                    </p>
                  </div>
                  <button
                    onClick={toggleFlag}
                    disabled={locked}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.75rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
                      flagged.has(`${activeGroup?.subject}:${question.id}`)
                        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        : "bg-well text-ink-quiet hover:text-ink",
                    )}
                    aria-pressed={flagged.has(
                      `${activeGroup?.subject}:${question.id}`,
                    )}
                    aria-label={
                      flagged.has(`${activeGroup?.subject}:${question.id}`)
                        ? "Remove flag"
                        : "Flag for review"
                    }
                  >
                    <Flag size={12} aria-hidden="true" />
                    {flagged.has(`${activeGroup?.subject}:${question.id}`)
                      ? "Flagged"
                      : "Flag"}
                  </button>
                </div>
              </div>

              <div className="px-5 py-6 sm:px-6">
                <div className="text-[1.0625rem] font-medium leading-7 text-ink">
                  <LessonContent content={question.question} />
                </div>
              </div>

              <div
                className="space-y-2.5 px-5 pb-6 sm:px-6"
                role="radiogroup"
                aria-label="Answer options"
              >
                {question?.option &&
                  Object.values(question.option).map((option, idx) => {
                    const optKey = optionLabels[idx];
                    const selected =
                      answers[activeGroup?.subject]?.[String(question.id)] ===
                      optKey;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(optKey, question)}
                        disabled={locked}
                        role="radio"
                        aria-checked={selected}
                        className={cn(
                          "group flex w-full items-start gap-4 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-75",
                          selected
                            ? "border-primary-400 bg-marker-wash"
                            : "border-slate-100 bg-answer hover:border-slate-200 hover:bg-sheet",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[0.6875rem] font-semibold uppercase transition-colors",
                            selected
                              ? "bg-primary-500 text-white"
                              : "border border-rule bg-sheet text-ink-quiet group-hover:border-rule",
                          )}
                        >
                          {optKey}
                        </span>
                        <div
                          className={cn(
                            "pt-0.5 text-[0.875rem] leading-6 transition-colors",
                            selected
                              ? "font-medium text-primary-950"
                              : "text-ink-soft",
                          )}
                        >
                          <LessonContent content={option as string} compact />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                className="flex h-10 items-center gap-2 rounded-xl border border-rule bg-sheet px-4 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous question"
              >
                <ChevronLeft size={15} aria-hidden="true" /> Previous
              </button>

              <button
                onClick={() => goTo(current + 1)}
                disabled={current === totalQ - 1}
                className="flex h-10 items-center gap-2 rounded-xl bg-exam px-5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next question"
              >
                Next <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Sidebar navigator */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-rule bg-sheet p-5">
              <h2 className="eyebrow eyebrow-quiet">Questions</h2>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {[
                  { color: "bg-well", label: "Untouched" },
                  { color: "bg-primary-500", label: "Answered" },
                  { color: "bg-amber-400", label: "Flagged" },
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
                className="mt-4 grid grid-cols-5 gap-1.5"
                role="list"
                aria-label="Question navigation"
              >
                {activeGroup?.questions.map((q, idx) => {
                  const isAnswered =
                    !!answers[activeGroup.subject]?.[String(q.id)];
                  const isFlagged = flagged.has(
                    `${activeGroup.subject}:${q.id}`,
                  );
                  const isCurrent = idx === current;
                  return (
                    <button
                      key={q.id}
                      ref={(el) => {
                        questionRefs.current[idx] = el;
                      }}
                      onClick={() => goTo(idx)}
                      role="listitem"
                      aria-current={isCurrent ? "true" : undefined}
                      aria-label={`Question ${idx + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                      className={cn(
                        "flex aspect-square w-full items-center justify-center rounded-lg text-[0.75rem] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                        isCurrent
                          ? "bg-exam text-white ring-2 ring-exam ring-offset-2 ring-offset-sheet"
                          : isFlagged
                            ? "bg-amber-400 text-exam hover:bg-amber-500"
                            : isAnswered
                              ? "bg-primary-500 text-white hover:bg-primary-600"
                              : "bg-well text-ink-quiet hover:bg-rule",
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Per-subject summary */}
              <div className="mt-5 space-y-2 border-t border-rule pt-4">
                {subjects.map((group) => {
                  const answered = Object.keys(
                    answers[group.subject] ?? {},
                  ).length;
                  const total = group.questions.length;
                  return (
                    <div
                      key={group.subject}
                      className="flex items-center justify-between gap-3 text-[0.75rem]"
                    >
                      <span className="max-w-35 truncate text-ink-quiet">
                        {group.subject}
                      </span>
                      <span className="font-semibold tabular-nums text-ink">
                        {answered}/{total}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowSubmit(true)}
                disabled={locked}
                className="mt-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-exam text-[0.75rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={12} aria-hidden="true" /> Submit paper
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile navigator */}
        <div className="mt-6 rounded-2xl border border-rule bg-sheet p-5 lg:hidden">
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow eyebrow-quiet">Jump to a question</h2>
            <span className="text-[0.6875rem] tabular-nums text-ink-quiet">
              {totalAnswered}/{totalQuestions} answered
            </span>
          </div>
          <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10">
            {activeGroup?.questions.map((q, idx) => {
              const isAnswered = !!answers[activeGroup.subject]?.[String(q.id)];
              const isFlagged = flagged.has(`${activeGroup.subject}:${q.id}`);
              const isCurrent = idx === current;
              return (
                <button
                  key={q.id}
                  onClick={() => goTo(idx)}
                  aria-label={`Question ${idx + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg text-[0.75rem] font-semibold tabular-nums transition-colors",
                    isCurrent
                      ? "bg-exam text-white ring-2 ring-exam ring-offset-1"
                      : isFlagged
                        ? "bg-amber-400 text-exam"
                        : isAnswered
                          ? "bg-primary-500 text-white"
                          : "bg-well text-ink-quiet",
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}
      {showSubmit && (
        <SubmitModal
          answers={answers}
          subjects={subjects}
          flagged={flagged}
          totalQuestions={totalQuestions}
          totalAnswered={totalAnswered}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmit(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
