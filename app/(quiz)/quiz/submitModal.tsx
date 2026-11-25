"use client";
import { AlertCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type SubjectGroup = {
  subject: string;
  questions: { id: number | string }[];
};

type AnswersMap = Record<string, Record<string, string>>;

export default function SubmitModal({
  answers,
  subjects,
  flagged,
  totalQuestions,
  totalAnswered,
  onConfirm,
  onCancel,
  isSubmitting,
}: {
  answers: AnswersMap;
  subjects: SubjectGroup[];
  flagged: Set<string>;
  totalQuestions: number;
  totalAnswered: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const unanswered = totalQuestions - totalAnswered;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-exam-deep/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Submit quiz confirmation"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-rule bg-sheet">
        <div className="border-b border-rule bg-exam px-6 py-5">
          <p className="eyebrow text-primary-300">Hand in</p>
          <h2 className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-white">
            Submit this paper?
          </h2>
          <p className="mt-1 text-[0.8125rem] text-white/50">
            It cannot be reopened once it is handed in.
          </p>
        </div>

        <div className="px-6 py-5">
          {/* Overall stats */}
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-rule">
            {[
              {
                label: "Answered",
                value: totalAnswered,
              },
              {
                label: "Skipped",
                value: unanswered,
              },
              {
                label: "Flagged",
                value: flagged.size,
              },
            ].map((s, index) => (
              <div
                key={s.label}
                className={cn(
                  "px-2 py-3 text-center",
                  index > 0 && "border-l border-rule",
                  s.label === "Flagged" && s.value > 0 && "bg-amber-50",
                )}
              >
                <p className="text-[1.25rem] font-semibold leading-none tabular-nums text-ink">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink-quiet">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Per-subject breakdown */}
          {subjects.length > 1 && (
            <div className="mt-4 space-y-2.5">
              {subjects.map((group) => {
                const answered = Object.keys(
                  answers[group.subject] ?? {},
                ).length;
                const total = group.questions.length;
                const pct = Math.round((answered / total) * 100);
                return (
                  <div key={group.subject}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-[0.75rem] text-ink-quiet">
                      <span className="max-w-45 truncate font-medium">
                        {group.subject}
                      </span>
                      <span className="tabular-nums">
                        {answered}/{total}
                      </span>
                    </div>
                    <div className="h-px overflow-hidden rounded-full bg-well">
                      <div
                        className="h-full rounded-full bg-marker"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {unanswered > 0 && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[0.75rem] leading-5 text-amber-800">
              <AlertCircle
                size={13}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              {unanswered} question{unanswered > 1 ? "s are" : " is"} still
              unanswered. They will be marked as skipped.
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-10 flex-1 rounded-xl border border-rule bg-sheet text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well disabled:opacity-50"
            >
              Go back
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex h-10 flex-[1.6] items-center justify-center gap-2 rounded-xl bg-exam text-[0.8125rem] font-semibold text-white transition-colors hover:bg-exam-edge active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={13}
                    className="animate-spin"
                    aria-hidden="true"
                  />{" "}
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={13} aria-hidden="true" /> Submit paper
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
