'use client'
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/ 3 Days" },
  { label: "Budget", placeholder: "$0 - $3000" },
  { label: "People", placeholder: "5-10" },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2400&auto=format&fit=crop";

export function Banner() {
  return (
    <section
      className="relative flex flex-1 flex-col"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.3)), url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-josefin max-w-3xl text-5xl font-light leading-tight text-white sm:text-6xl lg:text-7xl">
          Discover Your Next Adventure
        </h1>
        <p className="mt-6 max-w-xl text-sm text-white/85 sm:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan-500 px-5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cyan-600"
          >
            Explore Now
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-10 items-center rounded-md bg-white/25 px-5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/35"
          >
            View Destination
          </a>
        </div>
      </div>

      {/* Search strip */}
      <form
        className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-slate-200/70 bg-white/90 backdrop-blur-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className="flex flex-col gap-0.5 border-r border-slate-200/70 px-4 py-2.5 transition-colors last:border-r-0 focus-within:bg-slate-600 focus-within:text-white hover:bg-slate-600/90 hover:text-white lg:last:border-r sm:max-lg:border-b sm:max-lg:odd:border-l sm:max-lg:nth-last-2:border-r-0"
          >
            <label htmlFor={`banner-search-${index}`} className="text-sm font-medium">
              {field.label}
            </label>
            <input
              id={`banner-search-${index}`}
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400 focus:text-white/90 focus:placeholder:text-slate-300"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-cyan-500 px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          Search
        </button>
      </form>
    </section>
  );
}
