import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Whitepaper — ClawFarm',
  description: 'ClawFarm whitepaper PDF.',
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
    </main>
  )
}
