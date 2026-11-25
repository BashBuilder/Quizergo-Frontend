/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";
import { useGetSubjects } from "@/services/question.service";
import { Skeleton } from "@/components/ui/skeleton";

interface SubjectsProps {
  length?: number;
}

function Subjects({ length }: SubjectsProps) {
  const {
    data: subjects,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetSubjects();
  const subjectsList = length ? subjects?.slice(0, length) : subjects;
  const count = subjectsList?.length ?? 0;

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-20">
        <div className="grid gap-8 border-b border-rule pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="eyebrow text-marker-ink">Subject index</p>
            <h1 className="mt-4 max-w-2xl text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.75rem] lg:text-[3.25rem]">
              Every paper on your timetable.
            </h1>
          </div>

          <div className="md:justify-self-end">
            <p className="max-w-sm text-[0.9375rem] leading-7 text-ink-quiet">
              Sciences, arts and commercial subjects. Pick one to start a paper
              with it already selected.
            </p>
            {!isLoading && !error && (
              <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-quiet">
                <span className="tabular-nums text-ink">{count}</span> subjects
                on the index
              </p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="mt-10 divide-y divide-rule border-y border-rule">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] items-center gap-6 py-5"
                aria-hidden="true"
              >
                <div className="flex items-center gap-5">
                  <Skeleton className="h-14 w-14 rounded-xl bg-well" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded-sm bg-well" />
                    <Skeleton className="h-3 w-64 rounded-sm bg-well" />
                  </div>
                </div>
                <Skeleton className="h-3 w-16 rounded-sm bg-well" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-3xl border border-rule bg-sheet px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">
              The subject index didn&apos;t load.
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-6 text-ink-quiet">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              aria-busy={isFetching}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-rule bg-sheet px-4 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well disabled:opacity-50"
            >
              <RotateCw
                size={13}
                className={isFetching ? "animate-spin" : undefined}
                aria-hidden="true"
              />
              {isFetching ? "Trying again…" : "Try again"}
            </button>
          </div>
        )}

        {!isLoading && !error && subjectsList && subjectsList.length === 0 && (
          <div className="mt-10 rounded-3xl border border-rule bg-sheet px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">
              No subjects are listed yet.
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-[0.8125rem] leading-6 text-ink-quiet">
              The index is being updated. Try again in a moment.
            </p>
          </div>
        )}

        {!isLoading && !error && subjectsList && subjectsList.length > 0 && (
          <ol className="mt-10 border-y border-rule">
            {subjectsList.map((subject, index) => (
              <li
                key={subject.apiKey ?? subject.id ?? index}
                className="border-b border-rule last:border-b-0"
              >
                <Link
                  href={`/setup/?subject=${subject.apiKey}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3 py-5 transition-colors hover:bg-well/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:grid-cols-[2.25rem_3.5rem_1fr_auto] sm:gap-x-6"
                >
                  <span
                    className="hidden text-[0.6875rem] font-semibold tabular-nums text-ink-quiet sm:block"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {subject.image ? (
                    <img
                      src={subject.image}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 rounded-xl border border-rule object-cover"
                    />
                  ) : (
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-xl border border-marker-line bg-marker-wash text-sm font-semibold text-marker-ink"
                      aria-hidden="true"
                    >
                      {subject.name.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <span className="min-w-0">
                    <span className="block text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-marker-ink">
                      {subject.name}
                    </span>
                    <span className="mt-1 line-clamp-1 block text-[0.8125rem] leading-6 text-ink-quiet">
                      {subject.description?.trim() ||
                        "Past questions with a timed session and full marking."}
                    </span>
                  </span>

                  <span className="col-start-3 row-start-1 flex items-center gap-4 justify-self-end sm:col-start-4 sm:row-start-auto">
                    <span className="hidden text-[0.8125rem] tabular-nums text-ink-quiet sm:block">
                      {subject.questions || "Past questions"}
                    </span>
                    <ArrowRight
                      size={15}
                      className="text-ink-quiet/50 transition-colors group-hover:text-marker-ink"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default React.memo(Subjects);
