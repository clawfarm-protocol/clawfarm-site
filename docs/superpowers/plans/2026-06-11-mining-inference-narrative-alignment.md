# Mining Inference Narrative Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore ClawFarm's public narrative to mining inference, switch the public token symbol to CLAF, and keep current devnet implementation details contract-aligned.

**Architecture:** The implementation is copy/data/guard focused. Public pages lead with the protocol target and Genesis mainnet design, while current devnet sections remain explicit about deployed receipt settlement, off-chain metadata, compact receipt hash proofs, USDC splits, epoch weight, and locked reward streams.

**Tech Stack:** Next.js 14 App Router, React Server Components, TypeScript, local content verification script, static README documentation.

---

## File Structure

- Modify `scripts/verify-site-content.mjs`: invert the token-symbol guard from CLAF-as-stale to CLAW-as-stale, preserve security/global scans, and add targeted unsupported-current-devnet claim guards.
- Modify `app/lib/protocol.ts`: change the public token symbol type and network labels from `CLAW` to `CLAF` while keeping existing mint addresses and numeric fields unchanged.
- Modify `app/page.tsx`: make the homepage hero and mining/economics/treasury sections lead with mining inference, CLAF rewards, staged Genesis target economics, and current devnet implementation boundaries.
- Modify `app/builders/page.tsx`: frame the buyer side as demand-side mining weight, use CLAF, and keep SDK examples as wrapper targets.
- Modify `app/providers/page.tsx`: frame the provider side as supply-side mining weight, use CLAF, and keep endpoint metadata explicitly off-chain.
- Modify `app/install/page.tsx`: frame provider onboarding as joining the mining network, use CLAF, and keep current devnet registration mechanics accurate.
- Modify `app/docs/page.tsx`: add a protocol-objective layer before SDK details, use CLAF, and distinguish Genesis target from current devnet subset.
- Modify `app/layout.tsx`, `app/client-layout.tsx`, and `app/state/page.tsx`: update metadata, footer copy, and state copy where the old settlement-first language or CLAW symbol appears.
- Modify `README.md`: restore concise mining-inference positioning and document the current-devnet versus Genesis-mainnet distinction.

## Task 1: Verification Guard Baseline

**Files:**
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Run the current guard and capture the expected failure**

Run:

```bash
npm run verify:site
```

Expected: FAIL. The output should include `stale token symbol: CLAF` if the approved design spec is scanned, plus current public `CLAW` copy is not yet blocked.

- [ ] **Step 2: Replace the public-copy guard block**

In `scripts/verify-site-content.mjs`, replace the current `publicCopyChecks` array with:

```js
const publicCopyChecks = [
  { name: 'stale public token symbol', pattern: /\bCLAW\b/ },
  { name: 'unqualified buyback language', pattern: /\b(Jupiter|execute_buyback|swap aggregator|incinerator|current devnet[^.\n]{0,140}buyback|buyback[^.\n]{0,140}current devnet)\b/i },
  { name: 'unqualified mainnet immutability', pattern: /\b(Genesis-immutable|deployer wallet keys discarded|current devnet[^.\n]{0,140}(immutable|upgrade authority renounced)|(immutable|upgrade authority renounced)[^.\n]{0,140}current devnet)\b/i },
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'direct per-call mining payout claim', pattern: /\b(Every call mines|each call mines|mines CLAF to your wallet|CLAF mined directly|direct per-call (CLAF )?reward)\b/i },
  { name: 'unsupported current-devnet registry or routing claim', pattern: /\b(current devnet[^.\n]{0,160}(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)|(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)[^.\n]{0,160}current devnet)\b/i },
  { name: 'unsupported current-devnet dual-signature claim', pattern: /\b(current devnet[^.\n]{0,180}(dual-signed|user and provider sign|request hash|response hash)|(dual-signed|user and provider sign|request hash|response hash)[^.\n]{0,180}current devnet)\b/i },
  { name: 'contract-native HTTP API example', pattern: /curl https:\/\/api\.clawfarm\.network\/v1\/devnet\/receipts/i },
  { name: 'endpoint-first provider registration', pattern: /\b(Register an endpoint|Register a wallet-backed endpoint|wallet-controlled endpoint|wallet-backed endpoint)\b/i },
  { name: 'one-step SDK receipt submit hides wrapper target', pattern: /receipts\.submit\(\{[\s\S]{0,600}\b(model|totalUsdc|total_usdc)\b/ },
  { name: 'old chained SDK receipt submit hides wrapper target', pattern: /\.receipts\(\)[\s\S]{0,400}\.model\(/ },
  { name: 'unframed provider CLI example', pattern: /npx clawfarm provider register/i },
]
```

