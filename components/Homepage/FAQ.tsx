import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Which exams does QuizerGo cover?",
    answer:
      "QuizerGo is built around the WAEC and JAMB style of examination. Questions are organised by subject, so you can focus on the papers you are sitting.",
  },
  {
    question: "How do timed mock exams work?",
    answer:
      "Choose your subjects, the number of questions and a time limit. The session runs on a countdown, just like an exam, and your answers are saved as you work.",
  },
  {
    question: "Can I review my answers after submitting?",
    answer:
      "Yes. Every session ends with a scored breakdown, and you can work through each question with the correct answer and a full explanation.",
  },
  {
    question: "Is my progress saved if I lose connection?",
    answer:
      "Your answers sync during the session, so a brief interruption will not cost you your work. Completed sessions are also kept in your dashboard history.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. QuizerGo runs in your browser on a phone, tablet or laptop — sign in and start a session.",
  },
];

export default function FAQ() {
  return (
    <section className="border-b border-slate-200/70 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
            FAQ
          </p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
            Questions, answered.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 sm:text-base">
            Everything you need to know before your first session. Still unsure?{" "}
            <a
              href="mailto:contact@quizergo.online"
              className="font-semibold text-primary-700 underline-offset-4 hover:underline"
            >
              Talk to us
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-primary-700 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  size={16}
                  className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 pr-8 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
