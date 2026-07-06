# Mining Inference Narrative Alignment Design

Date: 2026-06-11
Branch: `develop`
Status: approved for planning

## Context

The website has become too implementation-heavy after the devnet and SDK wrapper alignment work. It now explains receipt hashes, signer proofs, account graphs, epoch finalization, and locked streams before clearly stating the higher-level purpose of ClawFarm.

The project narrative should return to the original mainnet-oriented positioning:

- Mining inference.
- Providers contribute capacity.
- Buyers pay for inference in USDC.
- Rewards follow contribution.
- The protocol is framed as a mining economy for AI inference, with a Bitcoin-style economic argument.

The current devnet contract remains the source of truth for implementation details, SDK examples, process descriptions, and economic parameters. It should not constrain the higher-level protocol target. Instead, public copy must distinguish:

- **Protocol target / Genesis mainnet design**: the full mining inference economy.
- **Current devnet implementation**: the deployed receipt-settlement subset and its active parameters.

## Updated Principles

1. The primary public narrative is **Mining inference**.
2. `receipt-settled inference` is the mechanism shorthand, not the replacement for the mining narrative.
3. The canonical token symbol for public copy is `CLAF`.
4. The current devnet contracts guide technical flow, SDK examples, and live parameter values.
5. Genesis mainnet target mechanisms may be described even when not enabled on current devnet, as long as the stage difference is explicit.
6. Automated buyback-and-burn is a Genesis mainnet target mechanism; current devnet only books the treasury USDC share.
7. Genesis immutability and upgrade-authority renunciation are Genesis mainnet targets; current devnet should be labeled separately as active devnet state.
8. Endpoint registry and dual-signed proof language may be used only at the full-design or target layer. Current devnet implementation copy must state that endpoint/model/pricing metadata is off-chain and that the deployed receipt path uses a gateway-capable signer over a compact receipt hash.

## Problem

The current public copy over-indexes on current contract mechanics:

- The homepage hero says `Receipt settlement for inference` instead of `Mining inference`.
- The mining section explains receipt finalization and locked streams before explaining the mining economy.
- Builder and provider pages describe contract effects but do not lead with contribution, capacity, buyer demand, and mining weight.
- The docs page is accurate technically but starts from implementation structure rather than the protocol's economic objective.
- `CLAW` appears across public copy and protocol labels, while the approved public symbol is `CLAF`.
- Verification guard logic treats `CLAF` as stale, which now conflicts with the approved symbol.

## Desired Public Story

The website should teach the protocol in this order:

1. **Mining inference**: ClawFarm turns paid AI inference into mining weight.
2. **Two-sided contribution**: providers contribute capacity; buyers contribute paid demand.
3. **USDC settlement**: buyers pay in USDC; providers earn provider-share USDC.
4. **CLAF rewards**: finalized usage contributes to Provider Pool and Buyer Pool mining weight.
5. **Genesis target economics**: immutable launch target, fixed CLAF cap, emission schedule, and automated buyback-and-burn target.
6. **Current devnet implementation**: receipt settlement, provider pending USDC, epoch weight, challenge window, and locked reward streams.
7. **SDK wrapper target**: examples show how wrapper tools prepare and submit devnet-compatible receipt transactions.

## Copy Rules

### Allowed And Encouraged

- `Mining inference.`
- `Providers contribute capacity.`
- `Buyers pay for inference in USDC.`
- `Rewards follow contribution.`
- `Finalized usage becomes mining weight.`
- `Provider Pool 70% / Buyer Pool 30%`.
- `CLAF` as the public token symbol.
- `Genesis mainnet target` when describing full-design mechanisms not enabled on devnet.
- `Current devnet` when describing deployed contract behavior and live values.

### Allowed With Stage Labeling

- `buyback-and-burn`, only as a Genesis mainnet target or full protocol target.
- `Genesis immutable`, only as a mainnet Genesis target.
- `upgrade authority renounced`, only as a mainnet Genesis target.
- `endpoint registry`, only as full-design or off-chain directory language, not as current devnet ProviderAccount state.
- `dual-signed usage proof`, only as full-design language, not as current devnet submit path.

### Not Allowed As Current Devnet Fact

- Every call directly mines CLAF to the wallet.
- Current devnet has automated buyback-and-burn.
- Current devnet program upgrade authority is renounced.
- Current devnet stores endpoint URLs, model lists, pricing, or route modes in ProviderAccount.
- Current devnet uses user-and-provider signatures over request and response hashes.
- Public copy using `CLAW` as the token symbol.

## Page-Level Design

### Homepage

The hero should return to a high-level statement:

