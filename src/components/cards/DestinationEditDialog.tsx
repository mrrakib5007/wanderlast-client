"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Save, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

export interface Destination {
  _id: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: number | string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
}

interface DestinationEditDialogProps {
  destination: Destination;
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  "h-10 w-full rounded-none border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white";

const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";
const errorTextClass = "mt-1 text-xs text-red-500";

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "City Tour",
  "Heritage",
  "Wildlife",
];

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
    message: "Format: X Days/ Y Nights",
  },
  imageUrl: {
    regex: /^https?:\/\/[\w-]+(\.[\w-]+)+[^\s]*$/,
    message: "Enter a valid URL starting with http(s)://",
  },
};

type Errors = Partial<Record<string, string>>;

export default function DestinationEditDialog({
  destination,
  isOpen,
  onClose,
}: DestinationEditDialogProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    destinationName: destination.destinationName || "",
    country: destination.country || "",
    category: destination.category?.toLowerCase() || "",
    price: destination.price?.toString() || "",
    duration: destination.duration || "",
    departureDate: destination.departureDate
      ? destination.departureDate.slice(0, 10)
      : "",
    imageUrl: destination.imageUrl || "",
    description: destination.description || "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors: Errors = {};

    for (const [name, field] of Object.entries(validators)) {
      const val = formData[name as keyof typeof formData]?.trim() || "";
      if (!val) {
        newErrors[name] = "This field is required.";
      } else if (!field.regex.test(val)) {
        newErrors[name] = field.message;
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    if (!formData.departureDate) {
      newErrors.departureDate = "Departure Date is required.";
    }

    const desc = formData.description.trim();
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
      setIsSubmitting(true);
      const res = await fetch(
        `${process.env.BETTER_AUTH_API_URL}/destination/${destination._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || `API error: ${res.status}`);
      }

      await Swal.fire({
        icon: "success",
        title: "Updated!",
        text: result.message || "Travel package updated successfully.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0ea5e9",
      });

      onClose();
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update the travel package. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: message,
        confirmButtonText: "OK",
        confirmButtonColor: "#0ea5e9",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 p-4 sm:p-6">
          <div className="pr-4">
            <h2 className="text-base font-semibold text-slate-800">
              Update Travel Package
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Make changes to the travel package details below
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div>
              <label htmlFor="edit-destinationName" className={labelClass}>
                Destination Name
              </label>
              <input
                id="edit-destinationName"
                name="destinationName"
                type="text"
                value={formData.destinationName}
                onChange={handleChange}
                placeholder="Bali Paradise"
                className={`${inputClass} ${errors.destinationName ? "border-red-400" : ""}`}
              />
              {errors.destinationName && (
                <p className={errorTextClass}>{errors.destinationName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-country" className={labelClass}>
                  Country
                </label>
                <input
                  id="edit-country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Indonesia"
                  className={`${inputClass} ${errors.country ? "border-red-400" : ""}`}
                />
                {errors.country && (
                  <p className={errorTextClass}>{errors.country}</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-category" className={labelClass}>
                  Category
                </label>
                <div className="relative">
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-9 capitalize ${errors.category ? "border-red-400" : ""}`}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" />
                </div>
                {errors.category && (
                  <p className={errorTextClass}>{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-price" className={labelClass}>
                  Price (USD)
                </label>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 1299"
                  className={`${inputClass} ${errors.price ? "border-red-400" : ""}`}
                />
                {errors.price && (
                  <p className={errorTextClass}>{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="edit-duration" className={labelClass}>
                  Duration
                </label>
                <input
                  id="edit-duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7 Days/6 Nights"
                  className={`${inputClass} ${errors.duration ? "border-red-400" : ""}`}
                />
                {errors.duration && (
                  <p className={errorTextClass}>{errors.duration}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="edit-departureDate" className={labelClass}>
                Departure Date
              </label>
              <input
                id="edit-departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
                className={`${inputClass} ${errors.departureDate ? "border-red-400" : ""}`}
              />
              {errors.departureDate && (
                <p className={errorTextClass}>{errors.departureDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-imageUrl" className={labelClass}>
                Image URL
              </label>
              <input
                id="edit-imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`${inputClass} ${errors.imageUrl ? "border-red-400" : ""}`}
              />
              {errors.imageUrl && (
                <p className={errorTextClass}>{errors.imageUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-description" className={labelClass}>
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the travel experience..."
                className={`w-full resize-none p-3 text-sm text-slate-700 outline-none transition-colors border border-slate-200 bg-slate-50 focus:border-slate-400 focus:bg-white min-h-22.5 ${
                  errors.description ? "border-red-400" : ""
                }`}
              />
              {errors.description && (
                <p className={errorTextClass}>{errors.description}</p>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-4 sm:flex sm:items-center sm:justify-end sm:gap-3">
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex h-9.5 w-full items-center justify-center gap-1.5 border border-red-200 bg-white px-4 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-9.5 w-full items-center justify-center gap-1.5 bg-[#0ea5e9] px-4 text-xs font-medium text-white transition-colors hover:bg-[#0284c7] disabled:opacity-50 sm:w-auto"
              >
                <Save className="size-3.5" />
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
