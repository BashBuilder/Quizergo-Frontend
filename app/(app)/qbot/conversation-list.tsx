"use client";

import { AlertCircle, Loader2, MessageCircle, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QbotConversation } from "@/services/qbot.service";

function relativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

function snippet(text: string) {
  return text
    .replace(/[#*_`>~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface ConversationListProps {
  conversations: QbotConversation[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isStreaming: boolean;
  deletingId?: string | null;
  onClose?: () => void;
}

export default function ConversationList({
  conversations,
  isLoading,
  isError,
  onRetry,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isStreaming,
  deletingId,
  onClose,
}: ConversationListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-rule bg-sheet">
      <div className="border-b border-rule p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow text-marker-ink">Qbot</p>
            <p className="mt-1 text-[0.6875rem] text-ink-quiet">
              Your study conversations
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label="Close conversation history"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-quiet transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onNew}
          disabled={isStreaming}
          className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-exam text-[0.75rem] font-semibold text-white transition-colors hover:bg-exam-edge focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus size={13} aria-hidden="true" />
          New conversation
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-1.5 p-1" aria-busy="true">
            <span className="sr-only">Loading conversations</span>
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl bg-well/60 px-3 py-3">
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-ink/10" />
                <div className="mt-2 h-2 w-1/2 animate-pulse rounded bg-ink/10" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="px-3 py-8 text-center">
            <AlertCircle
              size={18}
              className="mx-auto text-rose-500"
              aria-hidden="true"
            />
            <p className="mt-3 text-[0.75rem] font-semibold text-ink">
              Conversations didn&apos;t load.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-rule bg-sheet px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Try again
            </button>
          </div>
        ) : !conversations?.length ? (
          <div className="px-3 py-8 text-center">
            <MessageCircle
              size={18}
              className="mx-auto text-ink-quiet"
              aria-hidden="true"
            />
            <p className="mt-3 text-[0.75rem] font-semibold text-ink">
              No conversations yet.
            </p>
            <p className="mt-1 text-[0.6875rem] leading-5 text-ink-quiet">
              Ask your first question and it will be saved here.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeId;
              const title = conversation.title || "New conversation";
              const last = conversation.lastMessage?.content;

              return (
                <li key={conversation.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => onSelect(conversation.id)}
                    disabled={isStreaming}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 pr-9 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-60",
                      isActive
                        ? "border-marker-line bg-marker-wash"
                        : "border-transparent hover:bg-well/70",
                    )}
                  >
                    <span
                      className={cn(
                        "block truncate text-[0.8125rem] font-semibold",
                        isActive ? "text-marker-ink" : "text-ink-soft",
                      )}
                    >
                      {title}
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate text-[0.6875rem] text-ink-quiet">
                        {last ? snippet(last) : "No messages yet"}
                      </span>
                      <span className="shrink-0 text-[0.6875rem] tabular-nums text-ink-quiet/80">
                        {relativeTime(conversation.updatedAt)}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(conversation.id)}
                    disabled={isStreaming || deletingId === conversation.id}
                    aria-label={`Delete conversation: ${title}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-ink-quiet opacity-100 transition-all hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    {deletingId === conversation.id ? (
                      <Loader2
                        size={12}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Trash2 size={12} aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-rule px-3.5 py-3">
        <p className="text-[0.6875rem] leading-5 text-ink-quiet">
          Qbot keeps track of each conversation so you can come back and
          continue where you stopped.
        </p>
      </div>
    </div>
  );
}
