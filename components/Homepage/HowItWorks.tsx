import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose the paper",
    description:
      "Pick the subjects you are sitting, then set how many questions and how much time you want to practise with. The setup reads the total back to you before you start.",
  },
  {
    number: "02",
    title: "Sit it against the clock",
    description:
      "One question at a time, four answers within thumb reach, the countdown in the bar. Answers sync while you work so a dropped connection does not end the session.",
  },
  {
    number: "03",
    title: "Read the marking",
    description:
      "The paper comes back graded, question by question — your answer, the correct one, and an explanation you can actually revise from.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-rule bg-sheet">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:py-24">
        <div className="lg:pt-1">
          <p className="eyebrow text-marker-ink">How a paper runs</p>
          <h2 className="mt-4 max-w-sm text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.5rem] lg:text-[2.75rem]">
            Three passes between the question and the marking.
          </h2>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-7 text-ink-quiet">
            Setting up takes a minute. The session itself behaves like the exam:
            it starts, it runs out, and it reports back honestly.
          </p>

          <Link
            href="/setup"
            className="group mt-8 inline-flex items-center gap-2 border-b border-marker-line pb-1 text-[0.8125rem] font-semibold text-marker-ink transition-colors hover:border-marker hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 focus-visible:ring-offset-sheet"
          >
            Set up your first paper
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <ol className="border-t border-rule">
          {steps.map((step) => (
            <li
              key={step.number}
              className="grid grid-cols-[3rem_1fr] gap-x-5 border-b border-rule py-7 sm:grid-cols-[4rem_1fr] sm:gap-x-8 sm:py-8"
            >
              <span className="text-[0.8125rem] font-semibold tabular-nums tracking-[0.04em] text-marker-ink">
                {step.number}
              </span>
              <div className="max-w-xl">
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-7 text-ink-quiet">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
