import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  tone?: "ink" | "paper";
  className?: string;
}

const Logo = ({ size = 28, tone = "ink", className }: LogoProps) => {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        tone === "paper" ? "ring-offset-exam" : "ring-offset-paper",
        className,
      )}
      aria-label="Quizergo home"
    >
      <Image
        src="/assets/quizzer.png"
        alt=""
        width={size}
        height={size}
        priority
        className="object-contain"
        style={{ width: size, height: size }}
      />
      <span
        className={cn(
          "text-[1.3125rem] font-semibold leading-none tracking-[-0.035em]",
          tone === "paper" ? "text-white" : "text-ink",
        )}
      >
        Quizer
        <span
          className={cn(
            tone === "paper" ? "text-primary-400" : "text-primary-600",
          )}
        >
          Go
        </span>
      </span>
    </Link>
  );
};

export default Logo;
