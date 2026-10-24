import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Star, ArrowUpRight } from "lucide-react";

interface DestinationCardProps {
  imageSrc?: string;
  imageAlt?: string;
  rating?: number;
  location?: string;
  title?: string;
  duration?: string;
  price?: number;
  priceUnit?: string;
  bookUrl?: string;
  loading?: "eager" | "lazy";
}

export default function DestinationCard({
  imageSrc = "",
  imageAlt = "Travel destination",
  rating = 4.5,
  location = "Explore",
  title = "Untitled destination",
  duration = "Duration varies",
  price = 0,
  priceUnit = "Person",
  bookUrl = "#",
  loading = "lazy",
}: DestinationCardProps) {
  return (
    <article className="w-full overflow-hidden bg-white">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          loading={loading}
          unoptimized={imageSrc.startsWith("http")}
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 border border-white/50 bg-white/80 px-2 py-1 shadow-sm backdrop-blur-sm">
          <span className="text-xs font-semibold text-slate-800">{rating}</span>
          <Star className="size-3 fill-slate-900 text-slate-900" />
        </div>
      </div>

      <div className="pt-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="size-3 text-slate-400" />
          <span>{location}</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-2">
          <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-900">
              ${price.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">/{priceUnit}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="size-3 text-slate-400" />
          <span>{duration}</span>
        </div>

        <div className="mt-2">
          <Link
            href={bookUrl}
            className="group inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide text-cyan-600 transition-colors hover:text-cyan-700"
          >
            <span className="border-b border-cyan-600 pb-0.5 group-hover:border-cyan-700">
              BOOK NOW
            </span>
            <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}