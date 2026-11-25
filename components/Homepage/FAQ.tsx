import { Plus } from "lucide-react";

const faqs = [
  {
    question: "Which exams does Quizergo cover?",
    answer:
      "Quizergo practice is written in the WAEC and JAMB style. Questions are organised by subject, so you can sit the papers you are actually preparing for.",
  },
  {
    question: "How does a timed session work?",
    answer:
      "Choose your subjects, the number of questions and a time limit. The session runs on a countdown, one question at a time, and your answers are saved as you work.",
  },
  {
    question: "Can I review my answers after submitting?",
    answer:
      "Yes. Every session ends with the paper marked, question by question — your answer, the correct answer, and an explanation you can revise from.",
  },
  {
    question: "Is my progress saved if I lose connection?",
    answer:
      "Answers sync during the session, so a brief interruption will not cost you your work. Completed papers are also kept in your mark book.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. Quizergo runs in your browser on a phone, tablet or laptop — sign in and start a paper.",
  },
];

export default function FAQ() {
  return (
    <section className="border-b border-rule bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:py-24">
        <div>
          <p className="eyebrow text-marker-ink">Before you start</p>
          <h2 className="mt-4 max-w-xs text-[2rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[2.5rem]">
            Questions, answered.
          </h2>
          <p className="mt-5 max-w-xs text-[0.9375rem] leading-7 text-ink-quiet">
            Still unsure about something?{" "}
            <a
              href="mailto:contact@quizergo.online"
              className="font-semibold text-marker-ink underline decoration-marker-line underline-offset-4 transition-colors hover:decoration-marker"
            >
              Write to us
            </a>{" "}
            and a person will reply.
          </p>
        </div>

        <div className="border-t border-rule">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-[0.9375rem] font-semibold leading-6 text-ink transition-colors hover:text-marker-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-4 focus-visible:ring-offset-paper [&::-webkit-details-marker]:hidden">
                {faq.question}
                <Plus
                  size={16}
                  className="mt-0.5 shrink-0 text-ink-quiet transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[62ch] pb-6 pr-8 text-[0.875rem] leading-7 text-ink-quiet">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
