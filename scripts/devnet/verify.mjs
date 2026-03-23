import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl("devnet"), "confirmed");
const version = await connection.getVersion();
const blockhash = await connection.getLatestBlockhash("confirmed");

console.log("RPC version:", version["solana-core"]);
console.log("Latest blockhash:", blockhash.blockhash);
