"use client";

import { BookOpen, Loader2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "@/config/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import InputField from "../Field";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

type FormFields = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  const [tab, setTab] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    //@ts-expect-error Zod validation error
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setServerError(null);
    try {
      if (tab === 1) {
        const response = await axios.post("/auth/forgot-password", {
          email: formData.email,
        });
        toast.success(
          response.data.message ||
            "Password reset email sent, verify otp in your email",
        );
        setTab(2);
        return;
      }
      if (tab === 2) {
        await axios.post("/auth/verify", {
          email: formData.email,
          otp: formData.otp,
        });
        setTab(3);
        return;
      }
      if (tab === 3) {
        if (formData.password !== formData.confirmPassword) {
          setServerError("Passwords do not match");
          return;
        }
        await axios.post("/auth/reset-password", {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        toast.success(
          "Password reset successful, you can now login with new password",
        );
        router.push("/login");
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ||
            "Failed to send password reset email.",
        );
        return;
      }
      if (error instanceof Error) {
        setServerError(error.message);
        return;
      }
      setServerError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-950 text-slate-100">
      {/* Decorative background — hidden from assistive tech */}
      <Image
        width={1920}
        height={1080}
        alt=""
        role="presentation"
        src="/assets/120493 (1).jpg"
        priority
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Left panel — hidden on mobile */}
          <section
            aria-hidden="true"
            className="relative max-md:hidden overflow-hidden rounded-[2rem] bg-slate-900/90 p-10 backdrop-blur-xl"
          >
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <h2 className="mt-8 max-w-xl text-2xl font-semibold tracking-tight text-white">
                  Your learning hub is one login away.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Sign in to access quizzes, track your progress, and continue
                  the streak you built for your next assessment.
                </p>
              </div>
            </div>
          </section>

          {/* Forgot password form */}
          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Forgot Password
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
                aria-label="Forgot password form"
              >
                {tab === 1 && (
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-200"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/20">
                      <BookOpen
                        className="text-primary shrink-0"
                        size={18}
                        aria-hidden="true"
                      />
                      <input
                        id="email"
                        {...register("email")}
                        placeholder="studentid@school.edu"
                        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                        type="text"
                        autoComplete="username"
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p role="alert" className="text-sm text-red-300 px-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}

                {tab === 2 && (
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-slate-200"
                      htmlFor="otp"
                    >
                      OTP
                    </label>
                    <Controller
                      name="otp"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <InputOTP
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          className="text-white"
                          value={field.value || ""}
                          onChange={(value) => field.onChange(value)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={0}
                              className="text-white mx-1 rounded-md border  "
                            />
                            <InputOTPSlot
                              index={1}
                              className="text-white mx-1 rounded-md border  "
                            />
                            <InputOTPSlot
                              index={2}
                              className="text-white mx-1 rounded-md border  "
                            />
                            <InputOTPSlot
                              index={3}
                              className="text-white mx-1 rounded-md border  "
                            />
                            <InputOTPSlot
                              index={4}
                              className="text-white mx-1 rounded-md border  "
                            />
                            <InputOTPSlot
                              index={5}
                              className="text-white mx-1 rounded-md border  "
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    />
                  </div>
                )}
                {tab === 3 && (
                  <div className="space-y-3">
                    <InputField
                      label="Password"
                      htmlFor="password"
                      error={
                        errors.password ? errors.password.message : undefined
                      }
                    >
                      <input
                        id="password"
                        {...register("password")}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                        type={show.password ? "text" : "password"}
                        autoComplete="current-password"
                        aria-invalid={!!errors.password}
                      />
                      <button
                        className="cursor-pointer"
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                      >
                        <Lock
                          className={cn(
                            "text-slate-400 shrink-0",
                            show.password ? "hidden" : "block",
                          )}
                          size={18}
                        />
                        <Unlock
                          className={cn(
                            "text-slate-400 shrink-0",
                            show.password ? "block" : "hidden",
                          )}
                          size={18}
                        />
                      </button>
                    </InputField>
                    <InputField
                      label="Confirm Password"
                      htmlFor="confirmPassword"
                      error={
                        errors.confirmPassword
                          ? errors.confirmPassword.message
                          : undefined
                      }
                    >
                      <input
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        placeholder="••••••••"
                        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                        type={show.confirmPassword ? "text" : "password"}
                        autoComplete="current-password"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                          errors.confirmPassword
                            ? errors.confirmPassword.message
                            : undefined
                        }
                      />
                      <button
                        className="cursor-pointer"
                        type="button"
                        onClick={() =>
                          setShow((prev) => ({
                            ...prev,
                            confirmPassword: !prev.confirmPassword,
                          }))
                        }
                      >
                        <Lock
                          className={cn(
                            "text-slate-400 shrink-0",
                            show.confirmPassword ? "hidden" : "block",
                          )}
                          size={18}
                        />
                        <Unlock
                          className={cn(
                            "text-slate-400 shrink-0",
                            show.confirmPassword ? "block" : "hidden",
                          )}
                          size={18}
                        />
                      </button>
                    </InputField>
                  </div>
                )}
                {serverError && (
                  <p
                    role="alert"
                    className="rounded-3xl bg-red-500/10 text-center px-4 py-2 text-sm text-red-200 ring-1 ring-red-400/20"
                  >
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-3xl py-5 text-sm font-semibold"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="animate-spin mr-2"
                        size={16}
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
