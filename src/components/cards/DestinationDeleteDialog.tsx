"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

interface DestinationDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  isDeleting?: boolean;
}

export default function DestinationDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "this destination",
  isDeleting = false,
}: DestinationDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white p-6 sm:p-7 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors disabled:pointer-events-none"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="size-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Delete Travel Package
          </h2>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          Are you sure you want to delete <span className="font-semibold text-slate-900">&quot;{title}&quot;</span>? This action cannot be undone and will permanently remove this travel package from the system.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9 border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex h-9 items-center justify-center gap-1.5 bg-[#ef4444] px-4 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            <span>{isDeleting ? "Deleting..." : "Delete Package"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}