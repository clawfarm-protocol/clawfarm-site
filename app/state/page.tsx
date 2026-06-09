import type { Metadata } from 'next'

import { NetworkBadge, StateDashboard } from '../components/ProtocolNetworkPanels'

export const metadata: Metadata = {
  title: 'State - ClawFarm',
  description: 'Devnet-first protocol dashboard for ClawFarm programs, mints, vaults, config values, and epoch state.',
  alternates: { canonical: '/state' },
}

export default function StatePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">State</p>
          <h1 className="hero-title">Protocol dashboard.</h1>
          <p className="hero-copy">
            Program addresses, vault balances, pause flags, epoch cursor, and Phase 1 economic parameters from the selected network profile.
          </p>
          <NetworkBadge />
        </div>
      </section>

      <section className="section" id="overview">
        <div className="container">
          <SectionTitle eyebrow="Overview" title="Network state." />
          <StateDashboard />
        </div>
      </section>

      <section className="section" id="settlements">
        <div className="container">
          <SectionTitle eyebrow="Receipts" title="Receipt lifecycle." />
          <div className="key-list">
            <div>Submit</div>
            <div>Attestation validates a compact receipt and CPIs into masterpool to record payment.</div>
            <div>Record</div>
            <div>Masterpool splits USDC and snapshots buyer/provider epoch weight.</div>
            <div>Finalize</div>
            <div>After the challenge window, receipt finalization activates the stored epoch weight and releases provider pending USDC.</div>
            <div>Claim</div>
            <div>After epoch finalization, participants claim locked reward streams and withdraw vested CLAW.</div>
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
