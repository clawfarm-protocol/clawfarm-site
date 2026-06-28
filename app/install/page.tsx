import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register a Provider — ClawFarm',
  description: 'Register a provider wallet, stake 100 Test USDC on devnet, configure endpoint metadata off-chain, sign receipts, and receive finalized provider-share USDC through ClawFarm.',
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
            Register a provider wallet with the protocol. Publish endpoint, pricing, and protocol-fee tier metadata through an off-chain gateway or operator directory, serve requests, and receive provider-share USDC after receipt finalization. Finalized fee contribution determines provider-side epoch weight for CLAF rewards.
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
                The protocol records wallet, stake, status, receipt payment economics, and reward accounting on-chain.
              </p>
              <p>
                The on-chain registration is endpoint-agnostic: endpoint details remain in off-chain directory metadata.
              </p>
            </article>
            <article className="border-panel">
              <h3>Carry receipts, not identity.</h3>
              <p>
                The protocol does not inspect where capacity comes from. It asks for a
                wallet, a 100 Test USDC stake, off-chain directory metadata, and a signed compact receipt for
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
              <p className="stat-value">99.5%-97%</p>
              <p className="stat-desc">provider-share Test USDC after selected fee tier</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">70%</p>
              <p className="stat-desc">provider epoch weight share</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">100 Test USDC</p>
              <p className="stat-desc">devnet provider stake</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">180 days</p>
              <p className="stat-desc">configured reward lock</p>
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
                A provider wrapper can call <span className="mono">masterpool.register_provider</span> to create the on-chain ProviderAccount with wallet, stake, and status. Configure endpoint, models, and pricing in an off-chain gateway or operator directory.
              </p>
            </article>
            <article className="border-panel">
              <h3>Serve</h3>
              <p>
                Apps and gateways choose your provider wallet from off-chain directory metadata. You serve inference normally before a compact receipt is submitted.
              </p>
            </article>
            <article className="border-panel">
              <h3>Sign receipt</h3>
              <p>
                A configured provider or gateway signer signs the compact receipt hash. The attestation flow submits that compact receipt with the payer and payment delegate accounts.
              </p>
            </article>
            <article className="border-panel">
              <h3>Receive</h3>
              <p>
                After the receipt finalizes, provider-share Test USDC releases from the pending vault to your wallet. Provider-side epoch rewards are weighted by actual protocol-fee contribution, claimed from finalized epoch accounting, and withdrawn through locked CLAF streams.
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
          <pre className="code-block"><code>{`# Wrapper target: calls masterpool.register_provider
clawfarm provider register \
  --cluster devnet \
  --provider-wallet <provider-wallet> \
  --provider-usdc-token <provider-usdc-token>

# Wrapper target: writes off-chain directory metadata
clawfarm directory configure \
  --endpoint https://endpoint.invalid/v1 \
  --models model-l-001,model-l-002`}</code></pre>
          <p className="section-footnote wide-footnote">
            The provider wrapper signs with the provider wallet, transfers the configured 100 Test USDC stake, and supplies provider account, provider reward account, stake vault, provider USDC token, and Test USDC mint accounts.
          </p>

          <div style={{ height: 32 }} />

          <p className="caption">Operator directory config</p>
          <pre className="code-block"><code>{`{
  "endpoint": "https://endpoint.invalid/v1",
  "wallet": "your_solana_wallet_address",
  "stake_test_usdc": 100,
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
