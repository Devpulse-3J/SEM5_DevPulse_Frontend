import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-surface border border-border rounded-card p-6 transition-all duration-300 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(255,255,255,0.15)]">
      <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center text-ink mb-4 group-hover:bg-white/10 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-2">{title}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{description}</p>
    </div>
  );
}
