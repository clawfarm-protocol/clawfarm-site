# Contract-Driven Devnet Snapshot Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh public website protocol content and static devnet snapshot data from the latest `../clawfarm-masterpool` contract code and read-only devnet chain state, without exposing development/test tooling or secrets.

**Architecture:** Use a local-only sanitized chain-read step to produce public-safe snapshot data, then update the website's static protocol profile and protocol-facing copy. Keep the existing Mining inference narrative and UI style; add verification guard coverage so stale contract facts, faucet/test tooling, RPC secrets, and live/realtime snapshot claims cannot regress.

**Tech Stack:** Next.js 14 App Router, React, TypeScript, Solana Web3.js, Anchor IDL decoding via the sibling contract repository, SPL Token account reads, local content verification script.

---

## File Structure

- Read-only input: `../clawfarm-masterpool/programs/clawfarm-masterpool/src/**` and `../clawfarm-masterpool/programs/clawfarm-attestation/src/**` for latest instruction/account semantics.
- Read-only input: `../clawfarm-masterpool/target/idl/clawfarm_masterpool.json` and `../clawfarm-masterpool/target/idl/clawfarm_attestation.json` for account decoding.
- Read-only input: `../clawfarm-masterpool/deployments/devnet-phase1.json` for current devnet program IDs, public mints, core PDAs, and a local-only RPC URL.
- Temporary output: `/tmp/clawfarm-devnet-public-snapshot.json` for sanitized public-safe chain data. This file is not committed.
- Modify: `app/lib/protocol.ts` for static devnet profile, snapshot timestamp, config, balances, and epoch cursor.
- Modify: `app/components/ProtocolNetworkPanels.tsx` only if labels need to distinguish static snapshot values from realtime state.
- Modify: `app/page.tsx`, `app/docs/page.tsx`, `app/builders/page.tsx`, `app/providers/page.tsx`, `app/install/page.tsx`, `app/state/page.tsx`, and `README.md` only where contract drift is found.
- Modify: `scripts/verify-site-content.mjs` to guard against faucet/test tooling exposure, static snapshot live/realtime claims, stale contract semantics, RPC/API-key leakage, and SDK examples missing current receipt fields.

## Task 1: Contract And Chain-State Audit

