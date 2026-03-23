"use client";

import { Buffer } from "buffer";
import { useMemo, useState } from "react";
import { ArrowLeftRight, ChevronDown, Info, Route, Settings2, Wallet2 } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Button, Input, Badge } from "@/components/ui";
import { TOKENS } from "@/lib/tokens";
import { cn, explorerUrl, formatCurrency, formatNumber, shortAddress } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { QuoteResult, TokenConfig } from "@/lib/types";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

type HistoryItem = {
  pair: string;
  mode: string;
  amount: number;
  bestOut: number;
  protocol: string;
  requestedAt: string;
};

export function SwapWorkbench() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [inputToken, setInputToken] = useState<TokenConfig>(TOKENS[0]);
  const [outputToken, setOutputToken] = useState<TokenConfig>(TOKENS[1]);
  const [amount, setAmount] = useState("1");
  const [slippageBps, setSlippageBps] = useState(50);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [mode, setMode] = useState("demo");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [recentQuotes, setRecentQuotes] = useLocalStorage<HistoryItem[]>("talons.recentQuotes", []);
  const [error, setError] = useState<string | null>(null);

  const selectedQuote = useMemo(
    () => quotes.find((quote) => quote.id === selectedQuoteId) ?? quotes[0] ?? null,
    [quotes, selectedQuoteId]
  );

  async function fetchQuotes() {
    if (inputToken.mint === outputToken.mint) {
      setError("Select two different tokens.");
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a positive amount.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);
    setSignature(null);

    try {
      const search = new URLSearchParams({
        inputMint: inputToken.mint,
        outputMint: outputToken.mint,
        amount: numericAmount.toString(),
        slippageBps: slippageBps.toString(),
      });
      const response = await fetch(`/api/quote?${search.toString()}`, { cache: "no-store" });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error ?? "Unable to fetch quotes.");
      }

      const nextQuotes = (json.quotes ?? []) as QuoteResult[];
      setQuotes(nextQuotes);
      setSelectedQuoteId(nextQuotes[0]?.id ?? null);
      setMode(json.mode ?? "demo");

      if (nextQuotes[0]) {
        const item: HistoryItem = {
          pair: `${inputToken.symbol}/${outputToken.symbol}`,
          mode: json.mode ?? "demo",
          amount: numericAmount,
          bestOut: nextQuotes[0].estimatedOut,
          protocol: nextQuotes[0].protocol,
          requestedAt: json.requestedAt ?? new Date().toISOString(),
        };
        setRecentQuotes([item, ...recentQuotes].slice(0, 6));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown quote error");
      setQuotes([]);
      setSelectedQuoteId(null);
    } finally {
      setLoading(false);
    }
  }

  function flipPair() {
    setInputToken(outputToken);
    setOutputToken(inputToken);
    setQuotes([]);
    setSelectedQuoteId(null);
    setStatus(null);
    setSignature(null);
  }

  async function sendDemoAttestation() {
    if (!selectedQuote) {
      setError("Request a quote before sending a demo attestation.");
      return;
    }
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Connect a wallet first.");
      return;
    }

    try {
      setError(null);
      setStatus("Preparing Devnet memo transaction...");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      const tx = new Transaction({
        feePayer: wallet.publicKey,
        recentBlockhash: blockhash,
      });

      const memo = `Talons Aggregator demo attestation | ${inputToken.symbol}->${outputToken.symbol} | protocol=${selectedQuote.protocol} | out=${selectedQuote.estimatedOut.toFixed(4)} | slippage=${slippageBps}`;
      tx.add(
        new TransactionInstruction({
          programId: MEMO_PROGRAM_ID,
          keys: [],
          data: Buffer.from(memo, "utf8"),
        })
      );

      const sig = await wallet.sendTransaction(tx, connection);
      setSignature(sig);
      setStatus("Transaction submitted. Waiting for confirmation...");

      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
      setStatus("Confirmed on Devnet. This was a memo attestation, not a live swap.");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send memo transaction.");
      setStatus(null);
    }
  }

  const walletHint = wallet.publicKey ? shortAddress(wallet.publicKey.toBase58()) : "Wallet disconnected";
  const solBalanceHint = wallet.publicKey ? "Balance available via connected wallet session." : "Connect a wallet to sign demo route attestations.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone="warning">Devnet</Badge>
                <Badge tone={mode === "demo" ? "warning" : "success"}>{mode === "demo" ? "Demo quotes" : "Live mode"}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-semibold">Swap workspace</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                Compare normalized routes, review estimated output, then send a real Devnet memo transaction to attest
                the chosen route while live swap execution is still being wired.
              </p>
            </div>

            <Button variant="secondary" onClick={() => setDrawerOpen(true)} className="gap-2">
              <Settings2 className="h-4 w-4" />
              Settings
            </Button>
          </div>

          <div className="mt-8 grid gap-4">
            <TokenField
              label="You pay"
              token={inputToken}
              onChange={setInputToken}
              value={amount}
              onValueChange={setAmount}
            />
            <div className="flex justify-center">
              <Button variant="secondary" onClick={flipPair} className="h-12 w-12 rounded-full p-0">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
            <TokenField
              label="You receive"
              token={outputToken}
              onChange={setOutputToken}
              value={selectedQuote ? selectedQuote.estimatedOut.toFixed(4) : ""}
              readOnly
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={fetchQuotes} disabled={loading} className="sm:min-w-44">
              {loading ? "Finding routes..." : "Find best route"}
            </Button>
            <Button variant="secondary" onClick={sendDemoAttestation} disabled={!selectedQuote || !wallet.connected}>
              {wallet.connected ? "Send demo attestation" : "Connect wallet to attest"}
            </Button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="panel-subtle p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-muted">Wallet</div>
              <div className="mt-2 text-sm font-medium text-ink">{walletHint}</div>
            </div>
            <div className="panel-subtle p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-muted">Slippage</div>
              <div className="mt-2 text-sm font-medium text-ink">{(slippageBps / 100).toFixed(2)}%</div>
            </div>
            <div className="panel-subtle p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-muted">Execution path</div>
              <div className="mt-2 text-sm font-medium text-ink">{mode === "demo" ? "Memo attestation" : "Guarded swap"}</div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-muted">
            {solBalanceHint}
          </div>

          {status ? (
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {status}
              {signature ? (
                <div className="mt-2">
                  <a
                    href={explorerUrl(signature, "tx")}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold underline underline-offset-4"
                  >
                    Open in Solana Explorer
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-200" />
            <h2 className="text-xl font-semibold">Execution notes</h2>
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>• Demo mode shows deterministic Raydium-style and Orca-style route outputs.</li>
            <li>• “Send demo attestation” signs and submits a real Devnet memo transaction.</li>
            <li>• No DEX instruction is executed in demo mode, and the UI states that explicitly.</li>
            <li>• Replace the demo adapters when you are ready to wire live Devnet quotes.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="panel p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-cyan-200" />
            <h2 className="text-xl font-semibold">Route board</h2>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="h-4 w-1/3 rounded bg-white/5" />
                  <div className="mt-3 h-4 rounded bg-white/5" />
                  <div className="mt-3 h-4 w-2/3 rounded bg-white/5" />
                </div>
              ))
            ) : quotes.length > 0 ? (
              quotes.map((quote) => (
                <button
                  key={quote.id}
                  type="button"
                  onClick={() => setSelectedQuoteId(quote.id)}
                  className={cn(
                    "w-full rounded-3xl border p-5 text-left transition",
                    selectedQuote?.id === quote.id
                      ? "border-cyan-300/30 bg-cyan-300/5 shadow-glow"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge tone={quote.isBest ? "success" : "default"}>{quote.isBest ? "Best route" : quote.protocol}</Badge>
                        <Badge>{quote.kind}</Badge>
                      </div>
                      <div className="mt-3 text-lg font-semibold">{quote.protocol}</div>
                      <div className="mt-2 text-sm text-muted">
                        {quote.legs.map((leg) => leg.label).join(" → ")}
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-xs uppercase tracking-[0.16em] text-muted">Estimated out</div>
                      <div className="mt-2 text-2xl font-semibold text-ink">
                        {formatNumber(quote.estimatedOut)} {outputToken.symbol}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    <Metric label="Min received" value={`${formatNumber(quote.minReceived)} ${outputToken.symbol}`} />
                    <Metric label="Network fee" value={`~${formatCurrency(quote.networkFeeUsd)}`} />
                    <Metric label="Price impact" value={`${(quote.impactBps / 100).toFixed(2)}%`} />
                    <Metric label="Confidence" value={`${quote.confidence}%`} />
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm leading-7 text-muted">
                No routes yet. Pick a pair, choose an amount, and request quotes.
              </div>
            )}
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Wallet2 className="h-5 w-5 text-cyan-200" />
            <h2 className="text-xl font-semibold">Selected route detail</h2>
          </div>

          {selectedQuote ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{selectedQuote.protocol}</div>
                    <div className="mt-2 text-sm text-muted">
                      {selectedQuote.kind} • {selectedQuote.legs.length} leg{selectedQuote.legs.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </div>

                <div className="mt-4 space-y-3">
                  {selectedQuote.legs.map((leg) => (
                    <div key={leg.id} className="rounded-2xl border border-white/10 bg-[#0b1120] p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-ink">{leg.label}</div>
                        <Badge>{leg.dex}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted">
                        Fee {leg.feeBps} bps • Estimated price {formatNumber(leg.estimatedPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-200">
                Demo mode attests the chosen route to Devnet via the Memo program so you can review the full wallet + explorer flow without pretending a live swap happened.
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-muted">
              Select a quote to inspect its legs and execution notes.
            </div>
          )}
        </div>

        <div className="panel p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Recent quote history</h2>
          <div className="mt-5 space-y-3">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((item, index) => (
                <div key={`${item.requestedAt}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-ink">{item.pair}</div>
                      <div className="mt-1 text-xs text-muted">
                        {item.protocol} • {item.mode.toUpperCase()} • {new Date(item.requestedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted">
                      <div>{formatNumber(item.amount)} in</div>
                      <div className="mt-1 font-semibold text-ink">{formatNumber(item.bestOut)} out</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-muted">
                Recent quotes will show up here after your first request.
              </div>
            )}
          </div>
        </div>
      </div>

      <SettingsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slippageBps={slippageBps}
        onSlippageBpsChange={setSlippageBps}
      />
    </div>
  );
}

function TokenField({
  label,
  token,
  onChange,
  value,
  onValueChange,
  readOnly,
}: {
  label: string;
  token: TokenConfig;
  onChange: (token: TokenConfig) => void;
  value: string;
  onValueChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0a1020] p-5">
      <div className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:flex-1">
          <Input
            value={value}
            onChange={(event) => onValueChange?.(event.target.value)}
            placeholder="0.00"
            readOnly={readOnly}
            inputMode="decimal"
          />
        </div>
        <div className="sm:w-72">
          <select
            value={token.mint}
            onChange={(event) => {
              const next = TOKENS.find((item) => item.mint === event.target.value);
              if (next) onChange(next);
            }}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 text-sm text-ink outline-none transition focus:border-cyan-300/30"
          >
            {TOKENS.map((item) => (
              <option key={item.mint} value={item.mint}>
                {item.symbol} • {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>{shortAddress(token.mint)}</span>
        {token.demoOnly ? <Badge tone="warning">Demo token</Badge> : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1120] p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function SettingsDrawer({
  open,
  onClose,
  slippageBps,
  onSlippageBpsChange,
}: {
  open: boolean;
  onClose: () => void;
  slippageBps: number;
  onSlippageBpsChange: (value: number) => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-40 transition",
        open ? "pointer-events-auto bg-black/50 opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-[#0b1120] p-6 shadow-2xl transition",
          open ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Execution settings</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-sm font-medium text-ink">Slippage tolerance</div>
            <p className="mt-2 text-sm leading-7 text-muted">
              Demo mode uses this to calculate minimum received. The same field is ready to flow into a guarded program.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[30, 50, 100].map((value) => (
                <Button
                  key={value}
                  variant={slippageBps === value ? "primary" : "secondary"}
                  onClick={() => onSlippageBpsChange(value)}
                >
                  {(value / 100).toFixed(2)}%
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-7 text-amber-200">
            Live adapter mode is intentionally not enabled by default in this repo build. That keeps Vercel deployment simple and honest.
          </div>
        </div>
      </div>
    </div>
  );
}
