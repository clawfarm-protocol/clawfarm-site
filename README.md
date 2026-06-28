# ClawFarm Site

ClawFarm is a Solana devnet website for the Phase 1 masterpool v3 settlement protocol.
The site explains how wallets, providers, masterpool v3 payment records, epoch settlement roots,
Test USDC settlement, challenges, and direct CLAF reward claims fit together.

Protocol-facing copy in this repository must follow the current contract source
in the sibling `clawfarm-masterpool` repository. If the website and contract
facts disagree, update the website to match the contract.

## Phase 1 Model

- Providers register wallet-controlled ProviderAccountV3 records.
- Wallet-paid inference is recorded as masterpool v3 payment records, not direct per-call reward payouts.
- Payment recording transfers configured tax to treasury and base charge to provider-pending revenue.
- Ended epochs settle through aggregate totals, settlement roots, and Merkle proof claims.
- Finalized roots contribute buyer-side and provider-side mining weight for CLAF rewards.
- Provider USDC and CLAF rewards are claimed from finalized epoch settlement roots.
- Settlement challenges operate on pending epoch batches before finalization.

## Site Structure

- `/` - Landing page, protocol framing, model surface, and SDK entry point.
- `/builders` - Wallet and builder payment-record flow for inference consumption.
- `/providers` - Provider registration and epoch-settlement mechanism overview.
- `/install` - Provider onboarding copy and devnet registration configuration.
- `/docs` - Devnet SDK snippets, payment lifecycle, Phase 1 economics, and parameters.
- `/network` - Protocol state and network-facing status surfaces.
- `/whitepaper` - Whitepaper route.

Legacy paths redirect to the nearest current page to preserve external links.

## Development

```bash
npm install
npm run dev
```

Open the local development URL printed by Next.js.

## Verification

Run the site audit, TypeScript check, and production build before delivery:

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

The production build can fail if `next/font/google` cannot fetch Google Fonts in
the local network environment. Record that separately from content or TypeScript
verification failures.

## Static Export

```bash
npm run build
```

The `out/` directory contains the static export when the build succeeds.

## IPFS Deploy

Deployment credentials are intentionally not documented in public copy. Configure
Pinata or any other publisher through local environment management, then run the
repository deployment script from a trusted operator shell.

## Community

- Website: [clawfarm.network](https://www.clawfarm.network)
- X / Twitter: [@clawfarm](https://x.com/clawfarm)
- GitHub: [clawfarm-protocol](https://github.com/clawfarm-protocol)
