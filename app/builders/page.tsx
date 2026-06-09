import type { Metadata } from 'next'

import CodeTabs from '../components/CodeTabs'

export const metadata: Metadata = {
  title: 'Developers — ClawFarm',
  description: 'Developer surface for open ClawFarm inference consumption, SDK calls, and USDC settlement.',
  alternates: { canonical: '/builders' },
}

export default function BuildersPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Developers</p>
          <h1 className="hero-title">Consume inference.</h1>
          <p className="hero-copy">
            Any wallet can pay for a receipt-backed inference request. Finalized usage contributes buyer-side epoch weight for CLAW rewards.
          </p>
        </div>
      </section>

      <section className="section" id="quickstart">
        <div className="container">
          <div className="two-column">
            <article className="border-panel">
              <h3>Open consumption</h3>
              <p>Applications, builders, and wallets submit receipt-backed requests from the same registry. No named consumer application is required.</p>
            </article>
            <article className="border-panel">
              <h3>Epoch pool weight</h3>
              <p>Finalized receipts add buyer-side weight to the epoch pool. Buyer rewards are claimed from finalized epoch accounting and stream as locked CLAW.</p>
            </article>
            <article className="border-panel">
              <h3>Economic record</h3>
              <p>Each submitted receipt creates an economic record with Test USDC split snapshots, challenge timing, and buyer/provider weight. Provider-share USDC remains pending until finalization.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="SDK" title="Start with the SDK." />
          <CodeTabs />
          <p className="interface-note">SDK reference: <a href="/docs#sdk">/docs#sdk →</a></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Usage" title="Recent calls" meta="Wallet-bound" />
          <div className="protocol-table-shell">
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Model</th>
                  <th className="num-col">Tokens</th>
                  <th className="num-col">USDC</th>
                  <th className="num-col">Epoch weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="empty-row" colSpan={5}>Connect a wallet to view receipt-backed usage.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle eyebrow="Balance" title="USDC allowance" />
          <div className="dapp-card narrow">
            <span className="card-label">Current balance</span>
            <p className="balance-value">—</p>
            <p className="card-meta">Wallet payments authorize bounded Test USDC settlement for receipt-backed requests.</p>
            <div className="dapp-actions">
              <button className="btn primary" disabled type="button">Approve</button>
              <button className="btn ghost" disabled type="button">Withdraw</button>
            </div>
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
