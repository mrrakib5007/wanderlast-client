# Project: Wanderlust (Client)

Travel journal/blog application — Next.js frontend in `client/`.

## Tech Stack

- **Next.js 16.4.3** (App Router, Turbopack ready) — NOT an older Next.js; read `node_modules/next/dist/docs/` before writing code
- **React 19.3.0** + React Compiler (`babel-plugin-react-compiler`)
- **TypeScript 5**
- **Tailwind CSS v4** — CSS-first config, NO `tailwind.config` file; theme is defined via `@theme inline` in `src/app/globals.css`
- **shadcn/ui** — components in `src/components/ui/`, built on `@base-ui/react`, `cn` utility in `src/lib/`

## Project Structure

```
client/
├── src/app/          # App Router: layout.tsx, page.tsx, globals.css
├── src/components/   # React components
│   └── ui/           # shadcn/ui primitive components
└── src/lib/          # Utilities (e.g., highlighter.tsx)
```

## Commands

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run lint` — eslint

## Fonts

Loaded via `next/font/google` in `src/app/layout.tsx`, exposed as CSS variables on `<html>`:

- **Plus Jakarta Sans** → `--font-plus-jakarta-sans` — DEFAULT font for all text (mapped to `--font-sans` in globals.css)
- **Josefin Sans** → `--font-josefin-sans` — accent font:
  - Tailwind utility class: `font-josefin` (from `--font-josefin` token in globals.css)
  - Raw CSS variable: `var(--font-josefin-sans)` in arbitrary values, e.g. `font-(family-name:--font-josefin-sans)`
  - Use only in specific components where a different look is needed

## Styling Conventions

- Color/radius tokens: shadcn CSS variables in `:root` / `.dark`, mapped in `@theme inline`
- Utility classes via `@apply` allowed inside `@layer base`
- `--font-mono` was removed (was pointing to unloaded Geist Mono); Tailwind's default mono stack applies

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
