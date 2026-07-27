"use client";

import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-raised text-subtle border-border",
  success: "bg-success/15 text-success border-success/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  danger: "bg-danger/15 text-danger border-danger/25",
  info: "bg-accent/15 text-accent border-accent/25",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium leading-tight",
          variantStyles[variant],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
