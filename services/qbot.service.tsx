import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { apiUrl, refreshAccessToken } from "@/config/axios";
import { useAuth } from "@/hooks/auth";
import { tokenStorage } from "@/lib/token-storage";
import { TOKEN_KEY } from "@/data/auth.constants";
import { parseSseEvents } from "@/lib/sse";
import { toast } from "sonner";

/** Mirrors the backend's QbotMessage model. */
export interface QbotMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  reasoning: string | null;
  createdAt: string;
}

/** Mirrors the backend's QbotConversation model. */
export interface QbotConversation {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastMessage?: QbotMessage;
}

export interface QbotConversationList {
  conversations: QbotConversation[];
  total: number;
  limit: number;
  offset: number;
}

/** Mirrors the backend's QbotMessageHistory response. */
export interface QbotMessageHistory {
  messages: QbotMessage[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export type QbotStreamEvent =
  | { type: "start"; conversationId: string; messageId: string }
  | { type: "chunk"; content: string; reasoning: string }
  | {
      type: "complete";
      conversationId: string;
      messageId: string;
      content: string;
      reasoning: string;
    }
  | { type: "error"; message: string };

class QbotStreamError extends Error {}

function readAxiosMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const useQbotConversations = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["qbot", "conversations"],
    queryFn: async () => {
      const { data } = await axios.get<QbotConversationList>(
        "/qbot/conversations",
        { params: { limit: 50 } },
      );
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 15_000,
    retry: 1,
  });
};

export const useQbotMessages = (conversationId: string | null) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["qbot", "conversation", conversationId],
    queryFn: async () => {
      const { data } = await axios.get<QbotMessageHistory>(
        `/qbot/conversations/${conversationId}/messages`,
        { params: { limit: 100 } },
      );
      return data;
    },
    enabled: Boolean(conversationId) && isAuthenticated,
    staleTime: 10_000,
    retry: 1,
  });
};

export const useDeleteQbotConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      await axios.delete(`/qbot/conversations/${conversationId}`);
    },
    onSuccess: (_data, conversationId) => {
      queryClient.removeQueries({
        queryKey: ["qbot", "conversation", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["qbot", "conversations"] });
    },
    onError: (error: unknown) => {
      toast.error(
        readAxiosMessage(error, "Couldn't delete that conversation. Try again."),
      );
    },
  });
};

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

async function errorFromResponse(response: Response): Promise<QbotStreamError> {
  if (response.status === 401) {
    return new QbotStreamError(
      "Your session has expired. Please sign in again.",
    );
  }

  let message = "Qbot couldn't answer that right now. Please try again.";
  try {
    const body = (await response.json()) as { message?: unknown };
    if (typeof body.message === "string" && body.message.trim()) {
      message = body.message;
    }
  } catch {
    // Non-JSON error body -- keep the friendly fallback.
  }
  return new QbotStreamError(message);
}

/**
 * Send a message and consume Qbot's SSE response.
 * Uses fetch directly because EventSource can't POST or set an auth header.
 */
export async function streamQbotMessage({
  message,
  conversationId,
  signal,
  onEvent,
}: {
  message: string;
  conversationId?: string;
  signal?: AbortSignal;
  onEvent: (event: QbotStreamEvent) => void;
}): Promise<void> {
  const url = `${apiUrl.replace(/\/+$/, "")}/qbot/message`;
  const body = JSON.stringify({
    message,
    ...(conversationId ? { conversationId } : {}),
  });

  const send = (token: string | null) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { method: "POST", headers, body, signal });
  };

  let response: Response;
  try {
    response = await send(tokenStorage.getItem(TOKEN_KEY));
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) response = await send(refreshed);
    }
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new QbotStreamError(
      "Couldn't reach Qbot. Check your connection and try again.",
    );
  }

  if (!response.ok) throw await errorFromResponse(response);
  if (!response.body) {
    throw new QbotStreamError(
      "This browser can't display Qbot's reply. Please try a newer browser.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sawComplete = false;

  const handleFrames = (raw: string) => {
    let parsed: { events: QbotStreamEvent[]; rest: string };
    try {
      parsed = parseSseEvents<QbotStreamEvent>(raw);
    } catch {
      throw new QbotStreamError(
        "Qbot sent an unreadable reply. Please try again.",
      );
    }

    buffer = parsed.rest;
    for (const event of parsed.events) {
      if (event.type === "error") {
        throw new QbotStreamError(
          event.message || "Qbot couldn't finish that reply. Please try again.",
        );
      }
      if (event.type === "complete") sawComplete = true;
      onEvent(event);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      handleFrames(buffer);
    }

    buffer += decoder.decode();
    if (buffer.trim()) handleFrames(`${buffer}\n\n`);
    if (!sawComplete) {
      throw new QbotStreamError(
        "Qbot's reply was cut off. Please try again.",
      );
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    if (isAbortError(error) || error instanceof QbotStreamError) throw error;
    throw new QbotStreamError(
      "The connection to Qbot was interrupted. Please try again.",
    );
  } finally {
    reader.releaseLock();
  }
}
