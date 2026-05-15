import type { Metadata } from "next";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";

export const metadata: Metadata = {
  title: "QuizerGo",
  description: "QuizerGo = Your very first quiz go-to for enlightenment",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </main>
  );
}
