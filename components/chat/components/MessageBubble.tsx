"use client";

import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  avatar?: React.ReactNode;
};

export function MessageBubble({ 
  role, 
  content, 
  timestamp, 
  isStreaming = false,
  avatar 
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isUser = role === "user";

  return (
    <div 
      className={cn(
        "flex items-start gap-2 sm:gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar */}
      {avatar || (isUser ? (
        <div 
          className={cn(
            "flex-shrink-0 h-7 w-7 items-center justify-center rounded-lg",
            "bg-ink text-sheet text-xs font-semibold"
          )}
          aria-hidden="true"
        >
          U
        </div>
      ) : (
        <div 
          className={cn(
            "flex-shrink-0 h-7 w-7 items-center justify-center rounded-lg",
            "bg-marker-wash text-marker-ink"
          )}
          aria-hidden="true"
        >
          AI
        </div>
      ))}
      
      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl sm:rounded-3xl px-4 py-2.5 sm:px-5 py-3",
          "text-sm text-base",
          isUser
            ? "bg-marker text-sheet rounded-br-[18px] rounded-bl-[18px] rounded-tr-[26px]"
            : "bg-sheet border border-rule rounded-bl-[18px] rounded-br-[18px]"
        )}
      >
        <p className={cn(
          "whitespace-pre-wrap",
          isUser ? "text-base" : "text-ink"
        )}>
          {content}
          {isStreaming && (
            <span 
              className={cn(
                "inline-block w-1 h-4 bg-ink/50 animate-pulse",
                "ml-1 vertical-align-middle"
              )}
              aria-hidden="true"
            />
          )}
        </p>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs text-ink-quiet/60 mt-1.5 opacity-0",
          "hover:opacity-100 transition-opacity"
        )}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}