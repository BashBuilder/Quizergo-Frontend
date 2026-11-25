import type { Metadata } from "next";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

export const metadata: Metadata = {
  title: "Practice for JAMB and WAEC",
  description:
    "Timed JAMB and WAEC practice papers. Pick your subjects, sit the session, and get every answer explained.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  );
}
