# Mainnet-First AIRouter Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ClawFarm public site Mainnet-first, publish a dated and verified mainnet masterpool v3 snapshot, replace SDK-oriented onboarding with the current AIRouter Provider and B-side Buyer flows, and correct the whitepaper cold-start pool to 500,000 CLAF plus 50 USDC.

**Architecture:** Keep the site as a Next.js static export and store public-safe network state in `app/lib/protocol.ts`; do not add runtime RPC dependencies. Treat `clawfarm-masterpool` as the protocol source of truth and AIRouter `feature/clawfarm` as the integration source of truth. Use the existing content audit as the regression-test layer, then verify the rendered site and regenerated PDFs.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript, Node.js content audit, Python/ReportLab whitepaper generator, Solana CLI/RPC read-only queries, browser-based responsive QA.

---

## File Structure

- Modify `docs/superpowers/specs/2026-07-30-mainnet-airouter-onboarding-design.md`: record written-spec approval.
- Create `docs/superpowers/plans/2026-07-30-mainnet-airouter-onboarding.md`: implementation plan and execution checklist.
- Modify `scripts/verify-site-content.mjs`: add positive and negative regressions for Mainnet-first state, no-SDK onboarding, AIRouter contact flow, and whitepaper figures.
- Modify `app/lib/protocol.ts`: make Mainnet the default and populate the verified deployment/config/balance snapshot.
- Modify `app/components/NetworkSwitch.tsx`: present Mainnet before Devnet.
- Modify `app/components/ProtocolNetworkPanels.tsx`: remove hard-coded Devnet/target labels and render selected-network facts.
- Modify `app/network/page.tsx`: describe both active deployments with Mainnet primary.
- Modify `app/state/page.tsx`: describe selected-network static state rather than Devnet-first state.
- Modify `app/providers/page.tsx`: replace the disabled registration mock form with the real Provider onboarding sequence.
- Modify `app/install/page.tsx`: replace wrapper/CLI installation material with the detailed operational Provider checklist.
- Modify `app/builders/page.tsx`: replace SDK and connected-wallet UI with B-side Buyer onboarding and direct HTTP examples.
- Modify `app/docs/page.tsx`: replace SDK wrapper documentation with canonical AIRouter authentication, routes, payment lifecycle, settlement observation, and current mainnet parameters.
- Modify `app/page.tsx`: replace Devnet-pending and SDK-first homepage copy with Mainnet and direct AIRouter integration copy.
- Delete `app/components/CodeTabs.tsx`: remove the now-unused fictional SDK examples.
- Modify `scripts/generate-whitepaper-v1.py`: update the seed pair, opening price, FDV, direct cross-references, and Appendix A.
- Regenerate `public/whitepaper.pdf`: canonical downloadable whitepaper.
- Regenerate `public/ClawFarm_Whitepaper_v1.0.pdf`: compatibility download copy.
- Modify `README.md`: describe Mainnet-first operation, AIRouter onboarding pages, and static snapshot policy.

## Task 1: Lock The New Public Contract With Failing Content Tests

**Files:**
- Modify: `scripts/verify-site-content.mjs`

- [ ] **Step 1: Add required-state and stale-copy checks before changing production content**

Add a required-check type and checks after `publicCopyChecks`:

```js
const requiredChecks = [
  {
    file: 'app/lib/protocol.ts',
    name: 'Mainnet default network',
    pattern: /defaultNetworkId:\s*NetworkId\s*=\s*'mainnet'/,
  },
  {
    file: 'app/providers/page.tsx',
    name: 'Provider contact onboarding',
    pattern: /Contact the ClawFarm team/,
  },
  {
    file: 'app/builders/page.tsx',
    name: 'Buyer API-key onboarding',
    pattern: /cfk_\*/,
  },
  {
    file: 'app/builders/page.tsx',
    name: 'Buyer contact onboarding',
    pattern: /Contact the ClawFarm team/,
  },
  {
    file: 'app/docs/page.tsx',
    name: 'AIRouter chat route',
    pattern: /\/clawfarm\/chat\/completions/,
  },
  {
    file: 'scripts/generate-whitepaper-v1.py',
    name: 'Cold-start seed pair',
    pattern: /500,000 CLAF[\s\S]{0,180}50 USDC/,
  },
]

const staleLaunchChecks = [
  { name: 'Mainnet still pending', pattern: /Mainnet (?:target )?(?:pending|not deployed)|mainnet deployment record exists yet/i },
  { name: 'public SDK package', pattern: /@clawfarm\/sdk|sdk-wrapper-target|Start with the SDK/i },
  { name: 'fictional payment wrapper endpoint', pattern: /\/devnet\/payment-transactions/i },
]
```

