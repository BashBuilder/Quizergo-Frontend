"use client";

import { Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../Field";
import AuthShell from "../auth-shell";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .refine((val) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val);
      }, "At least 8 characters, with an uppercase letter, a lowercase letter and a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof schema>;

const inputClass =
  "w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-quiet";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setServerError(null);
    try {
      const response = await registerUser(formData);
      toast.success(
        response.message ||
          "Registration successful. A verification code is on its way.",
      );
      const email = encodeURIComponent(formData.email);
      router.push(`/confirm?email=${email}`);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <AuthShell
      eyebrow="Start here"
      headline="One account, then the paper."
      blurb="Register with an email, verify the code we send, and set up your first timed session. Everything you sit is kept in your mark book."
    >
      <p className="eyebrow text-marker-ink">New account</p>
      <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        Create an account
      </h1>
      <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
        We will email a six-digit code to confirm the address.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
        aria-label="Registration form"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First name"
            htmlFor="firstName"
            error={errors.firstName?.message}
          >
            <input
              id="firstName"
              {...register("firstName")}
              placeholder="Chidi"
              className={inputClass}
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
          </InputField>
          <InputField
            label="Last name"
            htmlFor="lastName"
            error={errors.lastName?.message}
          >
            <input
              id="lastName"
              {...register("lastName")}
              placeholder="Okafor"
              className={inputClass}
              type="text"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
          </InputField>
        </div>

        <InputField
          label="Email"
          htmlFor="email"
          error={errors.email?.message}
        >
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

        <InputField
          label="Password"
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
          label="Confirm password"
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
              errors.confirmPassword ? "confirmPassword-error" : undefined
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
              <span>Creating account…</span>
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="pt-1 text-center text-[0.75rem] text-ink-quiet">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-marker-ink underline decoration-marker-line underline-offset-4 transition-colors hover:decoration-marker focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
