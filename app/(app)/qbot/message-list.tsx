"use client";

import { useEffect, useRef } from "react";
import {
  AlertCircle,
  Copy,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import LessonContent from "@/components/global/LessonContent";
import { cn } from "@/lib/utils";
import { qbotStarters } from "./constants";
import type { ChatMessage } from "./types";

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1 py-1"
      role="status"
      aria-label="Qbot is thinking"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-quiet/60"
          style={{ animationDelay: `${delay}ms` }}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Qbot is thinking…</span>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon: typeof Copy;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.6875rem] font-medium text-ink-quiet transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
    >
      <Icon size={12} aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function UserMessage({
  message,
  initials,
  onRetry,
}: {
  message: ChatMessage;
  initials: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex justify-end gap-2.5 sm:gap-3">
      <div className="min-w-0 max-w-[85%] sm:max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl rounded-tr-md border px-4 py-2.5",
            message.failed
              ? "border-rose-200 bg-rose-50"
              : "border-marker-line bg-marker-wash",
          )}
        >
          <p className="whitespace-pre-wrap break-words text-[0.9375rem] leading-6 text-ink">
            {message.content}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-end gap-2 text-[0.6875rem]">
          {message.failed && (
            <>
              <span className="flex items-center gap-1 font-medium text-rose-600">
                <AlertCircle size={10} aria-hidden="true" />
                Not answered
              </span>
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1 rounded-md px-1 py-0.5 font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <RotateCcw size={10} aria-hidden="true" />
                Try again
              </button>
            </>
          )}
          <time
            dateTime={message.createdAt}
            className="tabular-nums text-ink-quiet/80"
          >
            {formatTime(message.createdAt)}
          </time>
        </div>
      </div>

      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-exam text-[0.6875rem] font-semibold text-white"
        aria-hidden="true"
      >
        {initials}
      </span>
    </div>
  );
}

function AssistantMessage({
  message,
  index,
  onCopy,
  onRetryAnswer,
  isStreaming,
}: {
  message: ChatMessage;
  index: number;
  onCopy: (content: string) => void;
  onRetryAnswer: (index: number) => void;
  isStreaming: boolean;
}) {
  const isPending = Boolean(message.pending);

  return (
    <div className="flex gap-2.5 sm:gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-marker-line bg-marker-wash text-marker-ink"
        aria-hidden="true"
      >
        <Sparkles size={14} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-marker-ink">
            Qbot
          </span>
          <time
            dateTime={message.createdAt}
            className="text-[0.6875rem] tabular-nums text-ink-quiet/80"
          >
            {formatTime(message.createdAt)}
          </time>
        </div>

        <div className="mt-1.5 rounded-2xl rounded-tl-md border border-rule bg-sheet px-4 py-3 sm:px-5">
          {isPending && !message.content ? (
            <TypingDots />
          ) : (
            <LessonContent content={message.content} compact />
          )}

          {isPending && message.content && (
            <p className="mt-2 flex items-center gap-1.5 text-[0.6875rem] text-ink-quiet">
              <Loader2
                size={11}
                className="animate-spin"
                aria-hidden="true"
              />
              Still writing…
            </p>
          )}
        </div>

        {!isPending && message.content && (
          <div className="mt-1 flex items-center gap-1">
            <ActionButton
              label="Copy"
              icon={Copy}
              onClick={() => onCopy(message.content)}
            />
            <ActionButton
              label="Ask again"
              icon={RotateCcw}
              disabled={isStreaming}
              onClick={() => onRetryAnswer(index)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Welcome({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-marker-line bg-marker-wash text-marker-ink"
        aria-hidden="true"
      >
        <Sparkles size={22} />
      </span>

      <p className="eyebrow mt-5 text-marker-ink">Qbot</p>
      <h2 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[2rem]">
        Stuck on something? Ask.
      </h2>
      <p className="mt-2 max-w-md text-[0.875rem] leading-6 text-ink-quiet">
        Your AI study tutor for JAMB and WAEC. Ask any subject question and
        Qbot will explain it step by step, in language that makes sense.
      </p>

      <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
        {qbotStarters.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
            className="rounded-2xl border border-rule bg-sheet p-3.5 text-left text-[0.8125rem] font-medium leading-5 text-ink-soft transition-colors hover:border-marker-line hover:bg-marker-wash hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {prompt}
          </button>
        ))}
      </div>

      <p className="mt-6 max-w-sm text-[0.6875rem] leading-5 text-ink-quiet">
        Qbot is a study helper, not a replacement for your textbook. Check
        important facts before your exam.
      </p>
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8"
      aria-busy="true"
    >
      <span className="sr-only">Loading conversation</span>
      <div className="flex justify-end">
        <div className="h-16 w-2/3 animate-pulse rounded-2xl border border-rule bg-well" />
      </div>
      <div className="flex gap-3">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-well" />
        <div className="h-32 flex-1 animate-pulse rounded-2xl border border-rule bg-well" />
      </div>
      <div className="flex justify-end">
        <div className="h-12 w-1/2 animate-pulse rounded-2xl border border-rule bg-well" />
      </div>
      <div className="flex gap-3">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-well" />
        <div className="h-24 flex-1 animate-pulse rounded-2xl border border-rule bg-well" />
      </div>
    </div>
  );
}

interface MessageListProps {
  messages: ChatMessage[];
  conversationId: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetryLoad: () => void;
  onPrompt: (prompt: string) => void;
  onCopy: (content: string) => void;
  onRetryAnswer: (index: number) => void;
  onRetryFailed: (index: number) => void;
  isStreaming: boolean;
  userInitials: string;
}

export default function MessageList({
  messages,
  conversationId,
  isLoading,
  isError,
  onRetryLoad,
  onPrompt,
  onCopy,
  onRetryAnswer,
  onRetryFailed,
  isStreaming,
  userInitials,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  // Follow the conversation while the student is already at the bottom.
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !stickToBottomRef.current) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, conversationId, isLoading]);

  useEffect(() => {
    stickToBottomRef.current = true;
  }, [conversationId]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    stickToBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      role="log"
      aria-label="Conversation with Qbot"
      aria-busy={isStreaming || isLoading}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      {isLoading ? (
        <MessageSkeleton />
      ) : isError ? (
        <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-6 py-12 text-center">
          <AlertCircle
            size={22}
            className="text-rose-500"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-semibold text-ink">
            That conversation didn&apos;t load.
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
            Your messages are safe on the server. Try opening it again.
          </p>
          <button
            type="button"
            onClick={onRetryLoad}
            className="mt-5 rounded-lg border border-rule bg-sheet px-4 py-2 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Try again
          </button>
        </div>
      ) : messages.length === 0 ? (
        <Welcome onPrompt={onPrompt} />
      ) : (
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
          {messages.map((message, index) =>
            message.role === "assistant" ? (
              <AssistantMessage
                key={message.id}
                message={message}
                index={index}
                onCopy={onCopy}
                onRetryAnswer={onRetryAnswer}
                isStreaming={isStreaming}
              />
            ) : (
              <UserMessage
                key={message.id}
                message={message}
                initials={userInitials}
                onRetry={() => onRetryFailed(index)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
