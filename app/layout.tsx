import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/global/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "QuizerGo",
  description: "QuizerGo = Your very first quiz go-to for enlightenment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", poppins.className)}>
      <body className="min-h-full">
        <Header />
        <main className="flex-1 pt-14">{children}</main>
      </body>
    </html>
  );
}
