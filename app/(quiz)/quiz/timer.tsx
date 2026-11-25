"use client";

import { cn } from "@/lib/utils";
import { Clock, TriangleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface TimerType {
  /** Deadline as an epoch timestamp in milliseconds. `null` means untimed. */
  deadline: number | null;
  /** True once the paper has been handed in (manually or by the clock). */
  submitted: boolean;
  /** Called exactly once when the deadline is reached. */
  onExpire: () => void;
}

const Timer = ({ deadline, submitted, onExpire }: TimerType) => {
  const [now, setNow] = useState(() => Date.now());
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  // Keep the callback fresh without re-arming the countdown.
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Derive remaining time from the deadline, so background throttling,
  // slow devices and refreshes cannot make the clock drift.
  useEffect(() => {
    if (deadline === null || submitted) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline, submitted]);

  const remaining =
    deadline === null ? null : Math.max(0, Math.ceil((deadline - now) / 1000));

  useEffect(() => {
    if (submitted || deadline === null || remaining === null) return;
    if (remaining > 0 || expiredRef.current) return;
    expiredRef.current = true;
    onExpireRef.current();
  }, [deadline, remaining, submitted]);

  if (deadline === null) {
    return (
      <div
        className="flex shrink-0 items-center gap-2 rounded-lg border border-rule bg-well px-3 py-1.5 text-[0.8125rem] font-semibold text-ink-quiet"
        role="timer"
        aria-label="No time limit on this paper"
      >
        <Clock size={13} aria-hidden="true" />
        Untimed
      </div>
    );
  }

  const safeRemaining = remaining ?? 0;
  const mins = Math.floor(safeRemaining / 60);
  const secs = safeRemaining % 60;
  const urgent = safeRemaining <= 5 * 60;

  // Announce only at the thresholds, never every second.
  const announcement =
    safeRemaining > 0 && safeRemaining <= 60
      ? "One minute remaining."
      : safeRemaining > 60 && safeRemaining <= 300
        ? "Five minutes remaining."
        : "";

  return (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-[0.8125rem] font-semibold tabular-nums transition-colors",
          urgent
            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
            : "border border-rule bg-well text-ink-soft",
        )}
        role="timer"
        aria-live="off"
        aria-label={`Time remaining: ${mins} minutes ${secs} seconds${
          urgent ? ", five minutes or less" : ""
        }`}
      >
        {urgent ? (
          <TriangleAlert
            size={13}
            className="animate-pulse"
            aria-hidden="true"
          />
        ) : (
          <Clock size={13} aria-hidden="true" />
        )}
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  );
};

export default React.memo(Timer);
