# ClawFarm Site

ClawFarm is the Mainnet-first public website for the Phase 1 masterpool v3 settlement protocol and its AIRouter integration.
The site documents Provider onboarding, B-side Buyer API access, Mainnet payment records, epoch settlement roots, USDC settlement, and CLAF rewards.

Protocol-facing copy in this repository follows the current contract source in the sibling `clawfarm-masterpool` repository. If the website and contract facts disagree, the contract is authoritative.

## Phase 1 Model

- Solana Mainnet is the default website network; Devnet remains selectable.
- Mainnet uses native USDC and 3,600-second epochs.
- AIRouter authenticates wallet-bound Buyer API keys, routes inference requests, persists durable receipts, and queues asynchronous settlement.
- Masterpool v3 records payments, moving configured tax to treasury and base USDC to the provider-pending vault.
- Ended epochs settle through aggregate totals, settlement roots, and Merkle-proof claims.
- Finalized roots allocate CLAF with a 70 percent Provider / 30 percent Buyer split and release Provider USDC claims.
- Current `register_provider_v3` initializes provider stake to zero and transfers no upfront collateral, even though the Mainnet config stores a provider-stake parameter.
- Public chain figures are dated static snapshots. The browser does not connect directly to an RPC endpoint.
- Explicit `?network=` selections and saved user preferences override the first-visit Mainnet default.

## Site Structure

- `/` - Mainnet-first protocol overview, settlement snapshot, and AIRouter entry paths.
- `/builders` - B-side Buyer access, wallet funding, direct HTTP quickstart, and settlement headers.
- `/providers` - Provider requirements and the routed-usage-to-claim settlement path.
- `/install` - Detailed operator-assisted Provider onboarding checklist.
- `/docs` - AIRouter authentication, supported HTTP routes, Provider onboarding, and masterpool v3 settlement reference.
- `/network` - Selected-network program addresses, config parameters, and dated vault balances.
- `/state` - Selected-network protocol state overview.
- `/whitepaper` - Whitepaper reader and downloads.

Legacy paths redirect to the nearest current page to preserve external links.

## Development

```bash
npm install
npm run dev
```

Open the local development URL printed by Next.js.

## Verification

Run the public-content audit, TypeScript check, and production build before delivery:

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

The production build can fail if `next/font/google` cannot fetch Google Fonts in the local network environment. Record that separately from content or TypeScript failures.

The static export is written to `out/` after a successful build.

## Deployment

Publishing credentials are intentionally absent from public copy. Configure the selected publisher through trusted environment management and run the repository deployment script from an operator shell.

## Community

- Website: [clawfarm.network](https://www.clawfarm.network)
- X / Twitter: [@clawfarm](https://x.com/clawfarm)
- GitHub: [clawfarm-protocol](https://github.com/clawfarm-protocol)
