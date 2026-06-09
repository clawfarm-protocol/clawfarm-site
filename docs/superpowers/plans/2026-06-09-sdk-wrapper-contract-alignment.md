# SDK Wrapper Contract Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all public SDK, CLI, HTTP, and provider onboarding examples with the current devnet contract shape while keeping them framed as wrapper targets.

**Architecture:** Update the content verification guard first so existing misleading examples fail, then rewrite public examples and copy around a consistent wrapper model: `prepare` builds compact receipt fields and account requirements, `submit` sends the signed transaction with gateway signer proof and payment delegate. Keep contract facts centralized in copy; do not add live calls or SDK implementation.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, static public copy, Node.js verification script.

---

## File Structure

- Modify: `scripts/verify-site-content.mjs` - extend public-copy guard to catch contract-native HTTP examples, endpoint-first provider registration, one-step SDK receipt submit examples, and old provider CLI examples.
- Modify: `app/components/CodeTabs.tsx` - replace TypeScript, Python, and Rust snippets with wrapper-target `prepare` plus `submit` examples.
- Modify: `app/docs/page.tsx` - rewrite Quickstart, SDK, Gateway wrapper, Current devnet contract shape, Provider, Architecture, Receipt lifecycle, Devnet parameters, and Resources copy.
- Modify: `app/install/page.tsx` - reframe provider onboarding CLI/config examples as wrapper targets; separate on-chain provider registration from off-chain directory config.
- Modify: `app/page.tsx` - replace endpoint-first CTA wording with provider-account wording.
- Modify: `README.md` - replace wallet-controlled endpoint wording with wallet-controlled `ProviderAccount` wording.

## Task 1: Extend Content Verification Guard

**Files:**
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Add guard patterns that fail on current public examples**

In `scripts/verify-site-content.mjs`, replace the `publicCopyChecks` array with this exact array:

```js
const publicCopyChecks = [
  { name: 'stale token symbol', pattern: /\bCLAF\b/ },
  { name: 'unsupported buyback language', pattern: /\b(Jupiter|buyback|execute_buyback|swap aggregator|incinerator)\b/i },
  { name: 'unverified mainnet immutability', pattern: /\b(Genesis-immutable|renounced at Genesis|upgrade authority renounced|deployer wallet keys discarded)\b/i },
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'old direct mining wording', pattern: /\b(mines CLAW to your wallet|mines CLAF to your wallet|CLAW mined|CLAF mined)\b/i },
  { name: 'unsupported routing or registry wording', pattern: /\b(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|dual-signed|user and provider sign|request hash|response hash|declared offerings)\b/i },
  { name: 'contract-native HTTP API example', pattern: /curl https:\/\/api\.clawfarm\.network\/v1\/devnet\/receipts/i },
  { name: 'endpoint-first provider registration', pattern: /\b(Register an endpoint|Register a wallet-backed endpoint|wallet-controlled endpoint|wallet-backed endpoint)\b/i },
  { name: 'one-step SDK receipt submit hides wrapper target', pattern: /receipts\.submit\(\{[\s\S]{0,600}\b(model|totalUsdc|total_usdc)\b/ },
  { name: 'old chained SDK receipt submit hides wrapper target', pattern: /\.receipts\(\)[\s\S]{0,400}\.model\(/ },
  { name: 'unframed provider CLI example', pattern: /npx clawfarm provider register/i },
]
```

- [ ] **Step 2: Run verification and confirm it fails on current copy**

Run:

```bash
npm run verify:site
```

Expected: FAIL. The output should identify current examples such as `Genesis-immutable`, one-step `receipts.submit({ ... model ... })`, the `curl https://api.clawfarm.network/v1/devnet/receipts` example, `Register an endpoint`, or `npx clawfarm provider register`.

- [ ] **Step 3: Commit the failing guard**

Run:

```bash
git add scripts/verify-site-content.mjs
git commit -m "test: guard sdk wrapper contract copy"
```

## Task 2: Rewrite SDK CodeTabs Examples

**Files:**
- Modify: `app/components/CodeTabs.tsx`

- [ ] **Step 1: Replace the `examples` object with wrapper-target examples**

