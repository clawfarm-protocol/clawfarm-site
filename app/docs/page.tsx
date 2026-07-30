import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Documentation — ClawFarm',
  description: 'AIRouter HTTP integration, Provider onboarding, and masterpool v3 settlement reference for ClawFarm on Solana Mainnet.',
  alternates: { canonical: '/docs' },
}

const toc = [
  ['Buyer quickstart', '#quickstart'],
  ['Authentication', '#authentication'],
  ['HTTP routes', '#routes'],
  ['Settlement', '#settlement'],
  ['Provider onboarding', '#provider'],
  ['Contract shape', '#contract'],
  ['Payment lifecycle', '#payment-lifecycle'],
  ['Mainnet parameters', '#mainnet-parameters'],
  ['Resources', '#resources'],
]

const chatExample = `curl "$CLAWFARM_GATEWAY_URL/clawfarm/chat/completions" \\
  -H "X-Api-Key: $CLAWFARM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "<model-id>",
    "messages": [
      {"role": "user", "content": "What is proof-based settlement?"}
    ]
  }'`

export default function DocsPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <p className="eyebrow">AIRouter · masterpool v3</p>
          <h1 className="page-title">Documentation</h1>
          <p className="page-copy">
            Direct HTTP integration for Buyers, operator-assisted onboarding for Providers, and the on-chain settlement facts behind both paths.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container docs-layout">
          <nav className="docs-toc" aria-label="Documentation sections">
            {toc.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
          </nav>

          <article className="docs-content">
            <section id="quickstart">
              <h2>Buyer quickstart</h2>
              <p>
                Contact the ClawFarm team to receive a one-time <span className="mono">cfk_*</span> API key and bind a public Solana Mainnet wallet. Fund that wallet with native Mainnet USDC before sending paid traffic. Never provide the wallet&apos;s private key or seed phrase.
              </p>
              <p>
                ClawFarm does not require an SDK. Call AIRouter from a trusted server environment using the issued key and a model returned by the models endpoint.
              </p>
              <h3>Environment</h3>
              <pre className="code-block"><code>{`export CLAWFARM_GATEWAY_URL="<gateway-url>"
export CLAWFARM_API_KEY="<issued-cfk-key>"`}</code></pre>
              <h3>Discover models</h3>
              <pre className="code-block"><code>{`curl "$CLAWFARM_GATEWAY_URL/clawfarm/v1/models" \\
  -H "Authorization: Bearer $CLAWFARM_API_KEY"`}</code></pre>
              <h3>Send a chat completion</h3>
              <pre className="code-block"><code>{chatExample}</code></pre>
            </section>

            <section id="authentication">
              <h2>Authentication</h2>
              <p>Use either accepted header form. Do not send both, log the credential, or expose it in browser-delivered JavaScript.</p>
              <pre className="code-block"><code>{`Authorization: Bearer $CLAWFARM_API_KEY

# or
X-Api-Key: $CLAWFARM_API_KEY`}</code></pre>
              <div className="key-list">
                <div>API key</div>
                <div>A one-time <span className="mono">cfk_*</span> credential issued during Buyer onboarding.</div>
                <div>Bound wallet</div>
                <div>The public Mainnet wallet registered to the active billing configuration.</div>
                <div>Funding</div>
                <div>Native Solana Mainnet USDC funds paid inference; maintain the balance before sending traffic.</div>
              </div>
            </section>

            <section id="routes">
              <h2>HTTP routes</h2>
              <p>AIRouter exposes protocol-compatible request surfaces. Use the path matching the request and response format already used by your application.</p>
              <div className="key-list">
                <div>GET /clawfarm/v1/models</div>
                <div>Lists the model IDs currently exposed through ClawFarm.</div>
                <div>GET /clawfarm/v1/model-quota</div>
                <div>Returns quota information for the authenticated Buyer and selected model context.</div>
                <div>POST /clawfarm/chat/completions</div>
                <div>OpenAI-compatible chat completions.</div>
                <div>POST /clawfarm/v1/responses</div>
                <div>OpenAI-compatible Responses requests.</div>
                <div>POST /clawfarm/v1/messages</div>
                <div>Anthropic-compatible Messages requests.</div>
                <div>POST /clawfarm/google/v1/models/&lt;model&gt;:generateContent</div>
                <div>Google-compatible generated content, including the corresponding <span className="mono">:streamGenerateContent</span> form.</div>
                <div>POST /clawfarm/models/&lt;model&gt;:generateContent</div>
                <div>Short Google-compatible path, also supporting the streaming method suffix.</div>
              </div>
            </section>

            <section id="settlement">
              <h2>Asynchronous settlement</h2>
              <p>
                AIRouter authorizes traffic against the active billing configuration and its bound wallet, meters the request, persists a receipt, and queues the masterpool v3 settlement path. The inference response does not wait for on-chain finalization.
              </p>
              <div className="key-list">
                <div>X-ClawFarm-Request-Nonce</div>
                <div>Request identity used for payment, proof, and settlement lookup.</div>
                <div>X-ClawFarm-Payment-Status</div>
                <div><span className="mono">settlement_pending</span> means a durable receipt exists and settlement is queued; it is not a final on-chain confirmation.</div>
                <div>X-ClawFarm-Max-Charge-Atomic</div>
                <div>Maximum authorized charge in atomic USDC units.</div>
                <div>X-ClawFarm-Charge-Atomic</div>
                <div>Metered charge when available on the response.</div>
                <div>X-ClawFarm-Receipt-Hash</div>
                <div>Receipt identity when emitted by the asynchronous settlement path.</div>
              </div>
              <p>
                Public proof and settlement lookup surfaces can resolve records by request nonce or receipt hash. Preserve those response values with your application logs, without logging the API key.
              </p>
            </section>

            <section id="provider">
              <h2>Provider onboarding</h2>
              <p>
                Contact the ClawFarm team. Provide the supported API protocol, upstream base URL, model catalog, pricing, quota, rate limits, timeout constraints, and the public Solana Mainnet provider wallet.
              </p>
              <p>
                Deliver the upstream API key only through the secure channel agreed with the team. ClawFarm verifies the upstream, stores the key encrypted, configures AIRouter, and bootstraps <span className="mono">ProviderAccountV3</span>. Never send a provider private key, seed phrase, or wallet file.
              </p>
              <div className="key-list">
                <div>Provider metadata</div>
                <div>Endpoint, models, pricing, limits, and upstream credentials remain in the off-chain AIRouter operator layer.</div>
                <div>ProviderAccountV3</div>
                <div>Stores the provider wallet, pending provider USDC, status, and timestamps.</div>
                <div>Current registration stake</div>
                <div><span className="mono">register_provider_v3</span> initializes <span className="mono">staked_usdc_amount</span> to zero and transfers no upfront stake.</div>
                <div>Configuration parameter</div>
                <div>Mainnet GlobalConfigV3 stores a 100 USDC provider-stake parameter, but the current registration instruction does not collect it.</div>
              </div>
              <p><Link href="/install">Open the full Provider onboarding checklist →</Link></p>
            </section>

            <section id="contract">
              <h2>Current contract shape</h2>
              <p>
                Masterpool v3 is the protocol source of truth for payment and epoch settlement. AIRouter owns endpoint selection, model metadata, usage metering, receipt persistence, and settlement orchestration; those fields are not stored in ProviderAccountV3.
              </p>
              <div className="key-list">
                <div>Payment recording</div>
                <div>Records payer and provider identities, base charge, configured tax, payment index state, and epoch aggregates.</div>
                <div>Vault movement</div>
                <div>Tax moves to treasury and base USDC moves to provider pending when the payment is recorded.</div>
                <div>Settlement batches</div>
                <div>Authorized submissions commit usage, provider, and buyer roots with aggregate totals for an ended epoch.</div>
                <div>Challenges</div>
                <div>Accepted challenges invalidate bad pending batches; rejected challenges restore the batch to pending.</div>
                <div>Claims</div>
                <div>Finalized roots authorize Merkle-proof claims for provider USDC, provider CLAF, and Buyer CLAF.</div>
              </div>

              <h3 id="payment-lifecycle">Payment lifecycle</h3>
              <pre className="code-block"><code>{`1. AIRouter authenticates the cfk_* key and resolves its active wallet-bound billing configuration.
2. AIRouter selects an eligible upstream provider and bounds the maximum USDC charge.
3. The upstream response is metered and a durable ClawFarm receipt is persisted.
4. The response returns with settlement_pending while asynchronous settlement is queued.
5. Masterpool v3 records the payment and moves tax and base USDC into their respective vaults.
6. After the epoch ends, an authorized submitter commits aggregate settlement roots.
7. A valid batch finalizes after review; Merkle proofs then authorize provider and Buyer claims.`}</code></pre>
            </section>

            <section id="mainnet-parameters">
              <h2>Mainnet parameters</h2>
              <div className="key-list">
                <div>Cluster</div><div>Solana Mainnet</div>
                <div>Payment mint</div><div>Native Solana Mainnet USDC</div>
                <div>Epoch duration</div><div>3,600 seconds</div>
                <div>Reward split</div><div>70 percent Provider / 30 percent Buyer</div>
                <div>Payment tax cap</div><div>300 basis points</div>
                <div>Emission inventory</div><div>1,000,000,000 CLAF over the configured emission duration</div>
                <div>Pause state at snapshot</div><div>Payments, settlements, and claims are enabled</div>
              </div>
              <p><Link href="/network">Inspect program addresses and the dated Mainnet snapshot →</Link></p>
            </section>

            <section id="resources">
              <h2>Resources</h2>
              <div className="key-list">
                <div>Network state</div><div><Link href="/network">Program addresses, config, and vault balances</Link></div>
                <div>Protocol state</div><div><Link href="/state">Selected-network state overview</Link></div>
                <div>Whitepaper</div><div><Link href="/whitepaper">Economics, launch commitments, and governance bounds</Link></div>
                <div>Provider onboarding</div><div><Link href="/install">Operator-assisted integration checklist</Link></div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}
