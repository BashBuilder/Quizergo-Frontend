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
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/global/PageWrapper";
import Field from "./Field";
import { DURATIONS, MODES, QUESTION_COUNTS, SUBJECTS } from "./constant";

// ── Schema ────────────────────────────────────────────────────────────────────
const schema = z
  .object({
    subject: z.string().min(1, "Please select a subject"),
    mode: z.enum(["count", "topic", "random"]),
    questionCount: z.string().optional(),
    topic: z.string().optional(),
    year: z.string().optional(),
    duration: z.string().min(1, "Please select a duration"),
  })
  .superRefine((field, ctx) => {
    if (field.mode === "count" && !field.questionCount)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a question count",
        path: ["questionCount"],
      });
    if (field.mode === "topic" && !field.topic)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a topic",
        path: ["topic"],
      });
  });

type FormValues = z.infer<typeof schema>;

// ── Page ──────────────────────────────────────────────────────────────────────
export default function QuizSetupPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error zodResolver types are messed up
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      mode: "random",
      questionCount: "",
      topic: "",
      duration: "45",
    },
  });

  const watchSubject = useWatch({ control, name: "subject" });
  const watchMode = useWatch({ control, name: "mode" });

  const selectedSubject = SUBJECTS.find((s) => s.code === watchSubject);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    console.log(data);
  };

  return (
    <PageWrapper className="  flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-6 py-5">
            <h1 className="text-2xl font-bold text-white leading-tight">
              Set up your session
            </h1>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="px-6 py-3 space-y-4"
          >
            {/* Subject */}
            <Field
              label="Subject"
              htmlFor="subject"
              error={errors.subject?.message}
            >
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("topic", "");
                      setValue("questionCount", "");
                    }}
                  >
                    <SelectTrigger
                      id="subject"
                      className={cn(
                        "w-full",
                        errors.subject && "border-rose-300 focus:ring-rose-100",
                      )}
                      aria-invalid={!!errors.subject}
                      aria-describedby={
                        errors.subject ? "subject-error" : undefined
                      }
                    >
                      <SelectValue placeholder="Choose a subject…" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          <span className="flex flex-col">
                            <span className="font-semibold">{s.name}</span>
                            <span className="text-xs text-slate-400">
                              {s.code}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {/* Mode */}
            <Field
              label="Question Selection"
              htmlFor="mode"
              error={errors.mode?.message}
            >
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("topic", "");
                      setValue("questionCount", "");
                    }}
                  >
                    <SelectTrigger
                      id="mode"
                      className="w-full"
                      aria-invalid={!!errors.mode}
                    >
                      <SelectValue placeholder="How to pick questions…" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODES.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Number of Questions"
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

            {/* Topic — conditional */}
            {watchMode === "topic" && (
              <Field
                label="Topic"
                htmlFor="topic"
                error={errors.topic?.message}
              >
                <Controller
                  name="topic"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger
                        id="topic"
                        className={cn(
                          "w-full",
                          errors.topic && "border-rose-300 focus:ring-rose-100",
                        )}
                        aria-invalid={!!errors.topic}
                      >
                        <SelectValue
                          placeholder={
                            selectedSubject
                              ? "Choose a topic…"
                              : "Select a subject first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedSubject?.topics ?? []).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            )}

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

            {/* Submit */}
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
