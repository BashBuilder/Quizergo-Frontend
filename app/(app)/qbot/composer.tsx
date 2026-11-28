"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isStreaming: boolean;
  isLoadingHistory: boolean;
  isHistoryUnavailable: boolean;
}

export default function Composer({
  value,
  onChange,
  onSend,
  isStreaming,
  isLoadingHistory,
  isHistoryUnavailable,
}: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow with the content, up to roughly five lines.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onSend();
    }
  };

  const isLocked = isLoadingHistory || isHistoryUnavailable;
  const canSend = value.trim().length > 0 && !isStreaming && !isLocked;

  return (
    <div className="border-t border-rule bg-sheet px-3 pb-3 pt-3 sm:px-5 sm:pb-4">
      <div className="flex items-end gap-2">
        <label htmlFor="qbot-input" className="sr-only">
          Ask Qbot a question
        </label>
        <textarea
          id="qbot-input"
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={5000}
          disabled={isLocked}
          placeholder={
            isHistoryUnavailable
              ? "This conversation couldn't open"
              : isLoadingHistory
                ? "Loading this conversation…"
                : isStreaming
                  ? "Qbot is still answering…"
                  : "Ask Qbot a question…"
          }
          aria-describedby="qbot-composer-hint"
          className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border border-rule bg-paper px-4 py-3 text-[0.9375rem] leading-6 text-ink outline-none transition-colors placeholder:text-ink-quiet focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label={
            isStreaming
              ? "Qbot is replying"
              : isLoadingHistory
                ? "Loading conversation"
                : isHistoryUnavailable
                  ? "Conversation unavailable"
                  : "Send message"
          }
          aria-busy={isStreaming || isLocked}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            canSend
              ? "bg-exam text-white hover:bg-exam-edge active:scale-[0.98]"
              : "bg-well text-ink-quiet",
          )}
        >
          {isStreaming ? (
            <Loader2 size={17} className="animate-spin" aria-hidden="true" />
          ) : (
            <ArrowUp size={17} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="qbot-composer-hint"
        className="mt-2 flex items-center justify-between gap-3 text-[0.6875rem] text-ink-quiet"
      >
        <span>
          {value.length > 4500 && (
            <span className="tabular-nums">{value.length}/5000</span>
          )}
        </span>
        <span className="hidden sm:block">
          Enter to send · Shift + Enter for a new line
        </span>
      </div>
    </div>
  );
}
