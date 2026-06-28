import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register a Provider — ClawFarm',
  description: 'Register a provider wallet, configure endpoint metadata off-chain, record payments, and claim provider USDC through ClawFarm.',
  alternates: { canonical: '/install' },
}

export default function InstallPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <p className="eyebrow">Providers</p>
          <h1 className="page-title">Register a compute provider.</h1>
          <p className="page-copy">
            Register a provider wallet with masterpool v3. Publish endpoint and pricing metadata through an off-chain gateway or operator directory, serve requests, and receive provider USDC through finalized epoch Merkle claims. Finalized usage contributes provider-side mining weight for CLAF rewards.
          </p>
          <p className="page-copy">
            The protocol does not ask where your capacity comes from, and would not
            understand the answer.
          </p>
          <div className="hero-actions">
            <a href="#setup" className="primary-button">Start registration →</a>
            <Link href="/docs#provider" className="secondary-button">Read provider docs →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>One provider account path.</h2>
          </div>
          <div className="two-column">
            <article className="border-panel">
              <h3>Register a provider wallet.</h3>
              <p>
                If you run an inference service, model deployment, or compute capacity,
                register the provider wallet with ClawFarm. Publish model list, pricing, and limits in the gateway or operator directory.
                ProviderAccountV3 records provider wallet, pending provider USDC, status, and timestamps. Current v3 registration has no upfront USDC collateral transfer.
              </p>
              <p>
                The on-chain registration is endpoint-agnostic: endpoint details remain in off-chain directory metadata.
              </p>
            </article>
            <article className="border-panel">
              <h3>Carry receipts, not identity.</h3>
              <p>
                The protocol does not inspect where capacity comes from. It asks for a
                wallet, off-chain directory metadata, and recorded payment facts for
                each settled session.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stat-grid">
            <div className="stat-cell">
              <p className="stat-value">100% base</p>
              <p className="stat-desc">provider pending USDC before configured tax</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">70%</p>
              <p className="stat-desc">provider epoch weight share</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">No collateral transfer</p>
              <p className="stat-desc">current v3 provider registration</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">Direct claims</p>
              <p className="stat-desc">CLAF transfers from reward vault</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>How it works.</h2>
          </div>
          <div className="two-column">
            <article className="border-panel">
              <h3>Register</h3>
              <p>
                A provider wrapper can call <span className="mono">register_provider_v3</span> to create the on-chain ProviderAccountV3 with wallet, pending provider USDC, status, and timestamps. Current v3 registration has no upfront USDC collateral transfer. Configure endpoint, models, and pricing in an off-chain gateway or operator directory.
              </p>
            </article>
            <article className="border-panel">
              <h3>Serve</h3>
              <p>
                Apps and gateways choose your provider wallet from off-chain directory metadata. You serve inference after the payer token delegate is prepared for payment recording.
              </p>
            </article>
            <article className="border-panel">
              <h3>Sign receipt</h3>
              <p>
                A wrapper prepares the payment nonce hash and payment record. Masterpool v3 records the payment, then updates the epoch accumulator and payment bitmap.
              </p>
            </article>
            <article className="border-panel">
              <h3>Receive</h3>
              <p>
                After epoch settlement finalizes, provider base-charge Test USDC and provider-side CLAF rewards release through Merkle proof claims against the finalized settlement root.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="setup">
        <div className="container">
          <div className="section-heading">
            <h2>SDK setup.</h2>
          </div>
          <p className="caption">Provider wrapper target</p>
          <pre className="code-block"><code>{`# Wrapper target: calls register_provider_v3
clawfarm provider register \
  --cluster devnet \
  --provider-wallet <provider-wallet> \
  --provider-usdc-token <provider-usdc-token>

# Wrapper target: writes off-chain directory metadata
clawfarm directory configure \
  --endpoint https://endpoint.invalid/v1 \
  --models model-l-001,model-l-002`}</code></pre>
          <p className="section-footnote wide-footnote">
            The provider wrapper signs with the provider wallet and supplies the ProviderAccountV3 accounts required by current registration. Provider USDC and CLAF claims are handled later through finalized settlement roots.
          </p>

          <div style={{ height: 32 }} />

          <p className="caption">Operator directory config</p>
          <pre className="code-block"><code>{`{
  "endpoint": "https://endpoint.invalid/v1",
  "wallet": "your_solana_wallet_address",
  "pricing": {
    "input_per_1m_tokens_usdc": 2.50,
    "output_per_1m_tokens_usdc": 10.00
  },
  "models": ["model-l-001", "model-l-002"],
  "limits": {
    "max_requests_per_minute": 120,
    "timeout_ms": 60000
  }
}`}</code></pre>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Open-source repos.</h2>
          </div>
          <div className="key-list">
            <div>clawfarm-protocol/contracts</div>
            <div>Solana programs for receipt settlement and reward accounting.</div>
            <div>clawfarm-protocol/provider-sdk</div>
            <div>Provider registration and receipt tools.</div>
            <div>clawfarm-protocol/sdk</div>
            <div>Builder SDK.</div>
          </div>
        </div>
      </section>
    </main>
  )
}
