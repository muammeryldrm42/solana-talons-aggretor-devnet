export type TokenConfig = {
  symbol: string;
  name: string;
  mint: string;
  decimals: number;
  demoOnly?: boolean;
};

export type QuoteLeg = {
  id: string;
  dex: "Raydium" | "Orca";
  label: string;
  feeBps: number;
  estimatedPrice: number;
};

export type QuoteResult = {
  id: string;
  protocol: "Raydium" | "Orca";
  kind: "Direct" | "Two-hop";
  estimatedOut: number;
  minReceived: number;
  impactBps: number;
  networkFeeUsd: number;
  confidence: number;
  isBest: boolean;
  legs: QuoteLeg[];
};

export type QuoteInput = {
  inputToken: TokenConfig;
  outputToken: TokenConfig;
  amount: number;
  slippageBps: number;
};
