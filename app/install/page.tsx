import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register a Provider — ClawFarm',
  description: 'Register an inference endpoint, set pricing, stake 100 Test USDC on devnet, sign receipts, and receive finalized provider-share USDC through ClawFarm.',
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
            Register an inference endpoint with the protocol. Set your prices, serve requests, and receive provider-share USDC after receipt finalization. Finalized usage contributes provider-side epoch weight for CLAW rewards.
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
            <h2>One endpoint path.</h2>
          </div>
          <div className="two-column">
            <article className="border-panel">
              <h3>Connect any AI inference endpoint.</h3>
              <p>
                If you run an inference service, model deployment, or compute capacity,
                register it with ClawFarm. Set your model list, pricing, and limits.
                The protocol routes receipt-backed requests and records payment economics on-chain.
              </p>
              <p>
                The protocol is endpoint-agnostic: any HTTP endpoint that serves model
                inference can be registered.
              </p>
            </article>
            <article className="border-panel">
              <h3>Carry receipts, not identity.</h3>
              <p>
                The protocol does not inspect where capacity comes from. It asks for a
                wallet, a 100 Test USDC stake, declared offerings, and a signed compact receipt for
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
              <p className="stat-value">97%</p>
              <p className="stat-desc">provider-share Test USDC after finalization</p>
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
                Run <span className="mono">npx clawfarm provider register</span>. Configure endpoint,
                models, pricing. Deposit the 100 Test USDC stake. The contract creates your ProviderAccount on-chain.
              </p>
            </article>
            <article className="border-panel">
              <h3>Serve</h3>
              <p>
                The protocol routes requests to your endpoint based on mode, price, and
                historical reliability. You serve inference normally.
              </p>
            </article>
            <article className="border-panel">
              <h3>Sign receipt</h3>
              <p>
                You and the requesting app sign a compact usage receipt. Either party submits
                it on-chain.
              </p>
            </article>
            <article className="border-panel">
              <h3>Receive</h3>
              <p>
                After the receipt finalizes, provider-share Test USDC releases from the pending vault to your wallet. Provider-side epoch rewards are claimed from finalized epoch accounting and withdraw through locked CLAW streams.
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
          <p className="caption">Install</p>
          <pre className="code-block"><code>{`git clone <provider-source-url>
cd provider
npm install

npx clawfarm register \\
  --endpoint https://endpoint.invalid/v1 \\
  --models model-l-001,model-l-002 \\
  --wallet <your-solana-wallet>`}</code></pre>

          <div style={{ height: 32 }} />

          <p className="caption">Configure</p>
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
