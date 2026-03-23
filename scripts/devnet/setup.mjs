import { clusterApiUrl } from "@solana/web3.js";

console.log("Talons Aggregator Devnet setup");
console.log("------------------------------");
console.log("RPC endpoint:", process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl("devnet"));
console.log("1) Fund a wallet with Devnet SOL.");
console.log("2) Deploy the Anchor program.");
console.log("3) Set NEXT_PUBLIC_QUOTE_MODE=demo or wire live adapters.");
