"use client";

import { BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/global/Logo";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function AuthPage() {
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  // Infer the type from the schema
  type FormFields = z.infer<typeof schema>;

  // 2. Setup useForm with the Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    // @ts-expect-error "error"
    resolver: zodResolver(schema),
  });

  // 4. Define the submission handler
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log("Validated Data:", data);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <Image
        width={1000}
        height={1000}
        alt="background image"
        src="/assets/120493 (1).jpg"
        loading="lazy"
        className="absolute top-0 left-0 h-full w-full object-cover opacity-20 "
      />
      <div className="absolute top-12 left-12 z-50 max-sm:top-4 max-sm:left-4 ">
        <Logo />
      </div>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_1fr]">
          <section className="relative max-md:hidden overflow-hidden rounded-[2rem] bg-slate-900/90 p-10 backdrop-blur-xl">
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <h1 className="mt-8 max-w-xl text-2xl font-semibold tracking-tight text-white">
                  Your learning hub is one login away.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Sign in to access quizzes, track your progress, and continue
                  the streak you built for your next assessment.
                </p>
              </div>
            </div>
          </section>

          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white ">Login</CardTitle>
            </CardHeader>
            <CardContent className="backdrop:blur-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-5">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="studentId"
                  >
                    Email or Username
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-secondary px-4 py-3 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400/20">
                    <BookOpen className="text-primary" size={18} />
                    <input
                      id="studentId"
                      {...register("email")}
                      placeholder="studentid@school.edu or 23A100"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      type="text"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/20">
                    <Lock className="text-slate-400" size={18} />
                    <input
                      id="password"
                      {...register("password")}
                      placeholder="••••••••"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      type="password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-3xl px-6 py-3 text-sm font-semibold"
                >
                  Sign in
                  {/* {submitted ? "Continue to dashboard" : "Sign in"} */}
                </Button>
                {errors ? (
                  <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-400/20">
                    {errors.email?.message || errors.password?.message}
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
