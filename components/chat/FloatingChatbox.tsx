"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Minimize, Send, Volume2, VolumeX, Check } from "lucide-react";
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

type ChatboxProps = {
  assistantName?: string;
  unreadCount?: number;
  className?: string;
  quickReplies?: string[];
  onMessageSent?: (message: string) => void;
};

// Design tokens from DESIGN.md
const DESIGN = {
  colors: {
    paper: "oklch(0.99 0.01 75)",
    sheet: "oklch(1 0 0)",
    well: "oklch(0.96 0.015 75)",
    ink: "oklch(0.22 0.03 55)",
    inkSoft: "oklch(0.28 0.04 55)",
    inkQuiet: "oklch(0.52 0.03 55)",
    rule: "oklch(0.91 0.01 75)",
    marker: "oklch(0.7 0.19 48)",
    markerDeep: "oklch(0.65 0.19 41)",
    markerInk: "oklch(0.55 0.17 38)",
    markerWash: "oklch(0.98 0.02 74)",
    markerLine: "oklch(0.9 0.07 71)",
    correct: "oklch(0.38 0.11 40)",
    wrong: "oklch(0.62 0.24 27)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
  },
  radius: {
    sm: "9.6px",
    md: "12.8px",
    lg: "16px",
    xl: "22.4px",
    "2xl": "28.8px",
    "3xl": "35.2px",
  },
};

// Default quick replies for exam prep assistant
const DEFAULT_QUICK_REPLIES = [
  "What topics are covered in JAMB Physics?",
  "How are the exam questions formatted?",
  "Need help with past questions",
  "What chapter should I study?",
];

