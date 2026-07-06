# Whitepaper Target And Devnet V3 Data Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the whitepaper target narrative, technical copy, SDK examples, and network data so the site separates current devnet v3 implementation facts from mainnet target economics.

**Architecture:** Keep the existing Next.js app structure and static protocol profile. Regenerate the whitepaper PDF from `scripts/generate-whitepaper-v1.py`, refresh `app/lib/protocol.ts` with current devnet v3 public addresses and balances, and update page copy to label current devnet v3 versus mainnet target explicitly.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Node.js verification script, Python ReportLab whitepaper generation, Solana web3.js for one-time devnet reads from the contract deployment file.

---

## File Structure

- Read-only input: `docs/superpowers/specs/2026-07-06-whitepaper-v3-target-devnet-data-alignment-design.md` for the approved design.
- Read-only input: owner-provided whitepaper correction file for target whitepaper language.
- Read-only input: `../clawfarm-masterpool/deployments/devnet-masterpool-v3.json` for the devnet v3 deployment and RPC source.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/lib.rs` for v3 instruction names.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs` and `state/types.rs` for account and argument fields.
- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs`, `settlement.rs`, and `claim.rs` for current devnet implementation behavior.
- Modify: `app/lib/protocol.ts` for current devnet v3 profile data and type names.
- Modify: `app/components/ProtocolNetworkPanels.tsx` for current v3 network labels and metrics.
- Modify: `app/components/SettlementFeed.tsx` only if table headings or row fields need current v3 wording.
- Modify: `app/docs/page.tsx` for current devnet v3 parameters, mainnet target notes, and SDK wrapper examples.
- Modify: `app/page.tsx`, `app/builders/page.tsx`, `app/providers/page.tsx`, `app/install/page.tsx`, and `app/state/page.tsx` for current-versus-target public copy.
- Modify: `app/whitepaper/page.tsx` for target whitepaper summary copy.
- Modify: `scripts/generate-whitepaper-v1.py` for target whitepaper content and references.
- Modify: `scripts/verify-site-content.mjs` for context-aware target whitepaper guards.
- Generate: `public/whitepaper.pdf` from the updated generator.
- Modify: `README.md` if implementation-facing summary needs the refreshed v3 data distinction.
- Do not create files containing RPC URLs, API keys, wallet paths, local absolute paths, or private key material.

## Task 1: Guard And Baseline Audit

**Files:**
- Modify: `docs/superpowers/specs/2026-07-06-whitepaper-v3-target-devnet-data-alignment-design.md`
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Confirm clean branch state**

Run:

```bash
git status --short --branch
```

Expected: branch is `codex/whitepaper-v3-target-devnet-data` with only the approved spec correction and plan work in progress.

- [ ] **Step 2: Commit the spec path sanitization if not already committed**

Run:

```bash
rg -n "$(printf '/%s/' Users)|$(printf '/%s/' home)|$(printf '/%s/' root)|$(printf 'api-%s=' key)|$(printf 'helius-rpc%scom' .)" docs/superpowers/specs/2026-07-06-whitepaper-v3-target-devnet-data-alignment-design.md -S || true
```

Expected: no output.

If the spec file is modified, run:

```bash
git add docs/superpowers/specs/2026-07-06-whitepaper-v3-target-devnet-data-alignment-design.md
git commit -m "docs: sanitize whitepaper v3 alignment spec"
```

Expected: commit succeeds or there is nothing to commit.

- [ ] **Step 3: Split public-copy checks by context**

Edit `scripts/verify-site-content.mjs` so `publicCopyChecks` no longer treats every target whitepaper word as an error. Keep global checks unchanged. Replace the current broad unsupported buyback and immutability checks with two arrays:

```js
const currentDevnetCopyChecks = [
  { name: 'current devnet buyback claim', pattern: /current\s+(devnet|contract|masterpool)[\s\S]{0,120}\b(buyback|Raydium|LP|timelock|Squads)\b/i },
  { name: 'implemented treasury engine claim', pattern: /\b(masterpool v3|current v3|devnet v3)\b[\s\S]{0,140}\b(executes? swaps?|buy-and-burn|buy-and-add-LP|protocol-owned liquidity|Raydium CPMM)\b/i },
  { name: 'current devnet provider bond claim', pattern: /\b(current devnet|devnet v3|current v3)\b[\s\S]{0,120}\b(100 USDC bond|provider bond|upfront collateral)\b/i },
  { name: 'current devnet timelock claim', pattern: /\b(current devnet|devnet v3|current v3)\b[\s\S]{0,120}\b(48-hour timelock|24-hour timelock|Squads multisig)\b/i },
]

