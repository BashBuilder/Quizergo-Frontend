const questionRows = [
  {
    subject: "Physics",
    text: "A body starts from rest and reaches 20 m/s in 5 s…",
  },
  {
    subject: "Chemistry",
    text: "Which of the following species is an electrophile?",
  },
  {
    subject: "Mathematics",
    text: "Solve for x: 2x² − 5x − 3 = 0",
  },
];

const scoreTrend = [40, 52, 48, 64, 72, 84];
const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export default function Features() {
  return (
    <section className="border-b border-rule bg-sheet">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="eyebrow text-marker-ink">Why Quizergo</p>
            <h2 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.5rem] lg:text-[2.75rem]">
              Built around how a real paper behaves.
            </h2>
          </div>
          <p className="max-w-sm text-[0.9375rem] leading-7 text-ink-quiet md:justify-self-end md:pb-1">
            No dashboards to admire and no points to collect — four things that
            change what happens on exam day.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-rule bg-sheet">
          <div className="grid lg:grid-cols-12">
            {/* Lead: the question bank */}
            <article className="border-b border-rule p-7 sm:p-9 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-10">
              <h3 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                Questions written the way the exam asks them.
              </h3>
              <p className="mt-2.5 max-w-lg text-[0.9375rem] leading-7 text-ink-quiet">
                Organised by subject, so you always know what you are practising
                — and never padded with trivia to make the count look bigger.
              </p>

              <div className="mt-7 border-t border-rule">
                {questionRows.map((row) => (
                  <div
                    key={row.subject}
                    className="flex items-baseline gap-4 border-b border-rule py-3.5 last:border-b-0"
                  >
                    <span className="w-20 shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-marker-ink">
                      {row.subject}
                    </span>
                    <span className="min-w-0 text-[0.8125rem] leading-6 text-ink-soft">
                      {row.text}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            {/* Timed condition — the one dark moment in the section */}
            <article className="p-7 sm:p-9 lg:col-span-5 lg:p-8">
              <div className="sheet-slab relative overflow-hidden p-7">
                <div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-500/25 blur-2xl"
                  aria-hidden="true"
                />
                <p className="eyebrow relative text-primary-300">Time left</p>
                <p className="relative mt-3 text-[3.25rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-white">
                  45:00
                </p>
                <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-primary-400" />
                </div>
                <p className="relative mt-3 text-[0.6875rem] font-medium leading-5 text-white/50">
                  Counted down from the first question to the last.
                </p>
              </div>

              <h3 className="mt-6 text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                A clock that actually ends the paper.
              </h3>
              <p className="mt-2 text-[0.875rem] leading-6 text-ink-quiet">
                Choose subjects, question count and time limit. The session runs
                on a countdown and reports the time you actually used.
              </p>
            </article>
          </div>

          <div className="grid border-t border-rule md:grid-cols-2">
            {/* Scoring */}
            <article className="border-b border-rule p-7 sm:p-9 md:border-b-0 md:border-r">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                Marked once, on the server.
              </h3>
              <p className="mt-2 max-w-sm text-[0.875rem] leading-6 text-ink-quiet">
                Submit once and the paper comes back scored, with every answer
                explained in plain language. The client never holds the key.
              </p>

              <div className="mt-6 flex items-end gap-3">
                <span className="text-[3.5rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-ink">
                  33
                </span>
                <span className="pb-1.5 text-[0.8125rem] font-medium tabular-nums text-ink-quiet">
                  / 40 correct
                </span>
              </div>
              <div className="mt-4 h-px w-full bg-rule">
                <div className="h-px w-[82%] bg-marker" />
              </div>
              <p className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-quiet">
                82% on the last paper
              </p>
            </article>

            {/* Progress */}
            <article className="p-7 sm:p-9">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                Your record, kept.
              </h3>
              <p className="mt-2 max-w-sm text-[0.875rem] leading-6 text-ink-quiet">
                Every completed paper is saved to your mark book, so next week
                has something to beat.
              </p>

              <div className="mt-7">
                <div className="flex h-20 items-end gap-2.5 border-b border-rule">
                  {scoreTrend.map((height, index) => (
                    <div
                      key={months[index]}
                      className={
                        index === scoreTrend.length - 1
                          ? "w-full bg-marker"
                          : "w-full bg-primary-200/70"
                      }
                      style={{ height: `${height}%` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between">
                  {months.map((month) => (
                    <span
                      key={month}
                      className="text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-ink-quiet"
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
