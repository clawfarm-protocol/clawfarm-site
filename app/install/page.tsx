import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register a Provider — ClawFarm',
  description: 'Register an inference endpoint, set pricing, post a 100 USDC bond, sign usage proofs, and receive settlement through ClawFarm.',
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
            Register an inference endpoint with the protocol. Set your prices. Serve
            requests. Get paid in USDC on every settled call, plus CLAF from the
            epoch pool.
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
                The protocol routes dual-signed requests and settles payment automatically.
              </p>
              <p>
                The protocol is endpoint-agnostic: any HTTP endpoint that serves model
                inference can be registered.
              </p>
            </article>
            <article className="border-panel">
              <h3>Carry proof, not identity.</h3>
              <p>
                The protocol does not inspect where capacity comes from. It asks for a
                wallet, a 100 USDC bond, declared offerings, and a dual-signed proof for
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
              <p className="stat-desc">of every USDC payment</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">70%</p>
              <p className="stat-desc">of every epoch&apos;s CLAF emission</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">100 USDC</p>
              <p className="stat-desc">bond, refundable after 7-day exit</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">180 days</p>
              <p className="stat-desc">linear vesting on CLAF</p>
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
                models, pricing. Deposit 100 USDC bond. The contract creates your ProviderAccount on-chain.
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
              <h3>Sign proof</h3>
              <p>
                You and the requesting app dual-sign a usage receipt. Either party submits
                it on-chain.
              </p>
            </article>
            <article className="border-panel">
              <h3>Receive</h3>
              <p>
                After the 24-hour challenge window, 97% USDC is released to your wallet.
                CLAF compensation vests linearly over 180 days from the epoch end.
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
  "bond_usdc": 100,
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
            <div>Solana programs. Immutable since Genesis.</div>
            <div>clawfarm-protocol/provider-sdk</div>
            <div>Provider tools.</div>
            <div>clawfarm-protocol/sdk</div>
            <div>Builder SDK.</div>
          </div>
        </div>
      </section>
    </main>
  )
}
