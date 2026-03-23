import { getSolanaNetwork, getSolanaRpcUrl } from "@/lib/config";

export function getRpcUrl() {
  return getSolanaRpcUrl();
}

export function getNetwork() {
  return getSolanaNetwork();
}
