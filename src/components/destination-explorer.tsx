"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import DestinationCard from "@/components/cards/DestinationCard";

interface Destination {
  id?: string | number;
  _id?: string | number;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: number | string;
  duration?: string;
  imageUrl?: string;
  rating?: number | string;
}

type PriceFilter = "all" | "under-1000" | "1000-2500" | "over-2500";
type SortOrder = "featured" | "price-low" | "price-high" | "name";

const selectClass =
  "h-10 w-full appearance-none border-0 bg-transparent px-3 pr-9 text-xs uppercase tracking-wide text-slate-600 outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500";

function getPrice(destination: Destination) {
  const price = Number(destination.price);
  return Number.isFinite(price) ? price : 0;
}

export default function DestinationExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          destinations
            .map((destination) => destination.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [destinations],
  );

  const visibleDestinations = useMemo(() => {
    const filtered = destinations.filter((destination) => {
      const price = getPrice(destination);
      const matchesCategory =
        category === "all" ||
        destination.category?.toLowerCase() === category.toLowerCase();
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "under-1000" && price < 1000) ||
        (priceFilter === "1000-2500" && price >= 1000 && price <= 2500) ||
        (priceFilter === "over-2500" && price > 2500);

      return matchesCategory && matchesPrice;
    });

    if (sortOrder === "price-low") {
      return filtered.sort((a, b) => getPrice(a) - getPrice(b));
    }
    if (sortOrder === "price-high") {
      return filtered.sort((a, b) => getPrice(b) - getPrice(a));
    }
    if (sortOrder === "name") {
      return filtered.sort((a, b) =>
        (a.destinationName ?? "").localeCompare(b.destinationName ?? ""),
      );
    }
    return filtered;
  }, [category, destinations, priceFilter, sortOrder]);

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <header>
        <h1 className="font-josefin text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Explore All Destinations
        </h1>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">
          Find your perfect travel experience from our curated collection.
        </p>
      </header>

      <section
        aria-label="Filter destinations"
        className="mt-6 grid grid-cols-1 divide-y divide-slate-200 border border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <label className="relative">
          <span className="sr-only">Filter by category</span>
          <select
            className={selectClass}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">Category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-slate-400"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filter by price</span>
          <select
            className={selectClass}
            value={priceFilter}
            onChange={(event) =>
              setPriceFilter(event.target.value as PriceFilter)
            }
          >
            <option value="all">Price range</option>
            <option value="under-1000">Under $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="over-2500">Over $2,500</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-slate-400"
          />
        </label>

        <label className="relative">
          <span className="sr-only">Sort destinations</span>
          <select
            className={selectClass}
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="featured">Sort by</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-slate-400"
          />
        </label>
      </section>

      <p aria-live="polite" className="mt-3 text-xs text-slate-500">
        Showing {visibleDestinations.length}{" "}
        {visibleDestinations.length === 1 ? "destination" : "destinations"}
      </p>

      {visibleDestinations.length > 0 ? (
        <section
          aria-label="Available destinations"
          className="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id ?? destination._id ?? `${destination.destinationName ?? "destination"}-${index}`}
              imageSrc={destination.imageUrl || "/destinations/image1.png"}
              imageAlt={destination.destinationName || "Travel destination"}
              rating={Number(destination.rating) || 4.5}
              location={destination.country || "Explore"}
              title={destination.destinationName || "Untitled destination"}
              duration={destination.duration || "Duration varies"}
              price={getPrice(destination)}
              bookUrl="#"
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </section>
      ) : (
        <p className="mt-8 border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No destinations match these filters.
        </p>
      )}
    </main>
  );
}
