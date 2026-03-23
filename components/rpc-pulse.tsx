"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RpcState =
  | { loading: true }
  | { loading: false; ok: true; version: string; epoch: number; latestBlockhash: string; timestamp: string }
  | { loading: false; ok: false; error: string };

export function RpcPulse() {
  const [state, setState] = useState<RpcState>({ loading: true });

  useEffect(() => {
    let alive = true;
    fetch("/api/rpc", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        if (!alive) return;
        if (json.ok) {
          setState({
            loading: false,
            ok: true,
            version: json.version,
            epoch: json.epoch,
            latestBlockhash: json.latestBlockhash,
            timestamp: json.timestamp,
          });
          return;
        }
        setState({ loading: false, ok: false, error: json.error ?? "Unknown RPC error" });
      })
      .catch((error: unknown) => {
        if (!alive) return;
        setState({
          loading: false,
          ok: false,
          error: error instanceof Error ? error.message : "RPC request failed",
        });
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-[#0a1020] p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-ink">RPC heartbeat</div>
        <div
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            state.loading && "bg-white/5 text-muted",
            !state.loading && "ok" in state && state.ok && "bg-emerald-500/15 text-emerald-300",
            !state.loading && "ok" in state && !state.ok && "bg-red-500/15 text-red-300"
          )}
        >
          {state.loading ? "Checking" : state.ok ? "Healthy" : "Unavailable"}
        </div>
      </div>

      {state.loading ? (
        <div className="mt-4 space-y-3">
          <div className="h-4 rounded bg-white/5" />
          <div className="h-4 rounded bg-white/5" />
          <div className="h-4 rounded bg-white/5" />
        </div>
      ) : state.ok ? (
        <div className="mt-4 grid gap-3 text-sm text-muted">
          <div>Solana core version: <span className="text-ink">{state.version}</span></div>
          <div>Current epoch: <span className="text-ink">{state.epoch}</span></div>
          <div className="truncate">Latest blockhash: <span className="text-ink">{state.latestBlockhash}</span></div>
          <div>Checked at: <span className="text-ink">{new Date(state.timestamp).toLocaleString()}</span></div>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {state.error}
        </div>
      )}
    </div>
  );
}