**Files:**
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool/src/lib.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool/src/state/accounts.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool/src/instructions/receipt.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-masterpool/src/utils.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-attestation/src/lib.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-attestation/src/state/accounts.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-attestation/src/state/types.rs`
- Read: `../clawfarm-masterpool/programs/clawfarm-attestation/src/instructions/receipt.rs`
- Read: `../clawfarm-masterpool/Anchor.toml`
- Read: `../clawfarm-masterpool/deployments/devnet-phase1.json`

- [ ] **Step 1: Confirm clean site and contract worktrees**

Run:

```bash
git status --short --branch
git -C ../clawfarm-masterpool status --short --branch
```

Expected:

```text
## develop...origin/develop [ahead 1]
## codex/local-phase1-devnet-rollout...origin/codex/local-phase1-devnet-rollout
```

If the exact ahead count differs because the plan commit was pushed or additional reviewed commits exist, continue only when both worktrees have no uncommitted file entries.

- [ ] **Step 2: Inspect latest contract facts**

Run:

```bash
sed -n '1,220p' ../clawfarm-masterpool/programs/clawfarm-masterpool/src/lib.rs
sed -n '1,180p' ../clawfarm-masterpool/programs/clawfarm-masterpool/src/state/accounts.rs
sed -n '40,90p' ../clawfarm-masterpool/programs/clawfarm-masterpool/src/instructions/receipt.rs
sed -n '250,270p' ../clawfarm-masterpool/programs/clawfarm-masterpool/src/utils.rs
sed -n '1,140p' ../clawfarm-masterpool/programs/clawfarm-attestation/src/lib.rs
sed -n '1,120p' ../clawfarm-masterpool/programs/clawfarm-attestation/src/state/types.rs
sed -n '40,90p' ../clawfarm-masterpool/programs/clawfarm-attestation/src/instructions/receipt.rs
```

Expected findings to record in the implementer's notes, not in a committed file:

```text
Masterpool program declares current devnet program ID.
Attestation program declares current devnet program ID.
SubmitReceiptArgs includes request_nonce_hash, metadata_hash, prompt_tokens, completion_tokens, charge_atomic, tax_rate_bps, receipt_hash.
Compact receipt hash includes tax_rate_bps.
Masterpool record_receipt_payment treats total_usdc_paid/charge_atomic as base charge, computes tax from tax_rate_bps, debits base plus tax, transfers base to provider pending, transfers tax to treasury.
Supported tax_rate_bps values are 5, 10, 15, 20, 25, 30.
Faucet instructions exist but are development/testing tooling and must not be exposed publicly.
```

- [ ] **Step 3: Verify deployment record public addresses without printing RPC URL**

Run:

```bash
node <<'NODE'
const { readFileSync } = require('node:fs')
const deployment = JSON.parse(readFileSync('../clawfarm-masterpool/deployments/devnet-phase1.json', 'utf8'))
const publicFields = {
  cluster: deployment.cluster,
  masterpoolProgramId: deployment.masterpoolProgramId,
  attestationProgramId: deployment.attestationProgramId,
  clawMint: deployment.clawMint,
  testUsdcMint: deployment.testUsdcMint,
  poolAuthority: deployment.poolAuthority,
  masterpoolConfig: deployment.masterpoolConfig,
  attestationConfig: deployment.attestationConfig,
  rewardVault: deployment.rewardVault,
  challengeBondVault: deployment.challengeBondVault,
  treasuryUsdcVault: deployment.treasuryUsdcVault,
  providerStakeUsdcVault: deployment.providerStakeUsdcVault,
  providerPendingUsdcVault: deployment.providerPendingUsdcVault,
  createdAt: deployment.createdAt,
}
console.log(JSON.stringify(publicFields, null, 2))
NODE
```

Expected: output contains public program, mint, and vault addresses only. It must not contain `rpcUrl`, an RPC hostname, or an API key.

- [ ] **Step 4: Commit audit notes only if tracked code was changed**

Run:

```bash
git status --short
```

Expected: no tracked changes. Do not commit anything for this task.

## Task 2: Read Sanitized Devnet Snapshot

**Files:**
- Temporary create: `/tmp/read-clawfarm-devnet-snapshot.mjs`
- Temporary create: `/tmp/clawfarm-devnet-public-snapshot.json`
- Read: `../clawfarm-masterpool/deployments/devnet-phase1.json`
- Read: `../clawfarm-masterpool/target/idl/clawfarm_masterpool.json`
- Read: `../clawfarm-masterpool/target/idl/clawfarm_attestation.json`

- [ ] **Step 1: Create a local-only sanitized chain reader**

Run:

```bash
cat > /tmp/read-clawfarm-devnet-snapshot.mjs <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const contractRequire = createRequire(`${process.cwd()}/../clawfarm-masterpool/package.json`)
const anchor = contractRequire('@coral-xyz/anchor')
const { PublicKey } = contractRequire('@solana/web3.js')
const { getAccount, getMint } = contractRequire('@solana/spl-token')

const deployment = JSON.parse(readFileSync('../clawfarm-masterpool/deployments/devnet-phase1.json', 'utf8'))
const masterpoolIdl = JSON.parse(readFileSync('../clawfarm-masterpool/target/idl/clawfarm_masterpool.json', 'utf8'))
const attestationIdl = JSON.parse(readFileSync('../clawfarm-masterpool/target/idl/clawfarm_attestation.json', 'utf8'))

masterpoolIdl.address = deployment.masterpoolProgramId
attestationIdl.address = deployment.attestationProgramId

const connection = new anchor.web3.Connection(deployment.rpcUrl, 'confirmed')
const readonlyWallet = {
  publicKey: PublicKey.default,
  signTransaction: async () => { throw new Error('read-only snapshot script must not sign transactions') },
  signAllTransactions: async () => { throw new Error('read-only snapshot script must not sign transactions') },
}
const provider = new anchor.AnchorProvider(connection, readonlyWallet, { commitment: 'confirmed' })
const masterpool = new anchor.Program(masterpoolIdl, provider)
const attestation = new anchor.Program(attestationIdl, provider)

