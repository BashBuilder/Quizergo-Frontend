"use client";

import { cn } from "@/lib/utils";

type QuickRepliesProps = {
  replies: string[];
  onSelect: (reply: string) => void;
};

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-full",
            "bg-well text-ink-soft hover:bg-marker-wash",
            "hover:text-marker-ink transition-colors",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-marker/50"
          )}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}