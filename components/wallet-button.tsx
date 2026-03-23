"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  return (
    <WalletMultiButton className="!h-11 !rounded-2xl !bg-white !px-4 !text-sm !font-semibold !text-slate-950 hover:!opacity-90" />
  );
}
