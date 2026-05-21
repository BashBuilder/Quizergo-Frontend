"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  // Calculator as Calc,
  Clock,
  Flag,
  X,
  Delete,
  CheckCircle2,
  AlertCircle,
  Send,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Demo Data ─────────────────────────────────────────────────────────────────
const QUIZ_META = {
  title: "Data Structures — Full Practice",
  subject: "CSC 301",
  totalTime: 30 * 60, // 30 minutes in seconds
  mode: "Full Practice",
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
    subject: "Trees",
  },
  {
    id: 2,
    text: "Which data structure uses the LIFO (Last In, First Out) principle?",
    options: ["Queue", "Linked List", "Stack", "Heap"],
    correct: 2,
    subject: "Linear Structures",
  },
  {
    id: 3,
    text: "In an AVL tree, what is the maximum allowed height difference between the left and right subtrees of any node?",
    options: ["0", "1", "2", "3"],
    correct: 1,
    subject: "Trees",
  },
  {
    id: 4,
    text: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correct: 2,
    subject: "Sorting",
  },
  {
    id: 5,
    text: "What is the space complexity of Depth-First Search (DFS) on a graph with V vertices and E edges?",
    options: ["O(V)", "O(E)", "O(V + E)", "O(V²)"],
    correct: 0,
    subject: "Graphs",
  },
  {
    id: 6,
    text: "Which of the following is NOT a property of a Min-Heap?",
    options: [
      "The root contains the minimum element",
      "Every parent node is smaller than or equal to its children",
      "It is always a complete binary tree",
      "In-order traversal gives a sorted sequence",
    ],
    correct: 3,
    subject: "Trees",
  },
  {
    id: 7,
    text: "What data structure is typically used to implement Breadth-First Search (BFS)?",
    options: ["Stack", "Queue", "Priority Queue", "Deque"],
    correct: 1,
    subject: "Graphs",
  },
  {
    id: 8,
    text: "The amortized time complexity of push and pop operations in a dynamic array is:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correct: 0,
    subject: "Arrays",
  },
  {
    id: 9,
    text: "Which of the following graph representations has better space complexity for a sparse graph?",
    options: [
      "Adjacency Matrix",
      "Adjacency List",
      "Incidence Matrix",
      "They are all the same",
    ],
    correct: 1,
    subject: "Graphs",
  },
  {
    id: 10,
    text: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correct: 2,
    subject: "Sorting",
  },
  {
    id: 11,
    text: "In a doubly linked list, what additional pointer does each node have compared to a singly linked list?",
    options: [
      "A pointer to the head",
      "A pointer to the previous node",
      "A pointer to the tail",
      "A pointer to the middle node",
    ],
    correct: 1,
    subject: "Linear Structures",
  },
  {
    id: 12,
    text: "Which traversal of a BST yields nodes in sorted order?",
    options: ["Pre-order", "Post-order", "In-order", "Level-order"],
    correct: 2,
    subject: "Trees",
  },
  {
    id: 13,
    text: "Hash tables achieve O(1) average-case lookup by using:",
    options: [
      "Binary search",
      "A hash function to map keys to indices",
      "Sorted arrays",
      "Tree-based indexing",
    ],
    correct: 1,
    subject: "Hash Tables",
  },
  {
    id: 14,
    text: "What is the primary advantage of a circular linked list over a standard linked list?",
    options: [
      "Faster search operations",
      "Efficient traversal from any node back to itself",
      "Lower memory usage",
      "Easier deletion of the head node",
    ],
    correct: 1,
    subject: "Linear Structures",
  },
  {
    id: 15,
    text: "Dijkstra's algorithm is used to find:",
    options: [
      "The minimum spanning tree",
      "The shortest path between all pairs of nodes",
      "The shortest path from a source to all other nodes",
      "The topological ordering of nodes",
    ],
    correct: 2,
    subject: "Graphs",
  },
];

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
  subject: string;
};