- [ ] **Step 3: Run the guard and verify it fails on existing CLAW copy**

Run:

```bash
npm run verify:site
```

Expected: FAIL. The output should include one or more `stale public token symbol: CLAW` failures from `app/` or `README.md`.

- [ ] **Step 4: Commit the guard change**

Run:

```bash
git add scripts/verify-site-content.mjs
git commit -m "test: guard mining inference narrative copy"
```

Expected: commit succeeds and the working tree is clean except for later task changes.

## Task 2: Protocol Token Symbol Data

**Files:**
- Modify: `app/lib/protocol.ts`

- [ ] **Step 1: Update the token symbol type and values**

In `app/lib/protocol.ts`, change:

```ts
tokenSymbol: 'CLAW'
```

to:

```ts
tokenSymbol: 'CLAF'
```

and change both network values:

```ts
tokenSymbol: 'CLAF',
```

Keep the `MintAddresses` field name `claw` unchanged in this task to avoid broad component churn; it is an internal field name for the deployed reward mint address, not public copy.

- [ ] **Step 2: Type-check the protocol data change**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Run the guard**

Run:

```bash
npm run verify:site
```

Expected: FAIL until all public `CLAW` copy is updated in later tasks. No TypeScript errors should be introduced by this task.

- [ ] **Step 4: Commit the protocol data change**

Run:

```bash
git add app/lib/protocol.ts
git commit -m "fix: use CLAF public token symbol"
```

Expected: commit succeeds.

## Task 3: Homepage Narrative Rewrite

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite the hero copy**

In `app/page.tsx`, update the hero section to use this copy:

```tsx
<p className="hero-status">Devnet active . Mainnet Genesis pending . Solana</p>
<h1 className="hero-title">Mining inference.</h1>
<ProtocolStatusStrip />
<NetworkBadge />
<p className="hero-copy">
  ClawFarm turns paid AI inference into mining weight. Providers contribute capacity, buyers pay in USDC, and CLAF rewards follow finalized contribution.
</p>
```

Update the two role cards to:

```tsx
<small>Register a wallet-backed ProviderAccount. Finalized provider usage contributes to Provider Pool mining weight.</small>
```

and:

```tsx
<small>Prepare compact receipts through wrapper tools. Finalized paid usage contributes to Buyer Pool mining weight.</small>
```

- [ ] **Step 2: Rewrite the mining section**

In the mining section, keep the same JSX structure and update the intro, labels, and table heading:

```tsx
<SectionHeader eyebrow="Mining" title="Inference becomes mining weight." />
<p className="section-intro">
  Paid inference is the contribution event. Current devnet records that contribution through finalized receipt settlement; Genesis mainnet targets the full mining economy around a fixed CLAF cap.
</p>
```

Use these stat labels:

```tsx
<span>Provider Pool</span>
<span>Buyer Pool</span>
<span>CLAF cap</span>
<span>Current devnet lock</span>
```

Use these stat values:

```tsx
<p>70%</p>
<p>30%</p>
<p>1B</p>
<p>180 days</p>
```

Update the footnote to:

```tsx
Current devnet realizes mining weight through finalized receipt settlement rather than direct per-call token payouts. Mainnet Genesis timing and full target mechanics remain pending until mainnet config is deployed.
```

Update the mining event amount column to:

```tsx
<th className="num-col">CLAF amount</th>
```

