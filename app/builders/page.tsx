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
            Any wallet can call any registered model and pay in USDC. Every call you make mines CLAF to your wallet.
          </p>
        </div>
      </section>

      <section className="section" id="quickstart">
        <div className="container">
          <div className="two-column">
            <article className="border-panel">
              <h3>Open consumption</h3>
              <p>Applications, builders, and wallets consume from the same registry. No named consumer application is required.</p>
            </article>
            <article className="border-panel">
              <h3>Mining on demand</h3>
              <p>Every call you make mines CLAF to your wallet. The consuming side receives 30% of epoch CLAF emission, weighted by settled usage.</p>
            </article>
            <article className="border-panel">
              <h3>Escrow PDA</h3>
              <p>USDC is deposited into a non-custodial escrow PDA derived from the wallet address. Funds release only on a dual-signed proof; no external key controls escrow.</p>
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
                  <th className="num-col">CLAF mined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="empty-row" colSpan={5}>Connect a wallet to view calls.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SectionTitle eyebrow="Balance" title="USDC escrow" />
          <div className="dapp-card narrow">
            <span className="card-label">Current balance</span>
            <p className="balance-value">—</p>
            <p className="card-meta">Top-ups credit after confirmation. Withdrawals remain wallet-controlled.</p>
            <div className="dapp-actions">
              <button className="btn primary" disabled type="button">Top up</button>
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
