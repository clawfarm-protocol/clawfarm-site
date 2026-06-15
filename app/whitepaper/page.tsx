import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whitepaper v1.0 — ClawFarm',
  description: 'ClawFarm whitepaper v1.0: a protocol for mining AI inference.',
  alternates: { canonical: '/whitepaper' },
}

export default function WhitepaperPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Whitepaper</p>
          <h1 className="hero-title">Whitepaper v1.0.</h1>
          <p className="hero-copy">
            A compact Genesis draft for the protocol: supply neutrality, dual-signed proof, settlement,
            mining emission, treasury burn, and immutable parameters.
          </p>
          <p className="tertiary-link">
            <a href="/whitepaper.pdf">Open PDF →</a>
          </p>
        </div>
      </section>
    </main>
  )
}
