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
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="eyebrow text-marker-ink">The subject index</p>
            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.5rem] lg:text-[2.75rem]">
              Everything on your exam timetable.
            </h2>
          </div>

          <div className="md:justify-self-end md:pb-1">
            <p className="max-w-sm text-[0.9375rem] leading-7 text-ink-quiet">
              Sciences, arts and commercial subjects. Pick one and the setup
              starts with it already on the paper.
            </p>
            <Link
              href="/subjects"
              className="group mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
            >
              View all subjects
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {isLoading && (
          <div
            className="mt-12 grid gap-x-12 sm:grid-cols-2"
            aria-hidden="true"
          >
            {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-t border-rule py-4"
              >
                <Skeleton className="h-3 w-5 rounded-sm bg-well" />
                <Skeleton className="h-4 w-2/3 rounded-sm bg-well" />
                <Skeleton className="ml-auto h-3 w-16 rounded-sm bg-well" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="mt-12 rounded-3xl border border-rule bg-sheet px-6 py-10 text-center">
            <p className="text-sm font-semibold text-ink">
              We couldn&apos;t load the subject index.
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-6 text-ink-quiet">
              Your connection may have dropped. Try again — nothing on this page
              depends on it.
            </p>
            <Button
              variant="outline"
              className="mt-5 h-9 rounded-lg border-rule text-[0.8125rem]"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
              aria-busy={isFetching}
            >
              <RotateCw
                size={13}
                className={isFetching ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              {isFetching ? "Trying again…" : "Try again"}
            </Button>
          </div>
        )}

        {!isLoading && !isError && subjects.length === 0 && (
          <div className="mt-12 rounded-3xl border border-rule bg-sheet px-6 py-10 text-center">
            <p className="text-sm font-semibold text-ink">
              The index is empty right now.
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-6 text-ink-quiet">
              You can still open the full subject list and check again there.
            </p>
            <Link
              href="/subjects"
              className={buttonVariants({
                variant: "outline",
                className: "mt-5 h-9 rounded-lg border-rule text-[0.8125rem]",
              })}
            >
              Browse subjects
            </Link>
          </div>
        )}

        {!isLoading && !isError && subjects.length > 0 && (
          <ol className="mt-12 grid gap-x-12 sm:grid-cols-2">
            {subjects.map((subject, index) => (
              <li key={subject.apiKey} className="border-t border-rule">
                <Link
                  href={`/setup?subject=${subject.apiKey}`}
                  className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                >
                  <span className="text-[0.6875rem] font-semibold tabular-nums text-ink-quiet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-marker-ink">
                      {subject.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-quiet">
                      {subject.questions || "Past questions"}
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-ink-quiet/50 transition-colors group-hover:text-marker-ink"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