- [ ] **Step 3: Rewrite treasury and economics copy**

Use this treasury intro:

```tsx
Genesis mainnet target: automated buyback-and-burn closes the cost-subsidy loop. Current devnet only books the 3% treasury USDC share when a receipt payment is recorded; automated buyback-and-burn is not enabled on devnet.
```

Use this key-list event stream value:

```tsx
Current devnet exposes no automated buyback-and-burn event stream.
```

Use this economics copy:

```tsx
<p>CLAF has a fixed 1B cap. Genesis mainnet targets the complete mining-inference economy; current devnet uses the deployed reward vault and epoch accounting for testing.</p>
```

```tsx
<p>USDC settlement is receipt-based. The provider share is held in pending revenue until receipt finalization.</p>
```

```tsx
<p>Reward claims create locked streams. Owners withdraw vested CLAF over the configured lock period.</p>
```

- [ ] **Step 4: Update provider CTA copy**

Change the provider action card paragraph to:

```tsx
Register a provider account. The protocol does not ask where capacity comes from. Provider-share USDC releases after receipt finalization, and finalized usage contributes to Provider Pool mining weight for CLAF rewards.
```

- [ ] **Step 5: Run the guard**

Run:

```bash
npm run verify:site
```

Expected: FAIL until remaining pages are updated. There should be no `CLAW` failures from `app/page.tsx`.

- [ ] **Step 6: Commit the homepage rewrite**

Run:

```bash
git add app/page.tsx
git commit -m "docs: restore homepage mining inference narrative"
```

Expected: commit succeeds.

## Task 4: Builders, Providers, And Install Pages

**Files:**
- Modify: `app/builders/page.tsx`
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`

- [ ] **Step 1: Update buyer-side mining copy**

In `app/builders/page.tsx`, set the hero title and copy to:

```tsx
<h1 className="hero-title">Create demand. Mine by usage.</h1>
<p className="hero-copy">
  Buyers contribute paid demand to the network. Finalized receipt-backed usage contributes to Buyer Pool mining weight for CLAF rewards.
</p>
```

Change the `Epoch pool weight` paragraph to:

```tsx
Finalized receipts add buyer-side weight to the epoch pool. Buyer rewards are claimed from finalized epoch accounting and stream as locked CLAF.
```

Change the SDK reference link to:

```tsx
<p className="interface-note">SDK reference: <a href="/docs#sdk-wrapper-target">/docs#sdk-wrapper-target →</a></p>
```

- [ ] **Step 2: Update provider-side mining copy**

In `app/providers/page.tsx`, update the third `mechanismBlocks` object to:

```ts
{
  label: 'CLAF CHALLENGE',
  title: 'Challenges use CLAF bonds.',
  body: 'A challenger posts the configured CLAF bond against a receipt during the challenge window. Rejected challenges burn the bond. Accepted challenges return the bond, refund provider-share USDC to the payer, apply reward-vault transfer and burn economics, and invalidate activated weight when applicable.',
},
```

Update the provider hero copy to:

```tsx
Providers contribute inference capacity to the mining network. Current devnet records finalized receipt usage as Provider Pool mining weight while endpoint, model, and pricing metadata stay off-chain.
```

- [ ] **Step 3: Update provider onboarding copy**

In `app/install/page.tsx`, update the first hero paragraph to:

```tsx
Register a provider wallet with the protocol. Publish endpoint and pricing metadata through an off-chain gateway or operator directory, serve requests, and receive provider-share USDC after receipt finalization. Finalized usage contributes provider-side mining weight for CLAF rewards.
```

Update the `Receive` paragraph to:

```tsx
After the receipt finalizes, provider-share Test USDC releases from the pending vault to your wallet. Provider-side epoch rewards are claimed from finalized epoch accounting and withdraw through locked CLAF streams.
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: the guard may still fail on other pages. TypeScript should pass.

- [ ] **Step 5: Commit page updates**

Run:

```bash
git add app/builders/page.tsx app/providers/page.tsx app/install/page.tsx
git commit -m "docs: align role pages with mining weight narrative"
```