In `app/components/CodeTabs.tsx`, replace the entire `examples` constant with this exact code:

```tsx
const examples: Record<Lang, { label: string; code: string }> = {
  ts: {
    label: 'TypeScript',
    code: `import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({ cluster: 'devnet' })

const prepared = await cf.receipts.prepare({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  requestNonce,
  metadata: {
    model: 'model-l-001',
    unit: 'tokens',
  },
  promptTokens: 420,
  completionTokens: 180,
  chargeUsdc: '0.025000',
})

const receipt = await cf.receipts.submit(prepared, {
  gatewaySigner,
  paymentDelegate,
})

console.log(receipt.receiptPda)`,
  },
  py: {
    label: 'Python',
    code: `from clawfarm import ClawFarm

cf = ClawFarm(cluster="devnet")

prepared = cf.receipts.prepare(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    request_nonce=request_nonce,
    metadata={"model": "model-l-001", "unit": "tokens"},
    prompt_tokens=420,
    completion_tokens=180,
    charge_usdc="0.025000",
)

receipt = cf.receipts.submit(
    prepared,
    gateway_signer=gateway_signer,
    payment_delegate=payment_delegate,
)

print(receipt.receipt_pda)`,
  },
  rs: {
    label: 'Rust',
    code: `use clawfarm::Client;

let cf = Client::new("devnet");

let prepared = cf.receipts().prepare()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .request_nonce(request_nonce)
    .metadata_model("model-l-001")
    .metadata_unit("tokens")
    .prompt_tokens(420)
    .completion_tokens(180)
    .charge_usdc("0.025000")
    .build()
    .await?;

let receipt = cf.receipts()
    .submit(prepared)
    .gateway_signer(gateway_signer)
    .payment_delegate(payment_delegate)
    .send()
    .await?;

println!("{}", receipt.receipt_pda);`,
  },
}
```

- [ ] **Step 2: Run the content verification guard**

Run:

```bash
npm run verify:site
```

Expected: still FAIL because `app/docs/page.tsx`, `app/install/page.tsx`, `app/page.tsx`, or `README.md` still contain guarded stale examples/copy.

- [ ] **Step 3: Run TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS. The component still only renders strings.

- [ ] **Step 4: Commit CodeTabs examples**

Run:

```bash
git add app/components/CodeTabs.tsx
git commit -m "docs: align sdk wrapper examples"
```

## Task 3: Rewrite Docs Page Around Wrapper Targets

**Files:**
- Modify: `app/docs/page.tsx`

- [ ] **Step 1: Replace the `toc` array**

In `app/docs/page.tsx`, replace the `toc` array with this exact code:

```ts
const toc = [
  ['Quickstart', '#quickstart'],
  ['Install', '#install'],
  ['Configure devnet', '#configure-devnet'],
  ['SDK wrapper target', '#sdk-wrapper-target'],
  ['Current contract shape', '#current-contract-shape'],
  ['Gateway wrapper target', '#gateway-wrapper-target'],
  ['Provider', '#provider'],
  ['Models', '#models'],
  ['Protocol', '#protocol'],
  ['Architecture', '#architecture'],
  ['Smart contracts', '#contracts'],
  ['Receipt lifecycle', '#receipt-lifecycle'],
  ['Phase 1 economics', '#phase-1-economics'],
  ['Challenges', '#challenges'],
  ['Devnet parameters', '#devnet-parameters'],
  ['Reproducibility', '#reproducibility'],
  ['Resources', '#resources'],
]
```

- [ ] **Step 2: Replace the Quickstart and SDK sections**

In `app/docs/page.tsx`, replace everything from `<section id="quickstart">` through the closing `</section>` immediately before `<section id="gateway-selection">` with this exact JSX:

