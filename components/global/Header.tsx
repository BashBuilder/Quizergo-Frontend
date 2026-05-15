import React from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Practice" },
  { href: "/", label: "Live" },
  { href: "/", label: "Challenges" },
  { href: "/", label: "Leaderboard" },
  { href: "/", label: "Blog" },
];

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-primary-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 h-14">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <nav className="hidden gap-8 md:flex text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden gap-3 md:flex">
          <Link href="/login">
            <Button variant="outline" className="text-sm">
              Login
            </Button>
          </Link>
          <Link href="/login">
            <Button className=" text-sm">Get Started</Button>
          </Link>
        </div>

        <button className="md:hidden">
          <Menu />
        </button>
      </div>
    </header>
  );
};

export default Header;
