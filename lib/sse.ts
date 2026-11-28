/**
 * Parse complete Server-Sent Event frames out of a buffer.
 * Returns the events already fully received plus the trailing partial frame,
 * which the caller should prepend to the next network chunk.
 */
export function parseSseEvents<T>(buffer: string): {
  events: T[];
  rest: string;
} {
  const frames = buffer.split(/\r?\n\r?\n/);
  const rest = frames.pop() ?? "";
  const events: T[] = [];

  for (const frame of frames) {
    const data = frame
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
      .join("\n");

    if (!data.trim()) continue;
    events.push(JSON.parse(data) as T);
  }

  return { events, rest };
}
