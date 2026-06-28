# Masterpool V3 Technical Copy Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align public technical website copy with the latest `clawfarm_masterpool_v3` contract implementation without changing whitepaper content or static network data.

**Architecture:** Keep the existing Next.js page and component structure. Update only implementation-facing copy, SDK wrapper snippets, technical state labels, and content guards so the public site describes masterpool v3 payment recording, epoch settlement roots, challenges, and Merkle claims. Leave `app/lib/protocol.ts` network addresses and snapshot values unchanged, but relabel related surfaces so they do not claim to be the latest v3 deployment data.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, static TypeScript protocol profile, custom Node.js content verification script.

---

## File Structure

- Read-only input: `docs/superpowers/specs/2026-06-28-masterpool-v3-technical-copy-alignment-design.md` for the approved scope.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/lib.rs` for instruction names.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs` for v3 account names.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/types.rs` for v3 argument names.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs` for payment recording semantics.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/settlement.rs` for epoch settlement and challenge semantics.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/claim.rs` for Merkle claim semantics.
- Modify: `app/docs/page.tsx` for SDK examples, contract shape, lifecycle, economics, challenges, devnet parameter wording, and reproducibility commands.
- Modify: `app/builders/page.tsx` for builder-facing v3 payment and settlement wording.
- Modify: `app/providers/page.tsx` for provider-facing v3 registration, pending balance, and Merkle claim wording.
- Modify: `app/install/page.tsx` for install/onboarding v3 wrapper wording and config-driven stake language.
- Modify: `app/page.tsx` for home page technical labels that still imply v2 receipt records.
- Modify: `app/state/page.tsx` for receipt lifecycle wording that should become v3 payment and epoch settlement wording.
- Modify: `app/components/ProtocolNetworkPanels.tsx` for neutral snapshot labels while static network data remains unchanged.
- Modify: `app/components/SettlementFeed.tsx` only if table field names still describe v2 provider-share split rather than base charge and protocol tax.
- Modify: `README.md` for implementation-facing v3 summary.
- Modify: `scripts/verify-site-content.mjs` for v3 regression guards.
- Do not modify: `app/lib/protocol.ts`.
- Do not modify: `app/whitepaper/page.tsx`.
- Do not modify: `scripts/generate-whitepaper-v1.py`.
- Do not modify: `public/*.pdf`.

## Task 1: Baseline And Contract Fact Audit

