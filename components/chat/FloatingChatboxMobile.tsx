"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Volume2, VolumeX, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
};

type ChatboxMobileProps = {
  assistantName?: string;
  unreadCount?: number;
  className?: string;
  quickReplies?: string[];
};

const DEFAULT_QUICK_REPLIES = [
  "What topics are covered in JAMB Physics?",
  "How are the exam questions formatted?",
  "Need help with past questions",
  "What chapter should I study?",
];

export function FloatingChatboxMobile({ 
  assistantName = "Quiz Assistant", 
  unreadCount = 0,
  className,
  quickReplies = DEFAULT_QUICK_REPLIES,
}: ChatboxMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [muted, setMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (!hasUserScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasUserScrolled]);

  // Focus management
  useEffect(() => {
    if (isOpen && textareaRef.current && !isStreaming) {
      textareaRef.current.focus();
    }
  }, [isOpen, isStreaming]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Body overflow lock when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setHasUserScrolled(!isAtBottom);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    if (isStreaming) return;
    
    // Simulate streaming response
    setIsStreaming(true);
    setInputValue("");
    
    const response = `Response to: "${inputValue}"\n\nThis would connect to your actual AI backend.`;
    const words = response.split(" ");
    let fullMessage = "";
    
    for (let i = 0; i < words.length; i++) {
      fullMessage += (i === 0 ? "" : " ") + words[i];
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg?.isStreaming) {
          lastMsg.content = fullMessage;
        }
        return updated;
      });
      await new Promise(r => setTimeout(r, 15));
    }
    
    setMessages(prev => {
      const updated = [...prev];
      const lastMsg = updated[updated.length - 1];
      if (lastMsg?.isStreaming) {
        lastMsg.isStreaming = false;
        lastMsg.content = fullMessage;
      }
      return updated;
    });
    
    setIsStreaming(false);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center",
          "rounded-full bg-marker text-sheet shadow-lg",
          "hover:bg-marker-deep transition-all focus-visible:ring-2",
          "focus-visible:ring-marker/50 focus-visible:ring-offset-2",
          "sm:hidden",
          className
        )}
        aria-label="Open chat"
      >
        <MessageCircle size={20} />
        
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center",
              "rounded-full bg-wrong text-sheet text-xs font-semibold",
              "shadow-md border-2 border-paper"
            )}
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className={cn(
              "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            )}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Drawer */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Chat conversation"
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "rounded-t-2xl",
              "bg-sheet border-t border-rule shadow-xl",
              "min-h-[50vh] max-h-[80vh] flex flex-col",
              "animate-slide-up"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-rule p-4">
              <div className="flex items-center gap-2">
                <div 
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg",
                    "bg-marker-wash text-marker-ink"
                  )}
                  aria-hidden="true"
                >
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{assistantName}</h3>
                  <span className={cn(
                    "text-xs",
                    muted ? "text-ink-quiet" : "text-correct"
                  )}>
                    {muted ? "Offline" : "Online"}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
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

            {/* Message Stream */}
            <div 
              ref={messagesEndRef}
              className={cn(
                "flex-1 overflow-y-auto p-4",
                "space-y-3"
              )}
              onScroll={handleScroll}
            >
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <div 
                    className={cn(
                      "mx-auto mb-3 flex h-10 w-10 items-center justify-center",
                      "rounded-full bg-marker-wash text-marker-ink"
                    )}
                    aria-hidden="true"
                  >
                    <MessageCircle size={18} />
                  </div>
                  <h4 className="text-sm font-semibold text-ink mb-2">
                    Welcome
                  </h4>
                  <p className="text-xs text-ink-quiet mb-3 max-w-[200px] mx-auto">
                    How can I help you with your exam preparation today?
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => setInputValue(reply)}
                        className={cn(
                          "px-2.5 py-1 text-xs rounded-full",
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
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex items-start gap-2",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {/* Assistant avatar */}
                      {message.role === "assistant" && (
                        <div 
                          className={cn(
                            "flex-shrink-0 h-6 w-6 items-center justify-center rounded-lg",
                            "bg-marker-wash text-marker-ink"
                          )}
                          aria-hidden="true"
                        >
                          <Volume2 size={12} />
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-3 py-2",
                          "text-xs text-sm",
                          message.role === "user"
                            ? "bg-marker text-sheet rounded-br-[15px] rounded-bl-[15px] rounded-tr-[22px]"
                            : "bg-sheet border border-rule rounded-bl-[15px] rounded-br-[15px]"
                        )}
                      >
                        <p className={cn(
                          "whitespace-pre-wrap",
                          message.role === "user" ? "text-base" : "text-ink"
                        )}>
                          {message.content}
                          {message.isStreaming && (
                            <span 
                              className={cn(
                                "inline-block w-1 h-3 bg-ink/50 animate-pulse",
                                "ml-1 vertical-align-middle"
                              )}
                              aria-hidden="true"
                            />
                          )}
                        </p>
                      </div>
                      
                      {/* User avatar */}
                      {message.role === "user" && (
                        <div 
                          className={cn(
                            "flex-shrink-0 h-6 w-6 items-center justify-center rounded-lg",
                            "bg-ink text-sheet text-xs font-semibold"
                          )}
                          aria-hidden="true"
                        >
                          U
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-rule p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Type message..."
                  className={cn(
                    "flex-1 min-h-[32px] max-h-[80px] resize-none",
                    "rounded-lg border border-rule bg-well",
                    "px-3 py-1.5 text-xs text-ink",
                    "placeholder:text-ink-quiet",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-marker/50",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50"
                  )}
                  disabled={isStreaming}
                  rows={1}
                />
                
                <Button
                  type="button"
                  size="icon"
                  variant={inputValue.trim() || isStreaming ? "default" : "ghost"}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  aria-label="Send message"
                >
                  {isStreaming ? (
                    <Check size={16} className="animate-scale-in" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}