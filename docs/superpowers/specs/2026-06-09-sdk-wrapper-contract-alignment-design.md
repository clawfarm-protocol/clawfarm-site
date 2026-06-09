# SDK Wrapper Contract Alignment Design

Date: 2026-06-09
Branch: `develop`
Status: approved for planning

## Context

The ClawFarm website currently presents SDK, CLI, and HTTP examples as if TypeScript, Python, Rust, provider CLI, and gateway API wrappers already hide the low-level Solana contract call graph. That direction is acceptable for public developer documentation, but the examples must still map cleanly to the current devnet contracts in `clawfarm-masterpool` and `clawfarm-attestation`.

The current devnet contracts expose lower-level Solana instructions:

- `clawfarm-masterpool.register_provider`
- `clawfarm-attestation.submit_receipt`
- `clawfarm-attestation.finalize_receipt`
- challenge instructions through `clawfarm-attestation`
- epoch and reward instructions through `clawfarm-masterpool`

The website should therefore describe SDK, CLI, and HTTP examples as wrapper targets, not as contract-native APIs or confirmed deployed services.

## Problem

Several public examples are too abstract for the current contract shape:

- `cf.receipts.submit({ model, provider, payer, totalUsdc })` hides required receipt hashes, signer proof, token delegate, and masterpool accounts without saying that it is a wrapper target.
- Python and Rust snippets mirror the same over-simplified method shape.
- The HTTP example reads like a deployed receipt API, not a gateway wrapper target that creates or returns a Solana transaction.
- Provider onboarding examples imply a CLI exists and that endpoint registration is part of the on-chain provider registration path.
- Some copy still uses endpoint-first language where the contract registers a wallet-controlled `ProviderAccount`.

## Contract Facts To Preserve

### Provider Registration

`masterpool.register_provider` records and initializes:

- provider wallet
- provider stake amount
- pending provider USDC counter
- challenge and unsettled receipt counters
- provider status
- provider reward account

The instruction requires provider wallet signing, a provider USDC token account, the configured provider stake vault, the Test USDC mint, and derived provider/reward PDAs. Endpoint, model, price, quality, and limits are off-chain gateway or directory metadata.

### Receipt Submission

`attestation.submit_receipt` takes `SubmitReceiptArgs`:

- `request_nonce_hash`
- `metadata_hash`
- `prompt_tokens`
- `completion_tokens`
- `charge_atomic`
- `receipt_hash`

The compact receipt hash uses the `clawfarm:receipt:v2` domain separator and includes request nonce hash, metadata hash, provider wallet, payer user, USDC mint, prompt tokens, completion tokens, and charge amount.

The transaction must include an immediately preceding ed25519 verification instruction for the configured provider signer over `receipt_hash`. The current submit path requires the signer record to be gateway-capable. The transaction also requires payer settlement accounts, a payment delegate signer, the attestation receipt PDA, and masterpool config/provider/epoch/vault/economic-record accounts.

### Finalization And Rewards

Receipt finalization happens through `attestation.finalize_receipt` after the challenge window. It CPIs into masterpool to settle valid receipt economics, activate buyer/provider epoch weight, and release provider pending USDC.

Epoch and reward flow remains:

1. `masterpool.advance_epoch_if_needed`
2. `masterpool.finalize_epoch`
3. `masterpool.claim_epoch_reward`
4. `masterpool.claim_vested_claw`

Rewards are claimed into locked streams and withdrawn as they vest.

## Design Goals

- Keep SDK, CLI, and HTTP examples, but label them as wrapper targets.
- Make every wrapper method map to the current devnet contract fields and account requirements.
- Avoid implying that model IDs, endpoint metadata, or pricing are stored in `ProviderAccount` or direct receipt fields.
- Avoid implying that the current contract exposes a native HTTP API.
- Avoid claiming that SDK packages, Python packages, Rust crates, or CLI tools are already published unless the copy explicitly frames them as wrapper targets.
- Keep the public website English-only.

## Proposed Documentation Shape

### Docs Page

Replace the current one-step receipt quickstart with a two-layer structure:

1. **SDK wrapper target**
   - Shows the ideal developer-facing flow.
   - Uses `prepare` plus `submit`, not a single overloaded `submit` call.
   - States that the wrapper constructs the Solana transaction and required proof/account graph.

2. **Current devnet contract shape**
   - Lists `SubmitReceiptArgs` fields.
   - Lists required proof and account categories.
   - Explains that model and endpoint data enter through hashed metadata, not direct on-chain registry fields.

3. **Gateway wrapper target**
   - If an HTTP example remains, it must say the gateway creates or returns a Solana transaction.
   - It must not read as a contract-native REST endpoint.

4. **Provider registration wrapper target**
   - Explain that a CLI wrapper would call `masterpool.register_provider`.
   - Keep gateway configuration as off-chain directory metadata.

### CodeTabs Component

Update TypeScript, Python, and Rust snippets to a consistent wrapper shape:

- `receipts.prepare(...)`
- `receipts.submit(prepared, { gatewaySigner, paymentDelegate })`

The examples should include:

- `providerWallet`
- `payer` public key
- `payerUsdcToken`
- `requestNonce`
- metadata object with model label
- prompt and completion token counts
- `chargeUsdc`
- `gatewaySigner`
- `paymentDelegate`

The examples should avoid implying that `model` is a direct contract field.

### Install Page

Provider onboarding should distinguish two paths:

- on-chain registration target: provider wallet, provider USDC token, 100 Test USDC stake, provider/reward PDAs
- off-chain directory target: endpoint URL, model labels, pricing, limits

The CLI example can remain only if labeled as a wrapper target. It should not imply that `gateway configure` writes endpoint metadata on-chain.

### Home And README

Replace endpoint-first phrasing with provider-account phrasing:

- `Register an endpoint` becomes `Register a provider account` or `Register a provider wallet`.
- `wallet-controlled endpoint` becomes `wallet-controlled ProviderAccount`.

### Verification Guard

Extend `verify:site` to catch future regressions such as:

- contract-native HTTP API wording
- model or endpoint metadata stored on-chain
- endpoint registration on-chain wording
- one-step receipt submit examples that hide the wrapper target framing

## Example Wrapper Shape

TypeScript target:

```ts
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
```

Required explanatory copy:

```txt
The wrapper computes request_nonce_hash, metadata_hash, charge_atomic, and receipt_hash, then submits attestation.submit_receipt with an ed25519 proof instruction and the required masterpool accounts.
```

## Non-Goals

- Do not implement the SDK, CLI, Python package, Rust crate, or HTTP gateway.
- Do not add live contract calls to the static website.
- Do not invent mainnet addresses or mainnet config values.
- Do not add secrets, private RPC URLs, local wallet paths, or credentialed examples.

## Acceptance Criteria

- Public examples clearly distinguish wrapper targets from current contract instructions.
- SDK snippets use `prepare` plus `submit` and include the contract-required concepts.
- Docs include a clear current devnet contract shape section for receipt submission.
- Provider onboarding copy states that endpoint metadata is off-chain.
- Home and README no longer describe provider registration as endpoint registration.
- `npm run verify:site` passes.
- `npx tsc --noEmit` passes.
- `npm run build` is attempted; Google Fonts fetch timeout may remain an external blocker and should be reported separately if it recurs.

## Self-Review

- No placeholders or unresolved TODOs remain.
- Scope is limited to public documentation and examples, plus verification guard updates.
- The design does not claim that wrapper packages or gateway APIs are currently deployed.
- The design matches the current devnet contract shape for provider registration, receipt submission, finalization, epoch rewards, and vesting.
