"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { getRpcUrl, getNetwork } from "@/lib/solana";

export function ProvidersClient({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => getRpcUrl(), []);
  const network = useMemo(() => getNetwork(), []);
  const wallets = useMemo(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const adapterNetwork =
      network === "mainnet-beta"
        ? WalletAdapterNetwork.Mainnet
        : network === "testnet"
          ? WalletAdapterNetwork.Testnet
          : WalletAdapterNetwork.Devnet;

    return [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: adapterNetwork })];
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
