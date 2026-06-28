import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Providers — ClawFarm',
  description: 'Provider registration surface for ClawFarm payment recording, epoch settlement roots, pending USDC revenue, and settlement challenge review.',
  alternates: { canonical: '/providers' },
}

const mechanismItems = [
  {
    label: 'PAYMENT RECORD',
    title: 'Settlement starts with masterpool v3 payment state.',
    body: 'Masterpool v3 accepts a payment nonce hash and records payment state for payer, provider wallet, base Test USDC charge, configured tax rate, and epoch accounting. Epoch roots become the source of truth for provider and buyer claims.',
  },
  {
    label: 'PENDING USDC',
    title: 'Provider revenue waits for finalization.',
    body: 'Wallet-paid Test USDC moves in two transfers at record time: tax moves into the treasury vault and base charge moves into the provider-pending vault. Provider USDC releases through provider Merkle claims after epoch settlement finalizes.',
  },
  {
    label: 'EPOCH CHALLENGE',
    title: 'Challenges review pending epoch batches.',
    body: 'Settlement challenges apply to pending epoch batches. Accepted challenges close invalid batches; rejected challenges restore batches so they can finalize after the challenge deadline.',
  },
]

export default function ProvidersPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Providers</p>
          <h1 className="hero-title">Supply inference.</h1>
          <p className="hero-copy">
            The protocol does not ask who you are or where inference comes from. It asks that wallet-paid usage settles through auditable payment records and finalized epoch roots.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="supply-grid">
            {mechanismItems.map((block) => (
              <article className="supply-layer" key={block.label}>
                <h3><span>{block.label}</span></h3>
                <p className="mechanism-title">{block.title}</p>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Register" title="Register a provider wallet." />
          <p className="section-intro">
            One on-chain record. A wallet, pending revenue, status, and timestamps.
          </p>
          <p className="section-intro">
            ProviderAccountV3 records provider wallet, pending provider USDC, status, and timestamps. Current v3 registration has no upfront USDC collateral transfer. Endpoint, model, pricing, and tax metadata belong to the off-chain gateway or operator directory layer.
          </p>
          <div className="dapp-card">
            <div className="field">
              <label htmlFor="endpoint-url">Directory endpoint URL</label>
              <input id="endpoint-url" placeholder="https://endpoint.invalid/v1" type="text" />
            </div>
            <div className="field">
              <label htmlFor="model-class">Directory model ID</label>
              <input id="model-class" placeholder="model-l-001" type="text" />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="price">Directory price per unit (USDC)</label>
                <input id="price" placeholder="—" type="text" />
              </div>
              <div className="field">
                <label htmlFor="quality">Directory quality declaration</label>
                <input id="quality" placeholder="—" type="text" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="tax-rate">Configured tax rate</label>
              <input id="tax-rate" placeholder="GlobalConfigV3.tax_rate_bps" type="text" />
            </div>
            <div className="field">
              <label htmlFor="wallet">Payout wallet</label>
              <input id="wallet" placeholder="addr_demo_7xQ…4fA" type="text" />
            </div>
            <div className="form-actions">
              <button className="btn primary" disabled type="button">Register provider</button>
            </div>
          </div>

          <SectionTitle eyebrow="Active registrations" title="Wallet providers" meta="Connect wallet" />
          <div className="protocol-table-shell">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Model</th>
                  <th className="num-col">Price</th>
                  <th className="num-col">24h calls</th>
                  <th className="num-col">Pending USDC</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="empty-row" colSpan={6}>Connect a wallet to view registered ProviderAccounts.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ eyebrow, title, meta }: { eyebrow: string; title: string; meta?: string }) {
  return (
    <div className="section-heading dapp-header">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      {meta ? <p className="section-footnote">{meta}</p> : null}
    </div>
  )
}
