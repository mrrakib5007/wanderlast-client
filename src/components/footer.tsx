import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/* ============================================================
   Footer config — edit everything here
   ============================================================ */

const footer = {
  logo: "/logo-white.png",
  tagline: "Your gateway to extraordinary travel experiences around the world.",
  copyright: `© ${new Date().getFullYear()} Wanderlast. All rights reserved.`,
};

const linkColumns = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", href: "/" },
      { name: "Destinations", href: "/destinations" },
      { name: "My Bookings", href: "/bookings" },
      { name: "My Profile", href: "/profile" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const contact = {
  phone: "890 123 4567",
  email: "info@wanderlustgo.com",
};

const socials = [
  { name: "X", href: "/", icon: "x" },
  { name: "LinkedIn", href: "/", icon: "linkedin" },
  { name: "Instagram", href: "/", icon: "instagram" },
] as const;

/* ============================================================ */

function SocialIcon({ name }: { name: "x" | "linkedin" | "instagram" }) {
  // lucide-react no longer ships brand logos — inline paths
  const paths: Record<string, string> = {
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z",
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
    instagram:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  };

  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8">
        {/* Brand */}
        <div className="max-w-md">
          <Image
            src={footer.logo}
            alt="Wanderlast"
            width={300}
            height={60}
            className="h-11 w-auto"
          />
          <p className="mt-4 text-sm text-white/60">{footer.tagline}</p>
        </div>

        {/* Columns */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-josefin font-semibold uppercase tracking-wider text-white/90">
              Newsletter
            </h3>
            <p className="mt-3 text-xs text-white/50">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form className="relative mt-4 max-w-xs" action="#">
              <input
                type="email"
                placeholder="Enter email"
                aria-label="Enter email"
                className="h-10 w-full rounded-none border border-white/15 bg-white/10 px-3 pr-10 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/40"
              />
              <button
                type="button"
                aria-label="Subscribe"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-white/80 hover:text-white"
              >
                <ArrowUpRight className="size-4" />
              </button>
            </form>
          </div>

          {/* Link columns */}
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-josefin text-xs font-semibold uppercase tracking-wider text-white/90">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-josefin text-xs font-semibold uppercase tracking-wider text-white/90">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">{footer.copyright}</p>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-white hover:text-cyan-600"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