**Files:**
- Read: `docs/superpowers/specs/2026-06-28-masterpool-v3-technical-copy-alignment-design.md`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/lib.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/types.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/settlement.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/claim.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/provider.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/config.rs`

- [ ] **Step 1: Confirm worktree state**

Run:

```bash
git status --short --branch
git -C ../clawfarm-masterpool status --short --branch
```

Expected: site branch is an isolated implementation branch such as `codex/masterpool-v3-technical-copy`, with no uncommitted site changes. Contract branch may be ahead of its remote, but it must not have uncommitted files that make source inspection ambiguous.

- [ ] **Step 2: Inspect v3 instruction and account names**

Run:

```bash
sed -n '1,120p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/lib.rs
sed -n '1,160p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs
sed -n '90,170p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/types.rs
```

Expected findings recorded in implementation notes, not committed as a new file:

```text
Program: clawfarm_masterpool_v3.
Instructions: initialize_masterpool_v3, register_provider_v3, record_payment_v3, commit_epoch_settlement_v3, open_epoch_settlement_challenge_v3, accept_epoch_settlement_challenge_v3, reject_epoch_settlement_challenge_v3, finalize_epoch_settlement_v3, claim_provider_epoch_v3, claim_buyer_epoch_reward_v3.
Accounts: GlobalConfigV3, ProviderAccountV3, EpochPaymentAccumulator, EpochPaymentBitmap, EpochSettlementBatch, EpochSettlementChallenge, EpochSettlementRoot, EpochClaimBitmap.
Args: RecordPaymentV3Args, CommitEpochSettlementV3Args, OpenEpochSettlementChallengeV3Args, ClaimProviderEpochV3Args, ClaimBuyerEpochRewardV3Args.
```

- [ ] **Step 3: Inspect v3 payment, settlement, and claim semantics**

Run:

```bash
sed -n '1,220p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs
sed -n '1,220p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/settlement.rs
sed -n '1,220p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/claim.rs
```

Expected findings recorded in implementation notes, not committed as a new file:

```text
record_payment_v3 validates payer token owner, USDC mint, payment delegate, active provider, and config tax rate.
record_payment_v3 transfers tax to treasury and base charge to provider pending vault.
record_payment_v3 updates EpochPaymentAccumulator, EpochPaymentBitmap, and ProviderAccountV3.pending_provider_usdc.
commit_epoch_settlement_v3 creates EpochSettlementBatch from accumulator-matching aggregate totals and Merkle roots after the epoch has ended.
open_epoch_settlement_challenge_v3 invalidates a pending batch and records evidence hashes.
reject_epoch_settlement_challenge_v3 restores the batch to pending.
finalize_epoch_settlement_v3 creates EpochSettlementRoot after the challenge deadline.
claim_provider_epoch_v3 and claim_buyer_epoch_reward_v3 verify Merkle proofs and mark EpochClaimBitmap entries.
```

- [ ] **Step 4: Run baseline verification**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: both pass before implementation begins. If they fail, record the exact failure and stop before editing copy.

## Task 2: Add V3 Regression Guard

**Files:**
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Add v3 guard patterns**

In `scripts/verify-site-content.mjs`, add these checks to `publicCopyChecks` after the existing provider CLI guard and before any broad stale-language guards:

```js
  { name: 'v2 SubmitReceiptArgs in current public copy', pattern: /\bSubmitReceiptArgs\b/ },
  { name: 'v2 ReceiptEconomicRecord in current public copy', pattern: /\bReceiptEconomicRecord\b/ },
  { name: 'v2 attestation submit receipt in current public copy', pattern: /attestation\.submit_receipt/i },
  { name: 'v2 epoch cursor label in current public copy', pattern: /\bepoch cursor\b/i },
  { name: 'hard-coded v2 provider stake in current public copy', pattern: /\b100 Test USDC\b/i },
  { name: 'v2 challenge bond vault in current public copy', pattern: /\bchallenge[- ]bond vault\b/i },
  { name: 'v2 provider stake vault in current public copy', pattern: /\bprovider[- ]stake vault\b/i },
```

Do not add `scripts/generate-whitepaper-v1.py` or `docs/superpowers/plans` to `sourceRoots`.

- [ ] **Step 2: Run guard to confirm it fails before copy alignment**

Run:

```bash
npm run verify:site
```

Expected: FAIL with one or more of these check names:

```text
v2 SubmitReceiptArgs in current public copy
v2 ReceiptEconomicRecord in current public copy
v2 attestation submit receipt in current public copy
v2 epoch cursor label in current public copy
hard-coded v2 provider stake in current public copy
v2 challenge bond vault in current public copy
v2 provider stake vault in current public copy
```

This failure is expected and proves the guard catches current stale public copy. Do not commit this task by itself.

## Task 3: Align Documentation Page To V3

**Files:**
- Modify: `app/docs/page.tsx`
- Test: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Replace the quickstart paragraph**

In `app/docs/page.tsx`, replace the first paragraph under `<section id="quickstart">` with:

```tsx
<p>
  The devnet contract path is Solana-native. SDK examples on this page are wrapper targets: the wrapper must build payment indexes, payment nonce hashes, payer token delegates, epoch PDAs, Merkle settlement artifacts, and masterpool v3 accounts before sending transactions.
