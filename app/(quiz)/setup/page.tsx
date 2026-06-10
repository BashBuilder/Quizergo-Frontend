"use client";

import { useState } from "react";
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
import { ChevronRight, Loader2, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import Field from "./Field";
import { DURATIONS, QUESTION_COUNTS } from "./constant";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSubjects } from "@/services/question.service";
import { toast } from "sonner";
import axios from "@/config/axios";

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
  const [isLoading, setIsLoading] = useState(false);
  const query = useSearchParams();
  const preselectedSubject = query.get("subject");
  const { data: subjects } = useGetSubjects();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error zodResolver types mismatch
    resolver: zodResolver(schema),
    defaultValues: {
      subjects: preselectedSubject ? [preselectedSubject] : [],
      questionCount: "20",
      duration: "45",
    },
  });

  const watchSubjects = useWatch({ control, name: "subjects" });

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

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/quiz/session", {
        subjects: data.subjects,
        questionCount: Number(data.questionCount),
        duration: Number(data.duration),
      });

      const session = res.data;

      // Store session info for quiz page
      sessionStorage.setItem("quizSession", JSON.stringify(session));
      sessionStorage.setItem("quizDuration", data.duration);

      router.push("/quiz");
      // eslint-disable-next-line
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to start session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-5">
            <h1 className="text-2xl font-bold text-white leading-tight">
              Set up your session
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Configure and start in seconds.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="px-6 py-4 space-y-4"
          >
            {/* Subjects — multi select */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Subjects
              </label>

              {/* Selected subject pills */}
              {watchSubjects.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {watchSubjects.map((key) => {
                    const sub = subjects?.find((s) => s.apiKey === key);
                    return (
                      <span
                        key={key}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                      >
                        {sub?.name ?? key}
                        {/* Only allow removal if not preselected via params */}
                        {!preselectedSubject && (
                          <button
                            type="button"
                            onClick={() => removeSubject(key)}
                            aria-label={`Remove ${sub?.name ?? key}`}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            <X size={11} />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Add subject dropdown — hidden if preselected */}
              {!preselectedSubject && availableSubjects.length > 0 && (
                <Select onValueChange={(value) => addSubject(value)} value="">
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors.subjects && "border-rose-300",
                    )}
                    aria-label="Add a subject"
                  >
                    <span className="flex items-center gap-2 text-slate-400">
                      <Plus size={14} aria-hidden="true" />
                      Add a subject…
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

              {errors.subjects && (
                <p className="text-xs text-rose-500 font-medium" role="alert">
                  {errors.subjects.message as string}
                </p>
              )}
            </div>

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
                        "w-full",
                        errors.questionCount &&
                          "border-rose-300 focus:ring-rose-100",
                      )}
                      aria-invalid={!!errors.questionCount}
                    >
                      <SelectValue placeholder="Pick a number…" />
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
                        "w-full",
                        errors.duration &&
                          "border-rose-300 focus:ring-rose-100",
                      )}
                      aria-invalid={!!errors.duration}
                    >
                      <SelectValue placeholder="Set a time limit…" />
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

            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full rounded-2xl py-6 text-sm font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin mr-2"
                    aria-hidden="true"
                  />
                  Starting…
                </>
              ) : (
                <>
                  Start Session
                  <ChevronRight size={15} className="ml-1" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
