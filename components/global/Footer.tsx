import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[0.8125rem] leading-6 text-ink-quiet">
              A timed practice paper for JAMB and WAEC, returned to you marked —
              every answer explained.
            </p>
          </div>

          <nav aria-label="Product" className="text-[0.8125rem]">
            <p className="eyebrow eyebrow-quiet">Practice</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/subjects"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Subjects
                </Link>
              </li>
              <li>
                <Link
                  href="/setup"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Start a paper
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Mark book
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal and support" className="text-[0.8125rem]">
            <p className="eyebrow eyebrow-quiet">The small print</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@quizergo.online"
                  className="text-ink-soft transition-colors hover:text-marker-ink"
                >
                  contact@quizergo.online
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 text-xs text-ink-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Quizergo. Free to use.</p>
          <p className="tabular-nums">
            Built for the paper you are actually sitting.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