</p>
```

- [ ] **Step 2: Replace the SDK wrapper target intro**

Replace the paragraph under `<section id="sdk-wrapper-target">` with:

```tsx
<p>
  A contract-aligned wrapper records wallet-paid usage through masterpool v3, then settles ended epochs through aggregate roots and Merkle claims.
</p>
```

- [ ] **Step 3: Replace TypeScript SDK example**

Replace the TypeScript code block in `app/docs/page.tsx` with:

```tsx
<pre className="code-block"><code>{`const payment = await cf.payments.record({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  paymentDelegate,
  paymentIndex: 42n,
  paymentNonce,
  baseChargeUsdc: '0.025000',
  taxRateBps: 300,
})

const settlement = await cf.epochs.commitSettlement({
  epochId: payment.epochId,
  usageRoot,
  providerRoot,
  buyerRoot,
  artifactHash,
  artifactUriHash,
  totals: payment.epochTotals,
})

await cf.epochs.finalizeSettlement({ epochId: settlement.epochId })

const claim = await cf.epochs.claimBuyerReward({
  epochId: settlement.epochId,
  leafIndex,
  buyerWeight,
  buyerClafReward,
  proof,
})`}</code></pre>
```

- [ ] **Step 4: Replace Python SDK example**

Replace the Python code block in `app/docs/page.tsx` with:

```tsx
<pre className="code-block"><code>{`payment = cf.payments.record(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    payment_delegate=payment_delegate,
    payment_index=42,
    payment_nonce=payment_nonce,
    base_charge_usdc="0.025000",
    tax_rate_bps=300,
)

settlement = cf.epochs.commit_settlement(
    epoch_id=payment.epoch_id,
    usage_root=usage_root,
    provider_root=provider_root,
    buyer_root=buyer_root,
    artifact_hash=artifact_hash,
    artifact_uri_hash=artifact_uri_hash,
    totals=payment.epoch_totals,
)

cf.epochs.finalize_settlement(epoch_id=settlement.epoch_id)

claim = cf.epochs.claim_buyer_reward(
    epoch_id=settlement.epoch_id,
    leaf_index=leaf_index,
    buyer_weight=buyer_weight,
    buyer_claf_reward=buyer_claf_reward,
    proof=proof,
)`}</code></pre>
```

- [ ] **Step 5: Replace Rust SDK example**

Replace the Rust code block in `app/docs/page.tsx` with:

```tsx
<pre className="code-block"><code>{`let payment = cf.payments().record()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .payment_delegate(payment_delegate)
    .payment_index(42)
    .payment_nonce(payment_nonce)
    .base_charge_usdc("0.025000")
    .tax_rate_bps(300)
    .send()
    .await?;

let settlement = cf.epochs().commit_settlement()
    .epoch_id(payment.epoch_id)
    .usage_root(usage_root)
    .provider_root(provider_root)
    .buyer_root(buyer_root)
    .artifact_hash(artifact_hash)
    .artifact_uri_hash(artifact_uri_hash)
    .totals(payment.epoch_totals)
    .send()
    .await?;

cf.epochs().finalize_settlement(settlement.epoch_id).send().await?;

let claim = cf.epochs().claim_buyer_reward()
    .epoch_id(settlement.epoch_id)
    .leaf_index(leaf_index)
    .buyer_weight(buyer_weight)
    .buyer_claf_reward(buyer_claf_reward)
    .proof(proof)
    .send()
    .await?;`}</code></pre>
```

- [ ] **Step 6: Replace current contract shape section**

Replace the body of `<section id="current-contract-shape">` with this content:

```tsx
<h2>Current devnet contract shape</h2>
<p>
  The SDK wrapper target maps to `clawfarm_masterpool_v3`. The current masterpool records payments directly, accumulates epoch totals, commits settlement roots, and verifies Merkle proofs for claims. Model IDs, endpoint metadata, and price metadata remain off-chain inputs to wrapper artifacts.
