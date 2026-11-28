"use client";

import { FloatingChatbox, FloatingChatboxMobile } from "../index";

/**
 * ChatDemo - Example usage of the Floating Chatbox widget
 * 
 * This demonstrates how to integrate the chatbox into a Quizergo-style app.
 * The widget follows the "marked script" design aesthetic with warm paper,
 * clean sheet surfaces, and marker orange accents.
 */
export function ChatDemo() {
  return (
    <div className="relative min-h-screen bg-paper">
      {/* Your app content here */}
      
      {/* Desktop chatbox - shows on sm+ screens */}
      <div className="hidden sm:block">
        <FloatingChatbox
          assistantName="Quiz Assistant"
          unreadCount={3}
          quickReplies={[
            "What topics are covered in JAMB Physics?",
            "How are the exam questions formatted?",
            "Need help with past questions",
            "What chapter should I study?",
          ]}
          onMessageSent={(message) => {
            console.log("Message sent:", message);
            // Integrate with your AI backend API here
          }}
        />
      </div>
      
      {/* Mobile chatbox - optimized drawer style */}
      <div className="sm:hidden">
        <FloatingChatboxMobile
          assistantName="Quiz Assistant"
          unreadCount={2}
          quickReplies={[
            "JAMB Physics topics",
            "Exam format help",
            "Past questions",
          ]}
        />
      </div>
    </div>
  );
}