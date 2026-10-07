import React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-[#257f61]/[0.07] border border-[#257f61]/30 rounded-card p-6 transition-all duration-300 hover:border-[#5fd3a8]/70 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(37,127,97,0.6)]">
      <div className="w-10 h-10 rounded-lg bg-[#257f61]/25 flex items-center justify-center text-[#5fd3a8] mb-4 group-hover:bg-[#257f61]/50 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-2">{title}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{description}</p>
    </div>
  );
}