</p>
<div className="key-list">
  <div>RecordPaymentV3Args</div>
  <div>payment_index, payment_nonce_hash, base_charge_atomic, tax_rate_bps, and tax_sweep_threshold_amount.</div>
  <div>Payment recording</div>
  <div>The payer token delegate authorizes gross payment. Tax transfers to treasury, base charge transfers to provider pending, and the epoch accumulator records base, tax, gross, and payment count.</div>
  <div>Payment bitmap</div>
  <div>EpochPaymentBitmap marks payment indexes so the same payment index cannot be reused inside an epoch chunk.</div>
  <div>Epoch settlement</div>
  <div>After an epoch ends, the wrapper commits usage, provider, and buyer Merkle roots plus aggregate totals into an EpochSettlementBatch.</div>
  <div>Claims</div>
  <div>Finalized EpochSettlementRoot accounts release provider USDC and CLAF rewards through provider and buyer Merkle proofs.</div>
</div>
```

- [ ] **Step 7: Replace gateway wrapper example**

In `<section id="gateway-wrapper-target">`, replace the paragraph and JSON code block with:

```tsx
<p>
  A gateway API may collect usage metadata, but it must create or return Solana transactions that follow the current masterpool v3 shape. It is not a contract-native REST endpoint.
</p>
<pre className="code-block"><code>{`POST /devnet/payment-transactions
{
  "providerWallet": "<provider-wallet>",
  "payer": "<payer-wallet>",
  "payerUsdcToken": "<payer-usdc-token>",
  "paymentIndex": "42",
  "paymentNonce": "<client-generated-nonce>",
  "metadata": {
    "model": "model-l-001",
    "unit": "tokens"
  },
  "baseChargeUsdc": "0.025000",
  "taxRateBps": 300
}`}</code></pre>
<p>
  The gateway wrapper response should contain a transaction or signing payload for `record_payment_v3`. Epoch settlement wrappers later commit aggregate roots and claim proofs.
</p>
```

- [ ] **Step 8: Replace protocol architecture and smart contract text**

Replace the architecture code block in `<section id="protocol">` with:

```tsx
<pre className="code-block"><code>{`WALLET / APP LAYER
  Users · Builders · Agents · Provider operators

OFF-CHAIN DIRECTORY
  Provider choices · Model labels · Endpoint metadata · Price metadata

MASTERPOOL V3 PAYMENT LAYER
  ProviderAccountV3 · EpochPaymentAccumulator · EpochPaymentBitmap · Treasury and provider pending vaults

EPOCH SETTLEMENT LAYER
  EpochSettlementBatch · EpochSettlementChallenge · EpochSettlementRoot · EpochClaimBitmap · Merkle proof claims`}</code></pre>
```

Replace the smart contracts key-list entries with:

```tsx
<div className="key-list">
  <div>clawfarm-masterpool-v3</div>
  <div>Records payments, accumulates epoch totals, commits settlement roots, handles epoch settlement challenges, and verifies provider or buyer claim proofs.</div>
  <div>ProviderAccountV3</div>
  <div>Stores provider wallet, pending provider USDC, status, and timestamps.</div>
  <div>EpochPaymentAccumulator</div>
  <div>Stores epoch payment count plus total base, tax, and gross USDC recorded through masterpool v3.</div>
  <div>EpochSettlementRoot</div>
  <div>Stores finalized usage, provider, and buyer roots, aggregate totals, CLAF pools, claimed totals, and finalization timestamp.</div>
