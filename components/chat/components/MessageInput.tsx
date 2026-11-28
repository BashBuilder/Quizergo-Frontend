"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MessageInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function MessageInput({ 
  onSend, 
  disabled = false,
  placeholder = "Type your message..." 
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-rule p-4 sm:p-5 lg:p-6">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] resize-none",
            "rounded-xl border border-rule bg-well",
            "px-4 py-2 text-sm text-ink",
            "placeholder:text-ink-quiet",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-marker/50 disabled:cursor-not-allowed",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !value && "disabled:opacity-50"
          )}
          disabled={disabled}
          rows={1}
        />
        
        <Button
          type="button"
          size="icon"
          variant={value.trim() ? "default" : "ghost"}
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
        >
          {disabled ? (
            <Check size={18} className="animate-scale-in" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}