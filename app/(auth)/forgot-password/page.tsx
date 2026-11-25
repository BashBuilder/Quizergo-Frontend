"use client";

import { BookOpen, Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import InputField from "../Field";
import AuthShell from "../auth-shell";
import { useAuth } from "@/hooks/auth";

const schema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-quiet";

const headings: Record<number, { title: string; blurb: string }> = {
  1: {
    title: "Reset your password",
    blurb: "Give us the email on the account and we will send a code.",
  },
  2: {
    title: "Enter the code",
    blurb: "Six digits from the email. They expire quickly.",
  },
  3: {
    title: "Set a new password",
    blurb: "At least 8 characters, with uppercase, lowercase and a number.",
  },
};

export default function ForgotPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const [tab, setTab] = useState(1);
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setServerError(null);
    try {
      if (tab === 1) {
        const response = await forgotPassword(formData.email);
        toast.success(
          response.message ||
            "Password reset email sent, verify otp in your email",
        );
        setTab(2);
        return;
      }
      if (tab === 2) {
        await verifyOtp(formData.email, formData.otp ?? "");
        setTab(3);
        return;
      }
      if (tab === 3) {
        if (formData.password !== formData.confirmPassword) {
          setServerError("Passwords do not match");
          return;
        }
        await resetPassword({
          email: formData.email,
          otp: formData.otp ?? "",
          newPassword: formData.password ?? "",
          confirmPassword: formData.confirmPassword ?? "",
        });
        toast.success(
          "Password reset successful, you can now login with new password",
        );
        router.push("/login");
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  const heading = headings[tab];

  return (
    <AuthShell
      eyebrow="Get back in"
      headline="A forgotten password is not a lost paper."
      blurb="We will verify the email on the account, then let you set a new password and return to your mark book."
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow text-marker-ink">Account recovery</p>
        <p className="text-[0.6875rem] font-semibold tabular-nums text-ink-quiet">
          Step {tab} of 3
        </p>
      </div>

      <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        {heading.title}
      </h1>
      <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
        {heading.blurb}
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
        aria-label="Forgot password form"
      >
        {tab === 1 && (
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
              className={inputClass}
              type="email"
              autoComplete="username"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </InputField>
        )}

        {tab === 2 && (
          <div>
            <label className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft">
              Six-digit code
            </label>
            <Controller
              name="otp"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  aria-label="Six-digit reset code"
                >
                  <InputOTPGroup className="gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-9 rounded-xl border border-rule bg-sheet text-[1.0625rem] font-semibold text-ink shadow-none sm:w-11"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
        )}

        {tab === 3 && (
          <>
            <InputField
              label="New password"
              htmlFor="password"
              error={errors.password?.message}
            >
              <input
                id="password"
                {...register("password")}
                placeholder="••••••••"
                className={inputClass}
                type={show.password ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                className="rounded-md p-1 text-ink-quiet transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                aria-label={show.password ? "Hide password" : "Show password"}
                aria-pressed={show.password}
              >
                {show.password ? (
                  <Unlock size={16} aria-hidden="true" />
                ) : (
                  <Lock size={16} aria-hidden="true" />
                )}
              </button>
            </InputField>

            <InputField
              label="Confirm new password"
              htmlFor="confirmPassword"
              error={errors.confirmPassword?.message}
            >
              <input
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={inputClass}
                type={show.confirmPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
              />
              <button
                className="rounded-md p-1 text-ink-quiet transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                type="button"
                onClick={() =>
                  setShow((prev) => ({
                    ...prev,
                    confirmPassword: !prev.confirmPassword,
                  }))
                }
                aria-label={
                  show.confirmPassword ? "Hide password" : "Show password"
                }
                aria-pressed={show.confirmPassword}
              >
                {show.confirmPassword ? (
                  <Unlock size={16} aria-hidden="true" />
                ) : (
                  <Lock size={16} aria-hidden="true" />
                )}
              </button>
            </InputField>
          </>
        )}

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
              <span>Working…</span>
            </>
          ) : tab === 1 ? (
            "Send the code"
          ) : tab === 2 ? (
            "Verify the code"
          ) : (
            "Set the new password"
          )}
        </Button>

        <p className="border-t border-rule pt-4 text-center text-[0.75rem] text-ink-quiet">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-marker-ink underline decoration-marker-line underline-offset-4 transition-colors hover:decoration-marker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
