import Link from "next/link";
import { ArrowRight, BadgeDollarSign, ShieldCheck, Waypoints, Wallet } from "lucide-react";
import { RpcStatusCard } from "@/components/rpc-status-card";
import { FeatureCard } from "@/components/feature-card";
import { StatsStrip } from "@/components/stats-strip";

export default function HomePage() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="panel p-8 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200">
            Solana Devnet • Vercel-ready • Rust + Next.js
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            A cleaner way to ship a <span className="text-gradient">Solana swap-aggregator MVP</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Talons Aggregator gives you a polished DeFi dashboard on the frontend and a serious Rust codebase on the
            blockchain side. The default mode is demo-safe, so the app deploys cleanly while still showing real wallet
            connectivity and Devnet transaction flow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/swap"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px]"
            >
              Launch swap workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white/5"
            >
              Read architecture
            </Link>
          </div>
          <StatsStrip />
        </div>

        <RpcStatusCard />
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <FeatureCard
          icon={Waypoints}
          title="Route comparison"
          description="Compare multiple normalized quote paths and surface the best route with clear fee and impact breakdown."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Guarded execution path"
          description="Ship a frontend today while preparing a Rust guard-program layer for slippage and route checks."
        />
        <FeatureCard
          icon={Wallet}
          title="Real wallet UX"
          description="Phantom and Solflare wallet support, explorer deep links, and a real Devnet memo transaction flow."
        />
        <FeatureCard
          icon={BadgeDollarSign}
          title="Honest demo mode"
          description="No fake live swap claims. The UI labels demo quotes clearly while staying ready for real adapters."
        />
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="panel p-8">
          <h2 className="text-2xl font-semibold">What you can show in one deploy</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            <li>• Vercel-compatible Next.js frontend with a proper premium dashboard feel.</li>
            <li>• Solana wallet adapter integration on Devnet.</li>
            <li>• Quote engine UI that is live-ready but deployment-safe.</li>
            <li>• Recent quote history and route detail review.</li>
            <li>• Rust route-math crate and Anchor guard-program scaffold.</li>
          </ul>
        </div>
        <div className="panel p-8">
          <h2 className="text-2xl font-semibold">Built for the next step</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
            <li>• Drop in real Raydium Devnet adapters.</li>
            <li>• Add Orca Whirlpool quoting.</li>
            <li>• Replace memo attestation with guarded execution.</li>
            <li>• Verify route hashes on-chain.</li>
            <li>• Use dedicated RPC when you leave public Devnet endpoints.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
