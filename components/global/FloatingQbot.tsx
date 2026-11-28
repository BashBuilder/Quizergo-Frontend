"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import FloatingQbotContent from "@/components/chat/FloatingQbotContent";

export default function FloatingQbot() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show floating button on the Qbot page itself
  const isOnQbotPage = pathname === "/qbot" || pathname.startsWith("/qbot/");
  if (isOnQbotPage) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center",
          "rounded-full bg-marker text-sheet shadow-lg",
          "hover:bg-marker-deep transition-all focus-visible:ring-2",
          "focus-visible:ring-marker/50 focus-visible:ring-offset-2",
          "animate-bounce",
        )}
        aria-label="Open Qbot chat"
      >
        <Sparkles size={24} />
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <FloatingQbotModal onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

function FloatingQbotModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
        "flex items-end justify-center p-4 sm:p-6",
      )}
      onClick={onClose}
      data-testid="floating-qbot-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Qbot chat"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-lg",
          "rounded-2xl sm:rounded-3xl",
          "bg-sheet border border-rule shadow-xl",
          "animate-slide-up",
          "flex flex-col",
          "h-[80vh]",
        )}
        data-testid="floating-qbot-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-marker-line bg-marker-wash text-marker-ink"
              aria-hidden="true"
            >
              <Sparkles size={15} />
            </span>
            <div>
              <p className="text-[0.8125rem] font-semibold text-ink">
                Qbot
              </p>
              <p className="text-[0.6875rem] text-ink-quiet">
                Your AI study tutor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-quiet transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Close Qbot chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Qbot chat content */}
        <FloatingQbotContent onClose={onClose} />
      </div>
    </div>
  );
}