Expected: commit succeeds.

## Task 5: Docs Page Layering

**Files:**
- Modify: `app/docs/page.tsx`

- [ ] **Step 1: Add the protocol objective section to the table of contents**

Change the beginning of `toc` to:

```ts
const toc = [
  ['Protocol objective', '#protocol-objective'],
  ['Quickstart', '#quickstart'],
  ['Install', '#install'],
  ['Configure devnet', '#configure-devnet'],
  ['SDK wrapper target', '#sdk-wrapper-target'],
```

- [ ] **Step 2: Rewrite docs metadata and hero**

Use:

```ts
description: 'Mining inference overview, devnet SDK wrapper targets, receipt lifecycle, and protocol economics for ClawFarm.',
```

and:

```tsx
<p className="page-copy">Mining inference overview, current devnet integration guides, and receipt-settlement implementation notes.</p>
```

- [ ] **Step 3: Insert the protocol objective section before quickstart**

Insert this section at the start of `<article className="docs-content">`:

```tsx
<section id="protocol-objective">
  <h2>Protocol objective</h2>
  <p>
    ClawFarm is mining inference: providers contribute capacity, buyers pay for inference in USDC, and CLAF rewards follow finalized contribution. Receipt settlement is the current mechanism shorthand, not the whole protocol story.
  </p>
  <div className="key-list">
    <div>Mining inference</div>
    <div>Paid usage becomes buyer-side and provider-side mining weight.</div>
    <div>Genesis mainnet target</div>
    <div>Fixed CLAF cap, Provider Pool 70%, Buyer Pool 30%, Genesis immutable launch target, and automated buyback-and-burn target.</div>
    <div>Current devnet subset</div>
    <div>Receipt settlement, provider pending USDC, epoch weight, challenge window, and locked reward streams.</div>
  </div>
</section>
```

- [ ] **Step 4: Replace public CLAW copy with CLAF**

In `app/docs/page.tsx`, replace public occurrences of `CLAW` with `CLAF`, including:

```tsx
ProviderAccount · Test USDC split · Epoch weight · Locked CLAF streams · Vault accounting
```

```tsx
8. Finalized epochs create locked CLAF streams for claimable rewards.
```

```tsx
<div>30% buyer-side CLAF pool and 70% provider-side CLAF pool by finalized epoch weight.</div>
```

```tsx
<div>Challenges are bonded in CLAF.</div>
```

```tsx
<div>CLAF mint</div><div className="mono">EW7npwHnVtTXvimde3Zj6dHX4mWbSAb5zkkHCrvkC8ui</div>
```

```tsx
<div>Challenge bond</div><div>Configured CLAF bond on devnet.</div>
```

- [ ] **Step 5: Run verification**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: the guard may still fail on layout, state, or README until later tasks. TypeScript should pass.

- [ ] **Step 6: Commit docs page updates**

Run:

```bash
git add app/docs/page.tsx
git commit -m "docs: add mining inference objective layer"
```

Expected: commit succeeds.

## Task 6: Metadata, State Copy, And README

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/client-layout.tsx`
- Modify: `app/state/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Update site metadata**

In `app/layout.tsx`, use:

```ts
description: 'The mining inference protocol for the AI economy.',
```

Set:

```ts
title: 'ClawFarm — Mining inference',
```

Use these keywords:

```ts
keywords: [
  'ClawFarm',
  'CLAF',
  'mining inference',
  'AI inference protocol',
  'permissionless AI',
  'Solana AI',
  'receipt settlement protocol',
  'AI inference mining',
],
```

Set OpenGraph and Twitter titles to `ClawFarm — Mining inference`, and set the Twitter description to:

```ts
description: 'A protocol for mining inference on Solana.',
```

- [ ] **Step 2: Update footer and state page copy**

In `app/client-layout.tsx`, change the footer line to:

```tsx
<p>Mining inference on Solana</p>
```

In `app/state/page.tsx`, change the claim row to:

```tsx
<div>After epoch finalization, participants claim locked reward streams and withdraw vested CLAF.</div>
```