Apply `staleLaunchChecks` only to `app/` and `README.md`. Add stale cold-start checks to `scripts/generate-whitepaper-v1.py`:

```js
const staleWhitepaperChecks = [
  { name: 'old seed CLAF amount', pattern: /10,000,000 CLAF/ },
  { name: 'old seed USDC amount', pattern: /5,000 USDC/ },
  { name: 'old opening price', pattern: /0\.0005 USDC per CLAF/ },
  { name: 'old seed FDV', pattern: /500,000 USDC/ },
]

function scanRequired(checks) {
  for (const check of checks) {
    const text = readFileSync(check.file, 'utf8')
    if (!check.pattern.test(text)) {
      failures.push(`${check.file}: missing ${check.name}`)
    }
  }
}
```

Call the new scans before the failure report:

```js
scan(publicCopyFiles, staleLaunchChecks)
scan(['scripts/generate-whitepaper-v1.py'], staleWhitepaperChecks)
scanRequired(requiredChecks)
```

- [ ] **Step 2: Run the content audit and verify the expected RED state**

Run:

```bash
npm run verify:site
```

Expected: FAIL and report at least the missing Mainnet default, missing Provider/Buyer contact flow, public SDK copy, Mainnet-pending copy, and old whitepaper seed figures. Confirm it fails for product drift, not syntax errors.

- [ ] **Step 3: Commit the failing regression contract**

```bash
git add scripts/verify-site-content.mjs
git commit -m "test: require mainnet AIRouter onboarding copy"
```

## Task 2: Refresh And Publish The Mainnet Static Snapshot

**Files:**
- Modify: `app/lib/protocol.ts`
- Modify: `app/components/NetworkSwitch.tsx`
- Modify: `app/components/ProtocolNetworkPanels.tsx`
- Modify: `app/network/page.tsx`
- Modify: `app/state/page.tsx`

- [ ] **Step 1: Re-read deployment and contract facts immediately before editing**

Run read-only checks:

```bash
test -n "$CLAWFARM_MAINNET_DEPLOYMENT_JSON"
sed -n '1,260p' "$CLAWFARM_MAINNET_DEPLOYMENT_JSON"
sed -n '1,260p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/state/accounts.rs
sed -n '1,300p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/config.rs
sed -n '1,260p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/provider.rs
sed -n '1,320p' ../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src/instructions/payment.rs
```

Expected: program/config/mint/vault addresses match the approved design; `register_provider_v3` stores zero stake; `record_payment_v3` transfers tax and base charge to their configured vaults.

- [ ] **Step 2: Fetch fresh finalized mainnet account state without persisting the RPC URL**

Use the public Solana endpoint. If direct access fails, add the project-approved local proxy only to the command environment:

```bash
HTTPS_PROXY=http://127.0.0.1:7890 solana account 6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m \
  --url https://api.mainnet-beta.solana.com --output json-compact
HTTPS_PROXY=http://127.0.0.1:7890 solana account AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC \
  --url https://api.mainnet-beta.solana.com --output json-compact
HTTPS_PROXY=http://127.0.0.1:7890 solana account EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS \
  --url https://api.mainnet-beta.solana.com --output json-compact
HTTPS_PROXY=http://127.0.0.1:7890 solana account BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ \
  --url https://api.mainnet-beta.solana.com --output json-compact
```

Decode the config with the current IDL and decode SPL token balances from offset 64. Record only public values and the UTC block time. Never copy the RPC URL from the deployment JSON into tracked files.

- [ ] **Step 3: Make Mainnet the default and populate its profile**

