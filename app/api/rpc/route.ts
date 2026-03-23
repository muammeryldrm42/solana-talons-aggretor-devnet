import { NextResponse } from "next/server";

type RpcPayload = {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown[];
};

async function rpc<T>(payload: RpcPayload): Promise<T> {
  const rpcUrl = "https://api.devnet.solana.com";
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`RPC request failed with ${response.status}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message ?? "Unknown RPC error");
  }
  return json.result as T;
}

export async function GET() {
  try {
    const [version, latestBlockhash, epochInfo] = await Promise.all([
      rpc<{ "solana-core": string }>({
        jsonrpc: "2.0",
        id: 1,
        method: "getVersion",
      }),
      rpc<{ blockhash: string; lastValidBlockHeight: number }>({
        jsonrpc: "2.0",
        id: 2,
        method: "getLatestBlockhash",
        params: [{ commitment: "confirmed" }],
      }),
      rpc<{ blockHeight: number; epoch: number; slotIndex: number; slotsInEpoch: number }>({
        jsonrpc: "2.0",
        id: 3,
        method: "getEpochInfo",
        params: [{ commitment: "confirmed" }],
      }),
    ]);

    return NextResponse.json({
      ok: true,
      network: "devnet",
      rpcUrl: "https://api.devnet.solana.com",
      version: version["solana-core"],
      latestBlockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      slot: epochInfo.blockHeight,
      epoch: epochInfo.epoch,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "RPC health check failed",
      },
      { status: 500 }
    );
  }
}
