"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { links } from "@/data/constants";
import { toast } from "sonner";

function NavSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-3" aria-hidden="true">
      {[72, 56, 88].map((w) => (
        <div
          key={w}
          className="h-8 rounded-md bg-slate-200 animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = (name || "").slice(0, 2).toUpperCase();
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-800 ring-2 ring-primary-200 select-none"
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Derive open state from pathname — when route changes, menu closes automatically
  const [menuOpenPathname, setMenuOpenPathname] = useState<string | null>(null);
  const mobileOpen = menuOpenPathname !== null && menuOpenPathname === pathname;

  const openMenu = () => setMenuOpenPathname(pathname);
  const closeMenu = () => setMenuOpenPathname(null);
  const toggleMenu = () => (mobileOpen ? closeMenu() : openMenu());

  // Trap focus & close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      closeMenu();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`${error.message}`);
        return;
      }
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
        role="banner"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-150",
                  isActive(link.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-500" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <NavSkeleton />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label={`Go to dashboard — logged in as ${user.firstName}`}
                >
                  <Avatar name={user.firstName} />
                  <span className="hidden lg:block">{user.firstName}</span>
                </Link>
                <Button
                  variant="outline"
                  className="text-sm h-8"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="text-sm h-8">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="text-sm h-8">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          <button
            ref={mobileToggleRef}
            className="flex md:hidden items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={toggleMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}

      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        className={cn(
          "fixed top-14 left-0 right-0 z-40 md:hidden bg-white border-b border-slate-200 shadow-lg transition-all duration-200",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-1">
          <nav aria-label="Mobile navigation links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {link.label}
                <ChevronRight
                  size={14}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="mt-3 pt-3 border-t border-slate-100">
            {isLoading ? (
              <div className="flex flex-col gap-2" aria-hidden="true">
                <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
                <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Avatar name={user.firstName} />
                  <div>
                    <p className="font-medium">{user.firstName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </Link>
                <Button
                  variant="outline"
                  disabled={isLoggingOut}
                  className="w-full text-sm"
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full text-sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
