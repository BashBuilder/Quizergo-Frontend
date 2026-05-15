"use client";

import { BookOpen, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/global/Logo";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axios from "@/config/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormFields = z.infer<typeof schema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    //@ts-expect-error Zod validation error
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (formData) => {
    setServerError(null);
    try {
      const response = await axios.post("/auth/login", formData);
      localStorage.setItem("token", response.data);
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Login failed. Please try again.",
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

  const emailErrorId = "email-error";
  const passwordErrorId = "password-error";

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

      <div className="absolute top-12 left-12 z-50 max-sm:top-4 max-sm:left-4">
        <Logo />
      </div>

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

          {/* Login form */}
          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Sign in to QuizerGo
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
                aria-label="Login form"
              >
                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="email"
                  >
                    Email or Username
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
                      aria-describedby={errors.email ? emailErrorId : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id={emailErrorId}
                      role="alert"
                      className="text-sm text-red-300 px-1"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/20">
                    <Lock
                      className="text-slate-400 shrink-0"
                      size={18}
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      {...register("password")}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? passwordErrorId : undefined
                      }
                    />
                  </div>
                  {errors.password && (
                    <p
                      id={passwordErrorId}
                      role="alert"
                      className="text-sm text-red-300 px-1"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Server-side error */}
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
                      <span>Signing in…</span>
                    </>
                  ) : (
                    "Sign in"
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
