import Link from "next/link";
import Image from "next/image";
import React from "react";

const Logo = ({ size = 32 }: { size?: number }) => {
  return (
    <Link href="/" className="flex items-center gap-2 motion-preset-confetti">
      <Image
        src="/assets/quizzer.png"
        alt=""
        width={size}
        height={size}
        priority
        className="object-contain"
        style={{ width: size, height: size }}
      />
      <span className="text-2xl font-bold tracking-tight text-slate-900">
        Quizer<span className="text-primary-500">Go</span>
      </span>
    </Link>
  );
};

export default Logo;
