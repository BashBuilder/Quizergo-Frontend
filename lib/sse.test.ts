import { describe, expect, it } from "vitest";
import { parseSseEvents } from "./sse";

type Event = { type: string; content?: string };

describe("parseSseEvents", () => {
  it("parses complete frames and keeps the trailing partial frame", () => {
    const buffer = [
      'data: {"type":"start"}',
      "",
      'data: {"type":"chunk","content":"Hello "}',
      "",
      'data: {"type":"chunk","content":"wor',
    ].join("\n");

    const { events, rest } = parseSseEvents<Event>(buffer);

    expect(events).toEqual([
      { type: "start" },
      { type: "chunk", content: "Hello " },
    ]);
    expect(rest).toBe('data: {"type":"chunk","content":"wor');
  });

  it("returns no events for an empty buffer", () => {
    expect(parseSseEvents("")).toEqual({ events: [], rest: "" });
  });
});
