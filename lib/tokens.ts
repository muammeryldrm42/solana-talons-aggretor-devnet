import type { TokenConfig } from "@/lib/types";

export const TOKENS: TokenConfig[] = [
  {
    symbol: "SOL",
    name: "Wrapped SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  {
    symbol: "USDC",
    name: "Devnet USDC",
    mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    decimals: 6,
  },
  {
    symbol: "tUSDT",
    name: "Demo Tether",
    mint: "Hh3g2L2vK2kqZneYqg8DsRPzQmVfDqBPjVAkVnnBYnCt",
    decimals: 6,
    demoOnly: true,
  },
  {
    symbol: "tBONK",
    name: "Demo Bonk",
    mint: "B6r25qn7a6oc4cV4SZArdX1HLhA8BGV1sPnqWj1dUtJR",
    decimals: 5,
    demoOnly: true,
  },
];
