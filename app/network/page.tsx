import type { Metadata } from 'next'

import { NetworkAddressSurface, NetworkBadge, StateDashboard } from '../components/ProtocolNetworkPanels'

export const metadata: Metadata = {
  title: 'Network - ClawFarm',
  description: 'ClawFarm network deployments, program IDs, mints, PDAs, vaults, and config snapshot.',
  alternates: { canonical: '/network' },
}

export default function NetworkPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Network</p>
          <h1 className="hero-title">Deployment surface.</h1>
          <p className="hero-copy">
            Devnet is populated from the current contract deployment. Mainnet remains selectable but empty until deployment records exist.
          </p>
          <NetworkBadge />
        </div>
      </section>

      <section className="section" id="addresses">
        <div className="container">
          <SectionTitle eyebrow="Addresses" title="Programs, mints, and vaults." />
          <NetworkAddressSurface />
        </div>
      </section>

      <section className="section" id="config">
        <div className="container">
          <SectionTitle eyebrow="Config" title="Economic snapshot." />
          <StateDashboard />
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
