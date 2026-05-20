import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText, Scale, Gavel } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service | QuizerGo",
  description:
    "Read the terms and conditions governing your use of the QuizerGo educational platform.",
};

const EFFECTIVE_DATE = "December 2024";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div>
              <h1 className="text-balance mb-2 text-4xl font-bold">
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Effective date: {EFFECTIVE_DATE}
              </p>
            </div>
          </div>
        </div>

        {/* Intro card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              Welcome to QuizerGo. By accessing or using our platform —
              including our website, mobile applications, and any related
              services — you agree to be bound by these Terms of Service. Please
              read them carefully. If you do not agree with any part of these
              terms, you may not use QuizerGo.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              These terms apply to all users, including students, educators, and
              institutions using the QuizerGo platform for exam preparation,
              quizzes, live sessions, and related educational activities.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* 1. Eligibility & Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                1. Eligibility & Account Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Eligibility</h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>• You must be at least 13 years old to use QuizerGo.</li>
                  <li>
                    • Users under 18 must have verifiable parental or guardian
                    consent.
                  </li>
                  <li>
                    • You must be capable of entering into a legally binding
                    agreement.
                  </li>
                  <li>
                    • You may not use the platform if previously banned or
                    suspended by QuizerGo.
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Account Responsibilities
                </h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • You are responsible for maintaining the confidentiality of
                    your login credentials.
                  </li>
                  <li>
                    • You agree to provide accurate, current, and complete
                    information during registration.
                  </li>
                  <li>
                    • You must notify us immediately at{" "}
                    <strong>support@quizergo.com</strong> if you suspect
                    unauthorised access to your account.
                  </li>
                  <li>
                    • You may not share, sell, or transfer your account to
                    another person.
                  </li>
                  <li>
                    • QuizerGo reserves the right to suspend or terminate
                    accounts that violate these terms.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 2. Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                2. Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">You Agree To</h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • Use the platform solely for lawful, educational purposes.
                  </li>
                  <li>
                    • Interact respectfully with other users in live sessions,
                    duels, and challenges.
                  </li>
                  <li>
                    • Submit accurate information when registering for sessions
                    or assessments.
                  </li>
                  <li>
                    • Comply with all applicable laws and regulations in your
                    jurisdiction.
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">You Must Not</h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • Use automated tools, bots, or scripts to access or scrape
                    the platform.
                  </li>
                  <li>
                    • Attempt to gain unauthorised access to any part of the
                    service or another user&apos;s account.
                  </li>
                  <li>
                    • Upload, post, or share content that is defamatory,
                    abusive, hateful, or illegal.
                  </li>
                  <li>
                    • Misrepresent your identity or impersonate any person or
                    entity.
                  </li>
                  <li>
                    • Reverse-engineer, decompile, or attempt to extract source
                    code from the platform.
                  </li>
                  <li>
                    • Interfere with or disrupt the integrity of the platform or
                    its servers.
                  </li>
                  <li>
                    • Use the platform to cheat in formal examinations or
                    assessments.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 3. Educational Content & IP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                3. Educational Content & Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                All content on QuizerGo — including but not limited to quiz
                questions, explanations, study materials, branding, software,
                and design — is owned by or licensed to QuizerGo and protected
                by applicable intellectual property laws.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">What You May Do</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Access and use content for personal study</li>
                    <li>• Download your own performance reports</li>
                    <li>• Share platform links with fellow students</li>
                    <li>• Use AI-generated explanations for learning</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">What You May Not Do</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • Reproduce or republish quiz questions commercially
                    </li>
                    <li>• Distribute platform content without permission</li>
                    <li>• Claim ownership of QuizerGo&apos;s content</li>
                    <li>• Use our branding without written consent</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Content you submit (e.g. comments, community posts) remains
                yours, but you grant QuizerGo a non-exclusive, royalty-free
                licence to use, display, and distribute it within the platform.
              </p>
            </CardContent>
          </Card>

          {/* 4. Subscriptions & Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                4. Subscriptions & Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Free & Paid Tiers
                </h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • QuizerGo offers both free and premium subscription plans.
                  </li>
                  <li>
                    • Free accounts have access to limited questions, subjects,
                    and features.
                  </li>
                  <li>
                    • Premium plans unlock full question banks, live sessions,
                    challenges, and analytics.
                  </li>
                  <li>
                    • Feature availability may change between tiers without
                    prior notice.
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Billing & Renewals
                </h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • Subscription fees are charged at the beginning of each
                    billing cycle.
                  </li>
                  <li>
                    • Subscriptions auto-renew unless cancelled before the
                    renewal date.
                  </li>
                  <li>
                    • All prices are displayed in Nigerian Naira (NGN) unless
                    otherwise stated.
                  </li>
                  <li>
                    • QuizerGo reserves the right to change pricing with 30
                    days&apos; notice.
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Refunds</h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>
                    • Refund requests must be submitted within 7 days of
                    purchase.
                  </li>
                  <li>
                    • Refunds are considered on a case-by-case basis and are not
                    guaranteed.
                  </li>
                  <li>
                    • Partial refunds may be issued for unused subscription
                    periods at our discretion.
                  </li>
                  <li>
                    • Promotional or discounted purchases are non-refundable.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 5. Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                5. Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                Your use of QuizerGo is also governed by our{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference. By using
                the platform, you consent to the collection and use of your data
                as described therein.
              </p>
              <div className="grid gap-3">
                {[
                  {
                    title: "Data Collection",
                    desc: "We collect usage, performance, and account data to power your learning experience.",
                  },
                  {
                    title: "Data Storage",
                    desc: "Your data is stored securely on encrypted servers and never sold to third parties.",
                  },
                  {
                    title: "Cookies",
                    desc: "We use cookies and similar tracking technologies to improve functionality. See our Cookie Policy.",
                  },
                  {
                    title: "Minors",
                    desc: "We take special care to protect the data of users under 18 in accordance with applicable laws.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-lg bg-muted/30 p-3"
                  >
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 6. Prohibited Conduct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                6. Account Suspension & Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                QuizerGo reserves the right to suspend or permanently terminate
                your account without prior notice if you:
              </p>
              <ul className="ml-4 space-y-2 text-muted-foreground">
                <li>• Violate any provision of these Terms of Service.</li>
                <li>
                  • Engage in fraudulent, abusive, or harmful behaviour toward
                  other users.
                </li>
                <li>
                  • Attempt to manipulate quiz scores, leaderboards, or session
                  results.
                </li>
                <li>• Use the platform in a way that poses a security risk.</li>
                <li>• Fail to pay subscription fees when due.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Upon termination, your access to the platform will cease
                immediately. You may request a data export before your account
                is fully deleted by contacting{" "}
                <strong>support@quizergo.com</strong>.
              </p>
            </CardContent>
          </Card>

          {/* 7. Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                7. Disclaimers & Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  No Guarantee of Results
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  QuizerGo is an educational aid. We do not guarantee specific
                  exam scores, academic outcomes, or that our content reflects
                  the exact questions in any external examination (WAEC, JAMB,
                  or otherwise). Results depend on individual effort and many
                  factors beyond our control.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Service Availability
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive for high uptime but do not guarantee uninterrupted
                  access. The platform may be temporarily unavailable due to
                  maintenance, updates, or factors beyond our control. QuizerGo
                  is not liable for any loss or inconvenience resulting from
                  downtime.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Limitation of Liability
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, QuizerGo shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages arising out of your use of — or inability
                  to use — the platform. Our total liability to you shall not
                  exceed the amount you paid to QuizerGo in the 12 months
                  preceding the claim.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                8. Changes to These Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                We may update these Terms of Service from time to time to
                reflect changes in our services, legal requirements, or business
                practices.
              </p>
              <ul className="ml-4 space-y-2 text-muted-foreground">
                <li>
                  • We will notify users of material changes via email or an
                  in-app notice at least 14 days before they take effect.
                </li>
                <li>
                  • The updated effective date will always be shown at the top
                  of this page.
                </li>
                <li>
                  • Continued use of the platform after changes take effect
                  constitutes acceptance of the revised terms.
                </li>
                <li>
                  • If you disagree with updated terms, you may close your
                  account before they take effect.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 9. Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                9. Governing Law & Disputes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                These Terms shall be governed by and construed in accordance
                with the laws of the Federal Republic of Nigeria, without regard
                to its conflict of law provisions.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold flex items-center gap-2">
                    <Gavel className="h-4 w-4" /> Dispute Resolution
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Any disputes arising from these Terms will first be
                    addressed through good-faith negotiation. If unresolved,
                    disputes will be referred to arbitration under Nigerian law
                    before any court action.
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">Jurisdiction</h4>
                  <p className="text-sm text-muted-foreground">
                    Both parties submit to the exclusive jurisdiction of the
                    courts located in Lagos, Nigeria for any matters not subject
                    to arbitration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                If you have questions about these Terms of Service, need to
                report a violation, or wish to exercise any rights under these
                terms, please reach out to us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> support@quizergo.com
                </p>
                <p>
                  <strong>Response Time:</strong> We aim to respond within 5
                  business days.
                </p>
              </div>

              <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                <p>
                  These Terms of Service are effective as of {EFFECTIVE_DATE}{" "}
                  and supersede all prior agreements.
                </p>
                <p className="mt-2">
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/cookies"
                    className="text-primary hover:underline"
                  >
                    Cookie Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