const legacyV2CopyChecks = [
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'old direct mining wording', pattern: /\b(mines CLAF to your wallet|CLAF mined)\b/i },
  { name: 'unsupported routing or registry wording', pattern: /\b(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)\b/i },
  { name: 'contract-native HTTP API example', pattern: /curl https:\/\/api\.clawfarm\.network\/v1\/devnet\/receipts/i },
  { name: 'endpoint-first provider registration', pattern: /\b(Register an endpoint|Register a wallet-backed endpoint|wallet-controlled endpoint|wallet-backed endpoint)\b/i },
  { name: 'one-step SDK receipt submit hides wrapper target', pattern: /receipts\.submit\(\{[\s\S]{0,600}\b(model|totalUsdc|total_usdc)\b/ },
  { name: 'old chained SDK receipt submit hides wrapper target', pattern: /\.receipts\(\)[\s\S]{0,400}\.model\(/ },
  { name: 'unframed provider CLI example', pattern: /npx clawfarm provider register/i },
  { name: 'v2 SubmitReceiptArgs in current public copy', pattern: /\bSubmitReceiptArgs\b/ },
  { name: 'v2 ReceiptEconomicRecord in current public copy', pattern: /\bReceiptEconomicRecord\b/ },
  { name: 'v2 attestation submit receipt in current public copy', pattern: /attestation\.submit_receipt/i },
  { name: 'v2 epoch cursor label in current public copy', pattern: /\bepoch cursor\b/i },
  { name: 'hard-coded v2 provider stake in current public copy', pattern: /\b100 Test USDC\b/i },
  { name: 'v2 challenge bond vault in current public copy', pattern: /\bchallenge[- ]bond vault\b/i },
  { name: 'v2 provider stake vault in current public copy', pattern: /\bprovider[- ]stake vault\b/i },
]

const publicCopyChecks = [...currentDevnetCopyChecks, ...legacyV2CopyChecks]
```

Keep `sourceRoots` as `['app', 'README.md', 'docs/superpowers/specs']`.

- [ ] **Step 4: Run the guard before content changes**

Run:

```bash
npm run verify:site
```

Expected: it may fail before all page copy is aligned. Record the failure names in the task notes and continue only if the failures are stale-copy failures, not global secret or path failures.

- [ ] **Step 5: Commit the guard update**

Run:

```bash
git add scripts/verify-site-content.mjs docs/superpowers/specs/2026-07-06-whitepaper-v3-target-devnet-data-alignment-design.md
git commit -m "chore: allow whitepaper target language with devnet guards"
```

Expected: commit succeeds.

## Task 2: Refresh Devnet V3 Protocol Data

**Files:**
- Modify: `app/lib/protocol.ts`
- Modify: `app/components/ProtocolNetworkPanels.tsx`

- [ ] **Step 1: Re-read current devnet data without persisting RPC credentials**

Run this one-time script from the site repo. It reads the contract deployment JSON at runtime and prints only public addresses, config fields, and balances:

```bash
node - <<'NODE'
const fs = require('fs')
const { Connection, PublicKey } = require('../clawfarm-masterpool/node_modules/@solana/web3.js')
const deploy = JSON.parse(fs.readFileSync('../clawfarm-masterpool/deployments/devnet-masterpool-v3.json', 'utf8'))
const conn = new Connection(deploy.rpcUrl, 'confirmed')
const pk = (value) => new PublicKey(value)
const readPk = (buf, offset) => [new PublicKey(buf.subarray(offset, offset + 32)).toBase58(), offset + 32]
const readI64 = (buf, offset) => [Number(buf.readBigInt64LE(offset)), offset + 8]
const readU64 = (buf, offset) => [buf.readBigUInt64LE(offset).toString(), offset + 8]
const readU16 = (buf, offset) => [buf.readUInt16LE(offset), offset + 2]
const readBool = (buf, offset) => [buf[offset] !== 0, offset + 1]
const fmtAtomic = (value, decimals) => {
  const raw = BigInt(value).toString().padStart(decimals + 1, '0')
  return `${raw.slice(0, -decimals)}.${raw.slice(-decimals)}`
}
function decodeConfig(buf) {
  let offset = 8
  const out = {}
  for (const key of ['authority', 'pauseAuthority', 'clawMint', 'usdcMint', 'rewardVault', 'treasuryUsdcVault', 'providerPendingUsdcVault']) {
    ;[out[key], offset] = readPk(buf, offset)
  }
  ;[out.epochDurationSeconds, offset] = readI64(buf, offset)
  ;[out.challengeWindowSeconds, offset] = readI64(buf, offset)
  ;[out.providerPoolShareBps, offset] = readU16(buf, offset)
  ;[out.buyerPoolShareBps, offset] = readU16(buf, offset)
  ;[out.providerStakeUsdcAtomic, offset] = readU64(buf, offset)
  ;[out.emissionAnchorTs, offset] = readI64(buf, offset)
  ;[out.emissionTotalClafAtomic, offset] = readU64(buf, offset)
  ;[out.emissionDurationSeconds, offset] = readI64(buf, offset)
  ;[out.taxRateBps, offset] = readU16(buf, offset)
  ;[out.pausePaymentRecording, offset] = readBool(buf, offset)
  ;[out.pauseSettlement, offset] = readBool(buf, offset)
  ;[out.pauseClaims, offset] = readBool(buf, offset)
  ;[out.createdAt, offset] = readI64(buf, offset)
  ;[out.updatedAt, offset] = readI64(buf, offset)
  out.providerStakeUsdc = fmtAtomic(out.providerStakeUsdcAtomic, 6)
  out.emissionTotalClaf = fmtAtomic(out.emissionTotalClafAtomic, 6)
  return out
}
async function main() {
  const [programInfo, configInfo] = await Promise.all([
    conn.getParsedAccountInfo(pk(deploy.masterpoolV3ProgramId)),
    conn.getAccountInfo(pk(deploy.config)),
  ])
  const config = decodeConfig(configInfo.data)
  const balances = {}
  for (const [key, address] of Object.entries(deploy.vaults)) {
    const balance = await conn.getTokenAccountBalance(pk(address))
    balances[key] = balance.value.uiAmountString
  }
  console.log(JSON.stringify({
    snapshotDate: new Date().toISOString().slice(0, 10),
    programExecutable: programInfo.value?.executable === true,
    programId: deploy.masterpoolV3ProgramId,
    configAddress: deploy.config,
    poolAuthority: deploy.poolAuthority,
    mints: deploy.mints,
    vaults: deploy.vaults,
    config,
    balances,
  }, null, 2))
}
main().catch((error) => { console.error(error.message); process.exit(1) })
NODE
```

Expected: JSON output with no RPC URL and no API key.

- [ ] **Step 2: Update protocol types**

In `app/lib/protocol.ts`, replace the legacy `ProgramAddresses`, `CoreAccounts`, `ProtocolConfigSnapshot`, and `VaultBalanceSnapshot` definitions with v3-oriented fields:

```ts
type ProgramAddresses = {
  masterpoolV3: NullableAddress
}

type CoreAccounts = {
  poolAuthority: NullableAddress
  masterpoolConfig: NullableAddress
  rewardVault: NullableAddress
  treasuryUsdcVault: NullableAddress
  providerPendingUsdcVault: NullableAddress
}

export type ProtocolConfigSnapshot = {
  masterpoolConfigVersion: string
  providerStakeUsdc: string
  taxRateBps: number
  providerEpochPoolShareBps: number
  buyerEpochPoolShareBps: number
  epochDurationSeconds: string
  challengeWindowSeconds: string
  emissionTotalClaf: string
  emissionDurationSeconds: string
  paymentRecordingPaused: boolean
  settlementPaused: boolean
  claimsPaused: boolean
  mainnetTargetEpochSeconds: string
}

export type VaultBalanceSnapshot = {
  rewardVaultClaf: string
  treasuryUsdc: string
  providerPendingUsdc: string
}
```

Update every reference in the file from `claw` to `claf` in type field names while keeping public token symbol `CLAF`.

- [ ] **Step 3: Update empty profiles**

In `app/lib/protocol.ts`, replace `emptyPrograms` and `emptyAccounts` with:

```ts
const emptyPrograms: ProgramAddresses = {
  masterpoolV3: null,
}

const emptyAccounts: CoreAccounts = {
  poolAuthority: null,
  masterpoolConfig: null,
  rewardVault: null,
  treasuryUsdcVault: null,
  providerPendingUsdcVault: null,
}
```

- [ ] **Step 4: Replace devnet profile data**

In `app/lib/protocol.ts`, replace the `devnet` profile object with current v3 data from the refreshed read. Use this structure and update balance values if the Step 1 read returned newer values:

```ts
  devnet: {
    id: 'devnet',
    label: 'Devnet',
    clusterLabel: 'Solana devnet',
    explorerCluster: 'devnet',
    status: 'active',
    statusText: 'Devnet v3 active',
    snapshotLabel: 'Devnet v3 snapshot read on 2026-07-06',
    tokenSymbol: 'CLAF',
    paymentMintLabel: 'Test USDC',
    programs: {
      masterpoolV3: '263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF',
    },
    mints: {
      claf: 'BstFT1KYuPntAzH6Z6mUBCzBGJXc6b6Ha6zKsG7bASYb',
      usdc: 'Pn9LRsXqH3Av44nrJGcAv22Js3iuaEhH36VKYfKTZQo',
    },
    accounts: {
      poolAuthority: '36Q2NicqLeS2a6vPc3G2g9nS7inrTQQL8azsY3suQwJ8',
      masterpoolConfig: '6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m',
      rewardVault: 'AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC',
      treasuryUsdcVault: 'EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS',
      providerPendingUsdcVault: 'BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ',
    },
    config: {
      masterpoolConfigVersion: '3',
      providerStakeUsdc: '0.000000',
      taxRateBps: 300,
      providerEpochPoolShareBps: 7000,
      buyerEpochPoolShareBps: 3000,
      epochDurationSeconds: '300',
      challengeWindowSeconds: '60',
      emissionTotalClaf: '1000000000.000000',
      emissionDurationSeconds: '157680000',
      paymentRecordingPaused: false,
      settlementPaused: false,
      claimsPaused: false,
      mainnetTargetEpochSeconds: '3600',
    },
    balances: {
      rewardVaultClaf: '999119000',
      treasuryUsdc: '14.296814',
      providerPendingUsdc: '5.55316',
    },
    epochCursor: null,
  },
```

- [ ] **Step 5: Update mainnet pending profile**

In the `mainnet` profile, keep `status: 'pending'`, but update text fields:

```ts
statusText: 'Mainnet target pending',
snapshotLabel: 'Mainnet target not deployed',
paymentMintLabel: 'USDC',
```

Keep programs, mints, accounts, config, balances, and epochCursor empty or null.

- [ ] **Step 6: Update protocol component references**

In `app/components/ProtocolNetworkPanels.tsx`, replace references to removed fields:

```tsx
profile.programs.masterpool
profile.programs.attestation
profile.mints.claw
profile.accounts.attestationConfig
profile.accounts.challengeBondVault
profile.accounts.providerStakeUsdcVault
profile.accounts.epochCursor
config.providerUsdcShareBps
config.treasuryUsdcShareBps
config.challengeBondClaw
config.providerSlashClaw
config.lockDays
config.halvingPeriodSeconds
config.receiptRecordingPaused
config.challengeProcessingPaused
config.finalizationPaused
config.genesisMinted
balances.rewardVaultClaw
balances.challengeBondVaultClaw
balances.providerStakeUsdc
```

Use these replacements:

```tsx
profile.programs.masterpoolV3
profile.mints.claf
config.taxRateBps
config.providerEpochPoolShareBps
config.buyerEpochPoolShareBps
config.mainnetTargetEpochSeconds
config.paymentRecordingPaused
config.settlementPaused
config.claimsPaused
balances.rewardVaultClaf
```

- [ ] **Step 7: Replace component row labels**

Use these labels in network surfaces:

```tsx
{ label: 'Masterpool v3 program', address: profile.programs.masterpoolV3 }
{ label: `${profile.tokenSymbol} mint`, address: profile.mints.claf }
{ label: 'Masterpool v3 config', address: profile.accounts.masterpoolConfig }
{ label: 'Pool authority', address: profile.accounts.poolAuthority }
{ label: 'Reward vault', address: profile.accounts.rewardVault }
{ label: 'Treasury USDC vault', address: profile.accounts.treasuryUsdcVault }
{ label: 'Provider pending USDC vault', address: profile.accounts.providerPendingUsdcVault }
```

Use these metrics:

```tsx
{ label: 'Payment tax cap', value: config ? formatBps(config.taxRateBps) : '-' }
{ label: 'Provider reward pool', value: config ? formatBps(config.providerEpochPoolShareBps) : '-' }
{ label: 'Buyer reward pool', value: config ? formatBps(config.buyerEpochPoolShareBps) : '-' }
{ label: 'Devnet epoch duration', value: config ? formatDurationSeconds(config.epochDurationSeconds) : '-' }
{ label: 'Target epoch duration', value: config ? formatDurationSeconds(config.mainnetTargetEpochSeconds) : '-' }
{ label: 'Challenge window', value: config ? formatDurationSeconds(config.challengeWindowSeconds) : '-' }
{ label: 'Provider stake transfer', value: config ? `${config.providerStakeUsdc} ${profile.paymentMintLabel}` : '-' }
{ label: 'Payment recording paused', value: config ? formatBoolean(config.paymentRecordingPaused) : '-' }
{ label: 'Settlement paused', value: config ? formatBoolean(config.settlementPaused) : '-' }
{ label: 'Claims paused', value: config ? formatBoolean(config.claimsPaused) : '-' }
```

- [ ] **Step 8: Run TypeScript check for data update**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS. If it fails, fix remaining renamed-field references and rerun until PASS.

- [ ] **Step 9: Commit devnet data refresh**

Run:

```bash
git add app/lib/protocol.ts app/components/ProtocolNetworkPanels.tsx
git commit -m "data: refresh devnet v3 protocol snapshot"
```

Expected: commit succeeds.

## Task 3: Align Technical Docs And SDK Examples

**Files:**
- Modify: `app/docs/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Add current-versus-target docs intro**

In `app/docs/page.tsx`, update the quickstart copy near the top to include this paragraph after the existing Solana-native wrapper paragraph:

```tsx
<p>
  This page separates current devnet v3 behavior from mainnet targets. Devnet v3 is live with 300-second epochs, a 60-second challenge window, a 3 percent payment-tax cap, zero upfront provider-stake transfer, and proof-based claims. The mainnet target keeps a 1-hour epoch, treasury split and buyback policy, bounded governance, and protocol-owned liquidity as whitepaper-level launch commitments.
</p>
```

- [ ] **Step 2: Update TypeScript SDK snippet**

Replace the TypeScript SDK code block with:

```tsx
<pre className="code-block"><code>{`const payment = await cf.payments.record({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  paymentDelegate,
  paymentIndex: 42n,
  paymentNonceHash,
  baseChargeUsdc: '0.025000',
  taxRateBps: 300,
  taxSweepThresholdAmount: 0n,
})

const settlement = await cf.epochs.commitSettlement({
  epochId: payment.epochId,
  usageRoot,
  providerRoot,
  buyerRoot,
  artifactHash,
  artifactUriHash,
  totals: payment.epochTotals,
  providerPoolClaf,
  buyerPoolClaf,
})

await cf.epochs.finalizeSettlement({ epochId: settlement.epochId })

await cf.epochs.claimProviderEpoch({
  epochId: settlement.epochId,
  leafIndex,
  totalProviderUsdc,
  providerWeight,
  providerClafReward,
  proof,
})

await cf.epochs.claimBuyerReward({
  epochId: settlement.epochId,
  leafIndex,
  buyerWeight,
  buyerClafReward,
  proof,
})`}</code></pre>
```

- [ ] **Step 3: Update Python SDK snippet**

Replace the Python SDK code block with:

```tsx
<pre className="code-block"><code>{`payment = cf.payments.record(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    payment_delegate=payment_delegate,
    payment_index=42,
    payment_nonce_hash=payment_nonce_hash,
    base_charge_usdc="0.025000",
    tax_rate_bps=300,
    tax_sweep_threshold_amount=0,
)

settlement = cf.epochs.commit_settlement(
    epoch_id=payment.epoch_id,
    usage_root=usage_root,
    provider_root=provider_root,
    buyer_root=buyer_root,
    artifact_hash=artifact_hash,
    artifact_uri_hash=artifact_uri_hash,
    totals=payment.epoch_totals,
    provider_pool_claf=provider_pool_claf,
    buyer_pool_claf=buyer_pool_claf,
)

cf.epochs.finalize_settlement(epoch_id=settlement.epoch_id)

cf.epochs.claim_provider_epoch(
    epoch_id=settlement.epoch_id,
    leaf_index=leaf_index,
    total_provider_usdc=total_provider_usdc,
    provider_weight=provider_weight,
    provider_claf_reward=provider_claf_reward,
    proof=proof,
)

cf.epochs.claim_buyer_reward(
    epoch_id=settlement.epoch_id,
    leaf_index=leaf_index,
    buyer_weight=buyer_weight,
    buyer_claf_reward=buyer_claf_reward,
    proof=proof,
)`}</code></pre>
```

- [ ] **Step 4: Update Rust SDK snippet**

Replace the Rust SDK code block with:

```tsx
<pre className="code-block"><code>{`let payment = cf.payments().record()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .payment_delegate(payment_delegate)
    .payment_index(42)
    .payment_nonce_hash(payment_nonce_hash)
    .base_charge_usdc("0.025000")
    .tax_rate_bps(300)
    .tax_sweep_threshold_amount(0)
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
    .provider_pool_claf(provider_pool_claf)
    .buyer_pool_claf(buyer_pool_claf)
    .send()
    .await?;

cf.epochs().finalize_settlement(settlement.epoch_id).send().await?;

cf.epochs().claim_provider_epoch()
    .epoch_id(settlement.epoch_id)
    .leaf_index(leaf_index)
    .total_provider_usdc(total_provider_usdc)
    .provider_weight(provider_weight)
    .provider_claf_reward(provider_claf_reward)
    .proof(proof.clone())
    .send()
    .await?;

cf.epochs().claim_buyer_reward()
    .epoch_id(settlement.epoch_id)
    .leaf_index(leaf_index)
    .buyer_weight(buyer_weight)
    .buyer_claf_reward(buyer_claf_reward)
    .proof(proof)
    .send()
    .await?;`}</code></pre>
```

- [ ] **Step 5: Update contract shape bullets**

In the contract shape / lifecycle section of `app/docs/page.tsx`, ensure these exact facts are present in English:

```tsx
<div>Current devnet v3 uses 300-second epochs for accelerated testing; the mainnet target is a 1-hour epoch.</div>
<div>record_payment_v3 accepts a payment nonce hash and tax_sweep_threshold_amount; current v3 stores payment identity through the bitmap and accumulator, while the sweep threshold is reserved for wrapper or future treasury handling.</div>
<div>Payment tax rate must be at least 50 bps and at or below GlobalConfigV3.tax_rate_bps.</div>
<div>commit_epoch_settlement_v3 stores provider_pool_claf and buyer_pool_claf supplied by the settlement artifact; current v3 does not compute emission on-chain.</div>
<div>Mainnet target treasury policy belongs to the whitepaper target layer, not the current devnet v3 masterpool settlement instruction set.</div>
```

- [ ] **Step 6: Update README summary**

In `README.md`, update the Phase 1 model bullets to include:

```md
- Current devnet v3 uses 300-second epochs for accelerated settlement testing; the mainnet target epoch is 1 hour.
- Masterpool v3 stores settlement roots and claim caps, while wrapper or indexer artifacts compute per-epoch CLAF pools.
- Whitepaper treasury and governance language describes mainnet target policy, not extra devnet masterpool instructions.
```

- [ ] **Step 7: Verify docs copy**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: both PASS or only failures already assigned to later whitepaper target updates.

- [ ] **Step 8: Commit technical docs alignment**

Run:

```bash
git add app/docs/page.tsx README.md
git commit -m "docs: distinguish devnet v3 from mainnet target"
```

Expected: commit succeeds.

## Task 4: Align Public Pages With Current And Target Layers

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/builders/page.tsx`
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`
- Modify: `app/state/page.tsx`
- Modify: `app/whitepaper/page.tsx`

- [ ] **Step 1: Update home hero technical line**

In `app/page.tsx`, replace any line saying `receipts` are recorded by the current implementation with:

```tsx
ClawFarm records wallet-paid inference payments, routes base Test USDC to provider pending revenue, and turns finalized epoch roots into CLAF reward claims.
```

- [ ] **Step 2: Update home treasury section**

In `app/page.tsx`, replace the treasury paragraph with:

```tsx
Every current devnet v3 payment uses a bounded payment tax rate. The tax moves to the treasury vault, while the base charge moves to provider pending revenue. The whitepaper target adds treasury split, buyback, burn, and protocol-owned-liquidity policy for mainnet; current devnet v3 does not execute swaps or LP actions from masterpool.
```

- [ ] **Step 3: Update home mining explanation**

In `app/page.tsx`, add this sentence to the mining or epoch reward section:

```tsx
Devnet v3 uses 300-second epochs for testing cadence; the mainnet target keeps 1-hour epochs without changing the total scheduled CLAF emission.
```

- [ ] **Step 4: Update builders page**

In `app/builders/page.tsx`, ensure the top copy includes:

```tsx
Any wallet can pay for a payment-record-backed inference request. Finalized devnet v3 roots carry buyer-side CLAF allocations, and the mainnet target keeps the same settlement shape with a 1-hour epoch cadence.
```

Replace any `receipt-backed` wording with `payment-record-backed`.

- [ ] **Step 5: Update providers page**

In `app/providers/page.tsx`, ensure provider registration copy includes:

```tsx
Current devnet v3 registration creates a ProviderAccountV3 without transferring upfront provider stake. The mainnet target may reintroduce provider bond economics as part of the launch policy, but current devnet v3 should be read as a zero-stake testing deployment.
```

- [ ] **Step 6: Update install page**

In `app/install/page.tsx`, update onboarding copy to include:

```tsx
Use the devnet v3 wrapper for current testing: register_provider_v3 creates the account, record_payment_v3 records wallet-paid usage, and finalized roots release provider USDC and CLAF. Mainnet target treasury and governance commitments are documented in the whitepaper and are not extra setup steps for the devnet provider wrapper.
```

- [ ] **Step 7: Update state page**

In `app/state/page.tsx`, update state dashboard intro copy to include:

```tsx
The network dashboard shows current devnet v3 addresses, vault balances, pause flags, and accelerated testing parameters. Mainnet target policy is intentionally separate from these live devnet fields.
```

- [ ] **Step 8: Update whitepaper page summary**

In `app/whitepaper/page.tsx`, replace the hero description with:

```tsx
A compact target draft for the protocol: supply neutrality, dual-signed proof, settlement, mining emission, treasury policy, governance scope, and launch commitments.
```

- [ ] **Step 9: Scan stale public page terms**

Run:

```bash
rg -n "receipt-backed|current devnet[\s\S]{0,120}(Raydium|buyback|LP|Squads|timelock)|100 Test USDC|provider-selected fee|daily epoch|24 hours \(UTC day\)" app README.md -S || true
```

Expected: no output, except whitepaper target text may contain buyback if it is clearly not current devnet copy.

- [ ] **Step 10: Verify and commit public page copy**

Run:

```bash
npm run verify:site
npx tsc --noEmit
git add app/page.tsx app/builders/page.tsx app/providers/page.tsx app/install/page.tsx app/state/page.tsx app/whitepaper/page.tsx
git commit -m "copy: separate devnet v3 state from target policy"
```

Expected: verification commands pass and commit succeeds.

## Task 5: Rewrite And Regenerate Whitepaper Target

**Files:**
- Modify: `scripts/generate-whitepaper-v1.py`
- Generate: `public/whitepaper.pdf`

- [ ] **Step 1: Update section 2 protocol records sentence**

In `scripts/generate-whitepaper-v1.py`, replace the first paragraph of section `2. What the protocol is` with:

```python
"ClawFarm is not a model lab, a cloud provider, an inference reseller, or a hosted application. It is a settlement protocol for inference calls. The protocol records provider registration, escrowed user funds, dual-signed usage proofs, settlement events, treasury inflows, treasury split events, mining rewards, burn events, and protocol-owned liquidity additions."
```

- [ ] **Step 2: Update section 3 optional treasury neutrality paragraph**

Append this paragraph to section `3. Supply neutrality`:

```python
"The treasury operates with the same neutrality. Buyback and add-LP slices are submitted by any wallet that pays gas; the program enforces the bounds, not the identity of the caller. Maintenance and infrastructure withdrawals can only flow to addresses declared at Genesis and have no power over the buyback engine."
```

- [ ] **Step 3: Update section 7 settlement treasury paragraph**

Replace the third paragraph of section `7. Settlement` with:

```python
"The protocol-fee inflow is split on-chain into three predetermined vaults at fixed ratios: 70 percent buyback, 20 percent maintenance, and 10 percent infrastructure. No discretionary allocation to a foundation, contributors, or marketing exists. The split, the recipient addresses, and the withdrawal paths are all set at Genesis and cannot be redirected."
```

Keep the first two settlement paragraphs unless a later review decides to rewrite provider-selected fee tiers in the target whitepaper. The target whitepaper can keep provider-selected tiers as target economics even though current devnet v3 uses a bounded payment tax rate.

- [ ] **Step 4: Update section 8 mining no-allocation paragraph**

Append this sentence to the second paragraph of section `8. Mining and emission`:

```python
" No portion of the schedule is pre-allocated to any party. The team participates in mining only as a settling consumer or provider, on the same terms as any other wallet. Where team-mined CLAF is used for initial pool seeding in Appendix A, it is surrendered to the pool and the resulting LP is burned, ensuring the team retains no claim to that liquidity."
```

- [ ] **Step 5: Replace section 9 treasury paragraphs**

Replace all paragraphs under `9. Treasury and burn` with this target text, using `Each epoch` rather than `Each daily epoch`:

```python
"The protocol treasury receives the provider-selected fee from every settlement in USDC. The allowed fee tiers range from 0.5 percent to 3.0 percent in 0.5 percent increments.",
"Each epoch, accumulated USDC is split deterministically: 70 percent to a buyback vault, 20 percent to a maintenance vault, and 10 percent to an infrastructure vault. The split is enforced on-chain and the split crank is permissionless.",
"The buyback vault drives two non-discretionary actions against the CLAF/USDC liquidity pool: buy-and-burn and buy-and-add-LP. Buy-and-burn removes CLAF from circulation. Buy-and-add-LP buys CLAF with treasury USDC, then deposits the bought CLAF plus an equal share of treasury USDC into the pool; the minted LP tokens are sent to a code-locked vault from which the protocol has no withdrawal path. The split between the two actions is a function of the pool's liquidity ratio L = pool TVL / circulating market cap, with a target band that prefers add-LP when L is below target and burn when L is above target.",
"Slices within a treasury execution window are randomized in count, size, and timing within bounds enforced on-chain: min and max slice size, min interval, cumulative cap, and min-out slippage tolerance. Randomization is sampled from a CSPRNG and submitted through bundled execution where available, to limit predictability and frontrunning. The on-chain swap is a direct CPI to a constant-product pool program; the swap instruction is composed off-chain so a different pool program can be substituted without contract changes.",
"The maintenance vault and infrastructure vault fund the operational and infrastructure costs that keep settlement, indexing, and challenge handling available. Both vaults pay out only to addresses fixed at Genesis and recorded on-chain.",
"No human trigger initiates a buyback. An epoch is opened by anyone; slices are executed by anyone; the split crank is called by anyone. The maintenance and infrastructure vaults are the only paths where an authorized address moves funds out of the treasury, and those addresses can withdraw only to themselves.",
```

- [ ] **Step 6: Insert section 9a Anti-MEV**

Insert a new `SECTIONS` item immediately after section `9. Treasury and burn`:

```python
(
    "9a. Anti-MEV",
    [
        "Two layers protect buyback execution from frontrunning and price manipulation: per-slice min-out and randomized timing and size.",
        "Every swap instruction enforces a minimum CLAF output, computed off-chain from the current pool reserves using the same constant-product math the on-chain pool program runs. The maximum slippage tolerance is a configurable parameter bounded by the admin. A swap that would receive less than the min-out reverts on-chain.",
        "Within each treasury execution window, slice count, individual size, and firing times are drawn from a CSPRNG and constrained by on-chain bounds: min and max slice size, min interval, and cumulative cap. Adjacent slices respect the min interval. Where bundled execution is available, slices are submitted in private bundles to limit mempool visibility.",
        "A minimum pool liquidity threshold prevents buyback during periods of thin or drained liquidity. The threshold is admin-tunable and starts at a conservative floor relative to the seed pool size.",
        "The protocol does not consult an external price oracle. Adding an on-chain oracle as a third defense layer was considered and deferred: at launch the pool is shallow enough that a pool-derived TWAP is itself cheaply manipulable, and CLAF has no independent oracle feed. The composition of min-out, randomized execution, and liquidity floor is the operating defense; an external oracle may be added later if it becomes practical.",
    ],
),
```

- [ ] **Step 7: Replace section 12 governance**

Change the section title from `12. Immutability` to `12. Governance scope`. Replace its paragraphs with:

```python
"The protocol distinguishes between structural and operational state. Structural state — mints, vault addresses, fee split ratios, the recipient addresses for maintenance and infrastructure, the PDA seeds, and the program ID — is fixed at Genesis and cannot be changed by any party after deployment.",
"Operational state — epoch timing, slice size bounds, slippage tolerance, minimum pool liquidity threshold, and minimum buyback threshold — is bounded and can be tuned by an admin multisig. The admin has no authority over fund flows beyond withdrawing the maintenance and infrastructure vault balances to their pre-declared recipients. The admin has no authority over the buyback vault, the CLAF holding vault, or the protocol-owned liquidity vault.",
"Two multisigs hold authority at Genesis. An upgrade multisig holds program upgrade authority; all upgrades pass through an on-chain timelock with a 48-hour delay before they can execute. An admin multisig holds the bounded operational role above and also serves as the recipient address for the maintenance and infrastructure vaults; admin actions that affect fund flow pass through a 24-hour timelock. Both timelock durations and both multisig memberships are publicly visible on-chain.",
"An emergency pause exists. It is set and lifted by the admin multisig in its pauser role and is exempt from timelock to preserve its emergency function. Pause halts the buyback engine only; it cannot redirect, withdraw, or otherwise move funds. The pause role is renounceable: a single transaction permanently removes pause capability from the protocol.",
"The protocol does not commit to renouncing upgrade authority. A settlement protocol that custodies user USDC and operates against external DEX liquidity must retain the ability to patch safety-critical bugs. Renouncement would convert any future bug into a permanent loss for users. The trust model is bounded by structural immutability, on-chain timelocks, public multisig execution, and acknowledged launch-period signer trust assumptions.",
"During the launch period, signers on both multisigs are members of the founding team. This is acknowledged as a trust assumption: signer diversity expands over time, but the protocol is not fully trustless on day one and does not claim to be.",
"The protocol has no team allocation in the emission schedule and no investor allocation. Rewards follow settled contribution. A separate cold-start commitment describes how initial pool liquidity is provided by team-mined CLAF and immediately surrendered.",
```

- [ ] **Step 8: Add section 15 cold-start commitment**

Insert this section before `14. Conclusion`, then renumber conclusion to `15. Conclusion` if keeping cold start as section `14`, or keep conclusion as `14` and add `15. Cold-start commitment` before it only if table of contents order remains correct. Use this final order: `13. Security limits`, `14. Cold-start commitment`, `15. Conclusion`.

Cold-start section:

```python
(
    "14. Cold-start commitment",
    [
        "CLAF launches with no pre-mined allocation and no pre-existing market. The protocol bootstraps initial liquidity by mining 10,000,000 CLAF, 1.0 percent of total supply, through ordinary settlement participation by the team's own wallets, on the same emission terms as any other participant. This portion is publicly verifiable on-chain.",
        "The mined CLAF is paired with 5,000 USDC of team-provided capital, creating a Raydium CPMM pool at an initial fully diluted valuation of 500,000 USDC and an opening price of 0.0005 USDC per CLAF.",
        "The LP tokens received from pool creation are burned. The team retains no claim on the seed liquidity. The 5,000 USDC and 10,000,000 CLAF become permanent pool depth that supports all subsequent buyback and add-LP activity.",
        "Once revenue begins, treasury buyback adds further protocol-owned liquidity through the code-locked vault described in Section 9. Pool depth therefore grows with protocol usage, independent of any team or investor sales.",
    ],
),
```

Update the existing conclusion title to:

```python
"15. Conclusion"
```

- [ ] **Step 9: Update parameters table**

Replace the affected `PARAMETERS` rows with:

```python
("Default epoch length", "1 hour"),
("Treasury fee split", "70 percent buyback / 20 percent maintenance / 10 percent infrastructure"),
("Buyback action mix", "Dynamic by liquidity ratio L = pool TVL / circulating market cap; target L = 17.5 percent. Cold start fixed at 70 percent add-LP / 30 percent burn until L exceeds target."),
("DEX", "Raydium CPMM constant-product pool. Swap and deposit are composed off-chain and executed through treasury-controlled instructions."),
("Min buyback threshold", "10 USDC at cold start; 100 USDC at steady state"),
("Min slice size", "1 USDC at cold start; 50 USDC at steady state"),
("Max slice size", "5,000 USDC"),
("Min slice interval", "30 seconds"),
("Slippage tolerance", "0.5 percent, configurable through bounded admin controls"),
("Min pool liquidity", "0 at deploy; raised to 5,000 USDC after pool seeding; intended to ratchet up"),
("Protocol-owned liquidity", "LP minted by buy-and-add-LP is sent to a code-locked vault with no withdrawal path"),
("Initial pool seeding", "5,000 USDC + 10,000,000 CLAF, with seed LP burned at pool creation"),
("Provider bond", "100 USDC mainnet target"),
("Challenge mechanism", "Permissionless bond and slash target"),
("Upgrade authority", "Upgrade multisig at Genesis, threshold 4-of-5, not renounced; upgrades pass through a 48-hour on-chain timelock"),
("Admin / governance", "Admin multisig at Genesis, threshold 3-of-5, bounded to operational parameters; fund-affecting actions pass through a 24-hour on-chain timelock"),
("Emergency pause", "Admin multisig pauser role, timelock-exempt, scoped to buyback engine, cannot move funds, renounceable"),
("Maintenance recipient", "Admin multisig; maintenance vault withdraws only to itself"),
("Infrastructure recipient", "Admin multisig; infrastructure vault withdraws only to itself"),
("Total multisigs at Genesis", "Two: upgrade and admin"),
("Timelock durations", "Upgrades 48 hours; admin fund-affecting actions 24 hours; pause exempt"),
```

Remove old rows for `Treasury disposition`, `Treasury threshold`, `Swap slippage cap`, `Swap volume cap`, `Upgrade authority` old value, and `Admin / governance` old value.

- [ ] **Step 10: Update references**

Replace the Jupiter reference with:

```python
"Raydium. Constant Product AMM program documentation.",
```

- [ ] **Step 11: Update abstract if needed**

In `abstract_text`, keep settlement and emission concise, but add this sentence before the final source-blind sentence:

```python
"The target treasury policy routes protocol fees through predetermined buyback, maintenance, and infrastructure paths."
```

- [ ] **Step 12: Generate the whitepaper PDF**

Run:

```bash
python3 scripts/generate-whitepaper-v1.py
```

Expected: `public/whitepaper.pdf` is regenerated successfully.

- [ ] **Step 13: Verify generated PDF exists and changed**

Run:

```bash
ls -lh public/whitepaper.pdf
git diff --stat -- scripts/generate-whitepaper-v1.py public/whitepaper.pdf
```

Expected: PDF exists and both generator and PDF are changed.

- [ ] **Step 14: Commit whitepaper target update**

Run:

```bash
git add scripts/generate-whitepaper-v1.py public/whitepaper.pdf
git commit -m "docs: update whitepaper target policy"
```

Expected: commit succeeds.

## Task 6: Final Verification And Delivery Audit

**Files:**
- All changed files.

- [ ] **Step 1: Run site verification**

Run:

```bash
npm run verify:site
```

Expected: PASS.

- [ ] **Step 2: Run TypeScript verification**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: PASS. If a remote font fetch fails, capture the exact error and verify it is unrelated to content or TypeScript.

- [ ] **Step 4: Run stale-copy scan**

Run:

```bash
rg -n "SubmitReceiptArgs|ReceiptEconomicRecord|attestation\.submit_receipt|100 Test USDC|provider-stake vault|challenge-bond vault|receipt-backed|daily epoch|24 hours \(UTC day\)|upgrade authority renounced|renounced at Genesis|Jupiter" app README.md scripts/generate-whitepaper-v1.py -S || true
```

Expected: no output except no `Jupiter` at all.

- [ ] **Step 5: Run safety scan without embedding sensitive literals in files**

Run:

```bash
rg -n "[\u4e00-\u9fff]|$(printf '/%s/' Users)|$(printf '/%s/' home)|$(printf '/%s/' root)|$(printf 'api-%s=' key)|$(printf 'helius-rpc%scom' .)|BEGIN (RSA|OPENSSH|PRIVATE) KEY|seed phrase|mnemonic|access token|auth token|wallet\.json|id\.json|\.config/solana" README.md app docs/superpowers scripts public --glob '!public/whitepaper.pdf' -S || true
```

Expected: no output.

- [ ] **Step 6: Review changed file list**

Run:

```bash
git status --short --branch
git diff --name-only HEAD~8..HEAD 2>/dev/null || git diff --name-only
git diff --stat
```

Expected: changed files are limited to planned site, docs, script, and generated PDF files.

- [ ] **Step 7: Run whitespace check**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 8: Final commit if needed**

If any verification-only fixes were made after the task commits, run:

```bash
git add README.md app docs/superpowers scripts public/whitepaper.pdf
git commit -m "chore: finalize whitepaper v3 alignment"
```

Expected: commit succeeds or there is nothing to commit.

- [ ] **Step 9: Report completion**

Final response must include:

```text
Branch: codex/whitepaper-v3-target-devnet-data
Verification: npm run verify:site, npx tsc --noEmit, npm run build
Key result: whitepaper states mainnet target policy; technical pages state current devnet v3 status and 1-hour mainnet target epoch; devnet data refreshed without storing RPC credentials.
```
