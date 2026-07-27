"use client";

import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={twMerge(
        clsx(
          "animate-spin rounded-full border-accent border-t-transparent",
          sizeStyles[size],
          className,
        ),
      )}
      {...props}
    />
  );
}

export default Spinner;