Change the default and Mainnet profile in `app/lib/protocol.ts`. Use the fresh values if they differ from this verified baseline:

```ts
export const defaultNetworkId: NetworkId = 'mainnet'

mainnet: {
  id: 'mainnet',
  label: 'Mainnet',
  clusterLabel: 'Solana mainnet-beta',
  explorerCluster: 'mainnet-beta',
  status: 'active',
  statusText: 'Mainnet v3 active',
  snapshotLabel: 'Mainnet v3 point-in-time snapshot read on 2026-07-30 12:55 UTC',
  tokenSymbol: 'CLAF',
  paymentMintLabel: 'USDC',
  programs: {
    masterpoolV3: '263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF',
  },
  mints: {
    claf: 'C9C4v7EPpxgYcuJpvBskW6VENA6kL1C1upgfg6jfmCu7',
    usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
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
    providerStakeUsdc: '100.000000',
    taxRateBps: 300,
    providerEpochPoolShareBps: 7000,
    buyerEpochPoolShareBps: 3000,
    epochDurationSeconds: '3600',
    challengeWindowSeconds: '30',
    emissionTotalClaf: '1000000000.000000',
    emissionDurationSeconds: '315360000',
    paymentRecordingPaused: false,
    settlementPaused: false,
    claimsPaused: false,
  },
  balances: {
    rewardVaultClaf: '997973744.292238',
    treasuryUsdc: '0.066766',
    providerPendingUsdc: '6.464508',
  },
},
```

Remove `mainnetTargetEpochSeconds` from `ProtocolConfigSnapshot` and from both network values; selected-network panels no longer compare an active deployment to a target.

- [ ] **Step 4: Make every shared network label selected-network aware**

In `app/components/NetworkSwitch.tsx`, order the buttons:

```ts
const networkIds: NetworkId[] = ['mainnet', 'devnet']
```

In `app/components/ProtocolNetworkPanels.tsx`, replace hard-coded labels with these forms:

```tsx
<span>Epoch: <data>{config ? formatDurationSeconds(config.epochDurationSeconds) : '-'}</data></span>
<span>Snapshot: <data>{profile.snapshotLabel}</data></span>
```

```ts
{ label: 'Epoch duration', value: formatDurationSeconds(config.epochDurationSeconds) }
{ label: 'Configured provider stake', value: `${config.providerStakeUsdc} ${profile.paymentMintLabel}`, note: 'Current v3 registration does not transfer or lock this amount.' }
{ label: 'Challenge window field', value: formatDurationSeconds(config.challengeWindowSeconds), note: 'Deprecated in the current v3 ledger settlement mode.' }
```

Delete the Mainnet-specific prose from `PendingPanel`; keep it generic so a future pending deployment can render `profile.statusText` and `profile.snapshotLabel` without claiming Mainnet is undeployed.

- [ ] **Step 5: Rewrite Network and State hero copy**

Use this core wording:

```tsx
<p className="hero-copy">
  Mainnet is the primary ClawFarm deployment. Select either network to inspect its dated, point-in-time program, mint, vault, and config snapshot.
</p>
```

```tsx
<p className="hero-copy">
  Inspect the selected masterpool v3 deployment, vault balances, pause flags, epoch parameters, and settlement lifecycle. Snapshot values are dated and are not realtime RPC reads.
</p>
```

Update State metadata from `Devnet-first` to `Mainnet-first`.

- [ ] **Step 6: Run focused checks**

```bash
npx tsc --noEmit
npm run verify:site
```

Expected: TypeScript passes. The content audit still fails only for onboarding and whitepaper requirements not yet implemented; Mainnet default and Mainnet-pending failures are gone.

- [ ] **Step 7: Commit the network slice**

```bash
git add app/lib/protocol.ts app/components/NetworkSwitch.tsx app/components/ProtocolNetworkPanels.tsx app/network/page.tsx app/state/page.tsx
git commit -m "feat: make mainnet the primary network"
```

## Task 3: Replace Provider Mock Registration With AIRouter Onboarding

**Files:**
- Modify: `app/providers/page.tsx`
- Modify: `app/install/page.tsx`

- [ ] **Step 1: Replace the Provider page mock form and empty wallet table**

