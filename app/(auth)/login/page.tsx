"use client";

import { useMemo, useState } from "react";
import { BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/global/Logo";
import Image from "next/image";

const focusHints: Record<string, string> = {
  name: "Enter the name your school uses so your student profile stays synced.",
  studentId: "Use your school ID or email to keep your quiz progress linked.",
  password: "A secure password protects your study streak and course history.",
};

export default function AuthPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [focusField, setFocusField] = useState<string>("name");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !studentId.trim() || !password.trim()) {
      setError("Please complete every field to access your student dashboard.");
      setSubmitted(false);
      return;
    }

    setError("");
    setSubmitted(true);
  }

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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={studentId}
                      onChange={(event) => setStudentId(event.target.value)}
                      onFocus={() => setFocusField("studentId")}
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onFocus={() => setFocusField("password")}
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
                  {submitted ? "Continue to dashboard" : "Sign in"}
                </Button>

                {error ? (
                  <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-400/20">
                    {error}
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