```tsx
            <section id="quickstart">
              <h2>Quickstart</h2>
              <p>
                The devnet contract path is Solana-native. SDK examples on this page are wrapper targets: the wrapper must build the compact receipt fields, proof instruction, token delegate, PDAs, and masterpool accounts before sending the transaction.
              </p>
              <h3 id="install">Install</h3>
              <pre className="code-block"><code>{`npm install @clawfarm/sdk`}</code></pre>
              <h3 id="configure-devnet">Configure devnet</h3>
              <pre className="code-block"><code>{`import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({
  cluster: 'devnet',
})`}</code></pre>
            </section>

            <section id="sdk-wrapper-target">
              <h2>SDK wrapper target</h2>
              <p>
                A contract-aligned wrapper should prepare receipt hashes first, then submit the prepared receipt with a gateway-capable signer proof and payer payment delegate.
              </p>
              <h3>TypeScript</h3>
              <pre className="code-block"><code>{`const prepared = await cf.receipts.prepare({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  requestNonce,
  metadata: {
    model: 'model-l-001',
    unit: 'tokens',
  },
  promptTokens: 420,
  completionTokens: 180,
  chargeUsdc: '0.025000',
})

const receipt = await cf.receipts.submit(prepared, {
  gatewaySigner,
  paymentDelegate,
})

console.log(receipt.receiptPda)
console.log(receipt.economicRecordPda)`}</code></pre>
              <h3>Python</h3>
              <pre className="code-block"><code>{`prepared = cf.receipts.prepare(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    request_nonce=request_nonce,
    metadata={"model": "model-l-001", "unit": "tokens"},
    prompt_tokens=420,
    completion_tokens=180,
    charge_usdc="0.025000",
)

receipt = cf.receipts.submit(
    prepared,
    gateway_signer=gateway_signer,
    payment_delegate=payment_delegate,
)`}</code></pre>
              <h3>Rust</h3>
              <pre className="code-block"><code>{`let prepared = cf.receipts().prepare()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .request_nonce(request_nonce)
    .metadata_model("model-l-001")
    .metadata_unit("tokens")
    .prompt_tokens(420)
    .completion_tokens(180)
    .charge_usdc("0.025000")
    .build()
    .await?;

let receipt = cf.receipts()
    .submit(prepared)
    .gateway_signer(gateway_signer)
    .payment_delegate(payment_delegate)
    .send()
    .await?;`}</code></pre>
            </section>

            <section id="current-contract-shape">
              <h2>Current devnet contract shape</h2>
              <p>
                The SDK wrapper target maps to `attestation.submit_receipt`. The contract does not accept model IDs or endpoint metadata as direct receipt fields; those values belong in metadata that the wrapper hashes.
              </p>
              <div className="key-list">
                <div>SubmitReceiptArgs</div>
                <div>request_nonce_hash, metadata_hash, prompt_tokens, completion_tokens, charge_atomic, receipt_hash.</div>
                <div>Receipt hash</div>
                <div>Built with the clawfarm:receipt:v2 domain, provider wallet, payer, Test USDC mint, token counts, and charge amount.</div>
                <div>Proof instruction</div>
                <div>The transaction includes an immediately preceding ed25519 verification instruction for the configured gateway-capable signer over receipt_hash.</div>
                <div>Payment delegate</div>
                <div>The payer authorizes bounded Test USDC movement through the payer token account and payment delegate signer.</div>
                <div>Masterpool accounts</div>
                <div>The wrapper supplies config, provider account, epoch cursor/state, receipt economic record, treasury vault, and provider pending vault accounts.</div>
              </div>
            </section>

            <section id="gateway-wrapper-target">
              <h2>Gateway wrapper target</h2>
              <p>
                A gateway API may collect receipt metadata, but it must create or return a Solana transaction that follows the current devnet contract shape. It is not a contract-native REST endpoint.
              </p>
              <pre className="code-block"><code>{`POST /devnet/receipt-transactions
{
  "providerWallet": "<provider-wallet>",
  "payer": "<payer-wallet>",
  "payerUsdcToken": "<payer-usdc-token>",
  "requestNonce": "<client-generated-nonce>",
  "metadata": {
    "model": "model-l-001",
    "unit": "tokens"
  },
  "promptTokens": 420,
  "completionTokens": 180,
  "chargeUsdc": "0.025000"
}`}</code></pre>
              <p>
                The gateway wrapper response should contain a transaction or signing payload that includes the ed25519 proof instruction and `attestation.submit_receipt` accounts.
              </p>
            </section>
```

- [ ] **Step 3: Replace the architecture code block**

