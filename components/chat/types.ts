"use client";

import { ReactNode } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

export type ChatboxProps = {
  /** Name of the assistant displayed in the header */
  assistantName?: string;
  /** Number of unread messages shown on the trigger button */
  unreadCount?: number;
  /** Additional className for the trigger button */
  className?: string;
  /** Quick reply suggestions to display */
  quickReplies?: string[];
  /** Callback when a message is sent */
  onMessageSent?: (message: string) => void;
};

export type ChatHeaderProps = {
  assistantName: string;
  muted: boolean;
  onMuteToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  showMinimize?: boolean;
};

export type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  avatar?: ReactNode;
};

export type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export type QuickRepliesProps = {
  replies: string[];
  onSelect: (reply: string) => void;
};