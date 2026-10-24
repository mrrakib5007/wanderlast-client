# Project: Wanderlast (Client)

Travel booking web application — Next.js frontend in `client/`. Brand name: **Wanderlast** (cyan/sky accent color scheme, square-cornered buttons/inputs).

## Tech Stack

- **Next.js 16.4.3** (App Router, Turbopack) — NOT an older Next.js; read `node_modules/next/dist/docs/` before writing code
- **React 19.3.0** + React Compiler (`babel-plugin-react-compiler`)
- **TypeScript 5**
- **Tailwind CSS v4** — CSS-first config, NO `tailwind.config` file; theme defined via `@theme inline` in `src/app/globals.css`
- **shadcn/ui** — primitives in `src/components/ui/`, built on `@base-ui/react` (uses `render` prop, NOT Radix `asChild`), `cn` is a clsx+tailwind-merge replacement
- **lucide-react** (brand icons removed — inline SVG needed for X/LinkedIn/Instagram)
- **sweetalert2** (popups), **embla-carousel-react** (via ui/carousel), **react-day-picker v10** (via ui/calendar)
- NOTE: Server Components cannot pass event handlers; event-handler pages/components need `"use client"` (metadata then moves to a route `layout.tsx`)

## Project Structure

```
client/
├── public/                # Assets: banner.png, CTA.png, logo.png, logo-white.png, icons (person1/2, ShieldCheck, MapTrifold, headset), destinations/image1-6
├── src/app/
│   ├── layout.tsx         # Fonts + Navbar + Footer (global), root SEO metadata (title template "%s | Wanderlast")
│   ├── page.tsx           # Home: Banner → WhyChooseUs → Testimonials → CTA (+ full SEO: OG, twitter, canonical, robots)
│   ├── add-destination/page.tsx  # "Add New Travel Package" form — CLIENT component, ALL logic in this single file (no extra component/layout per user request)
│   ├── globals.css        # Tailwind v4 theme
│   ├── robots.ts          # /robots.txt
│   └── sitemap.ts         # /sitemap.xml
├── src/components/        # Feature components (navbar, banner, why-choose-us, testimonials, cta, footer)
│   └── ui/                # shadcn/ui primitives
└── src/lib/               # site-config.ts (SITE_URL/SITE_NAME — TODO: real domain), highlighter.tsx
```

## Key Patterns (follow these)

- **Config-driven components**: colors/links/items defined as exported-style `const` objects/arrays at top of each component file (e.g., `navItems`, `features`, `testimonials`, `searchFields`, `cta`, `footer`, `categories` in add-destination, `validators` regex map) — user edits config in ONE place to change content
- **User edits files themselves — NEVER revert/overwrite user's own modifications.** Re-read file before editing to see their latest changes
- Form pages: event handlers live IN the page file only; `noValidate` custom regex validation (no browser default messages), field errors as small red text under inputs + red border; JSON stringify console.log on valid submit
- Responsive: mobile-first (`w-full` stacked on mobile, `sm:`/`lg:` grid/row on larger); buttons order via `sm:order-*` when mobile/desktop order differs
- Date inputs use "en-CA" locale trick (`YYYY-MM-DD`, timezone safe) for min/today
- shadcn NativeSelect quirk: its `className` goes to wrapper div, not `<select>` — for custom-styled selects, hand-roll `<select>` + ChevronDown instead
- Server-side imports of `next/font` etc fine; `Swal.fire()` only in client code

## Pages & Components Overview

- **Navbar** (`src/components/navbar.tsx`, in layout): config-driven nav/auth links with optional lucide `icon` per item + `NavItem` type; mobile = shadcn Sheet sliding from RIGHT (SheetClose needs `nativeButton={false}` when rendering `<Link>`); active link via `usePathname()`
- **Banner** (home): fixed height `lg:h-[calc(100svh-3.5rem)]` (3.5rem = navbar h-14; recalc if navbar height changes), mobile auto height; translucent search strip (`bg-slate-600/60`) with solid cyan Search button; Explore/View buttons `w-44`; public banner.png
- **WhyChooseUs**: cyan-50 bg, public PNG icons, 3-card grid
- **Testimonials**: embla carousel — `loop: true`, `duration: 30`, 5s auto-slide via custom `setApi` interval (pauses on hover); mobile/tab 1 card w/ square image TOP, `sm:basis-1/2` 2 cards, `lg` text-left/photo-right; arrows inside `<Carousel>` (context requirement)
- **CTA**: public CTA.png + dark overlay; desktop 1-line heading (`sm:whitespace-nowrap`)
- **Footer** (in layout): dark, config-driven columns, newsletter form, inline-SVG social icons, dynamic year
- **SEO**: root metadata in layout (metadataBase from site-config, template), home page OG/twitter/canonical, robots.ts, sitemap.ts

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint

## Fonts

Loaded via `next/font/google` in `src/app/layout.tsx`, exposed as CSS variables on `<html>`:

- **Plus Jakarta Sans** → `--font-plus-jakarta-sans` — DEFAULT font for all text (mapped to `--font-sans` in globals.css)
- **Josefin Sans** → `--font-josefin-sans` — accent font (headings "font-josefin"):
  - Tailwind utility class: `font-josefin` (from `--font-josefin` token in globals.css)
  - Raw CSS variable: `var(--font-josefin-sans)` in arbitrary values
  - Use only in specific components/headings where a different look is needed

## Styling Conventions

- Accent color: cyan-500/sky-600 family for interactive elements; neutral bg `bg-neutral-950` for footer
- Color/radius tokens: shadcn CSS variables in `:root` / `.dark`, mapped in `@theme inline`
- Header/column-title font: `font-josefin`
- `--font-mono` removed; Tailwind default mono stack applies

## Build Verification (MANDATORY)

- **After completing any work, ALWAYS verify there are no build errors before reporting done.**
- Minimum check: `npx tsc --noEmit` (types/components). For page/UI render issues also run `npm run build` when feasible.
- Do not consider a task finished with failing typecheck/build output.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
