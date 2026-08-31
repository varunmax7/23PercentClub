"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { YearPoint } from "@/lib/types";
import { formatINR, formatYears } from "@/lib/formatters";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The shared growth chart for every calculator — README §3.4 / §5.1. Locked
 * to Sapphire fill / Bright-Blue stroke, ₹ lakh/crore axis labels (never
 * abbreviated to K/M), and a text summary of the headline number so the
 * chart is never the only way to get the answer.
 */
export function GrowthChart({ series }: { series: YearPoint[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const final = series[series.length - 1];

  return (
    <div className="flex flex-col gap-2">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-sapphire)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--color-sapphire)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(year: number) => `Y${year}`}
              tick={{ fontSize: 12, fill: "var(--color-slate)" }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v: number) => formatINR(v)}
              tick={{ fontSize: 11, fill: "var(--color-slate)" }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              formatter={(value) => formatINR(Number(value))}
              labelFormatter={(label) => formatYears(Number(label))}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-bright-blue)"
              strokeWidth={2}
              fill="url(#growthFill)"
              isAnimationActive={!reducedMotion}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {final && (
        <p className="font-body text-sm text-slate">
          By {formatYears(final.year)}, projected value reaches{" "}
          <span className="font-medium text-ink tabular-nums">
            {formatINR(final.value)}
          </span>
          .
        </p>
      )}
    </div>
  );
}