// ── Calculator ────────────────────────────────────────────────────────────────
function Calculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(false);

  const handleNum = (n: string) => {
    if (fresh) {
      setDisplay(n);
      setFresh(false);
      return;
    }
    if (display === "0" && n !== ".") setDisplay(n);
    else if (n === "." && display.includes(".")) return;
    else setDisplay(display + n);
  };

  const handleOp = (o: string) => {
    setPrev(display);
    setOp(o);
    setFresh(true);
  };

  const handleEq = () => {
    if (!prev || !op) return;
    const a = parseFloat(prev),
      b = parseFloat(display);
    let result = 0;
    if (op === "+") result = a + b;
    else if (op === "−") result = a - b;
    else if (op === "×") result = a * b;
    else if (op === "÷") result = b !== 0 ? a / b : 0;
    const str = parseFloat(result.toFixed(8)).toString();
    setDisplay(str);
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const handleDel = () =>
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(false);
  };
  const handleToggleSign = () =>
    setDisplay((parseFloat(display) * -1).toString());
  const handlePct = () => setDisplay((parseFloat(display) / 100).toString());

  const btn = (label: string, onClick: () => void, cls = "") => (
    <button
      key={label}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-xl text-sm font-semibold h-10 transition-all active:scale-95",
        cls,
      )}
      aria-label={label}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-64 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700"
      role="dialog"
      aria-label="Calculator"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          {/* <Calculator size={12} aria-hidden="true" />  */}
          Calculator
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Close calculator"
        >
          <X size={14} />
        </button>
      </div>

      {/* Display */}
      <div className="px-4 py-3 text-right border-b border-slate-800">
        {op && (
          <p className="text-[10px] text-slate-500 mb-0.5">
            {prev} {op}
          </p>
        )}
        <p className="text-2xl font-light text-white truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-3">
        {btn(
          "AC",
          handleClear,
          "bg-slate-600 hover:bg-slate-500 text-white col-span-1",
        )}
        {btn(
          "+/−",
          handleToggleSign,
          "bg-slate-600 hover:bg-slate-500 text-white",
        )}
        {btn("%", handlePct, "bg-slate-600 hover:bg-slate-500 text-white")}
        {btn(
          "÷",
          () => handleOp("÷"),
          cn(
            "text-white",
            op === "÷"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["7", "8", "9"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "×",
          () => handleOp("×"),
          cn(
            "text-white",
            op === "×"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["4", "5", "6"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "−",
          () => handleOp("−"),
          cn(
            "text-white",
            op === "−"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {["1", "2", "3"].map((n) =>
          btn(
            n,
            () => handleNum(n),
            "bg-slate-700 hover:bg-slate-600 text-white",
          ),
        )}
        {btn(
          "+",
          () => handleOp("+"),
          cn(
            "text-white",
            op === "+"
              ? "bg-white/90 text-slate-900"
              : "bg-primary-500 hover:bg-primary-400",
          ),
        )}

        {btn("⌫", handleDel, "bg-slate-700 hover:bg-slate-600 text-white")}
        {btn(
          "0",
          () => handleNum("0"),
          "bg-slate-700 hover:bg-slate-600 text-white",
        )}
        {btn(
          ".",
          () => handleNum("."),
          "bg-slate-700 hover:bg-slate-600 text-white",
        )}
        {btn("=", handleEq, "bg-primary-500 hover:bg-primary-400 text-white")}
      </div>
    </div>
  );
}

// ── Submit Modal ──────────────────────────────────────────────────────────────
function SubmitModal({
  answers,
  flagged,
  total,
  onConfirm,
  onCancel,
}: {
  answers: Record<number, number>;
  flagged: Set<number>;
  total: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const answered = Object.keys(answers).length;
  const unanswered = total - answered;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Submit quiz confirmation"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-slate-900 px-6 pt-6 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
            <Send size={20} className="text-white" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-white">Submit Quiz?</h2>
          <p className="text-sm text-white/60 mt-1">
            This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {
                label: "Answered",
                value: answered,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Skipped",
                value: unanswered,
                color:
                  unanswered > 0
                    ? "text-rose-600 bg-rose-50"
                    : "text-slate-600 bg-slate-50",
              },
              {
                label: "Flagged",
                value: flagged.size,
                color:
                  flagged.size > 0
                    ? "text-amber-600 bg-amber-50"
                    : "text-slate-600 bg-slate-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={cn("rounded-xl p-2.5 text-center", s.color)}
              >
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-[11px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
          {unanswered > 0 && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
              <AlertCircle size={13} aria-hidden="true" />
              You have {unanswered} unanswered question
              {unanswered > 1 ? "s" : ""}. Are you sure?
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-[2] py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Send size={13} aria-hidden="true" /> Submit Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────────
function ResultsPage({
  answers,
  questions,
  timeTaken,
  onRetry,
}: {
  answers: Record<number, number>;
  questions: Question[];
  timeTaken: number;
  onRetry: () => void;
}) {
  const correct = questions.filter((q) => answers[q.id] === q.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  return (
    <div className="min-h-screen bg-[oklch(0.99_0.01_265)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {/* Score hero */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
            <p className="text-sm text-white/50 uppercase tracking-widest font-semibold mb-4">
              Session Complete
            </p>
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg
                className="w-32 h-32 -rotate-90"
                viewBox="0 0 120 120"
                aria-hidden="true"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={
                    score >= 80
                      ? "#34d399"
                      : score >= 60
                        ? "#fbbf24"
                        : "#f87171"
                  }
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 339.3} 339.3`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-bold text-white">{score}%</p>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              {correct} of {questions.length} correct
            </p>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: "Score",
                  value: `${score}%`,
                  sub:
                    score >= 80
                      ? "Excellent"
                      : score >= 60
                        ? "Good"
                        : "Needs work",
                },
                {
                  label: "Correct",
                  value: correct,
                  sub: `of ${questions.length}`,
                },
                { label: "Time", value: `${mins}m ${secs}s`, sub: "taken" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-50 rounded-2xl p-3 text-center"
                >
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-[10px] text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Question review */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Review</h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((q) => {
                  const answered = answers[q.id] !== undefined;
                  const isCorrect = answers[q.id] === q.correct;
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                        !answered
                          ? "bg-slate-100 text-slate-400"
                          : isCorrect
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700",
                      )}
                      title={`Q${q.id}: ${!answered ? "Skipped" : isCorrect ? "Correct" : "Wrong"}`}
                    >
                      {q.id}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onRetry}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
              >
                Try Again
              </button>
              <a
                href="/practice"
                className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-center"
              >
                Back to Practice
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Quiz Page ────────────────────────────────────────────────────────────
export default function QuizPage() {
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

  const q = QUESTIONS[current];
  const totalQ = QUESTIONS.length;

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
  }, [submitted]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timePct = (timeLeft / QUIZ_META.totalTime) * 100;
  const timerUrgent = timeLeft <= 5 * 60;

  const selectAnswer = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionIdx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
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
        questions={QUESTIONS}
        timeTaken={timeTaken}
        onRetry={handleRetry}
      />
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

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
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {q.subject}
                      </p>
                      <p className="text-xs text-slate-400">
                        Question {current + 1} of {totalQ}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleFlag}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0",
                      flagged.has(q.id)
                        ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
                        : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-500",
                    )}
                    aria-pressed={flagged.has(q.id)}
                    aria-label={
                      flagged.has(q.id) ? "Remove flag" : "Flag for review"
                    }
                  >
                    <Flag size={12} aria-hidden="true" />
                    {flagged.has(q.id) ? "Flagged" : "Flag"}
                  </button>
                </div>
              </div>

              {/* Question text */}
              <div className="px-6 py-6">
                <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {q.text}
                </p>
              </div>

              {/* Options */}
              <div
                className="px-6 pb-6 space-y-3"
                role="radiogroup"
                aria-label="Answer options"
              >
                {q.options.map((option, idx) => {
                  const selected = answers[q.id] === idx;
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
                        {option}
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
                {QUESTIONS.map((question, idx) => {
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
            {QUESTIONS.map((question, idx) => {
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
