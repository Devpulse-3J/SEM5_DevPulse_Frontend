import React from "react";

interface SparklineProps {
  data: number[];
  color: string;
}

export function Sparkline({ data, color }: SparklineProps) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-7">
      {data.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: i >= data.length - 2 ? color : `color-mix(in oklch, ${color} 40%, transparent)`,
          }}
        />
      ))}
    </div>
  );
}