Define the actual onboarding steps:

```ts
const onboardingSteps = [
  ['01', 'Contact', 'Contact the ClawFarm team to start Provider onboarding.'],
  ['02', 'Describe the route', 'Provide the supported API protocol, upstream base URL, model catalog, pricing, and quota information.'],
  ['03', 'Transfer the credential securely', 'Provide the upstream API key through the secure channel agreed with the ClawFarm team. It is stored encrypted and is never published.'],
  ['04', 'Register the Provider wallet', 'Provide a public Solana mainnet wallet address for settlement and rewards. Never send a private key or seed phrase.'],
  ['05', 'Validate and activate', 'ClawFarm configures AIRouter, bootstraps ProviderAccountV3 when needed, verifies routing and pricing, and activates traffic after an end-to-end request check.'],
] as const
```

Render these in the existing `key-list` or `supply-grid` visual language. Replace Test USDC with native mainnet USDC. Keep current contract facts: payment tax to treasury, base charge to Provider pending, Provider USDC/CLAF claims from finalized roots, zero stake transferred by current registration.

Add an identity section:

```tsx
<div className="key-list">
  <div>Upstream API credential</div>
  <div>A secret delivered securely to ClawFarm and stored encrypted for AIRouter upstream authentication.</div>
  <div>Provider wallet</div>
  <div>A public Solana mainnet address used as the on-chain Provider and reward identity.</div>
  <div>Provider endpoint</div>
  <div>Off-chain AIRouter routing metadata. It is not stored in ProviderAccountV3.</div>
</div>
```

- [ ] **Step 2: Rewrite `/install` as the detailed Provider checklist**

Remove every wrapper CLI, SDK setup, fake endpoint JSON, and unverified repository name. Keep the route for compatibility but change its metadata title to `Provider Onboarding - ClawFarm`.

Use sections for:

```tsx
<h1 className="page-title">Bring inference supply to ClawFarm.</h1>
<p className="page-copy">
  Provider onboarding is coordinated with the ClawFarm team. No ClawFarm SDK is required: AIRouter connects to your existing API, while your public mainnet wallet becomes the settlement and reward identity.
</p>
```

```ts
const providerChecklist = [
  ['API protocol', 'OpenAI-compatible, Anthropic-compatible, Google Generative AI, or another route confirmed by the team.'],
  ['Upstream access', 'Base URL, model discovery details, pricing metadata, quota information, and an API key delivered through the agreed secure channel.'],
  ['Public wallet', 'A canonical Solana mainnet address. Do not provide private key, seed phrase, or wallet files.'],
  ['Activation check', 'Model sync, route health, price metadata, ProviderAccountV3 state, receipt persistence, and settlement observability.'],
] as const
```

End with `Contact the ClawFarm team` and a link to `/docs#provider-onboarding`, but do not invent a contact URL.

- [ ] **Step 3: Run the Provider guard and TypeScript**

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: Provider contact requirement passes; remaining Buyer/whitepaper failures remain.

- [ ] **Step 4: Commit the Provider slice**

```bash
git add app/providers/page.tsx app/install/page.tsx
git commit -m "docs: document AIRouter provider onboarding"
```

## Task 4: Replace SDK Buyer Integration With Direct AIRouter HTTP

**Files:**
- Modify: `app/builders/page.tsx`
- Modify: `app/docs/page.tsx`
- Modify: `app/page.tsx`
- Delete: `app/components/CodeTabs.tsx`

- [ ] **Step 1: Rewrite `/builders` for B-side Buyers**

Remove `CodeTabs`, wallet-connect mocks, and SDK claims. Add the operational steps:

```ts
const buyerSteps = [
  ['01', 'Contact', 'Contact the ClawFarm team to request B-side access and the current Gateway base URL.'],
  ['02', 'Receive a cfk_* key', 'ClawFarm issues the API key once. Store it server-side or in a secret manager; never ship it in browser code.'],
  ['03', 'Register a wallet', 'Provide a public Solana mainnet wallet address to bind to the key. Never provide a private key or seed phrase.'],
  ['04', 'Fund the wallet', 'Deposit native mainnet USDC and keep the wallet funded for inference settlement.'],
  ['05', 'Call AIRouter', 'Use the HTTP endpoints directly with the cfk_* credential. No ClawFarm SDK is required.'],
] as const
```