- [ ] **Step 3: Replace `README.md` introduction and model section**

Use this introduction:

```md
# ClawFarm Site

> Mining inference.

ClawFarm is the official website for a Solana protocol that turns paid AI
inference into mining weight. Providers contribute capacity, buyers pay in USDC,
and CLAF rewards follow finalized contribution.

Current devnet is the active receipt-settlement subset: compact receipts,
Test USDC splits, provider pending revenue, challenges, epoch weight, and locked
reward streams. Genesis mainnet is the target full protocol layer: fixed CLAF
cap, Provider Pool 70%, Buyer Pool 30%, Genesis immutable launch target, and
automated buyback-and-burn target.
```

Use this model section:

```md
## Current Devnet Model

- Providers register a wallet-controlled ProviderAccount and stake 100 Test USDC on devnet.
- Wallet-paid inference is recorded through compact receipts, not direct per-call reward payouts.
- Receipt recording splits Test USDC into provider-pending revenue and treasury revenue.
- Provider-share USDC releases only after the receipt finalizes through the attestation lifecycle.
- Finalized receipts contribute buyer-side and provider-side mining weight for CLAF rewards.
- Epoch rewards are claimed into locked CLAF streams rather than paid directly per request.
- Challenges use CLAF bonds and can invalidate receipt economics when accepted.
```

- [ ] **Step 4: Run verification**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: PASS for both commands after all public `CLAW` copy has been removed from scanned public files.

- [ ] **Step 5: Commit metadata and README updates**

Run:

```bash
git add app/layout.tsx app/client-layout.tsx app/state/page.tsx README.md
git commit -m "docs: publish CLAF mining inference positioning"
```

Expected: commit succeeds.

## Task 7: Final Audit And Build Attempt

**Files:**
- Verify only unless a prior verification failure identifies a concrete file to fix.

- [ ] **Step 1: Scan for forbidden public copy**

Run:

```bash
npm run verify:site
rg -n "CLAW|api-key=|helius-rpc|PRIVATE KEY|seed phrase|mnemonic|[\u4e00-\u9fff]" app README.md scripts docs/superpowers/specs -S
```

Expected: no matches in `app`, `README.md`, or `scripts` except internal field names such as `challengeBondClaw`, `providerSlashClaw`, `emissionTotalClaw`, `rewardVaultClaw`, and `carryForwardClaw` in `app/lib/protocol.ts` or type-derived data names in components.

- [ ] **Step 2: Run final required checks**

Run:

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

Expected:

- `npm run verify:site`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: PASS unless `next/font/google` fails to fetch Google Fonts. If that network timeout recurs, record it as an external build blocker rather than a content or TypeScript regression.

- [ ] **Step 3: Inspect git diff**

Run:

```bash
git status --short
git diff --stat
git diff -- app README.md scripts/verify-site-content.mjs
```

Expected: only the intended narrative, CLAF label, and verification guard changes are present.

- [ ] **Step 4: Commit any final fixes**

If Step 2 or Step 3 required corrections, run:

```bash
git add app README.md scripts/verify-site-content.mjs
git commit -m "fix: finalize mining inference content audit"
```

Expected: commit succeeds. Skip this commit if there are no final corrections.

## Self-Review

- Spec coverage: Tasks 2-6 cover CLAF symbol migration, homepage narrative, role pages, docs layering, metadata, state copy, README, Genesis target language, and current devnet implementation boundaries. Task 1 covers the guard design. Task 7 covers acceptance verification.
- Placeholder scan: No task uses unresolved placeholders for implementation content. Example placeholder strings such as `<provider-wallet>` remain only inside public wrapper examples where they are intentional user-supplied values.
- Type consistency: `NetworkProfile.tokenSymbol` changes to `'CLAF'`; existing `*Claw` internal field names remain stable so component types do not require broad refactoring.
- Non-goals preserved: No contract code, SDK implementation, gateway implementation, live data fetching, mainnet address invention, private RPC URL, wallet path, or credential is introduced.
