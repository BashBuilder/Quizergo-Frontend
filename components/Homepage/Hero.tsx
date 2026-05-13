import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-white to-primary-100" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Study Smart. <br />
            Pass <span className="text-primary-600">WAEC & JAMB</span> with
            Confidence.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Practice thousands of questions, join live sessions, challenge
            friends, and watch tutorials — all in one app.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary-600 px-8 hover:bg-primary">
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button size="lg" variant="outline">
              Watch Live Class
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            Trusted by 50,000+ Nigerian students
          </div>
        </div>

        <div className="relative border border-red-200 h-full min-h-40 ">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            className="rounded-3xl shadow-2xl h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
