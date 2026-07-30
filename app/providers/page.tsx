import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Providers — ClawFarm',
  description: 'Connect an inference provider to AIRouter and receive auditable USDC and CLAF settlement through ClawFarm masterpool v3.',
  alternates: { canonical: '/providers' },
}

const onboardingSteps = [
  {
    number: '01',
    title: 'Contact the ClawFarm team',
    body: 'Start an operator-assisted onboarding. There is no public SDK or self-service registration form.',
  },
  {
    number: '02',
    title: 'Describe the upstream API',
    body: 'Provide the supported API protocol, upstream base URL, model catalog, pricing, quotas, rate limits, and timeout constraints.',
  },
  {
    number: '03',
    title: 'Transfer credentials securely',
    body: 'Provide the upstream API key through the secure channel agreed with the team. ClawFarm stores the credential encrypted; do not place it in public metadata or source control.',
  },
  {
    number: '04',
    title: 'Register the payout wallet',
    body: 'Provide the public Solana Mainnet address that will identify the ProviderAccountV3 and receive claims. Never provide a private key or seed phrase.',
  },
]

const settlementItems = [
  {
    label: 'PAYMENT RECORD',
    title: 'Usage becomes an auditable payment fact.',
    body: 'AIRouter records eligible paid requests through masterpool v3. The record binds the payer, provider wallet, base USDC charge, configured tax, nonce hash, and epoch accounting.',
  },
  {
    label: 'PENDING USDC',
    title: 'Provider revenue waits for finalization.',
    body: 'At record time, tax moves to the treasury vault and the base charge moves to the provider-pending vault. Provider USDC is released by Merkle claim after the epoch root finalizes.',
  },
  {
    label: 'EPOCH ROOT',
    title: 'Finalized roots authorize claims.',
    body: 'Pending settlement batches can be challenged. Once a valid batch finalizes, its root becomes the source of truth for provider USDC and provider-side CLAF claims.',
  },
]

export default function ProvidersPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Providers · Solana Mainnet</p>
          <h1 className="hero-title">Supply inference through AIRouter.</h1>
          <p className="hero-copy">
            ClawFarm connects an existing model API to AIRouter, associates it with a public provider wallet, and settles eligible usage through auditable masterpool v3 records.
          </p>
          <div className="hero-actions">
            <Link href="/install" className="primary-button">Provider onboarding →</Link>
            <Link href="/network" className="secondary-button">Inspect Mainnet state →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Onboarding" title="What a provider supplies." />
          <p className="section-intro">
            AIRouter configuration is operator-assisted. The team validates compatibility, configures encrypted upstream access, and bootstraps the on-chain provider record.
          </p>
          <div className="supply-grid">
            {onboardingSteps.map((step) => (
              <article className="supply-layer" key={step.number}>
                <h3><span>{step.number}</span></h3>
                <p className="mechanism-title">{step.title}</p>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
          <p className="section-footnote wide-footnote">
            Current <span className="mono">register_provider_v3</span> creates a ProviderAccountV3 with zero transferred or locked provider stake. The Mainnet configuration still exposes a 100 USDC provider-stake parameter; it is not collected by the current registration instruction.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Settlement" title="From routed usage to a claim." />
          <div className="supply-grid">
            {settlementItems.map((block) => (
              <article className="supply-layer" key={block.label}>
                <h3><span>{block.label}</span></h3>
                <p className="mechanism-title">{block.title}</p>
                <p>{block.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-heading dapp-header">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}
