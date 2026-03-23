import Link from "next/link";
import { Rocket, Github } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#060911]/80 backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-200">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-ink">Talons Aggregator</div>
                <div className="text-xs text-muted">Solana Devnet • Rust + Next.js</div>
              </div>
            </Link>
            <nav className="hidden gap-5 text-sm text-muted md:flex">
              <Link href="/swap" className="transition hover:text-ink">Swap</Link>
              <Link href="/about" className="transition hover:text-ink">Architecture</Link>
              <Link href="/faq" className="transition hover:text-ink">FAQ</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-muted transition hover:bg-white/5 md:inline-flex"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <WalletButton />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/5 py-8">
        <div className="container-shell flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Built for Solana Devnet demos that need a clean deploy story.</p>
          <p>Frontend on Vercel. Rust guard path on Devnet.</p>
        </div>
      </footer>
    </div>
  );
}
