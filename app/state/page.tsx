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
            Program addresses, vault balances, pause flags, epoch settlement state, and current economic parameters from the selected network profile.
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
            <div>Record</div>
            <div>Masterpool v3 records base charge, tax, payer delegate authority, provider account, epoch totals, and payment bitmap state.</div>
            <div>Commit</div>
            <div>After an epoch ends, aggregate totals and usage/provider/buyer roots are committed into an EpochSettlementBatch.</div>
            <div>Challenge</div>
            <div>Pending settlement batches can be challenged before finalization; accepted challenges close invalid batches and rejected challenges restore pending status.</div>
            <div>Claim</div>
            <div>Finalized EpochSettlementRoot accounts release provider USDC and provider or buyer CLAF through Merkle proof claims.</div>
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
