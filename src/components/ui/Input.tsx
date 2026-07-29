"use client";

import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              "h-9 w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-subtle",
              "outline-none transition-colors",
              "focus:border-accent focus:ring-1 focus:ring-accent/40",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-danger" : "border-border",
              className,
            ),
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