</div>
```

- [ ] **Step 9: Replace lifecycle code block**

Replace the receipt lifecycle code block with:

```tsx
<pre className="code-block"><code>{`1. Wallet authorizes bounded Test USDC settlement through a payer token delegate.
2. App or gateway prepares payment_index, payment_nonce_hash, base_charge_atomic, and tax_rate_bps.
3. Masterpool v3 records payment, transfers tax to treasury, transfers base charge to provider pending, and marks the epoch payment bitmap.
4. Epoch payment accumulator stores payment count plus total base, tax, and gross USDC.
5. After the epoch ends, an authorized submitter commits usage, provider, and buyer Merkle roots into an EpochSettlementBatch.
6. Settlement challenges may invalidate a pending batch until accepted or rejected by authority.
7. After the challenge deadline, finalization writes an EpochSettlementRoot.
8. Providers and buyers claim USDC or CLAF with Merkle proofs against the finalized root.`}</code></pre>
```

- [ ] **Step 10: Replace economics and challenge technical text**

In the Phase 1 economics key-list, replace the entries with:

```tsx
<div className="key-list">
  <div>Payment tax</div>
  <div>Masterpool v3 computes tax from the configured tax_rate_bps. The current payment must pass that configured rate, and gross payment equals base charge plus tax.</div>
  <div>Provider pending</div>
  <div>Base charge moves to the provider pending vault during payment recording and is released through provider Merkle claims after epoch settlement finalizes.</div>
  <div>Epoch roots</div>
  <div>Ended epochs settle through usage, provider, and buyer roots plus aggregate base, tax, and gross totals.</div>
  <div>Pool split</div>
  <div>Finalized settlement roots carry provider and buyer CLAF pools for Merkle proof claims.</div>
  <div>Claim protection</div>
  <div>EpochClaimBitmap accounts prevent repeated provider or buyer claims for the same epoch leaf.</div>
</div>
```

In the challenges key-list, replace the entries with:

```tsx
<div className="key-list">
  <div>Challenge scope</div>
  <div>Challenges apply to pending EpochSettlementBatch accounts before finalization.</div>
  <div>Open challenge</div>
  <div>Opening a challenge invalidates the pending batch and stores evidence hashes in an EpochSettlementChallenge account.</div>
  <div>Rejected challenge</div>
  <div>The authority rejects the challenge and restores the batch to pending so it can finalize after the challenge deadline.</div>
  <div>Accepted challenge</div>
  <div>The authority accepts the challenge and closes the invalidated batch and challenge accounts.</div>
</div>
```

- [ ] **Step 11: Replace devnet parameters technical list**

In the Devnet parameters key-list, remove hard-coded v2 program IDs and account names from the docs page and replace that list with:

```tsx
<div className="key-list">
  <div>Cluster</div><div>Solana devnet</div>
  <div>Masterpool implementation</div><div>clawfarm_masterpool_v3</div>
  <div>Program source</div><div>Latest implementation facts derive from the sibling clawfarm-masterpool repository.</div>
  <div>Provider stake</div><div>Config-driven in GlobalConfigV3; the website network profile is not refreshed in this pass.</div>
  <div>Payment tax</div><div>Config-driven in GlobalConfigV3 and validated by record_payment_v3.</div>
  <div>Epoch settlement</div><div>Uses accumulator totals, payment bitmaps, settlement batches, challenges, finalized roots, and claim bitmaps.</div>
