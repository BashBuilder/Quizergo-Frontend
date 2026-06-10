"use client";

import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  CalculatorIcon,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
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
  expiresAt: number | null;
  questions: SubjectGroup[];
};

// answers shape matches backend: { subject, answers: { [mockId]: "a"|"b"|"c"|"d" } }
type AnswersMap = Record<string, Record<string, string>>;

const SYNC_INTERVAL = 30_000; // 30s

export default function QuizPage() {
  const router = useRouter();

  const session = useMemo<Session | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("quizSession");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const duration = useMemo(() => {
    if (typeof window === "undefined") return 45;
    return Number(sessionStorage.getItem("quizDuration") ?? 45);
  }, []);

  const subjects = session?.questions ?? [];
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const activeGroup = subjects[activeSubjectIdx];
  const [current, setCurrent] = useState(0);

  // answers: { [subject]: { [questionId]: "a"|"b"|"c"|"d" } }
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [showCalc, setShowCalc] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastSyncedRef = useRef<AnswersMap>({});

  const question = activeGroup?.questions[current] ?? ({} as QuestionType);
  const totalQ = activeGroup?.questions.length ?? 0;

  // Switch subject — reset question index
  const switchSubject = (idx: number) => {
    setActiveSubjectIdx(idx);
    setCurrent(0);
  };

  const selectAnswer = (optionKey: string, q: QuestionType) => {
    setAnswers((prev) => ({
      ...prev,
      [activeGroup.subject]: {
        ...(prev[activeGroup.subject] ?? {}),
        [String(q.id)]: optionKey,
      },
    }));
  };

  const toggleFlag = () => {
    const key = `${activeGroup.subject}:${question.id}`;
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
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
      for (const [subject, ans] of Object.entries(answers)) {
        const lastAns = lastSyncedRef.current[subject] ?? {};
        const changed = Object.fromEntries(
          Object.entries(ans).filter(([k, v]) => lastAns[k] !== v),
        );
        if (Object.keys(changed).length) diff[subject] = changed;
      }
      if (!Object.keys(diff).length) return;

      try {
        await axios.patch(`/quiz/session/${session.sessionId}/sync`, {
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
  }, [session?.sessionId, answers, submitted]);

  const handleSubmit = async () => {
    if (!session?.sessionId) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `/quiz/session/${session.sessionId}/submit`,
        { answers: buildAnswerPayload(answers) },
      );
      sessionStorage.setItem("quizResult", JSON.stringify(res.data));
      sessionStorage.removeItem("quizSession");
      sessionStorage.removeItem("quizDuration");
      setSubmitted(true);
      setShowSubmit(false);
      router.push("/quiz/results");
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        No active session. Please set up a quiz first.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none">
              {activeGroup?.subject}
            </p>
            <p className="text-sm font-semibold text-slate-800 truncate">
              Full Practice
            </p>
          </div>

          <Timer
            submitted={submitted}
            setSubmitted={setSubmitted}
            totalTime={duration * 60}
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCalc((s) => !s)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                showCalc
                  ? "bg-primary-50 border-primary-200 text-primary-600"
                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-700",
              )}
              aria-label={showCalc ? "Hide calculator" : "Show calculator"}
              aria-pressed={showCalc}
            >
              <CalculatorIcon size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setShowSubmit(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all"
            >
              <Send size={12} aria-hidden="true" /> Submit
            </button>
          </div>
        </div>

        {/* Subject tabs — only shown when multiple subjects */}
        {subjects.length > 1 && (
          <div className="border-t border-slate-100 overflow-x-auto">
            <div className="flex mx-auto max-w-5xl px-4 sm:px-6">
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
                      "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all",
                      isActive
                        ? "border-slate-900 text-slate-900"
                        : "border-transparent text-slate-400 hover:text-slate-600",
                    )}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {group.subject}
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-500",
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
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Question panel */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <div className="px-6 pt-6 pb-4 border-b border-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white text-sm font-bold shrink-0">
                      {current + 1}
                    </span>
                    <p className="text-xs text-slate-400">
                      Question {current + 1} of {totalQ}
                    </p>
                  </div>
                  <button
                    onClick={toggleFlag}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                      flagged.has(`${activeGroup?.subject}:${question.id}`)
                        ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                        : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-500",
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

              <div className="px-6 py-6">
                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  <LessonContent content={question.question} />
                </p>
              </div>

              <div
                className="px-6 pb-6 space-y-3"
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
                        role="radio"
                        aria-checked={selected}
                        className={cn(
                          "w-full flex items-start gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-150 group",
                          selected
                            ? "border-primary-500 bg-primary-50"
                            : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white",
                        )}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 mt-0.5 transition-colors",
                            selected
                              ? "bg-primary-500 text-white"
                              : "bg-white text-slate-500 border border-slate-200 group-hover:border-slate-300",
                          )}
                        >
                          {optKey}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-relaxed pt-0.5 transition-colors",
                            selected
                              ? "text-primary-800 font-medium"
                              : "text-slate-700",
                          )}
                        >
                          <LessonContent content={option as string} />
                        </span>
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous question"
              >
                <ChevronLeft size={16} aria-hidden="true" /> Previous
              </button>

              <button
                onClick={() => setShowSubmit(true)}
                className="sm:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                <Send size={12} /> Submit
              </button>

              <button
                onClick={() => goTo(current + 1)}
                disabled={current === totalQ - 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                aria-label="Next question"
              >
                Next <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Sidebar navigator */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-20">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Questions
              </h2>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                {[
                  { color: "bg-slate-100", label: "Not visited" },
                  { color: "bg-primary-500", label: "Answered" },
                  { color: "bg-amber-400", label: "Flagged" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span
                      className={cn("w-2.5 h-2.5 rounded-sm", l.color)}
                      aria-hidden="true"
                    />
                    <span className="text-[10px] text-slate-400">
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="grid grid-cols-5 gap-1.5"
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
                        "w-full aspect-square flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-150",
                        isCurrent
                          ? "ring-2 ring-slate-900 ring-offset-1 bg-slate-900 text-white scale-105"
                          : isFlagged
                            ? "bg-amber-400 text-white hover:bg-amber-500"
                            : isAnswered
                              ? "bg-primary-500 text-white hover:bg-primary-600"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Per-subject summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {subjects.map((group) => {
                  const answered = Object.keys(
                    answers[group.subject] ?? {},
                  ).length;
                  const total = group.questions.length;
                  return (
                    <div
                      key={group.subject}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-400 truncate max-w-35">
                        {group.subject}
                      </span>
                      <span className="font-bold text-primary-600">
                        {answered}/{total}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowSubmit(true)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={12} aria-hidden="true" /> Submit Quiz
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile navigator */}
        <div className="lg:hidden mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Jump to Question
          </h2>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
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
                    "aspect-square flex items-center justify-center text-xs font-bold rounded-lg transition-all",
                    isCurrent
                      ? "ring-2 ring-slate-900 bg-slate-900 text-white"
                      : isFlagged
                        ? "bg-amber-400 text-white"
                        : isAnswered
                          ? "bg-primary-500 text-white"
                          : "bg-slate-100 text-slate-500",
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
