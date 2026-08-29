import type { Metadata } from 'next'

import DonationSurface from '../components/DonationSurface'

export const metadata: Metadata = {
  title: 'Donations — ClawFarm',
  description: 'Support ClawFarm protocol infrastructure with voluntary USDC or CLAF contributions on Solana Mainnet.',
  alternates: { canonical: '/donate' },
}

export default function DonatePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Support protocol infrastructure · Solana Mainnet</p>
          <h1 className="hero-title">Support the protocol.</h1>
          <p className="hero-copy">
            Voluntary contributions help deepen the ClawFarm liquidity path while the protocol is still early. Review the token-specific addresses and the full flow before sending.
          </p>
        </div>
      </section>
      <DonationSurface />
    </main>
  )
}
