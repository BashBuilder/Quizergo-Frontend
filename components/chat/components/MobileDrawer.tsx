"use client";

import { cn } from "@/lib/utils";

type MobileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm",
            "transition-all duration-200",
            "animate-in fade-in-0"
          )}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Drawer */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50",
            "rounded-t-2xl sm:rounded-t-3xl",
            "bg-sheet border-t border-rule shadow-xl",
            "animate-slide-up",
            "max-h-[80vh] flex flex-col"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Chat conversation"
        >
          {children}
        </div>
      )}
    </>
  );
}