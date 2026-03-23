export const APP_NAME = "Talons Aggregator";
export const DEFAULT_SOLANA_NETWORK = "devnet";
export const DEFAULT_SOLANA_RPC_URL = "https://api.devnet.solana.com";
export const DEFAULT_SOLANA_EXPLORER_CLUSTER = "devnet";
export const DEFAULT_QUOTE_MODE = "demo";

const VALID_NETWORKS = new Set(["devnet", "testnet", "mainnet-beta"]);
const VALID_QUOTE_MODES = new Set(["demo", "live"]);

function readPublicEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export function getSolanaNetwork() {
  const network = readPublicEnv("NEXT_PUBLIC_SOLANA_NETWORK");
  return VALID_NETWORKS.has(network) ? network : DEFAULT_SOLANA_NETWORK;
}

export function getSolanaRpcUrl() {
  const rpcUrl = readPublicEnv("NEXT_PUBLIC_SOLANA_RPC_URL");
  return rpcUrl || DEFAULT_SOLANA_RPC_URL;
}

export function getSolanaExplorerCluster() {
  const cluster = readPublicEnv("NEXT_PUBLIC_SOLANA_EXPLORER_CLUSTER");
  return cluster || getSolanaNetwork() || DEFAULT_SOLANA_EXPLORER_CLUSTER;
}

export function getQuoteMode() {
  const mode = readPublicEnv("NEXT_PUBLIC_QUOTE_MODE");
  return VALID_QUOTE_MODES.has(mode) ? mode : DEFAULT_QUOTE_MODE;
}