</div>
```

- [ ] **Step 12: Replace reproducibility command**

Replace the devnet state check command with:

```tsx
<pre className="code-block"><code>{`yarn phase1:v3:bootstrap:testnet --help`}</code></pre>
```

Keep the contract build code block unchanged.

- [ ] **Step 13: Run docs-focused stale term scan**

Run:

```bash
rg -n "SubmitReceiptArgs|ReceiptEconomicRecord|attestation\.submit_receipt|epoch cursor|100 Test USDC|challenge-bond vault|provider-stake vault" app/docs/page.tsx -S || true
```

Expected: no output.

## Task 4: Align Public Page Technical Copy

**Files:**
- Modify: `app/builders/page.tsx`
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/state/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Update builder page stale technical copy**

In `app/builders/page.tsx`, replace these paragraphs exactly where they appear:

```tsx
<p>Finalized receipts add buyer-side weight to the epoch pool. Buyer rewards are claimed from finalized epoch accounting and stream as locked CLAF.</p>
```

with:

```tsx
<p>Finalized epoch roots carry buyer-side CLAF allocations. Buyer rewards are claimed through Merkle proofs against the finalized root.</p>
```

Replace:

```tsx
<p>Each submitted receipt creates an economic record with Test USDC split snapshots, challenge timing, and buyer/provider weight. Provider-share USDC remains pending until finalization.</p>
```

with:

```tsx
<p>Each recorded payment updates epoch totals and a payment bitmap. Provider base-charge USDC remains pending until epoch settlement finalizes and provider claims verify against the root.</p>
```

Replace:

```tsx
<p className="card-meta">Receipt payment uses configured payer token accounts and delegated transfer authority in the attestation flow.</p>
```

with:

```tsx
<p className="card-meta">Payment recording uses configured payer token accounts and delegated transfer authority in masterpool v3.</p>
```

- [ ] **Step 2: Update providers page technical cards**

In `app/providers/page.tsx`, update the `providerCards` bodies to:

```ts
body: 'Masterpool v3 records payment facts that bind payer, provider wallet, payment nonce hash, base Test USDC charge, configured tax rate, and epoch accounting. Epoch roots become the source of truth for provider and buyer claims.',
```

```ts
body: 'Wallet-paid Test USDC moves in two transfers at record time: tax moves into the treasury vault and base charge moves into the provider-pending vault. Provider USDC releases through provider Merkle claims after epoch settlement finalizes.',
```

```ts
body: 'Settlement challenges apply to pending epoch batches. Accepted challenges close invalid batches; rejected challenges restore batches so they can finalize after the challenge deadline.',
```

- [ ] **Step 3: Update install page v3 wording**

In `app/install/page.tsx`, replace the hero copy paragraph with:

```tsx
<p className="page-copy">
  Register a provider wallet with masterpool v3. Publish endpoint and pricing metadata through an off-chain gateway or operator directory, serve requests, and receive provider USDC through finalized epoch Merkle claims. Finalized usage contributes provider-side mining weight for CLAF rewards.
</p>
```

Replace the stat cell that displays `100 Test USDC` with:

```tsx
<p className="stat-value">Config-driven</p>
<p className="stat-desc">provider stake in GlobalConfigV3</p>
```

Replace the receive step paragraph with:

```tsx
<p>
  After epoch settlement finalizes, provider base-charge Test USDC and provider-side CLAF rewards release through Merkle proof claims against the finalized settlement root.
</p>
```

- [ ] **Step 4: Update home page technical sentences**

In `app/page.tsx`, replace any sentence that says provider USDC releases directly after receipt finalization with:

```text
Provider USDC releases after epoch settlement finalizes and the provider claim verifies against the finalized root.
```

Replace any sentence that frames current devnet as receipt finalization with:

```text
Current technical implementation records payments through masterpool v3 and settles ended epochs through aggregate roots and Merkle claims.
```

Do not change high-level Mining inference, Genesis target, buyback-and-burn target, or CLAF cap language.

- [ ] **Step 5: Update state page lifecycle wording**

In `app/state/page.tsx`, replace the `key-list` under receipt lifecycle with:

```tsx
<div className="key-list">
  <div>Record</div>
  <div>Masterpool v3 records base charge, tax, payer delegate authority, provider account, epoch totals, and payment bitmap state.</div>
  <div>Commit</div>
  <div>After an epoch ends, aggregate totals and usage/provider/buyer roots are committed into an EpochSettlementBatch.</div>
  <div>Challenge</div>
  <div>Pending settlement batches can be challenged before finalization; accepted challenges close invalid batches and rejected challenges restore pending status.</div>
  <div>Claim</div>
  <div>Finalized EpochSettlementRoot accounts release provider USDC and provider or buyer CLAF through Merkle proof claims.</div>
