# Devnet Network Switch Design

Date: 2026-06-09
Status: Approved for specification; awaiting written-spec review

## Context

ClawFarm site is a static Next.js website for the ClawFarm protocol. Project rules require protocol-facing facts to follow the latest contract implementation in the sibling `../clawfarm-masterpool` repository.

The latest contract implementation is Phase 1 receipt-driven economics:

- `clawfarm-masterpool` is the protocol economic authority.
- `clawfarm-attestation` owns receipt and challenge lifecycle state and invokes masterpool through CPI.
- Receipts record epoch weight instead of issuing direct per-receipt CLAW rewards.
- User-paid USDC is split immediately at receipt record time.
- Provider revenue remains pending until the receipt survives the challenge window and is finalized.
- Epoch rewards are finalized and claimed through epoch-level weight accounting.

The website currently contains stale placeholders and some older protocol language. The new work should create a devnet-first version of the site, populate it with the current devnet deployment facts, and let users manually switch to a mainnet view that is explicitly pending.

## Goals

1. Default first visit to Devnet.
2. Add a manual Devnet / Mainnet switch that works across the existing website sections.
3. Populate Devnet with contract-derived addresses, config values, vaults, and current snapshot data.
4. Make Mainnet selectable but clearly marked as awaiting deployment.
5. Replace stale protocol claims with the latest Phase 1 receipt-driven economics.
6. Keep all public website copy in English.
7. Avoid shipping API keys, local machine paths, private keys, wallet paths, or other secrets.

## Non-Goals

- Do not build a live RPC indexer in this change.
- Do not add a backend service.
- Do not expose RPC provider credentials in browser code.
- Do not invent mainnet addresses before deployment records exist.
- Do not implement provider registration, wallet connect, or transaction submission flows.

## Chosen Approach

Use a static protocol data layer with two network profiles:

- `devnet`: populated from the latest contract source, IDL, `Anchor.toml`, devnet deployment record, and an on-chain snapshot.
- `mainnet`: present in the UI as `pending`, with no fake addresses or state values.

This approach fits the current static website, avoids frontend secret exposure, and gives users accurate devnet information immediately. Live data can be added later through a server-side indexer or curated API.

## Source Facts

### Devnet Programs

- Masterpool program ID: `DWbzvr2F8hKquw7cXQqhpEc8JnJ1covmP6f28Rwmy15q`
- Attestation program ID: `BwRMqumgiHbeMhG9xs1a76vUjmprrokr6WsPCzhz3pKK`

### Devnet Mints

- CLAW mint: `EW7npwHnVtTXvimde3Zj6dHX4mWbSAb5zkkHCrvkC8ui`
- Test USDC mint: `Hpq3GKSHa6rX9pGSRw2Gvoz6AbP16GMtHPVMxLr7P553`

### Devnet Core Accounts

- Pool authority: `5C1XsgA6SX9vfii55138q7yxwFuEssmxcMfWw6FEBYN5`
- Masterpool config: `B7kijN5oMvrEXc4ihsebG7fWi1DwTPPv3zL2u6WuxMDA`
- Attestation config: `5Rta1Vgp68Yr8HQqwFFzC6TZkUqCotqgvjTqF5ZgtEiD`
- Reward vault: `FLwt8ouUSaxfEhTEwNZbAP8yYSBy5sbYqV7Lvwz9xh3M`
- Challenge bond vault: `2JTopbYhBeLRzDHXSX5HRLvimURhiQs8n7a2HJoGoh3M`
- Treasury USDC vault: `3GCM4JwxDZDDa4wUDAGJ3vUkapAQU6EjSFougXnKjtQn`
- Provider stake USDC vault: `BDGJQXiStxnWgZAXp2jXGvKekQghCY3nWynqMqsxwQzp`
- Provider pending USDC vault: `E4bjKdR1n9n3cqYamgHUcvTGn8tpEoBmAvqb9X2qpcv4`
- Epoch cursor: `A9nrM4fm1T8pLwNaGRixPkmAg1FmKADJk7rPPQeA6d1a`

### Devnet Config Snapshot

- Masterpool config version: `2`
- Provider stake: `100.000000` Test USDC
- Provider USDC share: `970` bps using contract scale `1000`, shown as `97%`
- Treasury USDC share: `30` bps using contract scale `1000`, shown as `3%`
- Provider epoch pool share: `700` bps using contract scale `1000`, shown as `70%`
- Buyer epoch pool share: `300` bps using contract scale `1000`, shown as `30%`
- CLAW challenge bond: `2.000000`
- Provider slash amount: `30.000000` CLAW
- Reward lock: `180` days
- Epoch duration: `3600` seconds
- Devnet challenge window: `30` seconds
- Attestation challenge resolution timeout: `30` seconds
- Emission total: `1,000,000,000.000000` CLAW
- Halving period: `31,536,000` seconds
- Emission duration: `157,680,000` seconds
- Genesis minted: `true`
- Receipt recording paused: `false`
- Challenge processing paused: `false`
- Finalization paused: `false`
- Claims paused: `false`

### Devnet Balance Snapshot

- Reward vault: `999,899,885.946700` CLAW
- Challenge bond vault: `0.000000` CLAW
- Treasury USDC vault: `41.387849` Test USDC
- Provider stake USDC vault: `300.000000` Test USDC
- Provider pending USDC vault: `98.994182` Test USDC
- Latest known epoch: `522`
- Latest finalized epoch: `521`
- Carry-forward CLAW: `0.000000`

## Architecture

### Data Layer

Create a small typed data layer, likely `app/lib/protocol.ts`, that exports:

