"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Send,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
// import { QUIZ_META, QUESTIONS } from "./constants";
import Calculator from "./calculator";
import SubmitModal from "./submitModal";
import ResultsPage from "./result";
import LessonContent from "@/components/global/LessonContent";

export default function QuizPage() {
  const timerMiinutes = useMemo(() => {
    const timer = localStorage.getItem("quizerTimer");
    if (timer) return Number(timer);
  }, []);

  const QUIZ_META = {
    title: "Full Practice",
    subject: "Mathematics",
    totalTime: (timerMiinutes || 1) * 60, // 30 minutes in seconds
    mode: "Full Practice",
  };

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(QUIZ_META.totalTime);
  const [showCalc, setShowCalc] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const questionList = useMemo(() => {
    const questions = localStorage.getItem("quizerQuestions");
    if (questions) {
      return JSON.parse(questions) as QuestionType[];
    }
  }, []);

  const question = questionList?.[current] || ({} as QuestionType);
  // const totalQ = QUESTIONS.length;
  const totalQ = questionList?.length || 0;
  // Timer
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setTimeTaken(QUIZ_META.totalTime);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line
  }, [submitted]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timePct = (timeLeft / QUIZ_META.totalTime) * 100;
  const timerUrgent = timeLeft <= 5 * 60;

  const selectAnswer = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIdx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line
      next.has(question.id) ? next.delete(question.id) : next.add(question.id);
      return next;
    });
  };

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(Math.max(0, Math.min(totalQ - 1, idx)));
    },
    [totalQ],
  );

  const handleSubmit = () => {
    clearInterval(timerRef.current!);
    setTimeTaken(QUIZ_META.totalTime - timeLeft);
    setSubmitted(true);
    setShowSubmit(false);
  };

  const handleRetry = () => {
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(QUIZ_META.totalTime);
    setSubmitted(false);
    setTimeTaken(0);
    setCurrent(0);
  };

  if (submitted) {
    return (
      <ResultsPage
        answers={answers}
        questions={questionList!}
        timeTaken={timeTaken}
        onRetry={handleRetry}
      />
    );
  }

  const optionLabels = ["A", "B", "C", "D", "E"];

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Subject + mode */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-primary-50 shrink-0">
              <BookOpen
                size={14}
                className="text-primary-600"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                {QUIZ_META.subject}
              </p>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {QUIZ_META.title}
              </p>
            </div>
          </div>

          {/* Timer */}
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-colors shrink-0",
              timerUrgent
                ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                : "bg-slate-100 text-slate-700",
            )}
            aria-label={`Time remaining: ${mins} minutes ${secs} seconds`}
            aria-live="polite"
          >
            <Clock
              size={14}
              className={timerUrgent ? "animate-pulse" : ""}
              aria-hidden="true"
            />
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>

          {/* Progress + actions */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {Object.keys(answers).length}/{totalQ} answered
            </span>
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
              {/* <Calculator size={16} aria-hidden="true" /> */}
              Calc
            </button>
            <button
              onClick={() => setShowSubmit(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.97] transition-all"
            >
              <Send size={12} aria-hidden="true" /> Submit
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-slate-100">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              timerUrgent ? "bg-rose-400" : "bg-primary-500",
            )}
            style={{ width: `${timePct}%` }}
            role="progressbar"
            aria-valuenow={timeLeft}
            aria-valuemin={0}
            aria-valuemax={QUIZ_META.totalTime}
            aria-label="Time remaining"
          />
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Question panel */}
          <div>
            {/* Question card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              {/* Question header */}
              <div className="px-6 pt-6 pb-4 border-b border-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white text-sm font-bold shrink-0">
                      {current + 1}
                    </span>
                    <div>
                      {/* <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {question.subject}
                      </p> */}
                      <p className="text-xs text-slate-400">
                        Question {current + 1} of {totalQ}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleFlag}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                      flagged.has(question.id)
                        ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                        : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-500",
                    )}
                    aria-pressed={flagged.has(question.id)}
                    aria-label={
                      flagged.has(question.id)
                        ? "Remove flag"
                        : "Flag for review"
                    }
                  >
                    <Flag size={12} aria-hidden="true" />
                    {flagged.has(question.id) ? "Flagged" : "Flag"}
                  </button>
                </div>
              </div>
              <div className="px-6 py-6">
                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  <LessonContent content={question.question} />
                </p>
              </div>

              {/* Options */}
              <div
                className="px-6 pb-6 space-y-3"
                role="radiogroup"
                aria-label="Answer options"
              >
                {question?.option &&
                  Object.values(question.option).map((option, idx) => {
                    const selected = answers[question.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(idx)}
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
                          {optionLabels[idx]}
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

          {/* Right sidebar — question navigator */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-20">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Questions
              </h2>

              {/* Legend */}
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

              {/* Grid */}
              <div
                className="grid grid-cols-5 gap-1.5"
                role="list"
                aria-label="Question navigation"
              >
                {questionList?.map((question, idx) => {
                  const isAnswered = answers[question.id] !== undefined;
                  const isFlagged = flagged.has(question.id);
                  const isCurrent = idx === current;
                  return (
                    <button
                      key={question.id}
                      ref={(el) => {
                        questionRefs.current[idx] = el;
                      }}
                      onClick={() => goTo(idx)}
                      role="listitem"
                      aria-label={`Question ${idx + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}${isCurrent ? ", current" : ""}`}
                      aria-current={isCurrent ? "true" : undefined}
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

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                {[
                  {
                    label: "Answered",
                    value: Object.keys(answers).length,
                    color: "text-primary-600",
                  },
                  {
                    label: "Unanswered",
                    value: totalQ - Object.keys(answers).length,
                    color: "text-slate-500",
                  },
                  {
                    label: "Flagged",
                    value: flagged.size,
                    color: "text-amber-600",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-400">{s.label}</span>
                    <span className={cn("font-bold", s.color)}>{s.value}</span>
                  </div>
                ))}
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

        {/* Mobile question navigator */}
        <div className="lg:hidden mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Jump to Question
          </h2>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
            {questionList?.map((question, idx) => {
              const isAnswered = answers[question.id] !== undefined;
              const isFlagged = flagged.has(question.id);
              const isCurrent = idx === current;
              return (
                <button
                  key={question.id}
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

      {/* ── Floating calculator ── */}
      {showCalc && <Calculator onClose={() => setShowCalc(false)} />}

      {/* ── Submit modal ── */}
      {showSubmit && (
        <SubmitModal
          answers={answers}
          flagged={flagged}
          total={totalQ}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmit(false)}
        />
      )}
    </div>
  );
}