In the `Architecture` subsection, replace the existing `<pre className="code-block">` block with this exact block:

```tsx
              <pre className="code-block"><code>{`WALLET / APP LAYER
  Users · Builders · Agents · Provider operators

OFF-CHAIN DIRECTORY
  Provider choices · Model labels · Endpoint metadata · Price metadata

ATTESTATION LAYER
  ProviderSigner records · Compact receipts · Challenge lifecycle · Finalization authority

MASTERPOOL LAYER
  ProviderAccount · Test USDC split · Epoch weight · Locked CLAW streams · Vault accounting`}</code></pre>
```

- [ ] **Step 4: Replace receipt lifecycle copy**

Replace the receipt lifecycle `<pre className="code-block">` block with this exact block:

```tsx
              <pre className="code-block"><code>{`1. Wallet authorizes bounded Test USDC settlement through a payer token delegate.
2. App or gateway prepares request_nonce_hash, metadata_hash, charge_atomic, and receipt_hash.
3. A configured gateway-capable signer signs receipt_hash, and the transaction includes the ed25519 proof instruction.
4. Attestation submits the compact receipt and records payment through masterpool CPI.
5. Masterpool splits Test USDC into provider-pending and treasury vaults.
6. Receipt survives or fails the challenge window.
7. Finalized receipts activate buyer/provider epoch weight and release provider pending USDC.
8. Finalized epochs create locked CLAW streams for claimable rewards.`}</code></pre>
```

- [ ] **Step 5: Replace devnet timing copy**

In the Devnet parameters section, replace this line:

```tsx
<div>Challenge window</div><div>Short devnet window for rollout testing; mainnet uses the production challenge-window configuration before launch.</div>
```

with this exact line:

```tsx
<div>Challenge window</div><div>Short devnet window for rollout testing; mainnet timing remains pending until mainnet config is deployed.</div>
```

- [ ] **Step 6: Run verification and TypeScript checks**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: `verify:site` may still FAIL because `app/install/page.tsx`, `app/page.tsx`, or `README.md` still contain guarded copy. `npx tsc --noEmit` should PASS.

- [ ] **Step 7: Commit docs page rewrite**

Run:

```bash
git add app/docs/page.tsx
git commit -m "docs: explain current devnet contract shape"
```

## Task 4: Reframe Provider Install Page

**Files:**
- Modify: `app/install/page.tsx`

- [ ] **Step 1: Replace provider hero and path copy**

In `app/install/page.tsx`, make these exact text replacements:

```txt
Register a provider wallet with the protocol. Publish endpoint and pricing metadata through the gateway or operator directory, serve requests, and receive provider-share USDC after receipt finalization. Finalized usage contributes provider-side epoch weight for CLAW rewards.
```

becomes:

```txt
Register a provider wallet with the protocol. Publish endpoint and pricing metadata through an off-chain gateway or operator directory, serve requests, and receive provider-share USDC after receipt finalization. Finalized usage contributes provider-side epoch weight for CLAW rewards.
```

```txt
One endpoint path.
```

becomes:

```txt
One provider account path.
```

```txt
Connect any AI inference endpoint.
```

becomes:

```txt
Register a provider wallet.
```

```txt
The protocol is endpoint-agnostic: any HTTP endpoint that serves model
                inference can be registered.
```

becomes:

```txt
The on-chain registration is endpoint-agnostic: endpoint details remain in off-chain directory metadata.
```

- [ ] **Step 2: Replace the setup code block**

Replace the setup `<pre className="code-block">` under caption `Install` with this exact JSX block:

```tsx
          <pre className="code-block"><code>{`# Wrapper target: calls masterpool.register_provider
clawfarm provider register \
  --cluster devnet \
  --provider-wallet <provider-wallet> \
  --provider-usdc-token <provider-usdc-token>

# Wrapper target: writes off-chain directory metadata
clawfarm directory configure \
  --endpoint https://endpoint.invalid/v1 \
  --models model-l-001,model-l-002`}</code></pre>
```

- [ ] **Step 3: Replace the setup caption**

Replace:

```tsx
<p className="caption">Install</p>
```

with:

```tsx
<p className="caption">Provider wrapper target</p>
```

