import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whitepaper — ClawFarm',
  description: 'ClawFarm whitepaper PDF and strategic rationale for permissionless inference supply.',
  alternates: { canonical: '/whitepaper' },
}

export default function WhitepaperPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Whitepaper</p>
          <h1 className="hero-title">Protocol paper.</h1>
          <p className="hero-copy">
            The canonical paper is served as a PDF. The web route remains stable for navigation and previews.
          </p>
          <p className="tertiary-link">
            <a href="/whitepaper.pdf">Open PDF →</a>
          </p>
        </div>
      </section>

      <section className="section" id="strategic-rationale">
        <div className="container paper-column">
          <div className="section-heading">
            <p className="section-kicker">Strategic rationale</p>
            <h2>Why the protocol exists.</h2>
          </div>
          <p className="section-intro">
            The central risk of the AGI era is not that models become more capable. It is that model capability, compute access, settlement rails, and reward distribution become locked inside a small number of institutional balance sheets.
          </p>
          <p className="section-intro">
            ClawFarm is designed to separate the supply side of machine intelligence from any single platform. Any wallet, any endpoint, and any source of inference capacity can enter the same settleable network, subject only to the protocol&apos;s proof, bond, settlement, and challenge rules.
          </p>
          <p className="section-intro">
            The objective is not to operate another intermediary in the inference market. The objective is to make the supply of machine intelligence permissionless, economically legible, and settleable by protocol rather than by platform discretion.
          </p>
        </div>
      </section>
    </main>
  )
}
