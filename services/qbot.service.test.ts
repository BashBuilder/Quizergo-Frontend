import { afterEach, describe, expect, it, vi } from "vitest";
import { streamQbotMessage, type QbotStreamEvent } from "./qbot.service";

function sseResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("streamQbotMessage", () => {
  it("assembles chunks split across network reads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        sseResponse([
          'data: {"type":"start","conversationId":"c1","messageId":"m1"}\n\n',
          'data: {"type":"chunk","content":"Hel',
          'lo","reasoning":""}\n\ndata: {"type":"complete","conversationId":"c1",',
          '"messageId":"m2","content":"Hello","reasoning":""}\n\n',
        ]),
      ),
    );

    const events: QbotStreamEvent[] = [];
    await streamQbotMessage({
      message: "Hi",
      onEvent: (event) => events.push(event),
    });

    expect(events.map((event) => event.type)).toEqual([
      "start",
      "chunk",
      "complete",
    ]);
  });

  it("surfaces a streamed error event", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          sseResponse(['data: {"type":"error","message":"Provider down"}\n\n']),
        ),
    );

    await expect(
      streamQbotMessage({ message: "Hi", onEvent: () => {} }),
    ).rejects.toThrow("Provider down");
  });

  it("rejects a stream that ends without a complete event", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          sseResponse(['data: {"type":"chunk","content":"Half","reasoning":""}\n\n']),
        ),
    );

    await expect(
      streamQbotMessage({ message: "Hi", onEvent: () => {} }),
    ).rejects.toThrow("cut off");
  });
});
