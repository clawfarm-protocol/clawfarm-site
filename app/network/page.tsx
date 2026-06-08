import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Network — ClawFarm',
  description: 'Live ClawFarm protocol state, treasury parameters, and settlement counters.',
  alternates: { canonical: '/network' },
}

const stats = [
  ['Epoch', '#000'],
  ['Active providers', '—'],
  ['USDC settled (24H)', '—'],
  ['CLAF distributed (24H)', '—'],
  ['Total CLAF minted', '1,000,000,000'],
  ['CLAF burned (total)', '—'],
  ['Treasury balance', '— USDC'],
  ['Avg settlement latency', '— ms'],
]

export default function NetworkPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <p className="eyebrow">Network</p>
          <h1 className="page-title">Live protocol state.</h1>
          <p className="page-copy">Every number below is verifiable through a chain explorer.</p>
        </div>
      </section>

      <section className="section" id="stats">
        <div className="container">
          <div className="stat-grid">
            {stats.map(([label, value]) => (
              <div className="stat-cell" key={label}>
                <p className="stat-label">{label}</p>
                <p className="stat-value">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="treasury">
        <div className="container">
          <div className="section-heading">
            <h2>Treasury is a contract.</h2>
          </div>
          <div className="key-list">
            <div>Treasury fee</div>
            <div>3% of every settlement</div>
            <div>Mechanism</div>
            <div>Automated buyback-and-burn via swap aggregator</div>
            <div>Trigger</div>
            <div>Every epoch end, when Treasury balance ≥ 100 USDC</div>
            <div>Treasury PDA</div>
            <div>
              <span className="mono">7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU</span>{' '}
              <a href="/state" className="text-link">View state →</a>
            </div>
            <div>Total burned</div>
            <div>—</div>
            <div>Last buyback</div>
            <div>—</div>
          </div>
        </div>
      </section>
    </main>
  )
}
