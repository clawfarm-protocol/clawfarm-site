import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Providers — ClawFarm',
  description: 'Provider registration surface for ClawFarm inference endpoints, compact receipt settlement, pending USDC revenue, and challenger-driven enforcement.',
  alternates: { canonical: '/providers' },
}

const mechanismBlocks = [
  {
    label: 'COMPACT RECEIPT',
    title: 'Settlement starts with signed receipt facts.',
    body: 'Phase 1 records compact receipts that bind payer, provider wallet, metadata hash, token usage, total Test USDC paid, selected protocol-fee tier, and the service epoch. The receipt is the economic source of truth for payment split, challenge timing, and buyer/provider epoch weight.',
  },
  {
    label: 'PENDING USDC',
    title: 'Provider revenue waits for finalization.',
    body: 'Wallet-paid Test USDC is split at record time by the provider-selected fee tier. Treasury receives 0.5% to 3.0% in 0.5% steps; the remainder moves into the provider-pending vault. Provider-share USDC releases only after the receipt survives the challenge window and finalizes.',
  },
  {
    label: 'CLAF CHALLENGE',
    title: 'Challenges use CLAF bonds.',
    body: 'A challenger posts the configured CLAF bond against a receipt during the challenge window. Rejected challenges burn the bond. Accepted challenges return the bond, refund provider-share USDC to the payer, apply reward-vault transfer and burn economics, and invalidate activated weight when applicable.',
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
            The protocol does not ask who you are or where inference comes from. It asks that each finalized receipt carries auditable economic state.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="supply-grid">
            {mechanismBlocks.map((block) => (
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
            One on-chain record. A wallet, a stake, a status.
          </p>
          <p className="section-intro">
            On-chain registration records the provider wallet, 100 Test USDC stake, and active status. Endpoint, model, pricing, and protocol-fee tier metadata belong to the off-chain gateway or operator directory layer.
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
              <label htmlFor="fee-tier">Protocol-fee tier</label>
              <input id="fee-tier" placeholder="0.5% · 1.0% · 1.5% · 2.0% · 2.5% · 3.0%" type="text" />
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