- Hero title: `Mining inference.`
- Supporting copy: ClawFarm turns paid AI inference into mining weight. Providers contribute capacity, buyers pay in USDC, and CLAF rewards follow finalized contribution.
- Status line should say `Devnet active · Mainnet Genesis pending · Solana` or equivalent.

The mining section should explain the economy before the implementation:

- Provider Pool: 70%.
- Buyer Pool: 30%.
- Fixed CLAF cap and emitted schedule.
- Current devnet realizes mining weight through finalized receipt settlement rather than direct per-call token payouts.

The treasury section should restore the target mechanism while staying honest:

- Genesis target: automated buyback-and-burn closes the cost-subsidy loop.
- Current devnet: the treasury USDC share is booked; automated buyback-and-burn is not enabled.

### Builders Page

The builders page should lead with buyer-side mining:

- Buyers create demand and can earn Buyer Pool mining weight through finalized paid usage.
- SDK examples help create receipt-backed settlement transactions for the current devnet path.
- Avoid direct wallet payout language. Use `contributes to Buyer Pool mining weight`.

### Providers Page

The providers page should lead with supply-side mining:

- Providers contribute inference capacity.
- Provider-share USDC releases after receipt finalization on current devnet.
- Finalized provider usage contributes to Provider Pool mining weight.
- Off-chain endpoint metadata remains separate from current ProviderAccount state.

### Install Page

Provider onboarding should be framed as joining the mining network:

- On-chain current devnet: register provider wallet, stake Test USDC, create ProviderAccount.
- Off-chain: publish endpoint, model, and pricing metadata in a directory or gateway.
- Economic goal: finalized usage earns provider-side mining weight.

### Docs Page

The docs page should be reorganized into two layers:

1. **Protocol objective**
   - Mining inference.
   - Receipt settlement is the mechanism shorthand.
   - Current devnet is an active subset of the full Genesis target.

2. **Current devnet implementation**
   - Provider registration.
   - `SubmitReceiptArgs`.
   - compact receipt hash.
   - gateway-capable signer proof.
   - payment delegate.
   - epoch weight and rewards.

The existing SDK wrapper target remains, but the introduction should explain that SDK calls support the mining inference flow.

### README

The README should recover the original concise positioning while updating facts:

- Start with `> Mining inference.`
- Describe ClawFarm as a protocol for production and exchange of AI inference on Solana.
- State that providers contribute capacity, buyers pay in USDC, and CLAF rewards follow finalized contribution.
- Include current devnet and Genesis mainnet target distinction.

### Protocol Data And Labels

`app/lib/protocol.ts` and public copy should use `CLAF` rather than `CLAW`.

Devnet mint addresses and balances may remain the same if the deployed mint address is unchanged, but the public symbol label should be `CLAF` unless chain metadata verification later proves otherwise.

## Verification Guard Design

Update `scripts/verify-site-content.mjs` so it supports the new approved narrative:

- Remove the `CLAF` stale-token guard.
- Add a public-copy guard for `CLAW` as the old site symbol.
- Allow `Mining inference`, `mining weight`, and `buyback-and-burn` when stage-labeled.
- Continue blocking direct per-call reward claims, such as `mines CLAF to your wallet` or `Every call mines CLAF to your wallet`.
- Continue blocking unqualified current-devnet claims about automated buyback, immutable upgrade authority, on-chain endpoint registry, and current dual-signed request/response proof flow.

## Non-Goals

- Do not change contract code.
- Do not implement buyback-and-burn.
- Do not implement SDK, CLI, or HTTP gateway behavior.
- Do not create live data fetching.
- Do not invent mainnet addresses or claim mainnet deployment exists.
- Do not use private RPC URLs, wallet paths, local machine paths, or credentials.

## Acceptance Criteria

- Homepage leads with `Mining inference.` and communicates the high-level mining economy before implementation details.
- Public token symbol is `CLAF` across homepage, docs, builders, providers, install, README, protocol labels, and examples.
- Current devnet implementation descriptions remain contract-aligned.
- Genesis mainnet target mechanisms are present where strategically important and clearly labeled as target mechanisms when not enabled on devnet.
- SDK examples remain wrapper targets aligned with the current devnet contract path.
- Verification guard permits approved mining narrative and blocks unsupported current-devnet claims.
- `npm run verify:site` passes.
- `npx tsc --noEmit` passes.
- `npm run build` is attempted; Google Fonts fetch timeout may remain an external blocker and should be reported separately if it recurs.

## Self-Review

- No placeholders or unresolved TODOs remain.
- Scope is focused on public narrative, labels, examples, protocol copy, and content verification guard behavior.
- The design distinguishes full protocol target from current devnet implementation.
- The design follows the approved symbol decision: CLAF is canonical for public copy.
- The design preserves contract accuracy for current devnet technical descriptions while restoring the high-level mining inference goal.
