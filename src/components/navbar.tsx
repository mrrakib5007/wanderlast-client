"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, LogOut, type LucideIcon } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";

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
  { name: "Add Destination", href: "/add-destination" },
  { name: "My Bookings", href: "/bookings" },
];

const authLinks: NavItem[] = [
  { name: "Login", href: "/login" },
  { name: "Sign Up", href: "/signup" },
];

/* Helper to get user initials for fallback avatar */
function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ============================================================ */

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [userMenuOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setUserMenuOpen(false);
  }

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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

        {/* Right side: User Profile Circle / Auth Links */}
        <div className="flex items-center justify-end">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              {/* Profile Image Circle Button */}
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-sky-500/40 transition-all hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
                aria-label="User profile menu"
                aria-expanded={userMenuOpen}
              >
                {user.image ? (
                  <Image
                  referrerPolicy="no-referrer"
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={36}
                    height={36}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-sky-100 font-semibold text-xs text-sky-700">
                    {getInitials(user.name)}
                  </div>
                )}
              </button>

              {/* Small Popup Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                  {/* User Image, Name, and Email */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                      {user.image ? (
                        <Image
                         referrerPolicy="no-referrer"
                          src={user.image}
                          alt={user.name || "User"}
                          width={44}
                          height={44}
                          unoptimized
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="font-semibold text-sm text-sky-700">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="pt-2 pb-1 space-y-1">
                    {/* Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-sky-600"
                    >
                      <User className="size-4 text-slate-400" />
                      <span>Profile</span>
                    </Link>

                    {/* Sign Out Button */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="size-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
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

          <SheetFooter className="mt-auto border-t border-slate-100 p-4">
            {user ? (
              <div className="flex flex-col gap-3 w-full">
                {/* Mobile User Info */}
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    {user.image ? (
                      <Image
                      referrerPolicy="no-referrer"
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        unoptimized
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-xs text-sky-700">
                        {getInitials(user.name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Profile Link */}
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-sky-600"
                    />
                  }
                >
                  <User className="size-4 text-slate-400" />
                  <span>Profile</span>
                </SheetClose>

                {/* Mobile Sign Out Button */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="size-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1 w-full">
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
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </header>
  );
}
