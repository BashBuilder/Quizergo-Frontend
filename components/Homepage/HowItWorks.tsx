import Link from "next/link";
import { ArrowRight, Lightbulb, ListChecks, Timer } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose your subjects",
    description:
      "Pick the subjects you are sitting, then set how many questions and how much time you want to practise with.",
    icon: ListChecks,
  },
  {
    number: "02",
    title: "Sit a timed session",
    description:
      "Answer real past questions under exam conditions. Your progress syncs while you work, so you can focus on the paper.",
    icon: Timer,
  },
  {
    number: "03",
    title: "Review and improve",
    description:
      "Get an instant score, then work through every question with the correct answer and a clear explanation.",
    icon: Lightbulb,
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-slate-200/70 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
            How it works
          </p>
          <h2 className="mt-3 max-w-md text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            From revision to readiness in three steps.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            A practice session takes minutes to set up and gives you a clear
            picture of where you stand before exam day.
          </p>

          <Link
            href="/setup"
            className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Set up your first session
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.number} className="bg-white p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-stone-50 text-xs font-semibold tabular-nums text-slate-500">
                    {step.number}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {step.title}
                      </h3>
                      <Icon
                        size={15}
                        className="text-primary-500"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
