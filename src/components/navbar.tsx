'use client'
import { useState } from "react";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { cn } from "cn";

const navLinks = ["Home", "Destinations", "My Bookings", "Admin"] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<(typeof navLinks)[number]>("Home");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto grid h-10 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4">
        {/* Hamburger (mobile only) */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="justify-self-start text-slate-700 md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Left nav links (desktop) */}
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActive(link);
                setMenuOpen(false);
              }}
              className={cn(
                "transition-colors hover:text-sky-600",
                active === link && "text-sky-600"
              )}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Logo */}
        <a
          href="#"
          className="justify-self-center text-lg font-bold tracking-wide text-sky-600"
        >
          Wanderlust
        </a>

        {/* Right auth links (desktop) */}
        <div className="hidden items-center justify-end gap-6 text-sm text-slate-700 md:flex">
          <a href="#" className="flex items-center gap-1.5 hover:text-sky-600">
            <User className="size-4" />
            Profile
            <ChevronDown className="size-3" />
          </a>
          <a href="#" className="hover:text-sky-600">
            Login
          </a>
          <a href="#" className="hover:text-sky-600">
            Sign Up
          </a>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActive(link);
                setMenuOpen(false);
              }}
              className={cn(
                "rounded-md px-2 py-1.5 hover:bg-slate-50 hover:text-sky-600",
                active === link && "text-sky-600"
              )}
            >
              {link}
            </a>
          ))}
          <div className="my-1 border-t border-slate-100" />
          <a href="#" className="rounded-md px-2 py-1.5 hover:bg-slate-50 hover:text-sky-600">
            Profile
          </a>
          <a href="#" className="rounded-md px-2 py-1.5 hover:bg-slate-50 hover:text-sky-600">
            Login
          </a>
          <a href="#" className="rounded-md px-2 py-1.5 hover:bg-slate-50 hover:text-sky-600">
            Sign Up
          </a>
        </nav>
      )}
    </header>
  );
}
