import { BookOpen, CircleCheck, Timer, TrendingUp } from "lucide-react";

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

const cardClass =
  "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-slate-300 sm:p-7";

const iconTileClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700";

export default function Features() {
  return (
    <section className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
              Why QuizerGo
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
              Built around how exams actually work.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600 md:text-right">
            No guesswork and no clutter — just the four things that move your
            score.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {/* Real past questions */}
          <article className={`${cardClass} md:col-span-2`}>
            <div className="flex items-start gap-4">
              <span className={iconTileClass}>
                <BookOpen size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Real past questions
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Drill questions written in the WAEC and JAMB style, organised
                  by subject so you always know what you are practising.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-stone-50 p-3 sm:p-4">
              <div className="space-y-2">
                {questionRows.map((row, index) => (
                  <div
                    key={row.subject}
                    className={
                      index === 0
                        ? "flex items-center gap-3 rounded-xl border border-primary-200 bg-white px-3 py-2.5 ring-1 ring-primary-100/60"
                        : "flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-3 py-2.5"
                    }
                  >
                    <span className="shrink-0 rounded-md bg-primary-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-700">
                      {row.subject}
                    </span>
                    <span className="truncate text-xs text-slate-600">
                      {row.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Timed mock exams */}
          <article className={cardClass}>
            <div className="flex items-start gap-4">
              <span className={iconTileClass}>
                <Timer size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Timed mock exams
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Set your subjects, question count and time limit, then sit a
                  session under real exam pressure.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center rounded-2xl border border-slate-100 bg-stone-50 px-4 py-6">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[conic-gradient(var(--primary-500)_68%,var(--primary-100)_0)]">
                <div className="flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full bg-stone-50">
                  <span className="text-lg font-semibold tabular-nums tracking-tight text-slate-900">
                    45:00
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
                    remaining
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-slate-500">
                Exam-style countdown
              </p>
            </div>
          </article>

          {/* Instant scoring */}
          <article className={cardClass}>
            <div className="flex items-start gap-4">
              <span className={iconTileClass}>
                <CircleCheck size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Instant scoring
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Submit once and see your score immediately, with every answer
                  explained in plain language.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-stone-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Session score
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <CircleCheck size={10} aria-hidden="true" />
                  Graded
                </span>
              </div>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
                82%
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                33 of 40 correct · instantly
              </p>
            </div>
          </article>

          {/* Progress tracking */}
          <article className={`${cardClass} md:col-span-2`}>
            <div className="sm:flex sm:items-center sm:gap-8">
              <div className="sm:max-w-xs">
                <div className="flex items-start gap-4">
                  <span className={iconTileClass}>
                    <TrendingUp size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      Progress you can see
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Every completed session is saved to your dashboard, so you
                      can watch your scores improve over time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex-1 rounded-2xl border border-slate-100 bg-stone-50 p-4 sm:mt-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Average score
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    +12%
                  </span>
                </div>
                <div className="mt-4 flex h-24 items-end gap-2">
                  {scoreTrend.map((height, index) => (
                    <div
                      key={months[index]}
                      className={
                        index === scoreTrend.length - 1
                          ? "w-full rounded-t-md bg-primary-500"
                          : "w-full rounded-t-md bg-primary-200"
                      }
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[9px] font-medium uppercase tracking-wider text-slate-500">
                  {months.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
