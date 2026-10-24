"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, User, type LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "cn";

/* ============================================================
   Navbar config — edit everything here
   ============================================================ */

// Nav item — `icon` is optional (Lucide icon). Items with an
// icon show it before the name.
type NavItem = {
  name: string;
  href: string;
  icon?: LucideIcon;
};

// Brand: logo image path (in /public), alt name, and where the logo links to
const brand = {
  name: "Wanderlast",
  logo: "/logo.png",
  href: "/",
};

// Main nav items — change `name` or `href` freely
const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Destinations", href: "/destinations" },
  { name: "My Bookings", href: "/bookings" },
  { name: "Admin", href: "/admin", icon: ShieldCheck },
];

// Right side links — Profile with icon
const authLinks: NavItem[] = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Login", href: "/login" },
  { name: "Sign Up", href: "/signup" },
];

/* ============================================================ */

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4">
        {/* Hamburger — opens slide-in menu (mobile only) */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="justify-self-start text-slate-700 md:hidden"
        >
          <Menu className="size-5" />
        </button>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-sky-600",
                pathname === item.href && "text-sky-600"
              )}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link href={brand.href} className="justify-self-center">
          <Image
            src={brand.logo}
            alt={brand.name}
            width={150}
            height={30}
            priority
            className="h-5 w-auto"
          />
        </Link>

        {/* Desktop right links */}
        <div className="hidden items-center justify-end gap-6 text-sm text-slate-700 md:flex">
          {authLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-sky-600",
                pathname === item.href && "text-sky-600"
              )}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Slide-in menu from the right (mobile only) */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-72 gap-0">
          <SheetHeader>
            <SheetTitle className="sr-only">{brand.name}</SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>
            <SheetClose
              nativeButton={false}
              render={<Link href={brand.href} className="flex items-center" />}
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={150}
                height={30}
                className="h-5 w-auto"
              />
            </SheetClose>
          </SheetHeader>

          <nav className="flex flex-col">
            {navItems.map((item) => (
              <SheetClose
                key={item.name}
                nativeButton={false}
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-sky-600",
                      pathname === item.href && "text-sky-600"
                    )}
                  />
                }
              >
                {item.icon && <item.icon className="size-4" />}
                {item.name}
              </SheetClose>
            ))}
          </nav>

          <SheetFooter className="mt-auto border-t border-slate-100">
            {authLinks.map((item) => (
              <SheetClose
                key={item.name}
                nativeButton={false}
                render={
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm text-slate-700 hover:text-sky-600"
                  />
                }
              >
                {item.icon && <item.icon className="size-4" />}
                {item.name}
              </SheetClose>
            ))}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}
