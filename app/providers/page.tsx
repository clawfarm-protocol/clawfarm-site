import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Providers — ClawFarm',
  description: 'Provider registration surface for anonymous ClawFarm inference endpoints, dual-signed proof settlement, and challenger-driven enforcement.',
  alternates: { canonical: '/providers' },
}

const mechanismBlocks = [
  {
    label: 'DUAL-SIGNED PROOF',
    title: 'Both sides sign what was served.',
    body: 'Every session produces a usage proof signed by both the user and the provider: request hash, response hash, token counts, and agreed price. A session settles only if both signatures are present. Neither side can unilaterally distort the settlement amount. The protocol does not inspect the inference itself; it requires both parties to sign what was served.',
  },
  {
    label: 'SETTLEMENT & REWARD',
    title: 'USDC clears first. CLAF follows volume.',
    body: 'On settlement, 97% of USDC moves to the provider wallet and 3% moves to the protocol treasury. CLAF emission is distributed on settled volume: Provider Pool 70%, Developer Pool 30%. Providers priced below the network average earn higher CLAF weight through the price-relative term.',
  },
  {
    label: 'BOND & CHALLENGE',
    title: 'Enforcement is challenger-driven.',
    body: 'Registration requires a 100 USDC bond. Any party may post a small bond to challenge a suspect settlement; upheld challenges slash the provider. Quality factor Q decays on failed delivery or upheld challenge. Enforcement is permissionless and challenger-driven, not operator-driven.',
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
            The protocol does not ask who you are or where inference comes from. It asks only that each settled call carries proof.
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
          <SectionTitle eyebrow="Register" title="Register an endpoint." />
          <p className="section-intro">
            One way in. A wallet, a bond, an endpoint.
          </p>
          <p className="section-intro">
            Registration requires a Solana wallet, a 100 USDC bond, and declared model, price, and quality offerings.
          </p>
          <div className="dapp-card">
            <div className="field">
              <label htmlFor="endpoint-url">Endpoint URL</label>
              <input id="endpoint-url" placeholder="https://endpoint.invalid/v1" type="text" />
            </div>
            <div className="field">
              <label htmlFor="model-class">Model ID</label>
              <input id="model-class" placeholder="model-l-001" type="text" />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="price">Price per unit (USDC)</label>
                <input id="price" placeholder="—" type="text" />
              </div>
              <div className="field">
                <label htmlFor="quality">Quality declaration</label>
                <input id="quality" placeholder="—" type="text" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="wallet">Payout wallet</label>
              <input id="wallet" placeholder="addr_demo_7xQ…4fA" type="text" />
            </div>
            <div className="form-actions">
              <button className="btn primary" disabled type="button">Register endpoint</button>
            </div>
          </div>

          <SectionTitle eyebrow="Active registrations" title="Wallet endpoints" meta="Connect wallet" />
          <div className="protocol-table-shell">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Model</th>
                  <th className="num-col">Price</th>
                  <th className="num-col">24h calls</th>
                  <th className="num-col">24h USDC</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="empty-row" colSpan={6}>Connect a wallet to view registered endpoints.</td>
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
