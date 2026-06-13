# Contract-Driven Devnet Snapshot Refresh Design

Date: 2026-06-13
Branch: `develop`
Status: approved for specification

## Context

The ClawFarm website is the official public site for the protocol implemented in the sibling `../clawfarm-masterpool` contract repository. The public narrative remains **Mining inference**: providers contribute inference capacity, buyers pay for inference, and CLAF rewards follow finalized contribution.

The website was recently aligned to the current mining-inference narrative, the CLAF public token symbol, latest deployed program IDs, and the receipt-tax settlement model. The next revision must check the latest contract implementation again and refresh the website content from the contract source of truth, including a fresh devnet chain-state read.

The project owner confirmed these constraints:

- Continue following the existing highest-priority project rules.
- Public website content must be English-only.
- Interactions with the owner remain Chinese except technical terms.
- Latest `../clawfarm-masterpool` contract code, IDL, deployment records, tests, and chain state are the source of truth for protocol-facing content.
- High-level public positioning is not constrained by the current devnet subset; the high-level target remains Mining inference and Genesis mainnet target economics.
- Faucet and other technical development/testing tooling must not be exposed publicly.
- The chain-state read may temporarily use the RPC URL in `../clawfarm-masterpool/deployments/devnet-phase1.json`, but the RPC URL and API key must never be written into the site, docs, specs, plans, commits, or final public output.
- The refreshed devnet chain state should be statically written into the website where safe and useful.

## Goal

Refresh the website against the latest `clawfarm-masterpool` implementation and devnet chain state, while preserving the existing Mining inference narrative and public-safety rules.

## Design Principles

1. **Contract-first accuracy**: protocol facts, instruction behavior, account names, settlement flow, economic parameters, and devnet state come from latest contract code and verified chain reads.
2. **Narrative stability**: keep the high-level story focused on Mining inference, Provider Pool / Buyer Pool mining weight, and Genesis mainnet target economics.
3. **Stage labeling**: clearly distinguish Genesis mainnet target mechanisms from current devnet implementation.
4. **Static snapshot honesty**: any chain-state data shown on the site is a static snapshot with an explicit read timestamp, not realtime/live data.
5. **Public-data minimization**: publish only protocol-safe data; do not expose dev/test tooling, RPC URLs, API keys, admin/operator operational details, keypair paths, private keys, or wallet secrets.
6. **No faucet exposure**: faucet instructions, faucet config, faucet vaults, faucet limits, and faucet UX are development/testing infrastructure and should not appear in public website copy or public static data.
7. **No visual redesign**: allow small information-architecture edits for clarity, but do not redesign the UI or change the established visual style.

## Source-Of-Truth Inputs

### Contract Repository

Read from `../clawfarm-masterpool`:

- Rust program source under `programs/clawfarm-masterpool/src` and `programs/clawfarm-attestation/src`.
- Generated IDL and committed deployment records if present.
- `Anchor.toml` program IDs.
- Tests and smoke scripts only as supporting evidence.
- `deployments/devnet-phase1.json` for current devnet program IDs, mints, and core PDAs.

### Devnet Chain State

Use a local read-only script or one-off command to fetch current devnet state from the deployed programs and accounts. The command may read the RPC URL from `../clawfarm-masterpool/deployments/devnet-phase1.json`, but must not persist the RPC URL or API key.

Read and compare at least:

- Masterpool global config.
- Attestation config.
- Epoch cursor.
- Core vault token balances where public-safe.
- CLAF mint and Test USDC mint addresses.
- Pause flags.
- Current config economic parameters, including receipt tax model and supported receipt tax rates if represented in code rather than account config.

Do not read or publish faucet data.

## Public Snapshot Data Policy

Update `app/lib/protocol.ts` with the latest safe devnet snapshot:

- Program IDs.
- Public mints.
- Core protocol accounts and vaults.
- Masterpool config fields that are public protocol parameters.
- Attestation config fields that are public protocol parameters.
- Vault balances if fetched successfully and not tied to private/operator identity.
- Epoch cursor if fetched successfully.
- Pause flags.
- Snapshot label with an explicit timestamp, for example `Devnet snapshot read on 2026-06-13 HH:mm Asia/Shanghai`.

If a chain account read fails or a field cannot be verified:

- Do not invent a value.
- Set the affected public value to `null` or display `-`.
- Keep addresses that are verified by deployment records and PDA derivation.
- Document the missing verification in the implementation notes or final delivery summary.

Do not write these values into public files:

- RPC URL or API key.
- Admin authority.
- Test USDC operator.
- Faucet config, faucet vaults, faucet limits, or faucet status.
- Keypair paths.
- Private keys, seed phrases, wallet files, or local machine paths.

## Content Revision Scope

### Homepage

Keep the page led by Mining inference. Only revise homepage content if the latest contract check shows protocol drift, such as:

- Receipt-tax semantics.
- Current devnet snapshot labels.
- Vault/balance wording.
- Static vs live wording.

Avoid moving the page toward implementation-first language.

### Docs Page

The docs page is the primary target for technical updates. It should be checked and revised for:

- `SubmitReceiptArgs` fields.
- Compact receipt hash inputs.
- Receipt tax model.
- Provider signer / gateway-capable signer proof.
- Payment delegate and gross delegated allowance requirement.
- Masterpool record flow.
- Challenge lifecycle.
- Epoch weight, epoch finalization, reward stream, vesting, and claim flow.
- Devnet parameters and account addresses.
- SDK wrapper examples in TypeScript, Python, and Rust.

