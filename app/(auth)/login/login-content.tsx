"use client";

import { BookOpen, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import AuthShell from "../auth-shell";
import InputField from "../Field";

const schema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormFields = z.infer<typeof schema>;

export function LoginContent() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const query = useSearchParams();
  const prefilledEmail = query.get("email")
    ? decodeURIComponent(query.get("email") as string)
    : "";
  const justVerified = query.get("verified") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { email: prefilledEmail },
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setServerError(null);
    try {
      const result = await login(formData.email, formData.password);
      // Redirect to the saved "next" URL after login, or default to dashboard
      const nextUrl = query.get("next")?.split("&")[0]; // Basic XSS protection
      router.push(nextUrl && nextUrl.startsWith("/") ? nextUrl : "/dashboard");
    } catch (error) {
      // Check for pending verification error and redirect to confirm page
      if (
        typeof error === "object" &&
        error !== null &&
        (error as { type?: string }).type === "PENDING_VERIFICATION"
      ) {
        const pendingError = error as { email: string };
        router.push(`/confirm?email=${encodeURIComponent(pendingError.email)}`);
        return;
      }
      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  const emailErrorId = "email-error";
  const passwordErrorId = "password-error";

  return (
    <AuthShell
      eyebrow="Exam practice, marked"
      headline="Pick up where the last paper ended."
      blurb="Sign in to sit another timed paper and keep every marked result in one place."
    >
      <p className="eyebrow text-marker-ink">Your account</p>
      <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        Sign in
      </h1>
      <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
        Use the email address your account was registered with.
      </p>

      {justVerified && (
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
          <CheckCircle2
            size={15}
            className="shrink-0 text-emerald-700"
            aria-hidden="true"
          />
          <p className="text-[0.75rem] leading-5 text-emerald-800">
            Email verified. Sign in to sit your first paper.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
        aria-label="Login form"
      >
        <InputField
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
        >
          <BookOpen
            className="shrink-0 text-marker-ink"
            size={16}
            aria-hidden="true"
          />
          <input
            id="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-quiet"
            type="email"
            autoComplete="username"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? emailErrorId : undefined}
          />
        </InputField>

        <InputField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <Lock
            className="shrink-0 text-ink-quiet"
            size={16}
            aria-hidden="true"
          />
          <input
            id="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-quiet"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? passwordErrorId : undefined}
          />
        </InputField>

        {/* Server-side error */}
        {serverError && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[0.75rem] leading-5 text-rose-700"
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-[0.8125rem] font-semibold"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 animate-spin"
                size={15}
                aria-hidden="true"
              />
              <span>Signing in…</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[0.75rem]">
          <Link
            href="/forgot-password"
            className="font-medium text-ink-quiet underline decoration-rule underline-offset-4 transition-colors hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Forgot your password?
          </Link>
          <p className="text-ink-quiet">
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold text-marker-ink underline decoration-marker-line underline-offset-4 transition-colors hover:decoration-marker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Create one
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
