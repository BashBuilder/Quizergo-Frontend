"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, X, Plus, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import Field from "./Field";
import { DURATIONS, QUESTION_COUNTS } from "./constant";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSubjects } from "@/services/question.service";
import { useCreateQuizSession } from "@/services/quiz.service";

// ── Schema ─────────────────────────────────────────────────────────────────
const schema = z.object({
  subjects: z
    .array(z.string().min(1))
    .min(1, "Please select at least one subject"),
  questionCount: z.string().min(1, "Please select a question count"),
  duration: z.string().min(1, "Please select a duration"),
});

type FormValues = z.infer<typeof schema>;

// ── Page ───────────────────────────────────────────────────────────────────
export default function QuizSetupPage() {
  const query = useSearchParams();
  const preselectedSubject = query.get("subject");
  const {
    data: subjects,
    isLoading: subjectsLoading,
    isError: subjectsError,
    refetch: refetchSubjects,
    isFetching: subjectsFetching,
  } = useGetSubjects();
  const router = useRouter();

  // Mutation for creating quiz session
  const { mutate, isPending } = useCreateQuizSession();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subjects: preselectedSubject ? [preselectedSubject] : [],
      questionCount: "20",
      duration: "45",
    },
  });

  const watchSubjects = useWatch({ control, name: "subjects" });
  const watchCount = useWatch({ control, name: "questionCount" });
  const watchDuration = useWatch({ control, name: "duration" });

  // Available subjects to add (exclude already selected)
  const availableSubjects = (subjects ?? []).filter(
    (s) => !watchSubjects.includes(s.apiKey),
  );

  const addSubject = (apiKey: string | null) => {
    if (!apiKey || watchSubjects.includes(apiKey)) {
      return;
    }

    setValue("subjects", [...watchSubjects, apiKey]);
  };

  const removeSubject = (apiKey: string) => {
    setValue(
      "subjects",
      watchSubjects.filter((s) => s !== apiKey),
    );
  };

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        subjects: data.subjects,
        questionCount: Number(data.questionCount),
        duration: Number(data.duration),
      },
      {
        onSuccess: (session) => {
          // Store session info for quiz page. Clear any snapshot from an older
          // paper so the deadline and answers cannot leak into this one.
          try {
            sessionStorage.removeItem("quizDeadline");
            sessionStorage.removeItem("quizAnswers");
            sessionStorage.removeItem("quizFlags");
            sessionStorage.removeItem("quizResult");
            sessionStorage.setItem("quizSession", JSON.stringify(session));
            sessionStorage.setItem("quizDuration", data.duration);
          } catch {
            // Session storage might be unavailable
          }
          router.push("/quiz");
        },
      },
    );
  };

  const totalQuestions = (Number(watchCount) || 0) * watchSubjects.length;
  const minutes = Number(watchDuration) || 0;
  const secondsEach =
    minutes > 0 && totalQuestions > 0
      ? Math.round((minutes * 60) / totalQuestions)
      : null;
  const durationLabel =
    DURATIONS.find((d) => d.value === watchDuration)?.label ?? "—";

  return (
    <PageWrapper className="flex items-start justify-center py-10 sm:py-14">
      <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_27rem]">
        <aside className="hidden lg:block">
          <p className="eyebrow text-marker-ink">New session</p>
          <h1 className="mt-4 max-w-sm text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
            Set up the paper before the clock starts.
          </h1>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-7 text-ink-quiet">
            The paper is built by the server from what you choose here. Once it
            starts, the countdown does.
          </p>

          <ol className="mt-10 max-w-sm border-t border-rule">
            {[
              "Choose the subjects and length.",
              "Sit it one question at a time.",
              "Read the marking, question by question.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex gap-5 border-b border-rule py-4 text-[0.8125rem] leading-6 text-ink-soft"
              >
                <span className="text-[0.6875rem] font-semibold tabular-nums text-marker-ink">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </aside>

        <div className="w-full">
          <div className="mb-6 lg:hidden">
            <p className="eyebrow text-marker-ink">New session</p>
            <h1 className="mt-3 text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-ink">
              Set up the paper.
            </h1>
          </div>

          <div className="overflow-hidden rounded-3xl border border-rule bg-sheet">
            <div className="border-b border-rule bg-exam px-6 py-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="eyebrow text-primary-300">Session details</p>
                  <h2 className="mt-2 text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-white">
                    Build your paper
                  </h2>
                </div>
                <p className="shrink-0 text-[0.6875rem] font-semibold tabular-nums text-white/50">
                  {watchSubjects.length} subject
                  {watchSubjects.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6">
              {/* Subjects — multi select */}
              <div>
                <label
                  className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft"
                  htmlFor="add-subject"
                >
                  Subjects
                </label>

                {/* Selected subject pills */}
                {watchSubjects.length > 0 && (
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    {watchSubjects.map((key) => {
                      const sub = subjects?.find((s) => s.apiKey === key);
                      return (
                        <span
                          key={key}
                          className="flex items-center gap-1.5 rounded-lg border border-marker-line bg-marker-wash px-2.5 py-1.5 text-[0.75rem] font-semibold text-marker-ink"
                        >
                          {sub?.name ?? key}
                          <button
                            type="button"
                            onClick={() => removeSubject(key)}
                            aria-label={`Remove ${sub?.name ?? key}`}
                            className="rounded-sm text-marker-ink/60 transition-colors hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                          >
                            <X size={11} aria-hidden="true" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Add subject dropdown */}
                {availableSubjects.length > 0 && (
                  <Select onValueChange={(value) => addSubject(value)} value="">
                    <SelectTrigger
                      id="add-subject"
                      className={cn(
                        "h-11 w-full rounded-xl border-rule bg-sheet text-[0.8125rem]",
                        errors.subjects && "border-rose-300",
                      )}
                      aria-label="Add a subject"
                    >
                      <span className="flex items-center gap-2 text-ink-quiet">
                        <Plus size={14} aria-hidden="true" />
                        Add a subject
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubjects.map((s) => (
                        <SelectItem key={s.apiKey} value={s.apiKey}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {subjectsLoading && (
                  <p
                    className="mt-2 flex items-center gap-2 text-[0.75rem] text-ink-quiet"
                    aria-live="polite"
                  >
                    <Loader2
                      size={12}
                      className="animate-spin"
                      aria-hidden="true"
                    />
                    Loading the subject list…
                  </p>
                )}

                {subjectsError && (
                  <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5">
                    <p className="text-[0.75rem] leading-5 text-rose-700">
                      The subject list didn&apos;t load, so this form is
                      incomplete.
                    </p>
                    <button
                      type="button"
                      onClick={() => void refetchSubjects()}
                      disabled={subjectsFetching}
                      className="mt-1.5 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-rose-700 underline underline-offset-2 disabled:opacity-50"
                    >
                      <RotateCw
                        size={11}
                        className={subjectsFetching ? "animate-spin" : undefined}
                        aria-hidden="true"
                      />
                      Try again
                    </button>
                  </div>
                )}

                {errors.subjects && (
                  <p
                    className="mt-2 text-[0.75rem] font-medium text-rose-600"
                    role="alert"
                  >
                    {errors.subjects.message as string}
                  </p>
                )}
              </div>

              <div className="mt-5 grid gap-4 border-t border-rule pt-5 sm:grid-cols-2">
                {/* Question count */}
                <Field
                  label="Questions per subject"
                  htmlFor="questionCount"
                  error={errors.questionCount?.message}
                >
                  <Controller
                    name="questionCount"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="questionCount"
                          className={cn(
                            "h-11 w-full rounded-xl border-rule bg-sheet text-[0.8125rem]",
                            errors.questionCount && "border-rose-300",
                          )}
                          aria-invalid={!!errors.questionCount}
                        >
                          <SelectValue placeholder="Pick a number" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_COUNTS.map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} questions
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                {/* Duration */}
                <Field
                  label="Duration"
                  htmlFor="duration"
                  error={errors.duration?.message}
                >
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="duration"
                          className={cn(
                            "h-11 w-full rounded-xl border-rule bg-sheet text-[0.8125rem]",
                            errors.duration && "border-rose-300",
                          )}
                          aria-invalid={!!errors.duration}
                        >
                          <SelectValue placeholder="Set a time limit" />
                        </SelectTrigger>
                        <SelectContent>
                          {DURATIONS.map((d) => (
                            <SelectItem key={d.value} value={d.value}>
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              {/* Live readout */}
              <div
                className="mt-5 rounded-2xl border border-rule bg-well px-4 py-3.5"
                aria-live="polite"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-quiet">
                    This paper
                  </p>
                  <p className="text-[0.8125rem] font-semibold tabular-nums text-ink">
                    {watchSubjects.length || 0} × {watchCount || 0} ={" "}
                    {totalQuestions} questions
                  </p>
                </div>
                <p className="mt-1 text-[0.75rem] leading-5 text-ink-quiet">
                  {durationLabel}
                  {secondsEach
                    ? ` — about ${secondsEach}s per question.`
                    : " — no countdown; answers can be submitted when you are ready."}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                aria-busy={isPending}
                className="mt-5 h-11 w-full rounded-xl bg-exam text-[0.8125rem] font-semibold text-white hover:bg-exam-edge"
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={15}
                      className="mr-2 animate-spin"
                      aria-hidden="true"
                    />
                    Starting…
                  </>
                ) : (
                  <>
                    Start session
                    <ChevronRight size={15} className="ml-1" aria-hidden="true" />
                  </>
                )}
              </Button>

              <p className="mt-3 text-center text-[0.6875rem] leading-5 text-ink-quiet">
                The countdown begins with the first question. Your answers sync
                while you work.
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
