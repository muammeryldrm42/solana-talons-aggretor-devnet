import { NextRequest, NextResponse } from "next/server";
import { generateQuotes } from "@/lib/demo-engine";
import { TOKENS } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const inputMint = search.get("inputMint");
  const outputMint = search.get("outputMint");
  const amount = Number(search.get("amount") ?? "0");
  const slippageBps = Number(search.get("slippageBps") ?? "50");
  const mode = "demo";

  if (!inputMint || !outputMint || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Please provide inputMint, outputMint, and a positive amount." },
      { status: 400 }
    );
  }

  const inputToken = TOKENS.find((token) => token.mint === inputMint);
  const outputToken = TOKENS.find((token) => token.mint === outputMint);

  if (!inputToken || !outputToken) {
    return NextResponse.json({ error: "Unknown token pair." }, { status: 400 });
  }

  if (mode !== "demo") {
    return NextResponse.json({
      mode,
      quotes: [],
      liveReady: true,
      warning:
        "Live adapter mode is not wired in this template yet. Replace demo-engine adapters with real Raydium and Orca Devnet integrations."
    });
  }

  const quotes = generateQuotes({
    inputToken,
    outputToken,
    amount,
    slippageBps,
  });

  return NextResponse.json({
    mode,
    quotes,
    selected: quotes[0] ?? null,
    requestedAt: new Date().toISOString(),
  });
}
