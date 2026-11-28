import type { QbotMessage } from "@/services/qbot.service";

export type ChatMessage = QbotMessage & {
  pending?: boolean;
  failed?: boolean;
};
