# Masterpool V3 Technical Copy Alignment Design

## Summary

Align the ClawFarm public website's technical descriptions with the latest `clawfarm-masterpool-v3` contract implementation while preserving product narrative, whitepaper content, and current static network data. This change updates only protocol-facing implementation copy, SDK wrapper examples, flow descriptions, status labels, and content guards.

## Source Of Truth

Protocol-facing technical facts must be derived from the latest sibling contract repository:

- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/lib.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/types.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/settlement.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/claim.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/provider.rs`
- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/config.rs`
- `../clawfarm-masterpool/deployments/devnet-masterpool-v3.json`

The implementation must not publish private operator data, RPC URLs, API keys, keypair paths, faucet tooling, or local machine paths.

## Goals

1. Replace stale v2 technical website copy with v3 implementation facts.
2. Keep all public website text in English.
3. Preserve the high-level Mining inference narrative and mainnet goals.
4. Avoid modifying whitepaper assets, whitepaper route content, whitepaper generation scripts, or product-level goals.
5. Leave static network data in `app/lib/protocol.ts` unchanged for this pass.
6. Make regressions easier to catch with focused content guards.

## Non-Goals

- Do not refresh devnet addresses, balances, or static network snapshot data.
- Do not read live chain state or write a new on-chain snapshot into the website.
- Do not change whitepaper PDFs, `app/whitepaper/page.tsx`, or `scripts/generate-whitepaper-v1.py`.
- Do not redesign the UI.
- Do not change token goals, buyback-and-burn target language, Genesis immutable target language, or other high-level protocol objectives.
- Do not expose faucet, test operations, RPC credentials, keypairs, or deployment secrets.

## Current V3 Contract Facts

### Program Shape

The current masterpool implementation is the independent `clawfarm_masterpool_v3` program. Its public instruction surface is:

- `initialize_masterpool_v3`
- `register_provider_v3`
- `record_payment_v3`
- `commit_epoch_settlement_v3`
- `open_epoch_settlement_challenge_v3`
- `accept_epoch_settlement_challenge_v3`
- `reject_epoch_settlement_challenge_v3`
- `finalize_epoch_settlement_v3`
- `claim_provider_epoch_v3`
- `claim_buyer_epoch_reward_v3`

The website must not describe current devnet settlement as `attestation.submit_receipt`, `SubmitReceiptArgs`, or `ReceiptEconomicRecord` when referring to the v3 implementation.

### Accounts

The v3 account model uses:

- `GlobalConfigV3`
- `ProviderAccountV3`
- `EpochPaymentAccumulator`
- `EpochPaymentBitmap`
- `EpochSettlementBatch`
- `EpochSettlementChallenge`
- `EpochSettlementRoot`
- `EpochClaimBitmap`

The website must avoid presenting v2-only accounts as current v3 accounts, including `ReceiptEconomicRecord`, `EpochCursor`, challenge-bond vault, and provider-stake vault where the statement is framed as current v3 implementation detail.

### Payment Recording

`record_payment_v3` records payment directly in masterpool v3:

- The payer token account must be owned by the payer wallet.
- The payer token account must use the configured USDC mint.
- The payment delegate signer must match the payer token account delegate.
- `tax_rate_bps` must equal `GlobalConfigV3.tax_rate_bps`.
- Gross payment is `base_charge_atomic + tax`, where tax is computed from configured basis points.
- Tax transfers to the treasury USDC vault.
- Base charge transfers to the provider pending USDC vault.
- The current epoch is derived from `emission_anchor_ts` and `epoch_duration_seconds`.
- `EpochPaymentAccumulator` records aggregate base, tax, gross, and payment count.
- `EpochPaymentBitmap` prevents reusing the same payment index within an epoch chunk.
- `ProviderAccountV3.pending_provider_usdc` increases by the base charge.

### Epoch Settlement

`commit_epoch_settlement_v3` creates an `EpochSettlementBatch` after the epoch has ended. The submitted aggregate values must match `EpochPaymentAccumulator` totals. The batch stores:

- `usage_root`
- `provider_root`
- `buyer_root`
- `artifact_hash`
- `artifact_uri_hash`
- payment, provider, and buyer counts
- total base, tax, and gross USDC
- provider and buyer CLAF pools
- challenge deadline
- pending status

`open_epoch_settlement_challenge_v3` invalidates a pending batch during the challenge window and creates an `EpochSettlementChallenge`. The authority can accept or reject the challenge. Rejecting restores the batch to pending. Accepting closes the invalidated batch and challenge accounts. Finalization writes an `EpochSettlementRoot` after the challenge deadline.

