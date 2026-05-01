"use client";

import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Lock, Sparkles, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const summaryText = useMemo(() => {
    if (submitted) {
      return `Welcome back, ${name || "student"}! Your personalized study board is ready.`;
    }

    return (
      focusHints[focusField] ||
      "Login to continue your daily streak and unlock your next quiz."
    );
  }, [focusField, name, submitted]);

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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.2),_transparent_22%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[linear-gradient(180deg,_rgba(15,23,42,0.92)_0%,_transparent_80%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.25fr_0.95fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute right-0 top-12 h-52 w-52 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-300/20">
                  <Sparkles size={16} /> Student-first login
                </p>
                <h1 className="mt-8 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Your learning hub is one login away.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Sign in to access quizzes, track your progress, and continue
                  the streak you built for your next assessment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.9)] backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-cyan-300">
                    <BookOpen size={20} />
                    <span className="text-sm font-semibold">Study streak</span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-white">
                    4 days
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Keep it up — your quiz momentum is strong.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-violet-500/10 p-5 shadow-[0_18px_60px_-30px_rgba(99,102,241,0.5)] backdrop-blur-xl">
                  <div className="flex items-center gap-3 text-violet-300">
                    <CheckCircle2 size={20} />
                    <span className="text-sm font-semibold">
                      Assessment readiness
                    </span>
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-white">72%</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Target next quiz with recommended review flashcards.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.8)]">
                <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                  <span className="font-semibold text-slate-100">
                    What matters today
                  </span>
                  <span className="rounded-full bg-slate-800/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Student mode
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-3 text-slate-300">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />{" "}
                    Review 3 pending quizzes
                  </p>
                  <p className="flex items-center gap-3 text-slate-300">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-400" />{" "}
                    Save progress after every login
                  </p>
                  <p className="flex items-center gap-3 text-slate-300">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-slate-300" />{" "}
                    Unlock achievements on every passed lesson
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Card className="overflow-hidden bg-slate-950/95 shadow-2xl shadow-slate-950/40 ring-1 ring-white/10">
            <CardHeader>
              <div>
                <CardTitle className="text-2xl text-white">
                  Student Login
                </CardTitle>
                <CardDescription className="mt-2 text-slate-400">
                  Enter your details to open your quiz dashboard and study
                  insights.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="name"
                  >
                    Student name
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/20">
                    <User2 className="text-cyan-300" size={18} />
                    <input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      onFocus={() => setFocusField("name")}
                      placeholder="e.g. Amina Patel"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                      type="text"
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <label
                    className="block text-sm font-medium text-slate-200"
                    htmlFor="studentId"
                  >
                    School email or ID
                  </label>
                  <div className="flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400/20">
                    <BookOpen className="text-violet-300" size={18} />
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

                <div className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/75 p-4 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">
                    Quick student tip
                  </p>
                  <p>{summaryText}</p>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-3xl px-6 py-3 text-sm font-semibold"
                >
                  {submitted
                    ? "Continue to dashboard"
                    : "Sign in and start studying"}
                </Button>

                {error ? (
                  <p className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200 ring-1 ring-red-400/20">
                    {error}
                  </p>
                ) : null}
              </form>
            </CardContent>

            <CardFooter className="flex flex-wrap justify-between gap-3 px-6 pt-4 text-xs text-slate-400 sm:px-4">
              <span>Need help? Contact your campus IT or teacher.</span>
              <span>Designed for quiz-ready students.</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
