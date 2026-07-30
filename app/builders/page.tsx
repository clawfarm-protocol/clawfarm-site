import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Buyers — ClawFarm',
  description: 'Connect a Buyer to AIRouter with a wallet-bound ClawFarm API key and settle inference usage in native USDC on Solana Mainnet.',
  alternates: { canonical: '/builders' },
}

const buyerSteps = [
  ['01', 'Contact the ClawFarm team', 'Request Buyer access and describe the models and traffic profile you intend to use.'],
  ['02', 'Receive an API key', 'ClawFarm issues a one-time cfk_* credential. Store it as a secret and do not embed it in browser code or commit it to source control.'],
  ['03', 'Bind a wallet', 'Register the public Solana Mainnet wallet that will fund usage and receive Buyer-side CLAF claims. Never provide its private key or seed phrase.'],
  ['04', 'Fund with native USDC', 'Deposit native Solana Mainnet USDC into the bound wallet and retain enough SOL for any wallet-side network fees.'],
  ['05', 'Call AIRouter', 'Send an authenticated HTTP request directly to a ClawFarm route. AIRouter selects eligible provider capacity and queues settlement.'],
]

const curlExample = `curl "$CLAWFARM_GATEWAY_URL/clawfarm/chat/completions" \\
  -H "Authorization: Bearer $CLAWFARM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "<model-id>",
    "messages": [
      {"role": "user", "content": "Explain epoch settlement in one sentence."}
    ]
  }'`

export default function BuildersPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Buyers · Solana Mainnet</p>
          <h1 className="hero-title">Consume inference through AIRouter.</h1>
          <p className="hero-copy">
            A Buyer uses a wallet-bound ClawFarm API key, funds the registered wallet with native USDC, and calls familiar HTTP endpoints. No ClawFarm SDK is required.
          </p>
          <div className="hero-actions">
            <a href="#onboarding" className="primary-button">Buyer onboarding →</a>
            <Link href="/docs" className="secondary-button">HTTP reference →</Link>
          </div>
        </div>
      </section>

      <section className="section" id="onboarding">
        <div className="container">
          <SectionTitle eyebrow="Access" title="From contact to first request." />
          <div className="supply-grid">
            {buyerSteps.map(([number, title, body]) => (
              <article className="supply-layer" key={number}>
                <h3><span>{number}</span></h3>
                <p className="mechanism-title">{title}</p>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="quickstart">
        <div className="container">
          <SectionTitle eyebrow="HTTP" title="Make the first call." />
          <p className="section-intro">
            Set the gateway URL and the issued API key in your server environment, then choose a model returned by <span className="mono">GET /clawfarm/v1/models</span>.
          </p>
          <pre className="code-block"><code>{`export CLAWFARM_GATEWAY_URL="<gateway-url>"
export CLAWFARM_API_KEY="<issued-cfk-key>"`}</code></pre>
          <pre className="code-block"><code>{curlExample}</code></pre>
          <p className="section-footnote wide-footnote">
            <span className="mono">X-Api-Key: $CLAWFARM_API_KEY</span> is also accepted. Keep both the API key and wallet signing material out of client-side code.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Receipt" title="Read the settlement result." />
          <div className="key-list">
            <div>X-ClawFarm-Request-Nonce</div>
            <div>Stable request identity used to look up the corresponding payment and settlement records.</div>
            <div>X-ClawFarm-Payment-Status</div>
            <div><span className="mono">settlement_pending</span> means the response has a durable receipt and asynchronous on-chain settlement is queued.</div>
            <div>X-ClawFarm-Max-Charge-Atomic</div>
            <div>The maximum bounded charge for the request, expressed in atomic USDC units.</div>
            <div>X-ClawFarm-Charge-Atomic</div>
            <div>The metered charge when it is available at response time.</div>
          </div>
          <p className="table-action"><Link href="/docs#settlement">Full settlement reference →</Link></p>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading dapp-header">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}
