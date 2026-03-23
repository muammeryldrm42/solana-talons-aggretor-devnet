export const APP_NAME = "Talons Aggregator";
export const DEFAULT_SOLANA_NETWORK = "devnet";
export const DEFAULT_SOLANA_RPC_URL = "https://api.devnet.solana.com";
export const DEFAULT_SOLANA_EXPLORER_CLUSTER = "devnet";
export const DEFAULT_QUOTE_MODE = "demo";

export function getSolanaNetwork() {
  return DEFAULT_SOLANA_NETWORK;
}

export function getSolanaRpcUrl() {
  return DEFAULT_SOLANA_RPC_URL;
}

export function getSolanaExplorerCluster() {
  return DEFAULT_SOLANA_EXPLORER_CLUSTER;
}

export function getQuoteMode() {
  return DEFAULT_QUOTE_MODE;
}
