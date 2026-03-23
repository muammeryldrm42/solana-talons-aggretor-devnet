import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(value: string, size = 4) {
  if (value.length <= size * 2) return value;
  return `${value.slice(0, size)}…${value.slice(-size)}`;
}

export function formatNumber(value: number, digits = 4) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function explorerUrl(value: string, kind: "tx" | "address" = "tx") {
  const cluster = "devnet";
  if (kind === "address") {
    return `https://explorer.solana.com/address/${value}?cluster=${cluster}`;
  }
  return `https://explorer.solana.com/tx/${value}?cluster=${cluster}`;
}
