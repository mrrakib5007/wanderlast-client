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
      // Height = full screen minus navbar (h-14 = 3.5rem), so
      // navbar + banner together fill the viewport exactly.
      className="relative flex h-[calc(100svh-3.5rem)] min-h-120 flex-col"
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hero content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
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
            className="inline-flex h-10 items-center gap-2 rounded-none bg-cyan-500 px-5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cyan-600"
          >
            Explore Now
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-10 items-center rounded-none bg-white/25 px-6 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/35"
          >
            View Destination
          </a>
        </div>
      </div>

      {/* Search strip — banner image shows through (translucent cells),
          Search button stays solid */}
      <form
        className="grid w-full grid-cols-1 border-t border-white/20 sm:grid-cols-2 lg:grid-cols-5"
      >
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className="flex flex-col gap-0.5 border-r border-white/20 bg-slate-600/60 px-4 py-2.5 text-white last:border-r-0 sm:max-lg:border-b sm:max-lg:odd:border-l sm:max-lg:nth-last-2:border-r-0 lg:last:border-r"
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
          className="bg-cyan-500 px-4 py-4 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
        >
          Search
        </button>
      </form>
    </section>
  );
}
