import type { Metadata } from "next";
import QbotContent from "./qbot-content";

export const metadata: Metadata = {
  title: "Qbot — your AI study tutor",
  description:
    "Ask Qbot about any JAMB or WAEC subject and get clear, step-by-step explanations.",
};

export default function QbotPage() {
  return <QbotContent />;
}
