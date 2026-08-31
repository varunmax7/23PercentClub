"use client";

import { useId } from "react";
import { formatINR } from "@/lib/formatters";

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: "₹" | "%" | "years";
}

/**
 * A slider and a numeric input, both editable, both driving the same
 * state value — README §5.1 shared requirement. Mobile-first: the number
 * input is the primary interaction on touch, the slider on desktop.
 */
export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "₹",
}: InputSliderProps) {
  const id = useId();

  function clamp(next: number): number {
    if (Number.isNaN(next)) return min;
    return Math.min(max, Math.max(min, next));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="font-body text-sm font-medium text-ink">
          {label}
        </label>
        <div className="flex items-center gap-1 tabular-nums">
          {unit === "₹" && <span className="font-body text-sm text-slate">₹</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(clamp(Number(e.target.value)))}
            className="w-24 rounded-md border border-border bg-white px-2 py-1 text-right font-body text-sm text-ink focus-visible:outline-2 focus-visible:outline-bright-blue"
          />
          {unit !== "₹" && (
            <span className="font-body text-sm text-slate">
              {unit === "%" ? "%" : "yr"}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-bright-blue"
      />
      {unit === "₹" && (
        <p className="font-body text-xs text-slate tabular-nums">
          {formatINR(value)}
        </p>
      )}
    </div>
  );
}
