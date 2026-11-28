"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Menu,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";
import {
  streamQbotMessage,
  useDeleteQbotConversation,
  useQbotConversations,
  useQbotMessages,
} from "@/services/qbot.service";
import type { QbotConversation } from "@/services/qbot.service";
import ConversationList from "./conversation-list";
import Composer from "./composer";
import MessageList from "./message-list";
import type { ChatMessage } from "./types";

const ACTIVE_CONVERSATION_KEY = "qbotActiveConversation";
const EMPTY_MESSAGES: ChatMessage[] = [];

function readActiveConversation() {
  try {
    return sessionStorage.getItem(ACTIVE_CONVERSATION_KEY);
  } catch {
    return null;
  }
}

function storeActiveConversation(conversationId: string | null) {
  try {
    if (conversationId) {
      sessionStorage.setItem(ACTIVE_CONVERSATION_KEY, conversationId);
    } else {
      sessionStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
  } catch {
    // Storage can be unavailable in private browsing; not worth blocking on.
  }
}

export default function QbotContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[] | null>(
    null,
  );
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const streamingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const restoredRef = useRef(false);

  const conversationsQuery = useQbotConversations();
  const messagesQuery = useQbotMessages(activeId);
  const deleteConversation = useDeleteQbotConversation();

  const conversations = conversationsQuery.data?.conversations;
  const activeConversation = conversations?.find(
    (conversation) => conversation.id === activeId,
  );

  // Local messages exist only while a reply is being sent or shown. Once the
  // student switches conversations, the server history takes over again.
  const messages: ChatMessage[] =
    localMessages ?? messagesQuery.data?.messages ?? EMPTY_MESSAGES;
  const isLoadingHistory =
    Boolean(activeId) && localMessages === null && messagesQuery.isLoading;
  const isHistoryUnavailable =
    Boolean(activeId) && localMessages === null && messagesQuery.isError;
  const isComposerLocked = isLoadingHistory || isHistoryUnavailable;
  const failedMessage = messages.find(
    (message) => message.role === "user" && message.failed,
  );

  const userInitials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "You";

  // Remember the open conversation across navigation within this tab.
  useEffect(() => {
    const saved = readActiveConversation();
    // Restoring after hydration keeps the server and client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setActiveId(saved);
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    storeActiveConversation(activeId);
  }, [activeId]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!historyOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHistoryOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [historyOpen]);

  const runStream = async (
    text: string,
    conversationId?: string,
    replaceMessageId?: string,
  ) => {
    if (streamingRef.current) return;

    streamingRef.current = true;
    setIsStreaming(true);
    setStreamError(null);

    const tempUserId = `user-${Date.now()}`;
    const tempAssistantId = `assistant-${Date.now()}`;
    const createdAt = new Date().toISOString();
    let currentUserId = tempUserId;
    let startedConversationId = conversationId;
    let content = "";

    setLocalMessages((previous) => [
      ...(previous ?? messagesQuery.data?.messages ?? []).filter(
        (message) => message.id !== replaceMessageId,
      ),
      {
        id: tempUserId,
        conversationId: conversationId ?? "",
        role: "user",
        content: text,
        reasoning: null,
        createdAt,
      },
      {
        id: tempAssistantId,
        conversationId: conversationId ?? "",
        role: "assistant",
        content: "",
        reasoning: null,
        createdAt,
        pending: true,
      },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamQbotMessage({
        message: text,
        conversationId,
        signal: controller.signal,
        onEvent: (event) => {
          if (event.type === "start") {
            startedConversationId = event.conversationId;
            currentUserId = event.messageId;
            setActiveId(event.conversationId);
            setLocalMessages((previous) =>
              (previous ?? []).map((message) =>
                message.id === tempUserId
                  ? {
                      ...message,
                      id: event.messageId,
                      conversationId: event.conversationId,
                    }
                  : message,
              ),
            );
          } else if (event.type === "chunk") {
            content += event.content;
            setLocalMessages((previous) =>
              (previous ?? []).map((message) =>
                message.id === tempAssistantId
                  ? { ...message, content }
                  : message,
              ),
            );
          } else if (event.type === "complete") {
            content = event.content;
            setLocalMessages((previous) =>
              (previous ?? []).map((message) =>
                message.id === tempAssistantId
                  ? {
                      ...message,
                      id: event.messageId,
                      conversationId: event.conversationId,
                      content: event.content,
                      reasoning: event.reasoning || null,
                      pending: false,
                    }
                  : message,
              ),
            );
          }
        },
      });

      queryClient.invalidateQueries({ queryKey: ["qbot", "conversations"] });
      if (startedConversationId) {
        queryClient.invalidateQueries({
          queryKey: ["qbot", "conversation", startedConversationId],
        });
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      setStreamError(
        error instanceof Error && error.message
          ? error.message
          : "Qbot couldn't answer that. Please try again.",
      );
      setLocalMessages((previous) =>
        (previous ?? [])
          .filter((message) => message.id !== tempAssistantId)
          .map((message) =>
            message.id === currentUserId
              ? { ...message, pending: false, failed: true }
              : message,
          ),
      );

      if (startedConversationId) {
        queryClient.invalidateQueries({ queryKey: ["qbot", "conversations"] });
      }
    } finally {
      abortRef.current = null;
      streamingRef.current = false;
      setIsStreaming(false);
    }
  };

  const sendText = (
    text: string,
    conversationId?: string,
    replaceMessageId?: string,
  ) => {
    const trimmed = text.trim();
    if (!trimmed || streamingRef.current || isComposerLocked) return;
    void runStream(trimmed, conversationId, replaceMessageId);
  };

  const handleSend = () => {
    if (streamingRef.current) return;
    const text = input.trim();
    if (!text) return;
    setInput("");
    sendText(text, activeId ?? undefined);
  };

  // The backend has no regenerate endpoint, so retrying re-sends the question;
  // a reply that was already persisted may leave an extra user turn server-side.
  const retryFailedMessage = (message: ChatMessage) => {
    if (streamingRef.current) return;
    setStreamError(null);
    sendText(
      message.content,
      message.conversationId || undefined,
      message.id,
    );
  };

  const handleRetryFailed = (index: number) => {
    const message = messages[index];
    if (message?.role === "user" && message.failed) {
      retryFailedMessage(message);
    }
  };

  const handleRetryAnswer = (index: number) => {
    if (streamingRef.current) return;
    const prompt = messages
      .slice(0, index)
      .reverse()
      .find((message) => message.role === "user");
    if (!prompt) return;
    sendText(prompt.content, activeId ?? undefined);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard.");
    } catch {
      toast.error("Couldn't copy that. Select the text and copy it manually.");
    }
  };

  const handleSelectConversation = (id: string) => {
    setHistoryOpen(false);
    if (streamingRef.current || id === activeId) return;
    setActiveId(id);
    setLocalMessages(null);
    setStreamError(null);
  };

  const handleNewConversation = () => {
    if (streamingRef.current) return;
    setActiveId(null);
    setLocalMessages(null);
    setStreamError(null);
    setHistoryOpen(false);
    storeActiveConversation(null);
  };

  const handleDeleteConversation = async (id: string) => {
    if (streamingRef.current) return;
    const conversation: QbotConversation | undefined = conversations?.find(
      (item) => item.id === id,
    );
    const title = conversation?.title || "this conversation";
    if (
      !window.confirm(
        `Delete "${title}"? This removes the conversation and its messages for good.`,
      )
    ) {
      return;
    }

    try {
      await deleteConversation.mutateAsync(id);
      if (activeId === id) {
        setActiveId(null);
        setLocalMessages(null);
        setStreamError(null);
      }
    } catch {
      // The service surfaces the error toast.
    }
  };

  const deletingId = deleteConversation.isPending
    ? (deleteConversation.variables ?? null)
    : null;

  const listProps = {
    conversations,
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    onRetry: () => conversationsQuery.refetch(),
    activeId,
    onSelect: handleSelectConversation,
    onNew: handleNewConversation,
    onDelete: handleDeleteConversation,
    isStreaming,
    deletingId,
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-7xl gap-4 px-3 py-3 sm:gap-5 sm:px-6 sm:py-4">
      <h1 className="sr-only">Qbot study assistant</h1>

      <aside className="hidden w-64 shrink-0 lg:flex xl:w-72">
        <ConversationList {...listProps} />
      </aside>

      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-rule bg-sheet"
        aria-label="Qbot chat"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-rule px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              aria-label="Open conversation history"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-quiet transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 lg:hidden"
            >
              <Menu size={17} aria-hidden="true" />
            </button>

            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-marker-line bg-marker-wash text-marker-ink"
              aria-hidden="true"
            >
              <Sparkles size={15} />
            </span>

            <div className="min-w-0">
              <p className="text-[0.8125rem] font-semibold text-ink">Qbot</p>
              <p className="truncate text-[0.6875rem] text-ink-quiet">
                {activeConversation?.title || "Your AI study tutor"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewConversation}
            disabled={isStreaming}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-rule bg-sheet px-2.5 text-[0.75rem] font-semibold text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
          >
            <Plus size={13} aria-hidden="true" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col bg-paper">
          <MessageList
            messages={messages}
            conversationId={activeId}
            isLoading={isLoadingHistory}
            isError={isHistoryUnavailable}
            onRetryLoad={() => messagesQuery.refetch()}
            onPrompt={(prompt) => sendText(prompt, activeId ?? undefined)}
            onCopy={handleCopy}
            onRetryAnswer={handleRetryAnswer}
            onRetryFailed={handleRetryFailed}
            isStreaming={isStreaming}
            userInitials={userInitials}
          />

          {streamError && (
            <div
              role="alert"
              className="flex items-start gap-3 border-t border-rose-200 bg-rose-50 px-4 py-3 sm:px-6"
            >
              <AlertCircle
                size={15}
                className="mt-0.5 shrink-0 text-rose-500"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[0.8125rem] font-semibold text-rose-900">
                  Qbot couldn&apos;t answer that.
                </p>
                <p className="mt-0.5 text-[0.75rem] leading-5 text-rose-800">
                  {streamError}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {failedMessage && (
                  <button
                    type="button"
                    onClick={() => retryFailedMessage(failedMessage)}
                    disabled={isStreaming}
                    className="rounded-lg border border-rose-200 bg-sheet px-2.5 py-1.5 text-[0.6875rem] font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Try again
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStreamError(null)}
                  aria-label="Dismiss error"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

        <Composer
          value={input}
          onChange={setInput}
          onSend={handleSend}
          isStreaming={isStreaming}
          isLoadingHistory={isLoadingHistory}
          isHistoryUnavailable={isHistoryUnavailable}
        />
      </section>

      {historyOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            onClick={() => setHistoryOpen(false)}
            aria-label="Close conversation history"
            className="absolute inset-0 bg-exam-deep/40 backdrop-blur-[1px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your conversations"
            className="absolute inset-y-0 left-0 w-[86%] max-w-sm p-3"
          >
            <ConversationList
              {...listProps}
              onClose={() => setHistoryOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