Add a real HTTP example with placeholders only:

```tsx
<pre className="code-block"><code>{`export CLAWFARM_GATEWAY_URL="<provided-by-clawfarm>"
export CLAWFARM_API_KEY="<store-in-a-secret-manager>"

curl --fail-with-body "$CLAWFARM_GATEWAY_URL/clawfarm/chat/completions" \\
  -H "Authorization: Bearer $CLAWFARM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "clawfarm/auto",
    "messages": [{"role": "user", "content": "Explain epoch settlement."}],
    "max_tokens": 256
  }'`}</code></pre>
```

Document that `X-ClawFarm-Payment-Status: settlement_pending` means the durable receipt is queued for asynchronous mainnet settlement.

- [ ] **Step 2: Replace `/docs` with the canonical AIRouter reference**

Use these table-of-contents sections:

```ts
const toc = [
  ['Buyer onboarding', '#buyer-onboarding'],
  ['Authentication', '#authentication'],
  ['HTTP endpoints', '#http-endpoints'],
  ['Request example', '#request-example'],
  ['Settlement status', '#settlement-status'],
  ['Provider onboarding', '#provider-onboarding'],
  ['Contract shape', '#contract-shape'],
  ['Payment lifecycle', '#payment-lifecycle'],
  ['Mainnet parameters', '#mainnet-parameters'],
  ['Addresses', '#addresses'],
] as const
```

Document exact supported routes from `api/clawfarm/routes.go`:

```tsx
<div className="key-list">
  <div>GET /clawfarm/v1/models</div><div>List available ClawFarm models.</div>
  <div>POST /clawfarm/chat/completions</div><div>OpenAI-compatible Chat Completions.</div>
  <div>POST /clawfarm/v1/responses</div><div>OpenAI-compatible Responses API.</div>
  <div>POST /clawfarm/v1/messages</div><div>Anthropic-compatible Messages API.</div>
  <div>POST /clawfarm/google/v1/models/...</div><div>Google Generative AI-compatible route.</div>
</div>
```

Document both accepted auth headers, with placeholder values:

```http
Authorization: Bearer $CLAWFARM_API_KEY
X-Api-Key: $CLAWFARM_API_KEY
```

State that a Buyer uses one, not both. Explain `cfk_*`, wallet binding, mainnet USDC funding, max-charge policy, durable receipt creation, asynchronous chain settlement, and Buyer reward identity.

Retain contract internals as operator-independent facts: `RecordPaymentV3Args`, payment bitmap, accumulator, roots, claims, 50-300 bps accepted per-payment tax bounded by the 300 bps config cap, 3,600-second epoch, deprecated 30-second challenge field, 70/30 pool caps, zero registration stake transfer despite configured 100 USDC field.

- [ ] **Step 3: Remove SDK-first homepage content**

Remove the `CodeTabs` import and replace homepage interface/action copy:

```tsx
<SectionHeader eyebrow="Interface" title="One HTTP surface." />
<p className="section-intro">
  Buyers authenticate with a bound cfk_* API key and call AIRouter directly. Providers connect existing upstream APIs through coordinated onboarding.
