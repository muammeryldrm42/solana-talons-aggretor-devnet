# Talons Aggregator

Talons Aggregator is a **Vercel-friendly Solana Devnet swap-aggregator dashboard** with a **real Rust codebase** beside it:

- **Next.js App Router frontend** for wallet connection, route comparison, quote review, and transaction UX.
- **Rust router-core crate** for deterministic route math, fee handling, and slippage helpers.
- **Anchor guard program scaffold** for guarded execution checks such as max slippage, minimum output, and allow-listed program IDs.
- **Demo-first mode** so the repo deploys cleanly without standing up fragile backend infrastructure.

The project is intentionally designed so the **frontend can deploy to Vercel by itself** while the Solana program is deployed separately to **Devnet**.

## Why this architecture?

A lot of Solana demos fail at deployment because they ship:
- a custom Rust backend that Vercel does not need,
- too many moving pieces,
- or a fake DeFi UI with no wallet UX.

This repo keeps the frontend deploy-safe and moves the Rust work where it belongs:
- **on-chain program logic** in Anchor,
- **deterministic routing utilities** in Rust,
- **wallet and transaction UX** in Next.js.

## What ships today

### Frontend
- premium dark dashboard UI
- wallet connect with Phantom / Solflare via Solana wallet adapter
- devnet RPC health check
- token selection
- quote comparison cards
- best-route highlighting
- route leg breakdown
- slippage settings drawer
- recent quotes history in local storage
- real devnet transaction flow in **demo attestation mode**
- explorer deep links

### Rust
- `crates/router-core` for:
  - quote selection
  - slippage math
  - fee aggregation
  - route leg modeling
- `programs/talons_aggregator` Anchor scaffold for:
  - config initialization
  - config updates
  - allow-list management
  - route verification checks

## Important MVP note

The default mode is **`demo`**.

In demo mode the app:
- generates deterministic sample quotes for Raydium-style and Orca-style routes,
- lets a connected wallet sign a **Memo transaction** on Devnet to attest the selected route,
- clearly tells the user that **no live swap is executed**.

This keeps the app honest and deployable while still demonstrating:
- wallet integration,
- route comparison UX,
- transaction review flow,
- explorer links,
- and the Rust project structure needed for a real next step.

## Project structure

```text
.
├── app/                         # Next.js routes
├── components/                  # UI and feature components
├── docs/                        # architecture and deployment notes
├── hooks/                       # React hooks
├── lib/                         # quote engine, config, utilities
├── scripts/devnet/              # helper scripts
├── crates/router-core/          # Rust route math
├── programs/talons_aggregator/  # Anchor program scaffold
├── Cargo.toml                   # Rust workspace (router-core)
└── .github/workflows/ci.yml     # CI for frontend + router-core tests
```

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Run the frontend

```bash
npm run dev
```

Open `http://localhost:3000`.

## Vercel deployment

This repository is intentionally root-level **Next.js**, so deployment is straightforward:

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Deploy.

You do not need to set any public environment variables for the default Devnet deployment because the project ships with built-in public Devnet defaults. No custom server is required.

## Solana / Anchor local setup

The frontend does **not** require Anchor to deploy.

To work on the program locally, install:
- Rust toolchain
- Solana CLI
- Anchor CLI

Then:

```bash
cd programs/talons_aggregator
anchor build
anchor test
```

## Deploy order

1. Deploy the frontend to Vercel.
2. Verify the frontend loads and the devnet RPC badge is green.
3. Build and deploy the Anchor program to Devnet.
4. Replace the placeholder program ID in the frontend config when you are ready to wire guarded execution.

## Environment variables

For the default deploy, you can leave Vercel environment variables empty. The project already embeds:

- Solana network: `devnet`
- RPC URL: `https://api.devnet.solana.com`
- Explorer cluster: `devnet`
- App name: `Talons Aggregator`
- Quote mode: `demo`

`.env.example` is included only as an optional override reference for future customization.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run devnet:airdrop
npm run devnet:verify
npm run devnet:setup
```

## Live adapter roadmap

The frontend and Rust modules are intentionally structured to make these next steps straightforward:

- wire real Raydium Devnet pool fetching
- wire real Orca Whirlpool quote adapters
- replace demo attestation with live guarded execution
- serialize route hashes from `router-core`
- pass allow-listed program IDs into the guard program
- add swap simulation with real instructions

## Known limitations

- Default quote mode is `demo`.
- Demo mode does **not** execute a live DEX swap.
- Devnet liquidity is inconsistent.
- Public Solana RPC endpoints are rate-limited and not intended for production-grade traffic.
- Anchor tests require local Solana tooling and are not run by the Vercel deployment.

## Screenshots

Add your screenshots here after local run:

- `docs/screenshots/home.png`
- `docs/screenshots/swap.png`
- `docs/screenshots/tx-success.png`

## Disclaimer

This project is for engineering and portfolio use on **Solana Devnet**.  
Do not treat demo quotes as market data.  
Do not use this repository as a production trading system without a full security review.
