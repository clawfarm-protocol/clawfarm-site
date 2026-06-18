# ClawFarm Site

ClawFarm is a Solana devnet website for the Phase 1 receipt-settlement protocol.
The site explains how wallets, providers, compact receipts, Test USDC settlement,
epoch weight, challenges, and locked CLAF reward streams fit together.

Protocol-facing copy in this repository must follow the current contract source
in the sibling `clawfarm-masterpool` repository. If the website and contract
facts disagree, update the website to match the contract.

## Phase 1 Model

- Providers register a wallet-controlled ProviderAccount and stake 100 Test USDC on devnet.
- Wallet-paid inference is recorded through compact receipts, not direct per-call reward payouts.
- Receipt recording splits Test USDC into provider-pending revenue and treasury revenue.
- Provider-share USDC releases only after the receipt finalizes through the attestation lifecycle.
- Finalized receipts contribute buyer-side and provider-side epoch weight for CLAF rewards.
- Epoch rewards are claimed into locked CLAF streams rather than paid directly per request.
- Challenges use CLAF bonds and can invalidate receipt economics when accepted.

## Site Structure

- `/` - Landing page, protocol framing, model surface, and SDK entry point.
- `/builders` - Wallet and builder receipt flow for inference consumption.
- `/providers` - Provider registration and receipt-settlement mechanism overview.
- `/install` - Provider onboarding copy and devnet registration configuration.
- `/docs` - Devnet SDK snippets, receipt lifecycle, Phase 1 economics, and parameters.
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