const publicKey = (value) => new PublicKey(value)
const asString = (value) => value == null ? null : value.toString()
const booleanOf = (value) => Boolean(value)
const tokenAmount = (amount, decimals) => {
  const raw = BigInt(amount.toString())
  const scale = 10n ** BigInt(decimals)
  const whole = raw / scale
  const fraction = raw % scale
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`
}

async function fetchTokenAmount(address, decimals) {
  const account = await getAccount(connection, publicKey(address), 'confirmed')
  return tokenAmount(account.amount, decimals)
}

async function main() {
  const readAt = new Date()
  const masterpoolConfig = await masterpool.account.globalConfig.fetch(publicKey(deployment.masterpoolConfig))
  const attestationConfig = await attestation.account.config.fetch(publicKey(deployment.attestationConfig))
  const epochCursorPda = PublicKey.findProgramAddressSync([Buffer.from('epoch_cursor')], publicKey(deployment.masterpoolProgramId))[0]
  const epochCursor = await masterpool.account.epochCursor.fetch(epochCursorPda)
  const clawMint = await getMint(connection, publicKey(deployment.clawMint), 'confirmed')
  const usdcMint = await getMint(connection, publicKey(deployment.testUsdcMint), 'confirmed')

  const snapshot = {
    readAtIso: readAt.toISOString(),
    snapshotLabel: `Devnet snapshot read on ${readAt.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC')}`,
    deploymentCreatedAt: deployment.createdAt,
    programs: {
      masterpool: deployment.masterpoolProgramId,
      attestation: deployment.attestationProgramId,
    },
    mints: {
      claw: deployment.clawMint,
      usdc: deployment.testUsdcMint,
    },
    accounts: {
      poolAuthority: deployment.poolAuthority,
      masterpoolConfig: deployment.masterpoolConfig,
      attestationConfig: deployment.attestationConfig,
      rewardVault: deployment.rewardVault,
      challengeBondVault: deployment.challengeBondVault,
      treasuryUsdcVault: deployment.treasuryUsdcVault,
      providerStakeUsdcVault: deployment.providerStakeUsdcVault,
      providerPendingUsdcVault: deployment.providerPendingUsdcVault,
      epochCursor: epochCursorPda.toBase58(),
    },
    config: {
      masterpoolConfigVersion: String(masterpoolConfig.version),
      providerStakeUsdc: tokenAmount(masterpoolConfig.providerStakeUsdc, Number(usdcMint.decimals)),
      receiptTaxRateBps: 30,
      supportedReceiptTaxRateBps: [5, 10, 15, 20, 25, 30],
      providerEpochPoolShareBps: Number(masterpoolConfig.providerPoolShareBps),
      buyerEpochPoolShareBps: Number(masterpoolConfig.buyerPoolShareBps),
      challengeBondClaw: tokenAmount(masterpoolConfig.challengeBondClawAmount, Number(clawMint.decimals)),
      providerSlashClaw: tokenAmount(masterpoolConfig.providerSlashClawAmount, Number(clawMint.decimals)),
      lockDays: String(masterpoolConfig.lockDays),
      epochDurationSeconds: asString(masterpoolConfig.epochDurationSeconds),
      challengeWindowSeconds: asString(masterpoolConfig.challengeWindowSeconds),
      challengeResolutionTimeoutSeconds: asString(attestationConfig.challengeResolutionTimeoutSeconds),
      emissionTotalClaw: tokenAmount(masterpoolConfig.emissionTotalClaw, Number(clawMint.decimals)),
      halvingPeriodSeconds: asString(masterpoolConfig.halvingPeriodSeconds),
      emissionDurationSeconds: asString(masterpoolConfig.emissionDurationSeconds),
      genesisMinted: booleanOf(masterpoolConfig.genesisMinted),
      receiptRecordingPaused: booleanOf(masterpoolConfig.pauseReceiptRecording),
      challengeProcessingPaused: booleanOf(masterpoolConfig.pauseChallengeProcessing),
      finalizationPaused: booleanOf(masterpoolConfig.pauseFinalization),
      claimsPaused: booleanOf(masterpoolConfig.pauseClaims),
    },
    attestationConfig: {
      challengeWindowSeconds: asString(attestationConfig.challengeWindowSeconds),
      challengeResolutionTimeoutSeconds: asString(attestationConfig.challengeResolutionTimeoutSeconds),
      paused: booleanOf(attestationConfig.isPaused),
    },
    balances: {
      rewardVaultClaw: await fetchTokenAmount(deployment.rewardVault, Number(clawMint.decimals)),
      challengeBondVaultClaw: await fetchTokenAmount(deployment.challengeBondVault, Number(clawMint.decimals)),
      treasuryUsdc: await fetchTokenAmount(deployment.treasuryUsdcVault, Number(usdcMint.decimals)),
      providerStakeUsdc: await fetchTokenAmount(deployment.providerStakeUsdcVault, Number(usdcMint.decimals)),
      providerPendingUsdc: await fetchTokenAmount(deployment.providerPendingUsdcVault, Number(usdcMint.decimals)),
    },
    epochCursor: {
      latestKnownEpoch: asString(epochCursor.latestKnownEpochId),
      latestFinalizedEpoch: asString(epochCursor.latestFinalizedEpochId),
      carryForwardClaw: tokenAmount(epochCursor.carryForwardClaw, Number(clawMint.decimals)),
    },
  }

  const serialized = JSON.stringify(snapshot, null, 2)
  if (/rpcUrl|api-key|helius-rpc|adminAuthority|testUsdcOperator|faucet/i.test(serialized)) {
    throw new Error('sanitized snapshot contains forbidden operational data')
  }
  writeFileSync('/tmp/clawfarm-devnet-public-snapshot.json', `${serialized}\n`)
  console.log(serialized)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
NODE
```

Expected: the script is written under `/tmp` and no tracked files change.

- [ ] **Step 2: Run the chain reader**

Run:

```bash
node /tmp/read-clawfarm-devnet-snapshot.mjs
```

Expected: stdout and `/tmp/clawfarm-devnet-public-snapshot.json` contain sanitized public fields only. The output must not contain an RPC URL, API key, `adminAuthority`, `testUsdcOperator`, or faucet data.

- [ ] **Step 3: Validate sanitized output**

Run:

```bash
rg -n "rpcUrl|api-key|helius-rpc|adminAuthority|testUsdcOperator|faucet|keypair|PRIVATE KEY|seed phrase|mnemonic|wallet\.json" /tmp/clawfarm-devnet-public-snapshot.json || true
node -e "const s=require('/tmp/clawfarm-devnet-public-snapshot.json'); console.log(s.snapshotLabel); console.log(s.programs.masterpool); console.log(s.config.receiptTaxRateBps); console.log(s.balances ? 'balances-read' : 'balances-null')"
```

Expected:

```text
Devnet snapshot read on ... UTC
3gaSkyvgHJQxYpHJNxTBqSNrPMvu9fcCpoQkBsMKo3fg
30
balances-read
```

If the first `rg` command prints any forbidden term, delete the `/tmp` output and stop for manual review before editing tracked files.

- [ ] **Step 4: Commit nothing for the temporary read**

Run:

```bash
git status --short
```

Expected: no tracked changes. Do not commit `/tmp` files.

## Task 3: Refresh Static Protocol Snapshot

**Files:**
- Modify: `app/lib/protocol.ts`
- Modify: `app/components/ProtocolNetworkPanels.tsx`

- [ ] **Step 1: Generate the TypeScript snapshot block**

Run this command from the site repository root:

```bash
node <<'NODE'
const snapshot = require('/tmp/clawfarm-devnet-public-snapshot.json')
const js = (value) => JSON.stringify(value)
const block = `snapshotLabel: ${js(snapshot.snapshotLabel)},
programs: {
  masterpool: ${js(snapshot.programs.masterpool)},
  attestation: ${js(snapshot.programs.attestation)},
},
mints: {
  claw: ${js(snapshot.mints.claw)},
  usdc: ${js(snapshot.mints.usdc)},
},
accounts: {
  poolAuthority: ${js(snapshot.accounts.poolAuthority)},
  masterpoolConfig: ${js(snapshot.accounts.masterpoolConfig)},
  attestationConfig: ${js(snapshot.accounts.attestationConfig)},
  rewardVault: ${js(snapshot.accounts.rewardVault)},
  challengeBondVault: ${js(snapshot.accounts.challengeBondVault)},
  treasuryUsdcVault: ${js(snapshot.accounts.treasuryUsdcVault)},
  providerStakeUsdcVault: ${js(snapshot.accounts.providerStakeUsdcVault)},
  providerPendingUsdcVault: ${js(snapshot.accounts.providerPendingUsdcVault)},
  epochCursor: ${js(snapshot.accounts.epochCursor)},
},
config: {
  masterpoolConfigVersion: ${js(snapshot.config.masterpoolConfigVersion)},
  providerStakeUsdc: ${js(snapshot.config.providerStakeUsdc)},
  receiptTaxRateBps: ${snapshot.config.receiptTaxRateBps},
  supportedReceiptTaxRateBps: ${JSON.stringify(snapshot.config.supportedReceiptTaxRateBps)},
  providerEpochPoolShareBps: ${snapshot.config.providerEpochPoolShareBps},
  buyerEpochPoolShareBps: ${snapshot.config.buyerEpochPoolShareBps},
  challengeBondClaw: ${js(snapshot.config.challengeBondClaw)},
  providerSlashClaw: ${js(snapshot.config.providerSlashClaw)},
  lockDays: ${js(snapshot.config.lockDays)},
  epochDurationSeconds: ${js(snapshot.config.epochDurationSeconds)},
  challengeWindowSeconds: ${js(snapshot.config.challengeWindowSeconds)},
  challengeResolutionTimeoutSeconds: ${js(snapshot.config.challengeResolutionTimeoutSeconds)},
  emissionTotalClaw: ${js(snapshot.config.emissionTotalClaw)},
  halvingPeriodSeconds: ${js(snapshot.config.halvingPeriodSeconds)},
  emissionDurationSeconds: ${js(snapshot.config.emissionDurationSeconds)},
  genesisMinted: ${snapshot.config.genesisMinted},
  receiptRecordingPaused: ${snapshot.config.receiptRecordingPaused},
  challengeProcessingPaused: ${snapshot.config.challengeProcessingPaused},
  finalizationPaused: ${snapshot.config.finalizationPaused},
  claimsPaused: ${snapshot.config.claimsPaused},
},
balances: {
  rewardVaultClaw: ${js(snapshot.balances.rewardVaultClaw)},
  challengeBondVaultClaw: ${js(snapshot.balances.challengeBondVaultClaw)},
  treasuryUsdc: ${js(snapshot.balances.treasuryUsdc)},
  providerStakeUsdc: ${js(snapshot.balances.providerStakeUsdc)},
  providerPendingUsdc: ${js(snapshot.balances.providerPendingUsdc)},
},
epochCursor: {
  latestKnownEpoch: ${js(snapshot.epochCursor.latestKnownEpoch)},
  latestFinalizedEpoch: ${js(snapshot.epochCursor.latestFinalizedEpoch)},
  carryForwardClaw: ${js(snapshot.epochCursor.carryForwardClaw)},
},`
console.log(block)
NODE
```

Expected: stdout prints a complete TypeScript block containing only public addresses, public config values, vault balances, and epoch cursor values.

- [ ] **Step 2: Paste the generated block into the devnet profile**

In `app/lib/protocol.ts`, replace the existing devnet profile fields named `snapshotLabel`, `programs`, `mints`, `accounts`, `config`, `balances`, and `epochCursor` with the generated block from Step 1. Keep these existing static fields unchanged:

```ts
id: 'devnet',
label: 'Devnet',
clusterLabel: 'Solana Devnet',
explorerCluster: 'devnet',
status: 'active',
statusText: 'Default public devnet profile',
tokenSymbol: 'CLAF',
paymentMintLabel: 'Test USDC',
```

Do not paste any field that is outside the generated block.

- [ ] **Step 3: Ensure snapshot labels are static, not live**

In `app/components/ProtocolNetworkPanels.tsx`, rename user-facing labels that imply live data if needed. Use these labels if current labels remain ambiguous:

```tsx
<span>Snapshot epoch: <data>{epoch?.latestKnownEpoch ?? '-'}</data></span>
```

and:

```ts
{ label: 'Snapshot epoch', value: formatPending(epoch?.latestKnownEpoch) },
{ label: 'Snapshot finalized epoch', value: formatPending(epoch?.latestFinalizedEpoch) },
```

Keep `ProtocolStatusStrip` and `StateDashboard` layouts intact.

- [ ] **Step 4: Run type check and content guard**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: both commands pass. If `verify:site` fails on static snapshot wording, fix the copy to say `snapshot`, `static snapshot`, or `read on` instead of `live` or `realtime`.

- [ ] **Step 5: Commit snapshot refresh**

Run:

```bash
git add app/lib/protocol.ts app/components/ProtocolNetworkPanels.tsx
git commit -m "chore: refresh devnet protocol snapshot"
```

Expected: commit succeeds. If `app/components/ProtocolNetworkPanels.tsx` had no changes, omit it from `git add`.

## Task 4: Align Public Protocol Copy To Latest Contract

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/docs/page.tsx`
- Modify: `app/builders/page.tsx`
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`
- Modify: `app/state/page.tsx`
- Modify: `README.md`
- Modify: `app/components/CodeTabs.tsx`
- Modify: `app/components/SettlementFeed.tsx`

- [ ] **Step 1: Search for content that needs contract re-check**

Run:

```bash
rg -n "live|realtime|real-time|Receipt tax|taxRateBps|tax_rate_bps|chargeUsdc|charge_usdc|base charge|provider pending|split|Provider split|Protocol split|faucet|claim_faucet|initialize_faucet|fund_faucet|97%|3%|CLAW|current devnet|devnet" app README.md -S
```

Expected: matches are reviewed manually. `CLAW`, faucet terms, stale split terms, live/realtime snapshot wording, and SDK examples without tax rate require fixes.

- [ ] **Step 2: Update docs if contract drift is found**

In `app/docs/page.tsx`, ensure the following statements remain true. If any statement is missing or contradicted, edit the page to include it in existing sections without creating a new visual structure:

```tsx
<div>SubmitReceiptArgs</div>
<div>request_nonce_hash, metadata_hash, prompt_tokens, completion_tokens, charge_atomic, tax_rate_bps, receipt_hash.</div>
<div>Receipt hash</div>
<div>Built with the clawfarm:receipt:v2 domain, provider wallet, payer, Test USDC mint, token counts, base charge amount, and tax rate.</div>
```

Ensure SDK examples contain these fields:

```ts
chargeUsdc: '0.025000',
taxRateBps: 30,
```

```python
charge_usdc="0.025000",
tax_rate_bps=30,
```

```rust
.charge_usdc("0.025000")
.tax_rate_bps(30)
```

Ensure the gateway request body contains:

```json
"chargeUsdc": "0.025000",
"taxRateBps": 30
```

- [ ] **Step 3: Update shared SDK tabs if contract drift is found**

In `app/components/CodeTabs.tsx`, ensure every example with `chargeUsdc`, `charge_usdc`, or `.charge_usdc(` has a nearby tax rate field:

```ts
chargeUsdc: '0.025000',
taxRateBps: 30,
```

```python
charge_usdc="0.025000",
tax_rate_bps=30,
```

```rust
.charge_usdc("0.025000")
.tax_rate_bps(30)
```

- [ ] **Step 4: Remove stale live/realtime wording from static snapshot surfaces**

In `app/page.tsx`, `app/state/page.tsx`, `app/components/ProtocolNetworkPanels.tsx`, and `README.md`, replace wording that implies realtime data for static profile data. Use these patterns:

```text
Static devnet snapshot
Snapshot read on ...
Selected network profile
Static vault snapshot
Snapshot epoch
```

Do not use these phrases for `app/lib/protocol.ts` data:

```text
live state
realtime state
real-time dashboard
live balances
```

- [ ] **Step 5: Keep faucet/test tooling out of public content**

Run:

```bash
rg -n "faucet|claim_faucet|initialize_faucet|fund_faucet|set_faucet|faucet vault|test tooling|testing tooling" app README.md -S || true
```

Expected: no matches. If matches appear in public copy, remove or rewrite them without mentioning faucet.

- [ ] **Step 6: Verify content and types**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 7: Commit content alignment**

Run:

```bash
git add app README.md
git commit -m "docs: align public copy with latest contract state"
```

Expected: commit succeeds. If no files changed after review, skip the commit and record that no contract-copy drift was found.

## Task 5: Strengthen Content Verification Guard

**Files:**
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Add or confirm guard patterns for forbidden public concepts**

In `scripts/verify-site-content.mjs`, confirm these checks exist or add them to `publicCopyChecks`:

```js
{ name: 'public faucet or test tooling language', pattern: /\b(faucet|claim_faucet|initialize_faucet|fund_faucet|set_faucet|faucet vault|test tooling|testing tooling)\b/i },
{ name: 'static snapshot described as live', pattern: /\b(live|realtime|real-time)\b[^.\n]{0,120}\b(snapshot|vault|balance|epoch|state|profile)\b|\b(snapshot|vault|balance|epoch|state|profile)\b[^.\n]{0,120}\b(live|realtime|real-time)\b/i },
```

Keep existing guards for:

```js
{ name: 'stale public token symbol', pattern: /\bCLAW\b/ }
{ name: 'stale fixed settlement split language', pattern: staleFixedSettlementSplitPattern }
{ name: 'SDK charge example missing receipt tax rate', match: firstSdkChargeWithoutTaxRate }
```

If a new guard would flag an approved staged phrase, add a narrow file-scoped allowlist. Do not create broad allowlists.

- [ ] **Step 2: Add smoke checks for guard behavior**

Run this temporary smoke command:

```bash
node <<'NODE'
import { readFileSync, writeFileSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const repo = process.cwd()
const temp = mkdtempSync(join(tmpdir(), 'clawfarm-guard-'))
try {
  execFileSync('git', ['init'], { cwd: temp, stdio: 'ignore' })
  mkdirSync(join(temp, 'app'), { recursive: true })
  mkdirSync(join(temp, 'scripts'), { recursive: true })
  mkdirSync(join(temp, 'docs/superpowers/specs'), { recursive: true })
  writeFileSync(join(temp, 'scripts/verify-site-content.mjs'), readFileSync(join(repo, 'scripts/verify-site-content.mjs')))
  writeFileSync(join(temp, 'README.md'), '# Test\n')
  writeFileSync(join(temp, 'docs/superpowers/specs/empty.md'), '# Empty\n')

  const cases = [
    ['faucet public copy', 'The faucet lets devnet users claim tokens.', false],
    ['static snapshot live wording', 'Live vault snapshot for devnet balances.', false],
    ['stale split', '97% to provider pending revenue.', false],
    ['missing tax rate', 'chargeUsdc: \'0.025000\',', false],
    ['safe tax example', 'chargeUsdc: \'0.025000\',\ntaxRateBps: 30,', true],
    ['safe snapshot wording', 'Static devnet snapshot read on 2026-06-13.', true],
  ]

  for (const [name, content, shouldPass] of cases) {
    writeFileSync(join(temp, 'app/page.tsx'), content)
    let passed = true
    try {
      execFileSync('node', ['scripts/verify-site-content.mjs'], { cwd: temp, stdio: 'pipe' })
    } catch {
      passed = false
    }
    if (passed !== shouldPass) {
      throw new Error(`${name} expected ${shouldPass ? 'PASS' : 'FAIL'} but got ${passed ? 'PASS' : 'FAIL'}`)
    }
  }
  console.log('guard smoke passed')
} finally {
  rmSync(temp, { recursive: true, force: true })
}
NODE
```

Expected:

```text
guard smoke passed
```

- [ ] **Step 3: Run project verification**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: both pass.

- [ ] **Step 4: Commit guard updates**

Run:

```bash
git add scripts/verify-site-content.mjs
git commit -m "test: guard contract-driven snapshot content"
```

Expected: commit succeeds. If no guard changes were needed, skip the commit and record that existing guards already cover the required behavior.

## Task 6: Final Audit And Build

**Files:**
- Verify only unless a concrete failure identifies a file to fix.

- [ ] **Step 1: Run forbidden-content scans**

Run:

```bash
npm run verify:site
rg -n "CLAW|rpcUrl|api-key=|helius-rpc|PRIVATE KEY|seed phrase|mnemonic|keypair|wallet\.json|faucet|claim_faucet|initialize_faucet|fund_faucet|set_faucet|[\u4e00-\u9fff]" app README.md scripts docs/superpowers/specs -S || true
```

Expected:

- `npm run verify:site` passes.
- No forbidden matches in `app/` or `README.md`.
- `scripts/verify-site-content.mjs` may contain forbidden terms only as guard pattern literals.
- Historical design/spec files may contain policy references to forbidden concepts only as statements about what not to expose; they must not contain an actual RPC URL, API key, private key, wallet path, or local machine path.

- [ ] **Step 2: Confirm latest devnet addresses remain aligned**

Run:

```bash
node <<'NODE'
const { readFileSync } = require('node:fs')
const deployment = JSON.parse(readFileSync('../clawfarm-masterpool/deployments/devnet-phase1.json', 'utf8'))
const site = readFileSync('app/lib/protocol.ts', 'utf8')
for (const [name, value] of Object.entries({
  masterpoolProgramId: deployment.masterpoolProgramId,
  attestationProgramId: deployment.attestationProgramId,
  clawMint: deployment.clawMint,
  testUsdcMint: deployment.testUsdcMint,
  masterpoolConfig: deployment.masterpoolConfig,
  attestationConfig: deployment.attestationConfig,
  rewardVault: deployment.rewardVault,
  challengeBondVault: deployment.challengeBondVault,
  treasuryUsdcVault: deployment.treasuryUsdcVault,
  providerStakeUsdcVault: deployment.providerStakeUsdcVault,
  providerPendingUsdcVault: deployment.providerPendingUsdcVault,
})) {
  if (!site.includes(value)) {
    throw new Error(`app/lib/protocol.ts missing ${name}: ${value}`)
  }
}
console.log('deployment address check passed')
NODE
```

Expected:

```text
deployment address check passed
```

- [ ] **Step 3: Run final required checks**

Run:

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

Expected:

- `npm run verify:site`: PASS.
- `npx tsc --noEmit`: PASS.
- `npm run build`: exits 0. Non-fatal ESLint/AJV warnings may appear and should be reported if they recur.

- [ ] **Step 4: Inspect diff and commit final fixes if needed**

Run:

```bash
git status --short
git diff --stat
git diff -- app README.md scripts/verify-site-content.mjs
```

Expected: no uncommitted changes. If there are final corrections, commit them:

```bash
git add app README.md scripts/verify-site-content.mjs
git commit -m "fix: finalize contract-driven snapshot refresh"
```

Skip the commit when the working tree is clean.

## Self-Review

- Spec coverage: Tasks cover contract source inspection, read-only chain-state snapshot, public static data refresh, protocol copy alignment, guard strengthening, and final verification.
- Placeholder scan: This plan contains no unresolved implementation markers; dynamic TypeScript values are generated from the sanitized snapshot before editing tracked code.
- Scope check: This plan is focused on public website content, static protocol data, and verification guard behavior. It does not modify contracts, add live fetching, expose faucet tooling, or redesign UI.
- Type consistency: `ProtocolConfigSnapshot`, `VaultBalanceSnapshot`, and `EpochCursorSnapshot` keep the existing field names in `app/lib/protocol.ts`; UI components continue to read through `NetworkProfile`.
- Safety check: The plan never prints or commits the deployment RPC URL or API key. The only chain read output is sanitized public protocol data.