- [ ] **Step 4: Add on-chain account requirements below the setup block**

Immediately after the setup `<pre>` block from Step 2, add this paragraph:

```tsx
          <p className="section-footnote wide-footnote">
            The provider wrapper signs with the provider wallet, transfers the configured 100 Test USDC stake, and supplies provider account, provider reward account, stake vault, provider USDC token, and Test USDC mint accounts.
          </p>
```

- [ ] **Step 5: Run verification and TypeScript checks**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: `verify:site` may still FAIL because `app/page.tsx` or `README.md` still contain guarded endpoint-first copy. `npx tsc --noEmit` should PASS.

- [ ] **Step 6: Commit install page rewrite**

Run:

```bash
git add app/install/page.tsx
git commit -m "docs: reframe provider setup as wrapper target"
```

## Task 5: Replace Endpoint-First Public Copy

**Files:**
- Modify: `app/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Update home page copy**

In `app/page.tsx`, make these exact text replacements:

```txt
Genesis-immutable . Devnet default . Solana
```

becomes:

```txt
Devnet active . Mainnet pending . Solana
```

```txt
Register an endpoint →
```

becomes:

```txt
Register a provider account →
```

```txt
Register a wallet-backed endpoint. Receipt payments create pending provider USDC until finalization.
```

becomes:

```txt
Register a wallet-backed ProviderAccount. Receipt payments create pending provider USDC until finalization.
```

```txt
Register an endpoint. The protocol does not ask where capacity comes from. 97% of every settlement is paid to the provider in USDC. CLAW rewards accrue through finalized epoch weight.
```

becomes:

```txt
Register a provider account. The protocol does not ask where capacity comes from. Provider-share USDC releases after receipt finalization, and CLAW rewards accrue through finalized epoch weight.
```

- [ ] **Step 2: Update README copy**

In `README.md`, replace:

```txt
- Providers register a wallet-controlled endpoint and stake 100 Test USDC on devnet.
```

with:

```txt
- Providers register a wallet-controlled ProviderAccount and stake 100 Test USDC on devnet.
```

- [ ] **Step 3: Run verification and TypeScript checks**

Run:

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: PASS for both commands if Tasks 1-5 are complete.

- [ ] **Step 4: Commit endpoint copy cleanup**

Run:

```bash
git add app/page.tsx README.md
git commit -m "docs: use provider account copy"
```

## Task 6: Final Verification And Build Attempt

**Files:**
- No source edits expected.

- [ ] **Step 1: Run content verification**

Run:

```bash
npm run verify:site
```

Expected: PASS with a message like `Site content verification passed for 23 files.`

- [ ] **Step 2: Run TypeScript check**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS with exit code 0.

- [ ] **Step 3: Attempt production build**

Run:

```bash
npm run build
```

Expected: PASS if Google Fonts are reachable. If it fails with `next/font` errors for `IBM Plex Sans` or `JetBrains Mono`, record the failure as an external Google Fonts fetch timeout and do not treat it as a content or TypeScript regression.

- [ ] **Step 4: Inspect final git status**

Run:

```bash
git status --short --branch
```

Expected: clean worktree on `develop`, ahead of `origin/develop` by the new commits.

- [ ] **Step 5: Commit final plan progress if execution updates this plan**

If this plan file was updated with progress during execution, run:

```bash
git add docs/superpowers/plans/2026-06-09-sdk-wrapper-contract-alignment.md
git commit -m "docs: update sdk wrapper alignment plan progress"
```

If the plan file was not updated during execution, do not create an empty commit.

## Self-Review

- Spec coverage: the plan covers wrapper target framing, SDK snippets, current devnet contract shape, provider onboarding, endpoint-first copy, README copy, and verification guard updates.
- Placeholder scan: the plan contains no unresolved placeholders; placeholder-looking strings such as `<provider-wallet>` are intentional public example markers.
- Type consistency: wrapper method names are consistent across docs and CodeTabs: `receipts.prepare` followed by `receipts.submit`.
- Scope check: the plan only updates public documentation/examples and verification guard behavior; it does not implement SDK, CLI, HTTP gateway, or live contract calls.
