import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'State — ClawFarm',
  description: 'Live protocol dashboard for ClawFarm settlement volume, mining emission, treasury, registry counts, epoch, and halving state.',
  alternates: { canonical: '/state' },
}

const overviewMetrics = [
  ['Settlement volume (24h)', '—'],
  ['Settled calls (24h)', '—'],
  ['CLAF mined today', '—'],
  ['Current epoch emission', '—'],
  ['Treasury USDC', '—'],
  ['CLAF burned', '—'],
  ['Registered providers', '—'],
  ['Registered models', '—'],
  ['Current epoch', '—'],
  ['Halving countdown', '—'],
  ['Program ID', '—'],
  ['Upgrade authority', 'renounced'],
]

const settlementRows = [
  ['—', '—', '—', '—', '—', '—'],
  ['—', '—', '—', '—', '—', '—'],
  ['—', '—', '—', '—', '—', '—'],
]

const treasuryRows = [
  ['Protocol treasury inflow', '—'],
  ['Pending buyback', '—'],
  ['Last burn', '—'],
  ['Next epoch-boundary evaluation', '—'],
  ['Total CLAF burned', '—'],
]

const registryRows = [
  ['model-l-001', '—', '—'],
  ['model-l-002', '—', '—'],
  ['model-i-001', '—', '—'],
  ['model-v-001', '—', '—'],
]

export default function StatePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">State</p>
          <h1 className="hero-title">Protocol dashboard.</h1>
          <p className="hero-copy">
            Settlement volume, mining emission, treasury, registry counts, epoch, and halving state in one live surface.
          </p>
        </div>
      </section>

      <section className="section" id="overview">
        <div className="container">
          <SectionTitle eyebrow="Overview" title="Network state." />
          <div className="stat-grid">
            {overviewMetrics.map(([label, value]) => (
              <article className="stat-cell" key={label}>
                <p className="stat-label">{label}</p>
                <p className="stat-value" data-live-field={label.toLowerCase().replaceAll(' ', '-')}>{value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="settlements">
        <div className="container">
          <SectionTitle eyebrow="Settlements" title="Recent settled calls." />
          <div className="protocol-table-shell">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Provider wallet</th>
                  <th>Consumer wallet</th>
                  <th>Model</th>
                  <th className="num-col">USDC</th>
                  <th className="num-col">Protocol split</th>
                </tr>
              </thead>
              <tbody>
                {settlementRows.map(([time, provider, consumer, model, usdc, split], index) => (
                  <tr key={index}>
                    <td>{time}</td>
                    <td>{provider}</td>
                    <td>{consumer}</td>
                    <td>{model}</td>
                    <td className="right">{usdc}</td>
                    <td className="right">{split}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="mining">
        <div className="container">
          <SectionTitle eyebrow="Mining" title="Epoch emission." />
          <p className="section-intro">
            Emission splits 70% to the providing side and 30% to the consuming side on settled usage.
          </p>
          <div className="stat-strip">
            <div className="treasury-stat">
              <span>Provider side</span>
              <p>70%</p>
            </div>
            <div className="treasury-stat">
              <span>Consumer side</span>
              <p>30%</p>
            </div>
            <div className="treasury-stat">
              <span>Current epoch</span>
              <p data-live-field="current-epoch">—</p>
            </div>
            <div className="treasury-stat">
              <span>Halving countdown</span>
              <p data-live-field="halving-countdown">—</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="treasury">
        <div className="container">
          <SectionTitle eyebrow="Treasury" title="Fee inflow and burn." />
          <p className="section-intro">
            At each 1-hour epoch boundary, execute_buyback is evaluated. If the Treasury PDA balance exceeds 100 USDC, accumulated USDC swaps to CLAF via Jupiter and burns.
          </p>
          <dl className="kv-list state-kv-wide">
            {treasuryRows.map(([label, value]) => (
              <div className="kv-row" key={label}>
                <dt>{label}</dt>
                <dd data-live-field={label.toLowerCase().replaceAll(' ', '-')}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section" id="registry">
        <div className="container">
          <SectionTitle eyebrow="Registry" title="Model supply counts." />
          <div className="protocol-table-shell">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th className="num-col">Providers</th>
                  <th className="num-col">30d volume</th>
                </tr>
              </thead>
              <tbody>
                {registryRows.map(([model, providers, volume]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td className="right">{providers}</td>
                    <td className="right">{volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}
