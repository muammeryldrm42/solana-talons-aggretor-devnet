import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-accent text-slate-950 hover:translate-y-[-1px]",
        variant === "secondary" && "border border-white/10 bg-white/5 text-ink hover:bg-white/10",
        variant === "ghost" && "text-muted hover:bg-white/5 hover:text-ink",
        variant === "danger" && "bg-red-500/90 text-white hover:bg-red-500",
        className
      )}
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-cyan-300/30",
        props.className
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "default" && "bg-white/7 text-muted",
        tone === "success" && "bg-emerald-500/15 text-emerald-300",
        tone === "warning" && "bg-amber-500/15 text-amber-300",
        tone === "danger" && "bg-red-500/15 text-red-300"
      )}
    >
      {children}
    </span>
  );
}
