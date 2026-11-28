"use client";

import { Volume2, VolumeX, Minimize, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatHeaderProps = {
  assistantName: string;
  muted: boolean;
  onMuteToggle: () => void;
  onMinimize: () => void;
  onClose: () => void;
  showMinimize?: boolean;
};

export function ChatHeader({
  assistantName,
  muted,
  onMuteToggle,
  onMinimize,
  onClose,
  showMinimize = true,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-rule p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div 
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "bg-marker-wash text-marker-ink"
          )}
          aria-hidden="true"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{assistantName}</h3>
          <div className="flex items-center gap-1.5">
            <div 
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                muted ? "bg-ink-quiet" : "bg-correct"
              )}
              aria-hidden="true"
            />
            <span className={cn(
              "text-xs",
              muted ? "text-ink-quiet" : "text-correct"
            )}>
              {muted ? "Offline" : "Online"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2">
        {showMinimize && (
          <button
            onClick={onMinimize}
            className={cn(
              "hidden sm:flex h-8 w-8 items-center justify-center rounded-lg",
              "text-ink-quiet hover:bg-well hover:text-ink transition-colors",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-marker/50"
            )}
            aria-label="Minimize"
          >
            <Minimize size={16} />
          </button>
        )}
        
        <button
          onClick={onClose}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            "text-ink-quiet hover:bg-well hover:text-ink transition-colors",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-marker/50"
          )}
          aria-label="Close chat"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}