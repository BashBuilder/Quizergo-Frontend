"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";

const CTA = () => {
  return (
    <section className="bg-primary py-24 text-white">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h2 className="text-5xl font-black">
          Your Exam is Coming.
          <br />
          Start Today.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
          Join students across Nigeria using QuizerGo to prepare smarter.
        </p>

        <Link href="/register">
          <Button
            size="lg"
            className="mt-8 bg-white px-8 text-primary hover:bg-primary-50"
          >
            Create Free Account
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default React.memo(CTA);
