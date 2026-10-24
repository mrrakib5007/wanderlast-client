"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

/* Testimonials config — add/edit items freely.
   Photos live in /public */
const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Shanghai",
    photo: "/person1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommended!",
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "/person2.png",
  },
  {
    quote:
      "Kyoto In Cherry Blossom Season Was A Dream Come True. Every Temple Visit Felt Personal And Our Small Group Made New Friends Along The Way.",
    name: "Aisha Patel",
    location: "Mumbai, India",
    photo: "/person1.png", // TODO: replace with a real traveler's photo
  },
  {
    quote:
      "The Santorini Sunset Cruise Was The Highlight Of Our Honeymoon. Flawless Bookings, Beautiful Hotels And Memories That Will Last A Lifetime.",
    name: "David Okafor",
    location: "Lagos, Nigeria",
    photo: "/person2.png", // TODO: replace with a real traveler's photo
  },
] as const;

export function Testimonials() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [paused, setPaused] = useState(false);

  // Auto-slide every 5s, infinite (loop: true handles wrapping)
  useEffect(() => {
    if (!api || paused) return;
    const timer = setInterval(() => api.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [api, paused]);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Carousel wraps the header (arrows need carousel context) */}
        <Carousel
          opts={{ align: "start", loop: true, duration: 30 }}
          setApi={setApi}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          className="mt-10"
        >
          {/* Stack heading and arrows on mobile */}
          <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <h2 className="font-josefin text-3xl font-bold text-slate-900 sm:text-5xl">
                What Travelers Say
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex gap-2">
              <CarouselPrevious className="static size-9 sm:size-10" />
              <CarouselNext className="static size-9 sm:size-10" />
            </div>
          </div>

          {/* Testimonial cards */}
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.name}
                className="basis-full sm:basis-1/2"
              >
                <article className="flex h-full flex-col bg-slate-100 lg:flex-row-reverse">
                  {/* Mobile/tab: square photo on TOP; lg: photo right.
                      min-h guards against 0-height for the fill image */}
                  <div className="relative aspect-square w-full shrink-0 lg:aspect-auto lg:w-44 lg:min-h-44">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.name}
                      fill
                      sizes="(min-width: 1024px) 176px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[15px] font-medium leading-snug text-slate-800">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="mt-auto pt-6">
                      <p className="text-sm font-medium text-cyan-600">
                        — {testimonial.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
