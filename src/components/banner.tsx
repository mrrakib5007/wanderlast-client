import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/ 3 Days" },
  { label: "Budget", placeholder: "$0 - $3000" },
  { label: "People", placeholder: "5-10" },
] as const;

// Hero image from /public
const HERO_IMAGE = "/banner.png";

export function Banner() {
  return (
    <section
      // Desktop: full screen minus navbar (h-14 = 3.5rem) so navbar +
      // banner fill the viewport exactly.
      // Mobile (<lg): height auto — content (hero + stacked search
      // strip) can be taller than the viewport, so the strip must be
      // allowed to stay INSIDE the banner instead of overflowing it.
      className="relative flex min-h-120 flex-col lg:h-[calc(100svh-3.5rem)]"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center sm:py-20">
        <h1 className="font-josefin max-w-3xl text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          Discover Your Next Adventure
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-10 w-44 items-center justify-center gap-2 rounded-none bg-cyan-500 px-5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cyan-600"
          >
            Explore Now
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-10 w-44 items-center justify-center rounded-none bg-white/25 px-6 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/35"
          >
            View Destination
          </a>
        </div>
      </div>

      {/* Search strip — banner image shows through (translucent cells),
          Search button stays solid.
          Mobile: 2-col grid + full-width button; lg: 5 equal cells */}
      <form
        className="grid w-full grid-cols-2 border-t border-white/20 lg:grid-cols-5"
      >
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className="flex flex-col gap-0.5 border-r border-b border-white/20 bg-slate-600/60 px-4 py-2.5 text-white max-lg:odd:border-r-0 lg:border-b-0"
          >
            <label
              htmlFor={`banner-search-${index}`}
              className="text-sm font-medium"
            >
              {field.label}
            </label>
            <input
              id={`banner-search-${index}`}
              type="text"
              placeholder={field.placeholder}
              className="w-full bg-transparent text-xs text-white/90 outline-none placeholder:text-white/60"
            />
          </div>
        ))}
        <button
          type="button"
          className="col-span-2 bg-cyan-500 px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-cyan-600 lg:col-span-1 lg:py-4"
        >
          Search
        </button>
      </form>
    </section>
  );
}
