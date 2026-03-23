import type { QuoteInput, QuoteResult } from "@/lib/types";

const DIRECT_RATES: Record<string, number> = {
  "SOL:USDC": 148.6,
  "USDC:SOL": 1 / 149.4,
  "SOL:tUSDT": 148.1,
  "tUSDT:SOL": 1 / 149.1,
  "SOL:tBONK": 9750000,
  "tBONK:SOL": 1 / 10150000,
  "USDC:tBONK": 65500,
  "tBONK:USDC": 1 / 67200,
  "USDC:tUSDT": 0.998,
  "tUSDT:USDC": 1.001,
};

function key(from: string, to: string) {
  return `${from}:${to}`;
}

function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

function makeQuoteId(protocol: string, kind: string, suffix: string) {
  return `${protocol.toLowerCase()}-${kind.toLowerCase()}-${suffix}`;
}

function minReceived(out: number, slippageBps: number) {
  return out * (1 - slippageBps / 10_000);
}

function impactFor(amount: number, depth: number) {
  return Math.min(180, Math.max(12, Math.round((amount / depth) * 350)));
}

function priceFor(symbolA: string, symbolB: string) {
  return DIRECT_RATES[key(symbolA, symbolB)] ?? 0;
}

export function generateQuotes({ inputToken, outputToken, amount, slippageBps }: QuoteInput): QuoteResult[] {
  const direct = priceFor(inputToken.symbol, outputToken.symbol);
  const quotes: QuoteResult[] = [];

  if (direct > 0) {
    const rayImpact = impactFor(amount, inputToken.symbol === "SOL" ? 20 : 65);
    const orcaImpact = impactFor(amount, inputToken.symbol === "SOL" ? 22 : 72);

    const rayOut = amount * direct * (1 - rayImpact / 10_000) * (1 - 25 / 10_000);
    const orcaOut = amount * direct * (1 - orcaImpact / 10_000) * (1 - 18 / 10_000);

    quotes.push({
      id: makeQuoteId("Raydium", "Direct", "primary"),
      protocol: "Raydium",
      kind: "Direct",
      estimatedOut: round(rayOut),
      minReceived: round(minReceived(rayOut, slippageBps)),
      impactBps: rayImpact,
      networkFeeUsd: 0.07,
      confidence: 91,
      isBest: false,
      legs: [
        {
          id: "ray-leg-1",
          dex: "Raydium",
          label: `${inputToken.symbol} / ${outputToken.symbol}`,
          feeBps: 25,
          estimatedPrice: round(direct),
        },
      ],
    });

    quotes.push({
      id: makeQuoteId("Orca", "Direct", "primary"),
      protocol: "Orca",
      kind: "Direct",
      estimatedOut: round(orcaOut),
      minReceived: round(minReceived(orcaOut, slippageBps)),
      impactBps: orcaImpact,
      networkFeeUsd: 0.06,
      confidence: 89,
      isBest: false,
      legs: [
        {
          id: "orca-leg-1",
          dex: "Orca",
          label: `${inputToken.symbol} / ${outputToken.symbol}`,
          feeBps: 18,
          estimatedPrice: round(direct),
        },
      ],
    });
  }

  const viaUsdc =
    inputToken.symbol !== "USDC" &&
    outputToken.symbol !== "USDC" &&
    priceFor(inputToken.symbol, "USDC") > 0 &&
    priceFor("USDC", outputToken.symbol) > 0;

  if (viaUsdc) {
    const leg1 = priceFor(inputToken.symbol, "USDC");
    const leg2 = priceFor("USDC", outputToken.symbol);
    const impactBps = impactFor(amount, 90);
    const out = amount * leg1 * leg2 * (1 - impactBps / 10_000) * (1 - 36 / 10_000);

    quotes.push({
      id: makeQuoteId("Orca", "Two-hop", "via-usdc"),
      protocol: "Orca",
      kind: "Two-hop",
      estimatedOut: round(out),
      minReceived: round(minReceived(out, slippageBps)),
      impactBps,
      networkFeeUsd: 0.09,
      confidence: 84,
      isBest: false,
      legs: [
        {
          id: "orca-hop-1",
          dex: "Orca",
          label: `${inputToken.symbol} / USDC`,
          feeBps: 18,
          estimatedPrice: round(leg1),
        },
        {
          id: "orca-hop-2",
          dex: "Orca",
          label: `USDC / ${outputToken.symbol}`,
          feeBps: 18,
          estimatedPrice: round(leg2),
        },
      ],
    });
  }

  const ranked = quotes.sort((a, b) => b.estimatedOut - a.estimatedOut);
  return ranked.map((quote, index) => ({ ...quote, isBest: index === 0 }));
}
