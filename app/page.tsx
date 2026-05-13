// app/page.jsx
"use client";

import {
  ArrowRight,
  BookOpen,
  Trophy,
  Video,
  Zap,
  Check,
  Star,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/global/Header";
import Hero from "@/components/Homepage/Hero";
import QuizerGoSections from "@/components/Homepage/four-sections";
import Subjects from "@/components/Homepage/Subjects";
import Testimonials from "@/components/Homepage/Testimonials";

export default function HomePage() {
  const stats = [
    { value: "50K+", label: "Active Students" },
    { value: "12K+", label: "Past Questions" },
    { value: "94%", label: "Pass Rate" },
    { value: "20+", label: "Subjects" },
  ];

  const features = [
    {
      title: "Practice Questions",
      desc: "Thousands of WAEC & JAMB past questions with instant explanations.",
      icon: BookOpen,
    },
    {
      title: "Live Sessions",
      desc: "Attend real-time tutor classes and ask questions instantly.",
      icon: Video,
    },
    {
      title: "Challenges",
      desc: "Compete with friends and students nationwide.",
      icon: Trophy,
    },
    {
      title: "Tutorial Videos",
      desc: "Watch simplified lessons for difficult topics anytime.",
      icon: Zap,
    },
  ];

  const pricing = [
    {
      name: "Starter",
      price: "Free",
      features: ["500 Questions", "3 Subjects", "Basic Analytics"],
      featured: false,
    },
    {
      name: "Pro",
      price: "₦2,500/mo",
      features: [
        "Unlimited Questions",
        "All Subjects",
        "Live Sessions",
        "Video Tutorials",
        "Exam Simulations",
      ],
      featured: true,
    },
    {
      name: "School",
      price: "₦18,000/yr",
      features: [
        "50 Students",
        "Teacher Dashboard",
        "Reports",
        "Priority Support",
      ],
      featured: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Hero />
      <Subjects />
      <Testimonials />
      <QuizerGoSections />
      {/* FEATURES */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="font-semibold uppercase tracking-widest text-primary-600">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Everything you need to pass
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="rounded-3xl border-primary-100 shadow-lg transition hover:-translate-y-1"
                >
                  <CardContent className="p-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary">
                      <Icon />
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Star className="mx-auto h-10 w-10 fill-primary-500 text-primary-500" />
          <h2 className="mt-6 text-4xl font-black">
            Real Students. Real Results.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            “I failed JAMB twice before QuizerGo. After 3 months of practice, I
            scored 312. This app changed everything for me.”
          </p>

          <p className="mt-6 font-semibold text-primary">
            — Adebayo Olamide, Lagos
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-primary-600">
              Pricing
            </p>
            <h2 className="mt-3 text-4xl font-black">
              Start Free. Upgrade Anytime.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {pricing.map((plan) => (
              <Card
                key={plan.name}
                className={`rounded-3xl p-2 shadow-xl ${
                  plan.featured
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-slate-200"
                }`}
              >
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <div className="mt-3 text-4xl font-black">{plan.price}</div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Check className="h-4 w-4" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`mt-8 w-full ${
                      plan.featured
                        ? "bg-white text-primary hover:bg-primary-50"
                        : "bg-primary-600 hover:bg-primary"
                    }`}
                  >
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-5xl font-black">
            Your Exam is Coming.
            <br />
            Start Today.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            Join 50,000+ students using QuizerGo to prepare smarter.
          </p>

          <Button
            size="lg"
            className="mt-8 bg-white px-8 text-primary hover:bg-primary-50"
          >
            Create Free Account
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="text-sm text-slate-500">
            © 2025 QuizerGo. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
