"use client";
import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { links } from "@/data/constants";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";

function NavSkeleton() {
  return (
    <div className="hidden md:flex items-center gap-2" aria-hidden="true">
      {[64, 92].map((w) => (
        <div
          key={w}
          className="h-7 rounded-md bg-well animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = (name || "").slice(0, 2).toUpperCase();
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-marker-wash text-[0.6875rem] font-semibold tracking-wide text-marker-ink ring-1 ring-marker-line"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

const Header = () => {
  const { user, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const [menuOpenPathname, setMenuOpenPathname] = useState<string | null>(null);
  const mobileOpen = menuOpenPathname !== null && menuOpenPathname === pathname;

  const openMenu = () => setMenuOpenPathname(pathname);
  const closeMenu = () => setMenuOpenPathname(null);
  const toggleMenu = () => (mobileOpen ? closeMenu() : openMenu());

  const navLinks = user
    ? [...links, { href: "/dashboard", label: "Mark book" }]
    : links;

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
        className="fixed top-0 z-50 w-full border-b border-rule bg-paper/90 backdrop-blur-xl"
        role="banner"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-6">
          <Logo />

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative flex h-14 items-center text-[0.8125rem] font-medium transition-colors",
                  isActive(link.href)
                    ? "text-marker-ink"
                    : "text-ink-quiet hover:text-ink",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-marker"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <NavSkeleton />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2.5 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={`Mark book, signed in as ${user.firstName}`}
                >
                  <Avatar name={user.firstName} />
                  <span className="hidden lg:block">{user.firstName}</span>
                </Link>
                <button
                  type="button"
                  className="rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink-quiet transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-2.5 py-1.5 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:bg-well hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className: "h-8 rounded-md px-3.5 text-[0.8125rem]",
                  })}
                >
                  Start a paper
                </Link>
              </>
            )}
          </div>

          <button
            ref={mobileToggleRef}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-well focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:hidden"
            onClick={toggleMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-exam-deep/30 md:hidden"
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
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={cn(
          "fixed inset-x-0 top-14 z-40 border-b border-rule bg-paper md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-5">
          <nav aria-label="Mobile navigation links" className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-rule py-3.5 text-[0.9375rem] font-medium transition-colors",
                  isActive(link.href) ? "text-marker-ink" : "text-ink-soft",
                )}
              >
                {link.label}
                <ChevronRight
                  size={15}
                  className="text-ink-quiet/60"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          <div className="mt-5">
            {isLoading ? (
              <div className="flex flex-col gap-2" aria-hidden="true">
                <div className="h-10 rounded-md bg-well animate-pulse" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={user.firstName} />
                  <div className="min-w-0">
                    <p className="truncate text-[0.8125rem] font-semibold text-ink">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-ink-quiet">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  className="w-full rounded-md border border-rule bg-sheet py-2.5 text-[0.8125rem] font-semibold text-ink-soft transition-colors hover:bg-well disabled:opacity-50"
                  onClick={handleLogout}
                >
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full rounded-md border border-rule bg-sheet py-2.5 text-center text-[0.8125rem] font-semibold text-ink-soft"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className: "h-10 w-full rounded-md text-[0.8125rem]",
                  })}
                >
                  Start a paper
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
