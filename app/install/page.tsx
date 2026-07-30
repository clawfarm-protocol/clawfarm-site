import type { Metadata } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

export const metadata: Metadata = {
  title: 'Provider Onboarding — ClawFarm',
  description: 'The production process for connecting an inference provider to AIRouter and ClawFarm masterpool v3 on Solana Mainnet.',
  alternates: { canonical: '/install' },
}

const preparationRows = [
  ['API protocol', 'The upstream request and response format AIRouter should translate or forward.'],
  ['Base URL', 'The upstream service origin and any required path conventions.'],
  ['Models', 'Canonical model identifiers, capabilities, context limits, and availability.'],
  ['Commercial limits', 'Per-model pricing, quotas, rate limits, concurrency, and timeouts.'],
  ['API credential', 'An active upstream key delivered only through the agreed secure channel.'],
  ['Provider wallet', 'A public Solana Mainnet address for ProviderAccountV3 and settlement claims.'],
]

export default function InstallPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <p className="eyebrow">Provider onboarding</p>
          <h1 className="page-title">Connect an upstream API to ClawFarm.</h1>
          <p className="page-copy">
            Providers do not install a ClawFarm SDK. Onboarding connects an existing API to AIRouter, registers a public payout wallet, and lets the team configure the routing and settlement path.
          </p>
          <div className="hero-actions">
            <a href="#process" className="primary-button">Review the process →</a>
            <Link href="/docs#provider" className="secondary-button">Protocol details →</Link>
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="container">
          <div className="section-heading">
            <p className="section-kicker">Before contact</p>
            <h2>Prepare six integration facts.</h2>
          </div>
          <div className="key-list">
            {preparationRows.map(([label, detail]) => (
              <Fragment key={label}>
                <div>{label}</div>
                <div>{detail}</div>
              </Fragment>
            ))}
          </div>
          <p className="section-footnote wide-footnote">
            Never send a private key, seed phrase, or wallet file. ClawFarm needs only the public provider address. The upstream API key is separate from the Solana wallet and is stored encrypted by the operator.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="section-kicker">Production path</p>
            <h2>Four operator-assisted steps.</h2>
          </div>
          <div className="two-column">
            <article className="border-panel">
              <h3>01 · Contact</h3>
              <p>
                Contact the ClawFarm team. Share the API protocol, base URL, model catalog, pricing, quota, and public Solana Mainnet provider wallet.
              </p>
            </article>
            <article className="border-panel">
              <h3>02 · Secure handoff</h3>
              <p>
                Deliver the upstream API key through the secure channel agreed during onboarding. The team verifies upstream access and stores the credential encrypted for AIRouter.
              </p>
            </article>
            <article className="border-panel">
              <h3>03 · Configure</h3>
              <p>
                ClawFarm maps the models and limits into AIRouter, validates routing behavior, and bootstraps the wallet&apos;s <span className="mono">ProviderAccountV3</span> on Mainnet.
              </p>
            </article>
            <article className="border-panel">
              <h3>04 · Activate</h3>
              <p>
                After an end-to-end request and settlement check, the provider becomes available to eligible Buyer traffic. Changes to credentials, models, or pricing follow the same operator review.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stat-grid">
            <div className="stat-cell">
              <p className="stat-value">Native USDC</p>
              <p className="stat-desc">Mainnet payment asset</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">70%</p>
              <p className="stat-desc">provider epoch weight share</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">Zero transferred</p>
              <p className="stat-desc">current v3 registration stake</p>
            </div>
            <div className="stat-cell">
              <p className="stat-value">Merkle claims</p>
              <p className="stat-desc">finalized USDC and CLAF settlement</p>
            </div>
          </div>
          <p className="section-footnote wide-footnote">
            Masterpool v3 records the base charge and configured tax separately. Base USDC waits in the provider-pending vault until a finalized settlement root authorizes the provider claim; the tax portion moves to the treasury vault at payment-record time.
          </p>
        </div>
      </section>
    </main>
  )
}
