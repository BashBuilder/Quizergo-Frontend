import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-14 sm:px-12 sm:py-16 lg:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
            <div className="absolute -top-24 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
              Start today
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Your exam date won&apos;t move.
              <br className="hidden sm:block" /> Your preparation can.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
              Create an account and sit your first timed practice session in
              minutes.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-11 w-full rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100 sm:w-auto",
                })}
              >
                Create free account
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="/subjects"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-11 w-full rounded-xl border-white/20 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto",
                })}
              >
                Browse subjects
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400">
              WAEC &amp; JAMB practice · Timed sessions · Instant explanations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
