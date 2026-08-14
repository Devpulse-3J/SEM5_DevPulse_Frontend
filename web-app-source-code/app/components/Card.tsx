import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  borderLeftColor?: string;
}

export function Card({
  children,
  className = "",
  padding = "md",
  borderLeftColor,
}: CardProps) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4.5",
    lg: "p-6",
  };

  const borderLeftStyle = borderLeftColor
    ? { borderLeft: `3px solid ${borderLeftColor}` }
    : {};

  return (
    <div
      style={{
        backgroundColor: "var(--dp-surface)",
        borderColor: "var(--dp-border)",
        ...borderLeftStyle,
      }}
      className={`border rounded-[10px] ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
