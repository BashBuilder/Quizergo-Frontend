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
          {/* Overall stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              {
                label: "Answered",
                value: totalAnswered,
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

          {/* Per-subject breakdown */}
          {subjects.length > 1 && (
            <div className="mb-4 space-y-1.5">
              {subjects.map((group) => {
                const answered = Object.keys(
                  answers[group.subject] ?? {},
                ).length;
                const total = group.questions.length;
                const pct = Math.round((answered / total) * 100);
                return (
                  <div key={group.subject}>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="truncate max-w-45 font-medium">
                        {group.subject}
                      </span>
                      <span>
                        {answered}/{total}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          pct === 100
                            ? "bg-emerald-400"
                            : pct > 50
                              ? "bg-primary-400"
                              : "bg-amber-400",
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

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
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Send size={13} aria-hidden="true" /> Submit Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