The docs page must not expose faucet/test tooling.

### Builders Page

Check buyer-side usage language against latest contract flow:

- Paid usage contributes Buyer Pool mining weight after receipt finalization.
- Buyer-side examples include receipt tax rate where SDK snippets appear.
- Avoid direct per-call CLAF payout claims.

### Providers Page

Check provider-side language against latest contract flow:

- Provider metadata remains off-chain.
- ProviderAccount stores wallet, stake, pending provider base-charge USDC, counters, and status.
- Provider pending release happens after receipt finalization.
- Challenge outcomes match current contract semantics.

### Install Page

Check onboarding copy and wrapper examples:

- Provider registration uses wallet, stake, and on-chain ProviderAccount.
- Endpoint/model/pricing metadata remains off-chain.
- Receipt signing examples include current receipt-tax semantics where relevant.
- No faucet/test tooling is exposed.

### State / Network Panels

Refresh displayed devnet snapshot fields from `app/lib/protocol.ts`:

- Program IDs.
- Mint IDs.
- Core accounts.
- Config values.
- Pause flags.
- Vault balances and epoch cursor if verified.

Ensure labels do not imply realtime data unless the site actually fetches live data. Use static snapshot language.

### README

Update only if needed to reflect:

- Current contract semantics.
- Static snapshot policy.
- CLAF public symbol.
- Faucet/test tooling exclusion from public site scope.

Keep README public and free of local paths, RPC URLs, API keys, and private operational details.

### Content Guard

Update `scripts/verify-site-content.mjs` to protect the new decisions:

- Continue blocking Chinese text in public shipped files.
- Continue blocking local paths, RPC API-key URLs, private key material, wallet paths, and seed phrases.
- Continue blocking public `CLAW` as stale symbol.
- Continue allowing stage-labeled `buyback-and-burn` and Genesis immutable target copy only in approved contexts.
- Continue blocking unqualified current-devnet buyback, immutability, endpoint registry, routing, and dual-signature claims.
- Continue blocking direct per-call CLAF reward claims.
- Continue blocking stale fixed gross split language.
- Continue blocking SDK charge examples missing receipt tax rate.
- Add or preserve a guard that prevents public faucet/test tooling language from appearing in `app/` or `README.md`, with narrow exceptions only if the guard script itself contains the forbidden terms as patterns.
- Add or preserve a guard against describing static snapshots as realtime/live if the data comes from `app/lib/protocol.ts`.

## Chain Read Implementation Design

The implementation plan should include a local-only read step. Acceptable approaches:

1. Use existing contract scripts if they can read status without writing transactions and without printing secrets.
2. Write a temporary local script outside committed public files or a committed utility that reads deployment records without persisting RPC URLs.
3. Use a one-off Node/tsx command that imports Anchor/solana libraries from the contract repo and prints sanitized JSON.

The output used for website updates must be sanitized before editing tracked files.

The implementation must not commit generated raw chain dumps if they contain RPC URLs, API keys, admin/operator addresses, or faucet data.

## Acceptance Criteria

- Latest contract source has been inspected before implementation.
- Latest devnet chain state has been read using current deployment addresses.
- Safe snapshot data is statically written to `app/lib/protocol.ts` with an explicit snapshot timestamp.
- Public pages and README remain English-only.
- Public copy uses `CLAF`, not `CLAW`.
- Faucet/test tooling is not exposed publicly.
- RPC URL/API key from deployment JSON is not committed or printed in final public-facing content.
- Genesis target mechanisms remain stage-labeled.
- Current devnet implementation details are contract-aligned.
- SDK examples include required current receipt fields, including receipt tax rate if still required by contract code.
- `npm run verify:site` passes.
- `npx tsc --noEmit` passes.
- `npm run build` is attempted and passes, or any external/non-content blocker is clearly reported.

## Non-Goals

- Do not modify contract code.
- Do not run write transactions.
- Do not add live data fetching.
- Do not expose faucet/test tooling.
- Do not create mainnet addresses or claim mainnet deployment exists.
- Do not redesign the UI.
- Do not commit RPC URLs, API keys, keypairs, wallet files, local paths, or operational secrets.

## Risks And Mitigations

### RPC Secret Leakage

Risk: deployment JSON contains an RPC URL with an API key.

Mitigation: use the URL only in local process memory; never write it to tracked files; verify with content guard and grep before committing.

### Stale Static Snapshot

Risk: static balances and epoch counters can become stale.

Mitigation: label the snapshot with an explicit timestamp and avoid live/realtime wording.

### Test Tooling Exposure

Risk: faucet functionality appears in latest contract code and could accidentally be documented.

Mitigation: explicitly exclude faucet from public content and add guard coverage.

### Contract Drift

Risk: code or IDL changed after the previous website update.

Mitigation: implementation plan must re-read Rust source, IDL, deployment, and chain state in the same work session before editing public content.

## Self-Review

- No placeholders remain.
- Scope is focused on website content, static protocol data, and verification guard updates.
- The design does not introduce live fetching, UI redesign, contract changes, or public faucet content.
- The design preserves the approved Mining inference narrative while requiring latest contract and chain-state accuracy for technical details.
- The design explicitly protects RPC/API keys and other operational secrets.
