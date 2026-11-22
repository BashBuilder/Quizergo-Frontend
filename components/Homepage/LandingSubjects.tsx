"use client";

import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSubjects } from "@/services/question.service";

const PREVIEW_COUNT = 8;

export default function LandingSubjects() {
  const { data, isLoading, isError, refetch, isFetching } = useGetSubjects();
  const subjects = data?.slice(0, PREVIEW_COUNT) ?? [];

  return (
    <section className="border-b border-slate-200/70 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
              Subjects
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Everything on your exam timetable.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Sciences, arts and commercial subjects — pick one and start a
              focused practice session.
            </p>
          </div>

          <Link
            href="/subjects"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-700"
          >
            View all subjects
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {isLoading && (
          <div
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            aria-hidden="true"
          >
            {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <Skeleton className="h-10 w-10 rounded-xl bg-slate-200/70" />
                <Skeleton className="mt-4 h-4 w-2/3 bg-slate-200/70" />
                <Skeleton className="mt-2.5 h-3 w-full bg-slate-200/70" />
                <Skeleton className="mt-1.5 h-3 w-4/5 bg-slate-200/70" />
                <Skeleton className="mt-6 h-3 w-1/2 bg-slate-200/70" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              We couldn&apos;t load the subject list right now.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Check your connection and try again.
            </p>
            <Button
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
              aria-busy={isFetching}
            >
              <RotateCw
                size={14}
                className={isFetching ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              {isFetching ? "Trying again…" : "Try again"}
            </Button>
          </div>
        )}

        {!isLoading && !isError && subjects.length === 0 && (
          <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              Subjects are temporarily unavailable.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              You can still browse the full subject list.
            </p>
            <Link
              href="/subjects"
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 rounded-xl",
              })}
            >
              Browse subjects
            </Link>
          </div>
        )}

        {!isLoading && !isError && subjects.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <Link
                key={subject.apiKey}
                href={`/setup?subject=${subject.apiKey}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-sm font-semibold text-primary-700">
                      {subject.name.charAt(0).toUpperCase()}
                    </span>
                    <ArrowRight
                      size={15}
                      className="mt-1 text-slate-300 transition-colors group-hover:text-primary-600"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">
                    {subject.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">
                    {subject.description?.trim() ||
                      "Practice real past questions with timed sessions and full explanations."}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="font-medium text-slate-500">
                    {subject.questions || "Past questions"}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-500 transition-colors group-hover:text-primary-700">
                    Practice
                    <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
