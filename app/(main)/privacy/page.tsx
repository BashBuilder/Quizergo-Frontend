import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Lock, Users, Database, Globe, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy | QuizerGo",
  description:
    "Learn how QuizerGo protects your privacy and handles your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div>
              <h1 className="text-balance mb-2 text-4xl font-bold">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated:
                {new Date(
                  new Date().getTime() - 120 * 24 * 60 * 60 * 1000,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Quick Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground">
              At QuizerGo, we are committed to protecting your privacy and
              ensuring the security of your personal information. This policy
              explains how we collect, use, and safeguard your data when you use
              our educational platform for WAEC and JAMB exam preparation.
            </p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Personal Information
                </h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>• Name and email address when you create an account</li>
                  <li>• Educational background and exam preferences</li>
                  <li>• Profile information you choose to provide</li>
                  <li>• Communication preferences and settings</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Usage Information
                </h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>• Quiz performance and progress data</li>
                  <li>• Study patterns and learning analytics</li>
                  <li>• Time spent on different subjects and topics</li>
                  <li>• Device information and browser type</li>
                  <li>• IP address and general location data</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Educational Data</h3>
                <ul className="ml-4 space-y-2 text-muted-foreground">
                  <li>• Quiz answers and explanations requested</li>
                  <li>• Subject preferences and difficulty levels</li>
                  <li>• Study goals and target exam dates</li>
                  <li>• Chatbot interactions and AI assistance usage</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-semibold">Educational Services</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Provide personalized quiz experiences</li>
                    <li>• Track your learning progress</li>
                    <li>• Generate performance analytics</li>
                    <li>• Recommend study materials</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Platform Improvement</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Enhance AI-powered features</li>
                    <li>• Improve question quality</li>
                    <li>• Optimize user experience</li>
                    <li>• Develop new educational tools</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Communication</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Send study reminders</li>
                    <li>• Provide exam updates</li>
                    <li>• Share educational content</li>
                    <li>• Respond to support requests</li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Security & Legal</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Prevent fraud and abuse</li>
                    <li>• Ensure platform security</li>
                    <li>• Comply with legal requirements</li>
                    <li>• Protect user rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                We implement industry-standard security measures to protect your
                personal information:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">Technical Safeguards</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• SSL/TLS encryption for data transmission</li>
                    <li>• Secure database storage with encryption</li>
                    <li>• Regular security audits and updates</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">
                    Organizational Measures
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Limited access to personal data</li>
                    <li>• Staff training on data protection</li>
                    <li>• Regular backup and recovery procedures</li>
                    <li>• Incident response protocols</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                You have the following rights regarding your personal data:
              </p>
              <div className="grid gap-4">
                <div className="flex gap-3 rounded-lg bg-muted/30 p-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-semibold">Access & Portability</h4>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of your personal data and download your
                      quiz history.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg bg-muted/30 p-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-semibold">Correction & Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Update or correct your personal information at any time.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg bg-muted/30 p-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-semibold">Deletion</h4>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your account and associated data.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-lg bg-muted/30 p-3">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                  <div>
                    <h4 className="font-semibold">Communication Preferences</h4>
                    <p className="text-sm text-muted-foreground">
                      Opt-out of marketing communications while keeping
                      essential notifications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sharing & Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                We do not sell your personal information. We may share data only
                in these limited circumstances:
              </p>
              <ul className="ml-4 space-y-2 text-muted-foreground">
                <li>
                  • <strong>Service Providers:</strong> Trusted partners who
                  help us operate the platform (hosting, analytics, AI services)
                </li>
                <li>
                  • <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights and users&apos; safety
                </li>
                <li>
                  • <strong>Business Transfers:</strong> In case of merger or
                  acquisition (with continued privacy protection)
                </li>
                <li>
                  • <strong>Consent:</strong> When you explicitly agree to share
                  information with third parties
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                If you have questions about this privacy policy or want to
                exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> support@quizergo.com
                </p>
                {/* <p>
                  <strong>Address:</strong> QuizerGo Privacy Team, Lagos,
                  Nigeria
                </p> */}
                {/* <p>
                  <strong>Response Time:</strong> We aim to respond within 30
                  days
                </p> */}
              </div>
              <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                <p>
                  This privacy policy is effective as of December 2024 and may
                  be updated periodically.
                </p>
                <p className="mt-2">
                  <Link
                    href="/cookies"
                    className="text-primary hover:underline"
                  >
                    Cookie Policy
                  </Link>{" "}
                  |
                  <Link
                    href="/terms"
                    className="ml-2 text-primary hover:underline"
                  >
                    Terms of Service
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