- `NetworkId = 'devnet' | 'mainnet'`
- `NetworkProfile`
- `protocolNetworks`
- `defaultNetworkId = 'devnet'`
- formatting helpers for short addresses, explorer URLs, percentages, and pending values

The data layer should be the only place where protocol addresses and network-specific facts are defined. Existing pages should import from it instead of duplicating hard-coded protocol facts.

### Client Network State

The network switch needs client state because the user can change network without navigating away. The state can be handled in `ClientLayout` or a focused client component:

- Initial value: Devnet.
- If `?network=devnet` or `?network=mainnet` is present, use it.
- Otherwise use a stored preference from `localStorage` if present.
- Otherwise default to Devnet.
- Persist manual changes to `localStorage` and update the URL query without a full page reload.

If implementation complexity is high, the first version can use client-side state and `localStorage` only. The visible default must still be Devnet.

### Component Boundaries

Recommended components:

- `NetworkSwitch`: compact Devnet / Mainnet control in the top navigation.
- `NetworkBadge`: shows current network, deployment status, and snapshot label.
- `AddressValue`: renders full or shortened addresses with Solana explorer links.
- `PendingValue`: consistent display for mainnet pending fields.
- `ProtocolMetricGrid`: shared rendering for state and network metrics.

Keep components small and readable. Avoid creating a broad app-wide state framework for this change.

## Page Behavior

### Global Navigation

Add the network switch to the header without making it dominate the navigation. It should be usable on mobile and desktop. Devnet must appear selected on first load.

### Home Page

Update the hero and protocol status to show Devnet by default:

- Deployment status: Devnet active.
- Masterpool and attestation program IDs.
- Genesis minted status.
- Current epoch snapshot.
- Phase 1 settlement language.

Replace stale references to mainnet-live or immutable mainnet deployment if they cannot be verified by mainnet deployment records.

### State Page

Populate overview metrics from the selected network profile. For Devnet, show:

- Network status.
- Program IDs.
- CLAW and Test USDC mints.
- Latest known and finalized epoch.
- Treasury, provider stake, provider pending, reward, and challenge vault balances.
- Pause flags.
- Provider stake, challenge bond, slash amount, lock days, epoch duration, challenge window.

For Mainnet, show a pending deployment panel and use `—` for addresses and metrics.

### Network Page

Make this the most explicit contract-address surface:

- Programs.
- Mints.
- Core PDAs and vaults.
- Current config snapshot.
- Explorer links.
- Snapshot timestamp or label.

Mainnet should say `Awaiting mainnet deployment` and avoid fake values.

### Docs Page

Align protocol documentation with Phase 1:

- Attestation submits compact receipts.
- Masterpool records receipt payment and snapshots economic records.
- USDC splits immediately: 97% provider pending, 3% treasury.
- Receipt finalization activates epoch weight after the challenge window.
- Epoch finalization is permissionless.
- Claiming epoch rewards creates locked reward streams.
- Only the reward owner withdraws vested CLAW.
- Challenges are bond-backed in CLAW.

Remove or rewrite unsupported claims about automated Jupiter buyback, old direct reward materialization, and unverified mainnet immutability.

### Providers / Install / Builders Pages

Update copy to match Phase 1:

- Provider registration requires one wallet and 100 Test USDC stake on devnet.
- Providers earn pending USDC on receipt record and receive it after finalization.
- Buyers and providers earn epoch reward weight from finalized usage.
- Devnet challenge window is 30 seconds; mainnet policy can be described as deployment-dependent until mainnet config exists.
- Use `CLAW` for the token name if contract-facing, and avoid mixing with stale `CLAF` copy unless product naming rules explicitly require both.

## Error Handling And Empty States

- Mainnet pending is not an error. It should be a clear deployment state.
- If a value is unavailable for the selected network, show `—` with supporting text, not a spinner.
- Do not present static snapshots as live data. Labels should say `Devnet snapshot` or `Snapshot from devnet config`.
- If live refresh is added later, failures should keep the snapshot visible and show a quiet `Live refresh unavailable` note.

## Visual Direction

Follow the existing project design context and the `impeccable` standard:

- Contract-first, precise, protocol-grade UI.
- Compact network switch with strong state clarity.
- No generic crypto neon treatment.
- No gradient text.
- No colored side-stripe accents.
- Keep mobile touch targets usable.

## Security And Privacy Requirements

- Do not commit RPC provider API keys.
- Do not include local absolute development paths.
- Do not include wallet paths, private keys, seed phrases, keypair JSON, or admin secrets.
- Do not expose the Helius RPC URL from deployment records in frontend code.
- Use public explorer links for addresses instead of private RPC URLs.
- Keep `AGENTS.md` and `.impeccable.md` uncommitted unless the project owner explicitly changes that instruction.

## Testing And Verification

Before implementation is considered complete:

1. Run `npm run build`.
2. Scan changed files for Chinese text.
3. Scan changed files for local absolute paths.
4. Scan changed files for API keys, secrets, private keys, wallet paths, and token-like credentials.
5. Verify that the default rendered network is Devnet.
6. Verify that Mainnet can be selected and shows a pending state.
7. Verify that protocol values on public pages match the centralized protocol data layer.
8. Verify that stale buyback and old reward-flow claims are removed or rewritten.
9. Verify that `AGENTS.md` and `.impeccable.md` are not staged.

## Acceptance Criteria

- First visit opens the site in Devnet mode.
- A user can manually switch to Mainnet.
- Mainnet displays as awaiting deployment and never shows fake addresses.
- Devnet pages show the current program IDs, mints, PDAs, config values, and snapshot balances.
- Existing directory sections remain available.
- Protocol copy matches the latest Phase 1 contract implementation.
- The implementation contains no Chinese public copy, local machine paths, API keys, private keys, wallet paths, or other secrets.