</div>
```

- [ ] **Step 6: Update README implementation summary**

In `README.md`, replace the current devnet model bullet list with:

```markdown
- Providers register wallet-controlled ProviderAccountV3 records.
- Wallet-paid inference is recorded as masterpool v3 payment records, not direct per-call reward payouts.
- Payment recording transfers configured tax to treasury and base charge to provider-pending revenue.
- Ended epochs settle through aggregate totals, settlement roots, and Merkle proof claims.
- Finalized roots contribute buyer-side and provider-side mining weight for CLAF rewards.
- Provider USDC and CLAF rewards are claimed from finalized epoch settlement roots.
- Settlement challenges operate on pending epoch batches before finalization.
```

Keep the README title, high-level description, site structure, development, verification, deploy, and community sections unchanged.

- [ ] **Step 7: Run public copy stale term scan**

Run:

```bash
rg -n "SubmitReceiptArgs|ReceiptEconomicRecord|attestation\.submit_receipt|epoch cursor|100 Test USDC|challenge-bond vault|provider-stake vault" app README.md -S || true
```

Expected: no output.

## Task 5: Neutralize Static Network Snapshot Labels

**Files:**
- Modify: `app/components/ProtocolNetworkPanels.tsx`
- Modify: `app/components/SettlementFeed.tsx`

- [ ] **Step 1: Rename current status strip epoch label**

In `app/components/ProtocolNetworkPanels.tsx`, replace:

```tsx
<span>Epoch: <data>{epoch?.latestKnownEpoch ?? '-'}</data></span>
```

with:

```tsx
<span>Snapshot epoch: <data>{epoch?.latestKnownEpoch ?? '-'}</data></span>
```

- [ ] **Step 2: Rename activity row labels**

In `app/components/ProtocolNetworkPanels.tsx`, replace:

```ts
{ label: 'Latest known epoch', value: formatPending(profile.epochCursor?.latestKnownEpoch) },
{ label: 'Latest finalized epoch', value: formatPending(profile.epochCursor?.latestFinalizedEpoch) },
```

with:

```ts
{ label: 'Snapshot epoch', value: formatPending(profile.epochCursor?.latestKnownEpoch) },
{ label: 'Snapshot finalized epoch', value: formatPending(profile.epochCursor?.latestFinalizedEpoch) },
```

Also replace the same `Latest known epoch` and `Latest finalized epoch` labels in the `overview` metric list with `Snapshot epoch` and `Snapshot finalized epoch`.

- [ ] **Step 3: Rename v2-only vault labels**

In `app/components/ProtocolNetworkPanels.tsx`, replace the address row labels:

```ts
{ label: 'Challenge bond vault', address: profile.accounts.challengeBondVault },
{ label: 'Provider stake USDC vault', address: profile.accounts.providerStakeUsdcVault },
{ label: 'Epoch cursor', address: profile.accounts.epochCursor },
```

with:

```ts
{ label: 'Legacy challenge account', address: profile.accounts.challengeBondVault },
{ label: 'Legacy stake account', address: profile.accounts.providerStakeUsdcVault },
{ label: 'Legacy epoch account', address: profile.accounts.epochCursor },
```

- [ ] **Step 4: Rename treasury snapshot challenge label**

In `TreasurySnapshot`, replace:

```ts
{ label: 'Challenge bond vault', value: balances ? `${balances.challengeBondVaultClaw} ${profile.tokenSymbol}` : '-' },
```

with:

```ts
{ label: 'Legacy challenge balance', value: balances ? `${balances.challengeBondVaultClaw} ${profile.tokenSymbol}` : '-' },
```

- [ ] **Step 5: Ensure settlement table uses v3-neutral labels**

In `app/components/SettlementFeed.tsx`, if the row type still uses `providerSplit` and `protocolSplit`, rename fields to `baseCharge` and `protocolTax`, and replace table headers with:

```tsx
<th className="num-col">Base charge</th>
<th className="num-col">Protocol tax</th>
```

If the component already uses equivalent base-charge and receipt-tax labels, keep its behavior unchanged.

- [ ] **Step 6: Confirm protocol data file is unchanged**

Run:

```bash
git diff -- app/lib/protocol.ts
```

Expected: no output.

## Task 6: Verify Guard, Types, Build, And Commit

**Files:**
- Modify: `scripts/verify-site-content.mjs`
- Modify: `app/docs/page.tsx`
- Modify: `app/builders/page.tsx`
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/state/page.tsx`
- Modify: `app/components/ProtocolNetworkPanels.tsx`
- Modify: `app/components/SettlementFeed.tsx` if needed
- Modify: `README.md`

