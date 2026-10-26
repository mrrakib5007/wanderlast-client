"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronRight,
  Edit,
  House,
  MapPin,
  Star,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import DestinationEditDialog, {
  Destination,
} from "@/components/cards/DestinationEditDialog";
import DestinationDeleteDialog from "@/components/cards/DestinationDeleteDialog";
import Loading from "./loading";

export default function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.BETTER_AUTH_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl}/destination/${encodeURIComponent(id)}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (res.status === 404) notFound();
        if (!res.ok) throw new Error("Failed to fetch destination details");
        return res.json();
      })
      .then((result) => {
        if (!result?.data) notFound();
        setDestination(result.data);
      })
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [id, isEditOpen]);

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true);
      const res = await fetch(
        `${process.env.BETTER_AUTH_API_URL}/destination/${id}`,
        {
          method: "DELETE",
        },
      );

      const contentType = res.headers.get("content-type") || "";
      let result = null;
      if (contentType.includes("application/json")) {
        result = await res.json();
      }

      if (!res.ok) {
        throw new Error(result?.message || "Failed to delete");
      }

      setIsDeleteOpen(false);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: result?.message || "The destination package has been removed.",
        confirmButtonColor: "#0ea5e9",
      });

      router.push("/destinations");
    } catch (error: unknown) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong while deleting.",
        confirmButtonColor: "#0ea5e9",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!destination) return null;

  const price = Number(destination.price);
  const formattedPrice = Number.isFinite(price) ? price.toLocaleString() : "—";
  const imageUrl = destination.imageUrl || "/destinations/image1.png";

  const highlights = [
    "Luxury beachfront accommodation",
    "Visit Uluwatu Temple at sunset",
    "Traditional Balinese spa treatment",
    "Private beach dinner experience",
    "Sunrise trek to Mount Batur",
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ol className="flex flex-wrap items-center gap-2 text-xs lg:text-sm">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-blue-600"
              >
                <House size={16} />
                <span>Home</span>
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight size={15} className="text-gray-400" />
            </li>

            <li>
              <Link
                href="/destinations"
                className="text-gray-500 transition-colors hover:text-blue-600"
              >
                Destinations
              </Link>
            </li>

            <li aria-hidden="true">
              <ChevronRight size={15} className="text-gray-400" />
            </li>

            <li aria-current="page" className="font-semibold text-blue-600">
              {destination.destinationName}
            </li>
          </ol>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:flex-initial"
          >
            <Edit className="size-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-red-200 bg-white px-3.5 py-1.5 text-sm font-medium text-red-500 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 sm:flex-initial"
          >
            <Trash2 className="size-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      <div className="relative mt-6 h-50 md:h-80 lg:h-120 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={destination.destinationName || "Travel destination"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={imageUrl.startsWith("http")}
        />
      </div>

      <div className="mt-8 border-t border-slate-100 pt-8 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          {destination.country && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="size-3.5 text-slate-400" />
              <span>{destination.country}</span>
            </div>
          )}

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {destination.destinationName || "Travel destination"}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-emerald-600 text-emerald-600" />
              <span className="font-bold text-slate-900">4.9</span>
              <span className="text-slate-400">(234 reviews)</span>
            </div>

            {destination.duration && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Calendar className="size-3.5 text-slate-500" />
                <span>{destination.duration}</span>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-medium tracking-tight text-slate-900">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {destination.description ||
                "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-medium tracking-tight text-slate-900">
              Highlights
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {destination.description ||
                "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets."}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span className="text-xs text-slate-600">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 lg:col-span-4">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs text-slate-500">Starting from</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-[#0ea5e9]">
                ${formattedPrice}
              </span>
            </div>
            <p className="text-xs text-slate-400">per person</p>

            <div className="mt-6">
              <input
                type="input"
                defaultValue={destination.departureDate || ""}
                className="w-full rounded-md border border-slate-200 bg-slate-100 px-3.5 py-3 text-sm font-medium text-slate-700 outline-none"
              />
            </div>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#0ea5e9] py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0284c7] cursor-pointer"
            >
              <span>Book Now</span>
              <ArrowRight className="size-4" />
            </button>

            <ul className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" />
                <span>Free cancellation up to 7 days</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" />
                <span>Travel insurance included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-600" />
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DestinationEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        destination={destination}
      />

      <DestinationDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={destination.destinationName}
        isDeleting={isDeleting}
      />
    </main>
  );
}
