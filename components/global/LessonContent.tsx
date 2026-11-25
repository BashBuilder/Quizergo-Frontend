"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

import "katex/dist/katex.min.css";

export default function LessonContent({
  content,
  compact = false,
}: {
  content: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("lesson", compact && "lesson-compact")}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