- [ ] **Step 1: Run required content guard**

Run:

```bash
npm run verify:site
```

Expected: PASS.

- [ ] **Step 2: Run stale v2 public-copy scan**

Run:

```bash
rg -n "SubmitReceiptArgs|ReceiptEconomicRecord|attestation\.submit_receipt|epoch cursor|100 Test USDC|challenge-bond vault|provider-stake vault" app README.md -S || true
```

Expected: no output.

- [ ] **Step 3: Run safety scan**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
home_markers = ['/' + 'Users' + '/', '/' + 'home' + '/', '/' + 'root' + '/']
rpc_markers = ['api' + '-key=', 'helius' + '-rpc']
signing_markers = ['private' + ' ' + 'key', 'seed' + ' ' + 'phrase', 'mne' + 'monic']
patterns = [
    ('Chinese text', lambda text: any('\u4e00' <= char <= '\u9fff' for char in text)),
    ('local home path', lambda text: any(marker in text for marker in home_markers)),
    ('RPC credential marker', lambda text: any(marker in text.lower() for marker in rpc_markers)),
    ('private signing marker', lambda text: any(marker in text.lower() for marker in signing_markers)),
]
paths = [Path('app'), Path('README.md'), Path('scripts')]
failures = []
for root in paths:
    files = [root] if root.is_file() else [p for p in root.rglob('*') if p.is_file() and p.suffix not in {'.png', '.pdf'}]
    for file in files:
        text = file.read_text(errors='ignore')
        for name, predicate in patterns:
            if predicate(text):
                failures.append(f'{file}: {name}')
if failures:
    print('\n'.join(failures))
    raise SystemExit(1)
print('safety scan passed')
PY
```

Expected:

```text
safety scan passed
```

- [ ] **Step 4: Run TypeScript and production build**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 5: Confirm excluded files are untouched**

Run:

```bash
git diff --name-only -- app/lib/protocol.ts app/whitepaper/page.tsx scripts/generate-whitepaper-v1.py public
```

Expected: no output.

- [ ] **Step 6: Review final diff**

Run:

```bash
git diff --stat
git diff -- app README.md scripts/verify-site-content.mjs
```

Expected: diff only contains technical copy, neutral snapshot labels, and verification guard changes. It must not include whitepaper edits, network data edits, RPC URLs, private operator data, or faucet instructions.

- [ ] **Step 7: Commit implementation**

Run:

```bash
git add app README.md scripts/verify-site-content.mjs
git commit -m "docs: align technical copy with masterpool v3"
```

Expected: commit succeeds.

## Self-Review

- Spec coverage: Tasks cover v3 docs, SDK wrapper examples, builder/provider/install/home/state technical copy, neutral network snapshot labels, content guards, verification, and exclusions for whitepaper and static network data.
- Scope check: This is a single website content and guard update. It does not require decomposition because it intentionally avoids live data refresh and UI redesign.
- No unresolved markers: All steps include exact files, commands, expected results, and concrete replacement text.
- Type consistency: The plan does not add new exported TypeScript types. It changes text and labels only, except optional row-field rename in `SettlementFeed` if stale fields still exist.
- Safety check: The plan avoids writing RPC URLs, secrets, local paths, faucet tooling, or private operator data. It explicitly checks excluded whitepaper and static network files remain untouched.
