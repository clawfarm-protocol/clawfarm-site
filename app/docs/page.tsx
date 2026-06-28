import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation — ClawFarm',
  description: 'Devnet SDK, payment lifecycle, epoch settlement, and Phase 1 protocol economics for ClawFarm.',
  alternates: { canonical: '/docs' },
}

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
  ['Payment lifecycle', '#payment-lifecycle'],
  ['Phase 1 economics', '#phase-1-economics'],
  ['Challenges', '#challenges'],
  ['Devnet parameters', '#devnet-parameters'],
  ['Reproducibility', '#reproducibility'],
  ['Resources', '#resources'],
]

export default function DocsPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1 className="page-title">Documentation</h1>
          <p className="page-copy">Devnet integration guides and Phase 1 payment and epoch-settlement specification.</p>
        </div>
      </section>

      <section className="section">
        <div className="container docs-layout">
          <nav className="docs-toc" aria-label="Documentation sections">
            {toc.map(([label, href], index) => (
              <a className={index > 0 && index < 7 ? 'toc-sub' : undefined} href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>

          <article className="docs-content">
            <section id="quickstart">
              <h2>Quickstart</h2>
              <p>
                The devnet contract path is Solana-native. SDK examples on this page are wrapper targets: the wrapper must build payment indexes, payment nonce hashes, payer token delegates, epoch PDAs, Merkle settlement artifacts, and masterpool v3 accounts before sending transactions.
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
                A contract-aligned wrapper records wallet-paid usage through masterpool v3, then settles ended epochs through aggregate roots and Merkle claims.
              </p>
              <h3>TypeScript</h3>
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
              <h3>Python</h3>
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
              <h3>Rust</h3>
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
            </section>

            <section id="current-contract-shape">
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
            </section>

            <section id="gateway-wrapper-target">
              <h2>Gateway wrapper target</h2>
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
            </section>

            <section id="gateway-selection">
              <h2>Gateway selection</h2>
              <p>Applications or gateways choose the provider before payment recording. Masterpool v3 records payment identities, base charge, tax, epoch accumulator state, and payment bitmap state; finalized epoch roots later carry usage, provider, and buyer allocation data.</p>
              <div className="key-list">
                <div>Directory</div>
                <div>Endpoint, model, price, and limits are off-chain operator metadata.</div>
                <div>Selection</div>
                <div>Any app may choose a provider wallet before recording a masterpool v3 payment.</div>
                <div>Settlement</div>
                <div>Ended epochs settle through aggregate totals, usage roots, provider roots, buyer roots, and Merkle proof claims.</div>
              </div>
            </section>

            <section id="provider">
              <h2>Provider</h2>
              <p>Providers register one wallet-controlled ProviderAccountV3. Current registration initializes staking state without requiring an upfront collateral transfer.</p>
              <div className="key-list">
                <div>Register</div>
                <div>Masterpool registration records the provider wallet, initializes staked_usdc_amount to zero, and sets active status. Endpoint, model, and pricing metadata live in the off-chain gateway or operator directory layer.</div>
                <div>Stake</div>
                <div>GlobalConfigV3 retains provider_stake_usdc, but current register_provider_v3 initializes staked_usdc_amount to zero and does not enforce or transfer upfront collateral.</div>
                <div>Pricing</div>
                <div>Input, output, request, image, second, or task units.</div>
                <div>Payment artifacts</div>
                <div>Wrappers derive payment nonce hashes, epoch PDAs, accumulator accounts, bitmap chunks, and settlement artifacts before sending masterpool v3 transactions.</div>
              </div>
              <p>The masterpool account does not store endpoint infrastructure; applications and gateways bind endpoint metadata outside the on-chain provider account.</p>
            </section>

            <section id="models">
              <h2>Models</h2>
              <p>Model identifiers remain off-chain metadata used by applications and gateway directories. Masterpool v3 records payment and settlement artifacts, not model IDs.</p>
              <div className="key-list">
                <div>model-l-001</div>
                <div>Language model label supplied to wrapper artifacts outside ProviderAccountV3.</div>
                <div>model-i-001</div>
                <div>Image model label supplied to wrapper artifacts outside ProviderAccountV3.</div>
                <div>model-v-001</div>
                <div>Video model label supplied to wrapper artifacts outside ProviderAccountV3.</div>
              </div>
            </section>

            <section id="protocol">
              <h2>Protocol</h2>
              <p>ClawFarm Phase 1 is a payment-driven epoch settlement protocol for AI inference on Solana.</p>
              <h3 id="architecture">Architecture</h3>
              <pre className="code-block"><code>{`WALLET / APP LAYER
  Users · Builders · Agents · Provider operators

OFF-CHAIN DIRECTORY
  Provider choices · Model labels · Endpoint metadata · Price metadata

MASTERPOOL V3 PAYMENT LAYER
  ProviderAccountV3 · EpochPaymentAccumulator · EpochPaymentBitmap · Treasury and provider pending vaults

EPOCH SETTLEMENT LAYER
  EpochSettlementBatch · EpochSettlementChallenge · EpochSettlementRoot · EpochClaimBitmap · Merkle proof claims`}</code></pre>
              <h3 id="contracts">Smart contracts</h3>
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
              <h3 id="payment-lifecycle">Payment lifecycle</h3>
              <pre className="code-block"><code>{`1. Wallet authorizes bounded Test USDC settlement through a payer token delegate.
2. App or gateway prepares payment_index, payment_nonce_hash, base_charge_atomic, and tax_rate_bps.
3. Masterpool v3 records payment, transfers tax to treasury, transfers base charge to provider pending, and marks the epoch payment bitmap.
4. Epoch payment accumulator stores payment count plus total base, tax, and gross USDC.
5. After the epoch ends, an authorized submitter commits usage, provider, and buyer Merkle roots into an EpochSettlementBatch.
6. Settlement challenges may invalidate a pending batch until accepted or rejected by authority.
7. After the challenge deadline, finalization writes an EpochSettlementRoot.
8. Providers and buyers claim USDC or CLAF with Merkle proofs against the finalized root.`}</code></pre>
              <h3 id="phase-1-economics">Phase 1 economics</h3>
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
              <h3 id="challenges">Challenges</h3>
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
              <h3 id="devnet-parameters">Devnet parameters</h3>
              <div className="key-list">
                <div>Cluster</div><div>Solana devnet</div>
                <div>Masterpool implementation</div><div>clawfarm_masterpool_v3</div>
                <div>Program source</div><div>Latest implementation facts derive from the sibling clawfarm-masterpool repository.</div>
                <div>Provider collateral</div><div>ProviderAccountV3 includes staked_usdc_amount, but current registration initializes it to zero and does not transfer upfront collateral.</div>
                <div>Payment tax</div><div>Config-driven in GlobalConfigV3 and validated by record_payment_v3.</div>
                <div>Epoch settlement</div><div>Uses accumulator totals, payment bitmaps, settlement batches, challenges, finalized roots, and claim bitmaps.</div>
              </div>
            </section>

            <section id="reproducibility">
              <h2>Reproducibility</h2>
              <p>Contract builds should be verified against the current clawfarm-masterpool repository. The command below exposes the v3 bootstrap wrapper surface for testnet/devnet setup flows.</p>
              <h3>V3 wrapper command surface</h3>
              <pre className="code-block"><code>{`yarn phase1:v3:bootstrap:testnet --help`}</code></pre>
              <h3>Contract build</h3>
              <pre className="code-block"><code>{`git clone <contract-source-url>
cd clawfarm-masterpool
anchor build
anchor test`}</code></pre>
            </section>

            <section id="resources">
              <h2>Resources</h2>
              <p>Reference files and mirrors for developers, providers, and auditors.</p>
              <div className="key-list">
                <div>Contract source</div>
                <div>Protocol facts derive from the current clawfarm-masterpool repository.</div>
                <div>Phase 1 economics</div>
                <div>Payment recording, epoch settlement roots, challenges, and Merkle claim accounting.</div>
                <div>Website source</div>
                <div>Repository URL publishes after protocol organization migration.</div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}
