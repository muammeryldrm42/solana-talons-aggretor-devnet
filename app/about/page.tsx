export default function AboutPage() {
  return (
    <div className="container-shell py-10">
      <div className="panel p-8 sm:p-10">
        <h1 className="text-3xl font-semibold">Architecture</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted">
          <p>
            Talons Aggregator keeps the deployment-safe pieces in the web app and the security-sensitive pieces in Rust.
            That means a standard Vercel deployment for the dashboard, while the Solana program lives on Devnet where it belongs.
          </p>
          <p>
            The frontend does not depend on a custom Rust server. Instead, it uses lightweight route handlers for RPC
            health and demo quote normalization. This avoids fragile infrastructure and keeps the repo easy to ship.
          </p>
          <p>
            The Rust side is split into a reusable <code className="rounded bg-white/5 px-1 py-0.5 text-ink">router-core</code> crate
            and an Anchor <code className="rounded bg-white/5 px-1 py-0.5 text-ink">talons_aggregator</code> program scaffold.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="panel-subtle p-5">
            <h2 className="font-semibold text-ink">Frontend</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Next.js App Router, TypeScript, Tailwind, wallet adapter, route comparison UI, and a real Devnet memo flow.
            </p>
          </div>
          <div className="panel-subtle p-5">
            <h2 className="font-semibold text-ink">Rust core</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Route evaluation, fee math, minimum output calculation, and best-quote selection logic with unit tests.
            </p>
          </div>
          <div className="panel-subtle p-5">
            <h2 className="font-semibold text-ink">Anchor program</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Max-slippage config, route hash verification, pause control, and allow-list management for future guarded swaps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
