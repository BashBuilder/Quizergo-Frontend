import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  Settings,
  BarChart3,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Cookie Policy | QuizerGo",
  description:
    "Learn about how QuizerGo uses cookies to enhance your learning experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div>
              <h1 className="text-balance text-4xl font-bold">Cookie Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated:{" "}
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
              <Globe className="h-5 w-5" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Cookies are small text files stored on your device when you visit
              our website. They help us provide you with a better, more
              personalized learning experience on QuizerGo by remembering your
              preferences and tracking your progress.
            </p>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Your Control:</strong> You can control and delete
                cookies through your browser settings. However, some features
                may not work properly without certain cookies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Essential Cookies */}
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Essential Cookies</h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground">
                  These cookies are necessary for the website to function
                  properly and cannot be disabled.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Authentication</span>
                    <span className="text-muted-foreground">
                      Keeps you logged in
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Security</span>
                    <span className="text-muted-foreground">
                      Protects against fraud
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Session Management</span>
                    <span className="text-muted-foreground">
                      Maintains your quiz progress
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Cookies */}
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Performance Cookies
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground">
                  These cookies help us understand how you use our platform to
                  improve performance and user experience.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Page Load Times</span>
                    <span className="text-muted-foreground">
                      Optimize loading speed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Error Tracking</span>
                    <span className="text-muted-foreground">
                      Identify and fix issues
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Feature Usage</span>
                    <span className="text-muted-foreground">
                      Improve popular features
                    </span>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Analytics Cookies</h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground">
                  These cookies provide insights into how students use QuizerGo
                  to help us create better educational content.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Study Patterns</span>
                    <span className="text-muted-foreground">
                      Understand learning habits
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Popular Subjects</span>
                    <span className="text-muted-foreground">
                      Improve content quality
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">User Journey</span>
                    <span className="text-muted-foreground">
                      Enhance navigation
                    </span>
                  </div>
                </div>
              </div>

              {/* Personalization Cookies */}
              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Personalization Cookies
                    </h3>
                  </div>
                </div>
                <p className="mb-3 text-muted-foreground">
                  These cookies remember your preferences to provide a
                  customized learning experience.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Theme Preferences</span>
                    <span className="text-muted-foreground">
                      Dark/light mode settings
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subject Preferences</span>
                    <span className="text-muted-foreground">
                      Favorite subjects and topics
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">AI Assistance Level</span>
                    <span className="text-muted-foreground">
                      Chatbot interaction preferences
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                We use trusted third-party services that may set their own
                cookies to provide enhanced functionality:
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="mb-2 font-semibold">Google Analytics</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Helps us understand user behavior and improve our platform.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <a
                      href="https://policies.google.com/privacy"
                      className="text-primary hover:underline"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="mb-2 font-semibold">AI Services</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Powers our chatbot and personalized learning
                    recommendations.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Data processed securely with privacy protection
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="mb-2 font-semibold">CDN Services</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Ensures fast loading of educational content and images.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Technical cookies for content delivery
                  </p>
                </div>

                <div className="rounded-lg bg-muted/30 p-4">
                  <h4 className="mb-2 font-semibold">Payment Processing</h4>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Secure handling of subscription and payment information.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PCI-compliant security standards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookie Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold">Browser Settings</h3>
                <p className="mb-4 text-muted-foreground">
                  You can control cookies through your browser settings.
                  Here&apos;s how to manage cookies in popular browsers:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-1 font-medium">Chrome</h4>
                    <p className="text-sm text-muted-foreground">
                      Settings → Privacy and Security → Cookies
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-1 font-medium">Firefox</h4>
                    <p className="text-sm text-muted-foreground">
                      Options → Privacy & Security → Cookies
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-1 font-medium">Safari</h4>
                    <p className="text-sm text-muted-foreground">
                      Preferences → Privacy → Cookies
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <h4 className="mb-1 font-medium">Edge</h4>
                    <p className="text-sm text-muted-foreground">
                      Settings → Privacy → Cookies
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-lg font-semibold">
                  Impact of Disabling Cookies
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 rounded-lg border p-3">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">
                        Essential Cookies Disabled
                      </h4>
                      <p className="text-sm ">
                        You may not be able to log in or access your quiz
                        progress.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-lg border -3">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full "></div>
                    <div>
                      <h4 className="font-medium ">
                        Analytics Cookies Disabled
                      </h4>
                      <p className="text-sm ">
                        We won&apos;t be able to improve the platform based on
                        usage patterns.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-lg border  p-3 ">
                    <div className="mt-2 h-2 w-2 shrink-0 rounded-full "></div>
                    <div>
                      <h4 className="font-medium">
                        Personalization Cookies Disabled
                      </h4>
                      <p className="text-sm ">
                        Your preferences won&apos;t be saved, and you&apos;ll
                        see generic content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Questions About Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                If you have questions about our use of cookies or need help
                managing your preferences, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> support@quizergo.com
                </p>
                <p>
                  <strong>Subject Line:</strong> Cookie Policy Inquiry
                </p>
                <p>
                  <strong>Response Time:</strong> Within 48 hours
                </p>
              </div>

              <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                <p>
                  This cookie policy is effective as of December 2024 and may be
                  updated to reflect changes in our practices.
                </p>
                <p className="mt-2">
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
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
