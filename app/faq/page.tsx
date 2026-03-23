export default function FaqPage() {
  return (
    <div className="container-shell py-10">
      <div className="panel p-8 sm:p-10">
        <h1 className="text-3xl font-semibold">FAQ & Devnet notes</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted">
          <div>
            <h2 className="text-lg font-semibold text-ink">Does this execute live swaps?</h2>
            <p className="mt-2">
              Not in the default repo state. The default mode is demo-safe. It generates deterministic quotes and sends
              a real Devnet memo transaction so the dashboard remains honest and deployable.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Why not add a Rust backend?</h2>
            <p className="mt-2">
              The goal is a clean one-shot deploy on Vercel. A custom backend is the fastest way to make the deployment brittle.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Can I wire Raydium and Orca later?</h2>
            <p className="mt-2">
              Yes. The adapter boundaries are intentionally separated so you can replace the demo engine with real Devnet adapters.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">What should I expect on Devnet?</h2>
            <p className="mt-2">
              Expect resets, thin liquidity, and public RPC rate limits. Treat Devnet as an engineering playground, not a production environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