export function FloatingChatbox({ 
  assistantName = "Quiz Assistant", 
  unreadCount = 0,
  className,
  quickReplies = DEFAULT_QUICK_REPLIES,
  onMessageSent,
}: ChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [muted, setMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Auto-scroll when new messages arrive (unless user is scrolled up)
  useEffect(() => {
    if (!hasUserScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasUserScrolled]);

  // Focus management
  useEffect(() => {
    if (isOpen && !isMinimized && textareaRef.current && !isStreaming) {
      textareaRef.current.focus();
    }
  }, [isOpen, isMinimized, isStreaming]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === "Escape") {
        if (isMinimized) {
          setIsMinimized(false);
        } else {
          setIsOpen(false);
        }
        return;
      }
      
      // Trap focus when open
      if (e.key === "Tab") {
        const container = chatRef.current;
        if (container && document.activeElement) {
          const focusable = container.querySelectorAll<HTMLElement>(
            'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          
          if (document.activeElement === first && e.shiftKey) {
            e.preventDefault();
            last?.focus();
          } else if (document.activeElement === last && !e.shiftKey) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isMinimized]);

  // Body overflow lock when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Message time formatting
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle scroll to detect user interaction
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setHasUserScrolled(!isAtBottom);
  }, []);

  // Simulate streaming response (replace with actual API call in production)
  const simulateStreamingResponse = async (prompt: string) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const response = `I understand you're asking about: "${prompt}". Let me provide some helpful information...

This is a sample response for the floating chatbox widget. In production, this would connect to your actual AI assistant backend.

The chatbox follows Quizergo's design system with:
- Warm paper background (oklch(0.99 0.01 75))
- Clean sheet surfaces (white)
- Marker orange for accents and user bubbles
- Subtle ruled borders instead of heavy shadows

How can I help you with your exam preparation today?`;
    
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
      await delay(15);
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

  // Handle sending a message
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
    setShowIntro(false);
    
    // Notify parent
    if (onMessageSent) {
      onMessageSent(inputValue);
    }
    
    // Add streaming placeholder for assistant response
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    await simulateStreamingResponse(inputValue);
  };

  // Handle keyboard shortcuts
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle quick reply selection
  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  // Reset session
  const handleReset = () => {
    setMessages([]);
    setShowIntro(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center",
          "rounded-full bg-marker text-sheet shadow-lg",
          "hover:bg-marker-deep transition-all focus-visible:ring-2",
          "focus-visible:ring-marker/50 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "animate-bounce",
          isOpen && "hidden",
          className
        )}
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center",
              "rounded-full bg-wrong text-sheet text-xs font-semibold",
              "shadow-md border-2 border-paper",
              "animate-pulse"
            )}
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Overlay */}
      {isOpen && (
        <div 
          className={cn(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm",
            "flex items-end justify-center p-4 sm:p-6 md:p-8"
          )}
          onClick={() => setIsOpen(false)}
        >
          <div
            ref={chatRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${assistantName} chat`}
            onClick={e => e.stopPropagation()}
            className={cn(
              "w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl",
              "bg-sheet border border-rule shadow-xl",
              "flex flex-col",
              "animate-slide-up",
              "min-h-[500px] sm:min-h-[600px] max-h-[80vh]"
            )}
          >
            {/* Header */}
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
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
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
            </div>

            {/* Message Stream */}
            <div 
              ref={messagesEndRef}
              className={cn(
                "flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6",
                "space-y-3 sm:space-y-4"
              )}
              onScroll={handleScroll}
            >
              {messages.length === 0 && showIntro && (
                <div className="text-center py-8">
                  <div 
                    className={cn(
                      "mx-auto mb-4 flex h-12 w-12 items-center justify-center",
                      "rounded-full bg-marker-wash text-marker-ink"
                    )}
                    aria-hidden="true"
                  >
                    <MessageCircle size={20} />
                  </div>
                  <h4 className="text-sm font-semibold text-ink mb-2">
                    Welcome to Quizergo Assistant
                  </h4>
                  <p className="text-xs text-ink-quiet mb-4 max-w-[280px] mx-auto">
                    I'm here to help with your exam preparation. How can I assist you today?
                  </p>
                  
                  {/* Quick replies */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
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
                </div>
              )}
              
              {/* Empty state when reset */}
              {messages.length === 0 && !showIntro && (
                <div className="text-center py-8">
                  <p className="text-xs text-ink-quiet">Start a new conversation</p>
                </div>
              )}

              {/* Messages */}
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2 sm:gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Assistant avatar */}
                  {message.role === "assistant" && (
                    <div 
                      className={cn(
                        "flex-shrink-0 h-7 w-7 items-center justify-center rounded-lg",
                        "bg-marker-wash text-marker-ink"
                      )}
                      aria-hidden="true"
                    >
                      <Volume2 size={14} />
                    </div>
                  )}
                  
                  {/* Message bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl sm:rounded-3xl px-4 py-2.5 sm:px-5 py-3",
                      "text-sm text-base break-words",
                      message.role === "user"
                        ? "bg-marker text-sheet rounded-br-[18px] rounded-bl-[18px] rounded-tr-[26px]"
                        : "bg-sheet border border-rule rounded-bl-[18px] rounded-br-[18px]"
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
                            "inline-block w-1 h-4 bg-ink/50 animate-pulse",
                            "ml-1 vertical-align-middle"
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </p>
                    
                    {/* Timestamp on hover */}
                    <div className={cn(
                      "text-xs text-ink-quiet/60 mt-1.5 opacity-0",
                      "hover:opacity-100 transition-opacity"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {/* User avatar */}
                  {message.role === "user" && (
                    <div 
                      className={cn(
                        "flex-shrink-0 h-7 w-7 items-center justify-center rounded-lg",
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

            {/* Composer */}
            <div className="border-t border-rule p-4 sm:p-5 lg:p-6">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Type your message..."
                  className={cn(
                    "flex-1 min-h-[40px] max-h-[100px] resize-none",
                    "rounded-xl border border-rule bg-well",
                    "px-4 py-2 text-sm text-ink",
                    "placeholder:text-ink-quiet",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-marker/50",
                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",
                    !inputValue.trim() && "disabled:opacity-30"
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
                    <Check size={18} className="animate-scale-in" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}