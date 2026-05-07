/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="motion-preset-confetti">
      <div className="relative w-fit">
        <h1 className="text-3xl font-bold">Quizer</h1>
        <img
          src="/assets/quizzer.png"
          alt="quizer logo"
          className="absolute right-3 top-1/2 h-full -translate-y-1/2 object-contain"
        />
      </div>
    </Link>
  );
};

export default Logo;
