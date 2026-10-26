"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "cn";

/* ============================================================
   Add New Travel Package — page (client)
   ============================================================ */

/* Shared field styles — mock er moto light inputs, no rounded corners */
const inputClass =
  "h-10 w-full rounded-none border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white";

const labelClass = "block text-sm font-medium text-slate-700";

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "City Tour",
  "Heritage",
  "Wildlife",
];

const errorTextClass = "mt-1 text-xs text-red-500";

/* Local date as YYYY-MM-DD (timezone-safe min for date inputs) */
const today = new Date();
const todayStr = today.toLocaleDateString("en-CA");

/* ============================================================
   Regex validations — better security
   ============================================================ */
const validators: Record<string, { regex: RegExp; message: string }> = {
  destinationName: {
    regex: /^[A-Za-z0-9\s.,'()-]{2,60}$/,
    message: "Must be 2-60 characters (letters, numbers, basic punctuation).",
  },
  country: {
    regex: /^[A-Za-z\s'-]{2,60}$/,
    message: "Only letters, spaces, apostrophes and hyphens (2-60 chars).",
  },
  price: {
    regex: /^\d{1,6}(\.\d{1,2})?$/,
    message: "Enter a valid price, e.g. 1299",
  },
  duration: {
    regex: /^\d+\sDays?\/\s\d+\sNights?$/,
    message: "Format: X Days/ Y Nights (Use calender icon to fill it).",
  },
  imageUrl: {
    regex: /^https?:\/\/[\w-]+(\.[\w-]+)+[^\s]*$/,
    message: "Enter a valid URL starting with http(s)://",
  },
};

type Errors = Partial<Record<string, string>>;

export default function AddDestinationPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});

  // Departure date (state mirror for return-date calculation + min rules)
  const [departureDate, setDepartureDate] = useState(todayStr);

  // Custom return-date box state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>();
  const [returnTime, setReturnTime] = useState("12:00");
  const [pickerError, setPickerError] = useState<string>();

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function fieldClass(name: string) {
    return cn(
      inputClass,
      errors[name] && "border-red-400 focus:border-red-400",
    );
  }

  function fieldError(name: string) {
    return errors[name] ? (
      <p className={errorTextClass}>{errors[name]}</p>
    ) : null;
  }

  /* Return date o departure date theke Days/ Nights calculate */
  function applyReturnDate() {
    if (!returnDate) return;

    // date-only compare (timezone safe)
    const dep = departureDate
      ? new Date(`${departureDate}T00:00:00`)
      : new Date(`${todayStr}T00:00:00`);
    const ret = new Date(`${returnDate.toISOString().slice(0, 10)}T00:00:00`);

    const nights = Math.max(
      0,
      Math.round((ret.getTime() - dep.getTime()) / 86400000),
    );
    const days = nights + 1;

    const durationInput = document.getElementById(
      "package-duration",
    ) as HTMLInputElement | null;
    if (durationInput) {
      durationInput.value = `${days} Days/ ${nights} Nights`;
      clearError("duration");
    }

    setPickerOpen(false);
    setPickerError(undefined);
  }

  /* Form submit — regex validation, valid hole (JSON) console log + sweetalert2 popup */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const value = (name: string) =>
      (data[name] as string | undefined)?.trim() ?? "";

    const newErrors: Errors = {};

    for (const [name, field] of Object.entries(validators)) {
      const v = value(name);
      if (!v) {
        newErrors[name] = `${
          name === "destinationName"
            ? "Destination Name"
            : name === "imageUrl"
              ? "Image URL"
              : name.charAt(0).toUpperCase() + name.slice(1)
        } is required.`;
      } else if (!field.regex.test(v)) {
        newErrors[name] = field.message;
      }
    }

    // Category whitelist
    if (value("category")) {
      if (!categories.map((c) => c.toLowerCase()).includes(value("category"))) {
        newErrors.category = "Select a valid category.";
      }
    } else if (!newErrors.category) {
      newErrors.category = "Category is required.";
    }

    // Departure Date — valid + today or future
    if (!value("departureDate")) {
      newErrors.departureDate = "Departure Date is required.";
    } else if (value("departureDate") < todayStr) {
      newErrors.departureDate = "Departure date cannot be in the past.";
    }

    // Description — length + no HTML tags (XSS-ish safety)
    const desc = value("description");
    if (!desc) {
      newErrors.description = "Description is required.";
    } else if (desc.length < 10 || desc.length > 1000) {
      newErrors.description = "Description must be 10-1000 characters.";
    } else if (/[<>]/.test(desc)) {
      newErrors.description = "HTML tags (< >) are not allowed.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(
        `${process.env.BETTER_AUTH_API_URL}/destination`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const responseText = await res.text();

        console.error("API URL:", res.url);
        console.error("Status:", res.status);
        console.error("Response:", responseText.slice(0, 300));

        throw new Error(
          `Server returned HTML or an invalid response (HTTP ${res.status}). Check your API URL.`,
        );
      }

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        throw new Error(result.message || `API error: ${res.status}`);
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.message || "Your travel package has been added.",
        confirmButtonText: "OK",
        confirmButtonColor: "#06b6d4",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      // form.reset();
      // setDepartureDate(todayStr);
      // setReturnDate(undefined);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not add the travel package. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#06b6d4",
      });
      return;
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      {/* Page heading */}
      <div>
        <h1 className="font-josefin text-4xl font-bold text-slate-900 sm:text-5xl">
          Add New Travel Package
        </h1>
      </div>

      {/* Form card — centered */}
      <div className="mx-auto mt-10 max-w-2xl">
        <form
          noValidate
          className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          onSubmit={handleSubmit}
        >
          {/* Destination Name */}
          <div>
            <label htmlFor="package-name" className={labelClass}>
              Destination Name
            </label>
            <input
              id="package-name"
              name="destinationName"
              type="text"
              placeholder="Bali Paradise"
              onChange={() => clearError("destinationName")}
              className={`mt-2 ${fieldClass("destinationName")}`}
            />
            {fieldError("destinationName")}
          </div>

          {/* Country + Category */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="package-country" className={labelClass}>
                Country
              </label>
              <input
                id="package-country"
                name="country"
                type="text"
                placeholder="Indonesia"
                onChange={() => clearError("country")}
                className={`mt-2 ${fieldClass("country")}`}
              />
              {fieldError("country")}
            </div>
            <div>
              <label htmlFor="package-category" className={labelClass}>
                Category
              </label>
              <div className="relative mt-2">
                <select
                  id="package-category"
                  name="category"
                  defaultValue=""
                  onChange={() => clearError("category")}
                  className={`${fieldClass("category")} appearance-none pr-9`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
                />
              </div>
              {fieldError("category")}
            </div>
          </div>

          {/* Price + Duration */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="package-price" className={labelClass}>
                Price (USD$)
              </label>
              <input
                id="package-price"
                name="price"
                type="number"
                min="0"
                placeholder="e.g. 1299"
                onChange={() => clearError("price")}
                className={`mt-2 ${fieldClass("price")}`}
              />
              {fieldError("price")}
            </div>
            <div>
              <label htmlFor="package-duration" className={labelClass}>
                Duration
              </label>
              <div className="relative mt-2">
                {/* auto-fillo input */}
                <input
                  id="package-duration"
                  name="duration"
                  type="text"
                  placeholder="e.g. 7 Days/ 6 Nights"
                  onChange={() => clearError("duration")}
                  className={`${fieldClass("duration")} pr-11`}
                />
                <button
                  type="button"
                  aria-label="Open return date picker"
                  onClick={() => {
                    setPickerOpen((open) => !open);
                    setPickerError(undefined);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
                >
                  <CalendarIcon className="size-4.5" />
                </button>
              </div>
              {fieldError("duration")}

              {/* Custom return date & time box */}
              {pickerOpen && (
                <div className="absolute z-20 mt-2 w-full max-w-80 border border-slate-200 bg-white p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      Select return date &amp; time
                    </p>
                    <button
                      type="button"
                      aria-label="Close date picker"
                      onClick={() => setPickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  {!departureDate ? (
                    <p className="mt-3 text-xs text-red-500">
                      Please select a Departure Date first.
                    </p>
                  ) : (
                    <>
                      <div className="mt-3 flex justify-center">
                        <Calendar
                          mode="single"
                          selected={returnDate}
                          onSelect={(date) => setReturnDate(date)}
                          disabled={{
                            before: new Date(`${departureDate}T00:00:00`),
                          }}
                        />
                      </div>

                      {/* Return time */}
                      <label
                        htmlFor="return-time"
                        className="mt-2 block text-xs font-medium text-slate-600"
                      >
                        Return time
                      </label>
                      <input
                        id="return-time"
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="mt-1 h-9 w-full rounded-none border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                      />

                      {pickerError && (
                        <p className={errorTextClass}>{pickerError}</p>
                      )}

                      <button
                        type="button"
                        disabled={!returnDate}
                        onClick={applyReturnDate}
                        className="mt-3 h-9 w-full rounded-none bg-cyan-500 text-sm font-medium text-white transition-colors hover:bg-cyan-600 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Departure Date — past date select kora jabe na (min=today) */}
          <div className="mt-5">
            <label htmlFor="package-date" className={labelClass}>
              Departure Date
            </label>
            <input
              id="package-date"
              name="departureDate"
              type="date"
              min={todayStr}
              value={departureDate}
              onChange={(e) => {
                setDepartureDate(e.target.value);
                clearError("departureDate");
              }}
              className={`mt-2 ${fieldClass("departureDate")}`}
            />
            {fieldError("departureDate")}
          </div>

          {/* Image URL */}
          <div className="mt-5">
            <label htmlFor="package-image" className={labelClass}>
              Image URL
            </label>
            <input
              id="package-image"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              onChange={() => clearError("imageUrl")}
              className={`mt-2 ${fieldClass("imageUrl")}`}
            />
            {fieldError("imageUrl")}
          </div>

          {/* Description — resize none */}
          <div className="mt-5">
            <label htmlFor="package-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="package-description"
              name="description"
              rows={4}
              placeholder="Describe the travel experience..."
              onChange={() => {
                clearError("description");
                // security: typed HTML tag keর live removal na — submit e validate hoy
              }}
              maxLength={500}
              className={cn(
                fieldClass("description"),
                "mt-2 w-full resize-none p-3 min-h-28",
              )}
            />
            {fieldError("description")}
          </div>

          {/* Actions — mobile: full-width buttons, one per row */}
          <div className="mt-8 grid gap-3 sm:flex sm:items-center sm:justify-end">
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-none bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-600 sm:order-2 sm:w-auto"
            >
              <Plus className="size-4" />
              Add Travel Package
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-none border border-red-300 bg-white px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 sm:order-1 sm:w-auto"
            >
              <Trash2 className="size-4" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
