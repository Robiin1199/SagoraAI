import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, currency: string = "EUR") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);

export const formatDelta = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
