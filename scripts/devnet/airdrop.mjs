import { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl("devnet"), "confirmed");
const recipient = Keypair.generate().publicKey;

const sig = await connection.requestAirdrop(recipient, LAMPORTS_PER_SOL);
await connection.confirmTransaction(sig, "confirmed");

console.log("Airdropped 1 SOL to temporary key:", recipient.toBase58());
console.log("Signature:", sig);