### Claims

Claims use Merkle proofs against finalized epoch roots:

- `claim_provider_epoch_v3` verifies a provider leaf, transfers provider USDC from provider pending vault, transfers provider CLAF from reward vault, updates root claimed totals, and marks the provider claim bitmap.
- `claim_buyer_epoch_reward_v3` verifies a buyer leaf, transfers buyer CLAF from reward vault, updates root claimed totals, and marks the buyer claim bitmap.
- Provider and buyer claim leaves use sorted-pair Merkle proofs without direction bits.

## Website Changes

### Documentation Page

Update `app/docs/page.tsx` so current implementation sections describe v3:

- SDK examples should target `record_payment_v3` and epoch settlement wrappers rather than `attestation.submit_receipt`.
- Replace `SubmitReceiptArgs` with `RecordPaymentV3Args`.
- Replace receipt hash and ed25519 proof language with payment nonce hash, payment index, base charge, tax rate, payer delegate, and masterpool v3 accounts.
- Replace `ReceiptEconomicRecord` lifecycle with epoch accumulator, settlement batch, challenge, settlement root, and Merkle claim lifecycle.
- Keep model, endpoint, and pricing metadata off-chain.
- Keep gateway examples framed as wrapper targets, not contract-native REST endpoints.
- Devnet parameters may mention v3 deployment facts only as public technical facts, but this pass must not rewrite `app/lib/protocol.ts` network data.

### Builders Page

Update `app/builders/page.tsx` technical copy to describe wallet-paid usage as v3 payment records that feed epoch settlement roots. Avoid v2 phrasing such as receipt economic records or attestation CPI when describing current v3 behavior.

### Providers And Install Pages

Update `app/providers/page.tsx` and `app/install/page.tsx` technical copy to describe:

- `ProviderAccountV3` registration.
- Config-driven provider stake behavior rather than hard-coded legacy `100 Test USDC` when framed as current v3 implementation.
- Provider pending USDC accumulation from base charges.
- Provider claims through finalized epoch Merkle roots.

### State And Network Surfaces

Because network data is intentionally not refreshed in this pass, public labels must avoid implying that the current static profile is the latest v3 deployment snapshot. Prefer neutral wording such as:

- `Selected network snapshot`
- `Static network snapshot`
- `Legacy devnet snapshot`
- `Network profile`

Do not add v3 addresses or balances to `app/lib/protocol.ts` in this pass.

### README

Update only implementation-facing summary text in `README.md` so it no longer describes v2 receipt records as the current technical implementation. Preserve high-level project description and site structure.

### Content Guard

Update `scripts/verify-site-content.mjs` so public copy does not regress to v2-only current-implementation language. Guard targets should include current-public-copy occurrences of:

- `SubmitReceiptArgs`
- `ReceiptEconomicRecord`
- `attestation.submit_receipt`
- `epoch cursor` when framed as current v3 state
- hard-coded current v3 provider stake as `100 Test USDC`
- current v3 challenge-bond vault or provider-stake vault claims

The guard must avoid scanning whitepaper generation scripts and must not block historical specs or implementation plans unless they contain secrets, local paths, Chinese text, or public-output files intended for the website.

## Safety Rules

- Public website output and shipped source must remain English-only.
- No local machine paths, RPC URLs, API keys, private signing material, wallet secret files, or operator key paths may be committed.
- Faucet and development testing tooling must remain private and must not appear in public website copy.
- Contract facts must use the latest v3 source code as source of truth.
- If website copy conflicts with v3 contract code, update website copy, not the contract.

## Verification Plan

Run these commands after implementation:

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

Also run targeted scans for prohibited public-output content. The scans must cover Chinese characters, absolute local home paths, RPC credential markers, private key material, wallet files, and stale v2-only implementation terms in `app/` and `README.md`.

Expected results:

- `npm run verify:site` passes.
- TypeScript passes.
- Build passes.
- No Chinese text appears in public website files or shipped source.
- No secrets, local paths, RPC API key URLs, or wallet/keypair paths appear in committed files.
- Any remaining v2-only terms are either removed from public copy or intentionally guarded as disallowed patterns.

## Acceptance Criteria

- Public technical copy describes masterpool v3 payment recording, epoch settlement roots, challenges, and Merkle claims accurately.
- SDK wrapper examples target v3 concepts and do not imply direct contract REST APIs.
- Whitepaper files and whitepaper route content are unchanged.
- `app/lib/protocol.ts` network data is unchanged.
- Website build and content verification pass.
