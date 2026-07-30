"use client";

import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** px width of the panel — the spec's Add Project modal is 460px. */
  width?: number;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  width = 460,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEscape, onClose]);

  // Lock body scroll while a modal is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/70 backdrop-blur-sm animate-fade-in"
      onMouseDown={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{ width }}
        className={twMerge(
          clsx(
            "flex flex-col gap-3.5 rounded-panel border border-border bg-surface-raised",
            "p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]",
            "animate-zoom-in",
            className,
          ),
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  description,
  onClose,
}: {
  title: string;
  description?: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-[15px] font-bold text-ink">{title}</div>
        {description && (
          <div className="mt-1 text-xs text-subtle">{description}</div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-subtle hover:text-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function ModalBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("flex flex-col gap-3.5", className))}
      {...props}
    />
  );
}

export function ModalField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-muted">{label}</label>
      {children}
    </div>
  );
}

export function ModalFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx("mt-2 flex items-center justify-end gap-2.5", className),
      )}
      {...props}
    />
  );
}

export default Modal;
