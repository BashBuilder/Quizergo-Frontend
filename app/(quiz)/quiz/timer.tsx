"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface TimerType {
  submitted: boolean;
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  totalTime: number;
}

const Timer = ({ submitted, totalTime, setSubmitted }: TimerType) => {
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [submitted, setSubmitted]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timePct = (timeLeft / totalTime) * 100;
  const timerUrgent = timeLeft <= 5 * 60;

  useEffect(() => {
    if (submitted) {
      clearInterval(timerRef.current!);
    }
  }, [submitted]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold transition-colors shrink-0",
        timerUrgent
          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
          : "bg-slate-100 text-slate-700",
      )}
      aria-label={`Time remaining: ${mins} minutes ${secs} seconds`}
      aria-live="polite"
    >
      <Clock
        size={14}
        className={timerUrgent ? "animate-pulse" : ""}
        aria-hidden="true"
      />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
};

export default React.memo(Timer);
