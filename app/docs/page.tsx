import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation — ClawFarm',
  description: 'Devnet SDK, receipt lifecycle, and Phase 1 protocol economics for ClawFarm.',
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
  ['Receipt lifecycle', '#receipt-lifecycle'],
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
          <p className="page-copy">Devnet integration guides and Phase 1 receipt-settlement specification.</p>
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

            <section id="gateway-selection">
              <h2>Gateway selection</h2>
              <p>Applications or gateways choose the provider before receipt submission. The on-chain programs record the provider wallet, payer, payment amount, token usage, receipt hash, and epoch weights.</p>
              <div className="key-list">
                <div>Directory</div>
                <div>Endpoint, model, price, and limits are off-chain operator metadata.</div>
                <div>Selection</div>
                <div>Any app may choose a provider wallet before submitting a compact receipt.</div>
                <div>Settlement</div>
                <div>The contract settles only the compact receipt facts and configured vault accounting.</div>
              </div>
            </section>

            <section id="provider">
              <h2>Provider</h2>
              <p>Providers register one wallet-controlled ProviderAccount and stake Test USDC on devnet.</p>
              <div className="key-list">
                <div>Register</div>
                <div>Masterpool registration records the provider wallet, stake amount, and active status. Endpoint, model, and pricing metadata live in the off-chain gateway or operator directory layer.</div>
                <div>Stake</div>
                <div>Devnet provider stake: 100 Test USDC.</div>
                <div>Pricing</div>
                <div>Input, output, request, image, second, or task units.</div>
                <div>Receipts</div>
                <div>A configured provider or gateway signer signs the compact receipt hash before on-chain settlement.</div>
              </div>
              <p>The masterpool account does not store endpoint infrastructure; applications and gateways bind endpoint metadata outside the on-chain provider account.</p>
            </section>

            <section id="models">
              <h2>Models</h2>
              <p>Model identifiers are off-chain labels used by applications and gateway directories. The current on-chain receipt stores compact hashes, wallet identities, token counts, payment amount, and epoch weights.</p>
              <div className="key-list">
                <div>model-l-001</div>
                <div>Language model identifier supplied as receipt metadata outside the ProviderAccount.</div>
                <div>model-i-001</div>
                <div>Image model identifier supplied as receipt metadata outside the ProviderAccount.</div>
                <div>model-v-001</div>
                <div>Video model identifier supplied as receipt metadata outside the ProviderAccount.</div>
              </div>
            </section>

            <section id="protocol">
              <h2>Protocol</h2>
              <p>ClawFarm Phase 1 is a receipt-driven settlement protocol for AI inference on Solana.</p>
              <h3 id="architecture">Architecture</h3>
              <pre className="code-block"><code>{`WALLET / APP LAYER
  Users · Builders · Agents · Provider operators

OFF-CHAIN DIRECTORY
  Provider choices · Model labels · Endpoint metadata · Price metadata

ATTESTATION LAYER
  ProviderSigner records · Compact receipts · Challenge lifecycle · Finalization authority

MASTERPOOL LAYER
  ProviderAccount · Test USDC split · Epoch weight · Locked CLAF streams · Vault accounting`}</code></pre>
              <h3 id="contracts">Smart contracts</h3>
              <div className="key-list">
                <div>clawfarm-attestation</div>
                <div>Verifies compact receipts, stores receipt status, opens challenges, and finalizes receipt economics through CPI.</div>
                <div>clawfarm-masterpool</div>
                <div>Owns reward, treasury, provider stake, provider pending revenue, and challenge-bond vault accounting.</div>
                <div>ProviderAccount</div>
                <div>Stores provider wallet, stake state, pending revenue counters, challenge counters, and registration status.</div>
                <div>ReceiptEconomicRecord</div>
                <div>Stores immutable receipt-time payment split, epoch weight, challenge deadline, and economic status.</div>
              </div>
              <h3 id="receipt-lifecycle">Receipt lifecycle</h3>
              <pre className="code-block"><code>{`1. Wallet authorizes bounded Test USDC settlement through a payer token delegate.
2. App or gateway prepares request_nonce_hash, metadata_hash, charge_atomic, and receipt_hash.
3. A configured gateway-capable signer signs receipt_hash, and the transaction includes the ed25519 proof instruction.
4. Attestation submits the compact receipt and records payment through masterpool CPI.
5. Masterpool splits Test USDC into provider-pending and treasury vaults.
6. Receipt survives or fails the challenge window.
7. Finalized receipts activate buyer/provider epoch weight and release provider pending USDC.
8. Finalized epochs create locked CLAF streams for claimable rewards.`}</code></pre>
              <h3 id="phase-1-economics">Phase 1 economics</h3>
              <div className="key-list">
                <div>USDC split</div>
                <div>Provider-selected protocol-fee tier: 0.5% to 3.0% in 0.5% increments. Treasury receives charge_atomic multiplied by the selected tier; provider-pending receives the remainder.</div>
                <div>Provider release</div>
                <div>Provider-share USDC remains pending until attestation marks the receipt finalized.</div>
                <div>Epoch reward</div>
                <div>Receipts record buyer and provider epoch weight from actual protocol-fee contribution; rewards are not paid directly per call.</div>
                <div>Pool split</div>
                <div>30% buyer-side CLAF pool and 70% provider-side CLAF pool by finalized epoch weight.</div>
                <div>Reward lock</div>
                <div>Claimed epoch rewards create locked streams using the configured lock-days snapshot.</div>
              </div>
              <h3 id="challenges">Challenges</h3>
              <div className="key-list">
                <div>Bond unit</div>
                <div>Challenges are bonded in CLAF.</div>
                <div>Rejected challenge</div>
                <div>The challenger bond is burned and the receipt remains economically valid.</div>
                <div>Accepted challenge</div>
                <div>The bond is returned, provider-share USDC is refunded to the payer, reward-vault transfer and burn economics apply, and activated receipt weight is removed when applicable.</div>
                <div>Timeout stance</div>
                <div>Receipt economics finalize only through the attestation lifecycle after the configured challenge window.</div>
              </div>
              <h3 id="devnet-parameters">Devnet parameters</h3>
              <div className="key-list">
                <div>Cluster</div><div>Solana devnet</div>
                <div>Masterpool program</div><div className="mono">DWbzvr2F8hKquw7cXQqhpEc8JnJ1covmP6f28Rwmy15q</div>
                <div>Attestation program</div><div className="mono">BwRMqumgiHbeMhG9xs1a76vUjmprrokr6WsPCzhz3pKK</div>
                <div>CLAF mint</div><div className="mono">EW7npwHnVtTXvimde3Zj6dHX4mWbSAb5zkkHCrvkC8ui</div>
                <div>Test USDC mint</div><div className="mono">Hpq3GKSHa6rX9pGSRw2Gvoz6AbP16GMtHPVMxLr7P553</div>
                <div>Provider stake</div><div>100 Test USDC</div>
                <div>Challenge bond</div><div>Configured CLAF bond on devnet.</div>
                <div>Challenge window</div><div>Short devnet window for rollout testing; mainnet timing remains pending until mainnet config is deployed.</div>
                <div>Reward lock</div><div>Configured lock-days snapshot; current Phase 1 default is 180 days.</div>
              </div>
            </section>

            <section id="reproducibility">
              <h2>Reproducibility</h2>
              <p>Contract state and builds should be verified against the current clawfarm-masterpool repository.</p>
              <h3>Devnet state check</h3>
              <pre className="code-block"><code>{`npx clawfarm phase1 status --cluster devnet`}</code></pre>
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
                <div>Receipt settlement, epoch weight, challenge, and reward-stream accounting.</div>
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
