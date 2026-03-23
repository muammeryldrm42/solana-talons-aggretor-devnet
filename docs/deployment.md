# Deployment

## Frontend
1. Push repo to GitHub.
2. Import into Vercel.
3. Add env vars from `.env.example`.
4. Deploy.

## Program
1. Install Solana CLI and Anchor.
2. `cd programs/talons_aggregator`
3. `anchor build`
4. `anchor deploy --provider.cluster devnet`

Update frontend constants after you have a deployed program ID.
