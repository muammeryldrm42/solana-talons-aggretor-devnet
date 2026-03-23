# Architecture

Talons Aggregator intentionally separates concerns:

- **Frontend**: Next.js on Vercel
- **Chain integration**: Wallet adapter + Devnet RPC
- **Routing math**: Rust `router-core`
- **Guard path**: Anchor program scaffold

This lets the dashboard deploy independently from the on-chain program.