</p>
<pre className="code-block"><code>{`POST $CLAWFARM_GATEWAY_URL/clawfarm/chat/completions
Authorization: Bearer $CLAWFARM_API_KEY`}</code></pre>
```

Replace `Devnet active . Mainnet pending . Solana` with `Mainnet v3 active . Solana`, replace Test USDC with USDC in default-state copy, and change calls to action to `Start Buyer onboarding` and `Start Provider onboarding`.

- [ ] **Step 4: Delete the unused SDK component**

```bash
git rm app/components/CodeTabs.tsx
```

- [ ] **Step 5: Run content and type checks**

```bash
npm run verify:site
npx tsc --noEmit
```

Expected: Buyer, AIRouter route, Mainnet, and no-public-SDK checks pass. Only stale whitepaper requirements may remain.

- [ ] **Step 6: Commit the Buyer/docs slice**

```bash
git add app/builders/page.tsx app/docs/page.tsx app/page.tsx app/components/CodeTabs.tsx
git commit -m "docs: replace SDK onboarding with AIRouter HTTP flow"
```

## Task 5: Correct And Regenerate The Whitepaper

**Files:**
- Modify: `scripts/generate-whitepaper-v1.py`
- Modify: `public/whitepaper.pdf`
- Modify: `public/ClawFarm_Whitepaper_v1.0.pdf`

- [ ] **Step 1: Update every direct cold-start source reference**

In Section 14 use exactly:

```python
"CLAF launches with no schedule pre-allocation to the team, investors, foundation, marketing, or maintenance, and with no pre-existing market. The protocol bootstraps initial liquidity with 500,000 CLAF, 0.05 percent of total supply, donated by early community members. This portion is publicly verifiable on-chain and is not retained by any donor or team wallet.",
"The donated CLAF is paired with 50 USDC of team-provided capital, creating a Raydium CPMM pool at an initial fully diluted valuation of 100,000 USDC and an opening price of 0.0001 USDC per CLAF.",
"The LP tokens received from pool creation are burned. No donor or team wallet retains any claim on the seed liquidity. The 50 USDC and 500,000 CLAF become surrendered pool depth that supports subsequent buyback and add-LP activity.",
```

Update Appendix A:

```python
("Min pool liquidity", "0 at deploy; activated only after pool seeding and subject to the bounded launch policy"),
("Initial pool seeding", "50 USDC + 500,000 CLAF, with seed LP burned at pool creation"),
```

Do not invent a numeric replacement for the old 5,000 USDC minimum-liquidity threshold.

- [ ] **Step 2: Run the content audit and verify GREEN**

```bash
npm run verify:site
```

Expected: PASS with no Mainnet, onboarding, SDK, secret, or whitepaper failures.

- [ ] **Step 3: Regenerate both PDFs from the canonical source**

```bash
python3 scripts/generate-whitepaper-v1.py
```

Expected: both PDF files are updated and the command exits 0.

- [ ] **Step 4: Extract text and verify new and stale figures**

```bash
pdftotext public/whitepaper.pdf - | rg -n '500,000 CLAF|50 USDC|0\.0001 USDC per CLAF|100,000 USDC'
pdftotext public/whitepaper.pdf - | rg -n '10,000,000 CLAF|5,000 USDC|0\.0005 USDC per CLAF|500,000 USDC' && exit 1 || true
cmp public/whitepaper.pdf public/ClawFarm_Whitepaper_v1.0.pdf
```

Expected: all four new facts are present, stale facts are absent, and both PDFs are identical.

- [ ] **Step 5: Render and inspect affected PDF pages**

Render the PDF to a temporary directory and inspect the Section 14 and Appendix pages:

```bash
pdfimages -list public/whitepaper.pdf >/dev/null
CLAWFARM_PDF_RENDER_DIR="$(mktemp -d)"
pdftoppm -png -r 120 public/whitepaper.pdf "$CLAWFARM_PDF_RENDER_DIR/page"
```

Expected: no clipping, overlap, missing glyphs, or broken pagination around Section 14 and Appendix A.

- [ ] **Step 6: Commit the whitepaper slice**

```bash
git add scripts/generate-whitepaper-v1.py public/whitepaper.pdf public/ClawFarm_Whitepaper_v1.0.pdf
git commit -m "docs: revise cold-start liquidity commitment"
```

## Task 6: Align README And Public Metadata

**Files:**
- Modify: `README.md`
- Modify: `app/layout.tsx` only if SDK/receipt-era metadata remains inaccurate after the page updates

- [ ] **Step 1: Rewrite the README stage and site map**

Start with:

```md
# ClawFarm Site

ClawFarm is the Mainnet-first public website for the Phase 1 masterpool v3 settlement protocol and its AIRouter integration.
The site documents Provider onboarding, B-side Buyer API access, mainnet payment records, epoch settlement roots, USDC settlement, and CLAF rewards.
```

Update the Phase 1 bullets to say Mainnet uses 3,600-second epochs, native USDC, static dated snapshots, 70/30 Provider/Buyer pools, and current v3 Provider registration transfers no upfront stake. Update the site map so `/builders`, `/providers`, `/install`, and `/docs` describe the AIRouter flows and no longer mention an SDK.

- [ ] **Step 2: Run the public content audit**

```bash
npm run verify:site
```

Expected: PASS.

- [ ] **Step 3: Commit README/metadata alignment**

```bash
git add README.md app/layout.tsx
git commit -m "docs: align public metadata with mainnet launch"
```

## Task 7: Full Verification, Browser QA, And Delivery Audit

**Files:**
- Verify all changed files
- Modify only files that fail a verification step

- [ ] **Step 1: Run all automated checks fresh**

```bash
npm run verify:site
npx tsc --noEmit
npm run build
```

Expected: all commands exit 0. The build produces the static `out/` export.

- [ ] **Step 2: Run the static site locally**

```bash
npx serve out -l 4173
```

Expected: the server starts at `http://localhost:4173` without runtime errors.

- [ ] **Step 3: Verify desktop and mobile behavior in a real browser**

Check `/`, `/providers`, `/install`, `/builders`, `/docs`, `/network`, `/state`, and `/whitepaper` at approximately 1440x900 and 390x844.

Verify:

- a fresh storage context selects Mainnet;
- `?network=devnet` selects Devnet and persists it;
- `?network=mainnet` restores Mainnet;
- Mainnet Explorer links contain no Devnet query parameter;
- the Mainnet snapshot date and balances render without overflow;
- Provider and Buyer step lists are readable and ordered;
- long HTTP code blocks scroll rather than widening the page;
- there are no console errors, failed local assets, or hydration warnings;
- no Mainnet-pending, SDK-install, fake registration form, or connected-wallet prompt remains.

- [ ] **Step 4: Audit changed text and generated artifacts**

Run:

```bash
git diff --check
git status --short
rg -n '[\p{Han}]|/Users/|/home/|/root/|api-key=|helius-rpc\.com|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|seed phrase|mnemonic|wallet\.json|id\.json' \
  README.md app docs/superpowers scripts public --glob '!public/*.pdf' --glob '!public/*.png' -P
rg -n 'Mainnet target pending|Mainnet target not deployed|Start with the SDK|@clawfarm/sdk|sdk-wrapper-target|10,000,000 CLAF|5,000 USDC|0\.0005 USDC per CLAF' \
  README.md app scripts/generate-whitepaper-v1.py
```

Expected: no prohibited matches. Review any match in the audit scripts themselves rather than assuming it is safe.

- [ ] **Step 5: Review the final diff against every acceptance criterion**

```bash
git diff HEAD~5 -- README.md app scripts/generate-whitepaper-v1.py docs/superpowers/specs/2026-07-30-mainnet-airouter-onboarding-design.md docs/superpowers/plans/2026-07-30-mainnet-airouter-onboarding.md
git log --oneline -8
```

Expected: all design requirements map to a changed file and no unrelated refactor is present.

- [ ] **Step 6: Commit any verification-only fixes**

If verification required edits:

```bash
git add <only-the-files-fixed-during-verification>
git commit -m "fix: close mainnet launch verification gaps"
```

If no files changed, do not create an empty commit.

## Plan Self-Review

- Spec coverage: Mainnet default, static mainnet snapshot, network-aware labels, Provider onboarding, Buyer onboarding, direct AIRouter HTTP, whitepaper/PDF updates, README, browser QA, and delivery audit each have an implementation task.
- Placeholder scan: example credentials and Gateway URL use explicit non-secret placeholders; there are no implementation placeholders or deferred tasks.
- Type consistency: the plan removes `mainnetTargetEpochSeconds` from the shared type and every consumer in the same network task; `cfk_*`, `CLAWFARM_GATEWAY_URL`, and AIRouter route names match the current code.
- Protocol consistency: current v3 Provider registration transfers zero stake even though mainnet config stores 100 USDC; the plan labels both facts without conflating them.
- Security consistency: local source paths appear only as plan-time operator commands, never in the public app, README, whitepaper source, or generated PDFs; the final audit explicitly checks shipped files.
