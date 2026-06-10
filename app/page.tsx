import type { ReactNode } from 'react'

import CodeTabs from './components/CodeTabs'
import SettlementFeed from './components/SettlementFeed'
import type { LiveSurfaceState } from './lib/config'
import {
  HomeProtocolState,
  NetworkBadge,
  ProtocolNumberWall,
  ProtocolStatusStrip,
  TreasurySnapshot,
} from './components/ProtocolNetworkPanels'

const miningEvents: string[][] = []
const miningEventsState: LiveSurfaceState = 'loading'

const registryRows = [
  ['model-l-001', '—', '—', '—'],
  ['model-l-002', '—', '—', '—'],
  ['model-l-003', '—', '—', '—'],
  ['model-i-001', '—', '—', '—'],
  ['model-i-002', '—', '—', '—'],
  ['model-v-001', '—', '—', '—'],
  ['model-v-002', '—', '—', '—'],
]

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Devnet active . Mainnet Genesis pending . Solana</p>
          <h1 className="hero-title">Mining inference.</h1>
          <ProtocolStatusStrip />
          <NetworkBadge />
          <p className="hero-copy">
            ClawFarm turns paid AI inference into mining weight. Providers contribute capacity, buyers pay in USDC, and CLAF rewards follow finalized contribution.
          </p>
          <div className="hero-role-grid" aria-label="Protocol entry paths">
            <a className="role-entry" href="/providers">
              <span>Providers</span>
              <strong>Register a provider account →</strong>
              <small>Register a wallet-backed ProviderAccount. Finalized provider usage contributes to Provider Pool mining weight.</small>
            </a>
            <a className="role-entry" href="/builders">
              <span>Developers</span>
              <strong>Start with the SDK →</strong>
              <small>Prepare compact receipts through wrapper tools. Finalized paid usage contributes to Buyer Pool mining weight.</small>
            </a>
          </div>
          <p className="tertiary-link">
            <a href="/whitepaper">Read the whitepaper →</a>
          </p>
        </div>
      </section>

      <section className="section" id="settlement-feed">
        <div className="container">
          <SectionHeader eyebrow="Settlement" title="Settlement, live." />
          <SettlementFeed state="loading" />
          <p className="section-footnote wide-footnote">
            Receipt tax is booked when a payment is recorded. With taxRateBps: 30, treasury receives 3% of the base charge while the base charge stays pending for the provider until finalization.
          </p>
        </div>
      </section>

      <section className="section" id="mining">
        <div className="container">
          <SectionHeader eyebrow="Mining" title="Inference becomes mining weight." />
          <p className="section-intro">
            Paid inference is the contribution event. Current devnet records that contribution through finalized receipt settlement; Genesis mainnet targets the full mining economy around a fixed CLAF cap.
          </p>
          <div className="stat-strip mining-strip">
            <div className="treasury-stat">
              <span>Provider Pool</span>
              <p>70%</p>
            </div>
            <div className="treasury-stat">
              <span>Buyer Pool</span>
              <p>30%</p>
            </div>
            <div className="treasury-stat">
              <span>CLAF cap</span>
              <p>1B</p>
            </div>
            <div className="treasury-stat">
              <span>Current devnet lock</span>
              <p>180 days</p>
            </div>
          </div>
          <p className="section-footnote wide-footnote">
            Current devnet realizes mining weight through finalized receipt settlement rather than direct per-call token payouts. Mainnet Genesis timing and full target mechanics remain pending until mainnet config is deployed.
          </p>
          <div className="protocol-table-shell burn-table-shell" data-live-state={miningEventsState}>
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Wallet</th>
                  <th>Role</th>
                  <th className="num-col">CLAF amount</th>
                  <th className="num-col">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {miningEventsState === 'loading' ? (
                  <tr>
                    <td className="empty-row" colSpan={4}>Loading mining events.</td>
                  </tr>
                ) : null}
                {miningEventsState === 'empty' ? (
                  <tr>
                    <td className="empty-row" colSpan={4}>No mining events yet.</td>
                  </tr>
                ) : null}
                {miningEventsState === 'populated'
                  ? miningEvents.map(([wallet, role, amount, timestamp]) => (
                      <tr key={`${wallet}-${role}`}>
                        <td>{wallet}</td>
                        <td>{role}</td>
                        <td className="right">{amount}</td>
                        <td className="right">{timestamp}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section" id="state">
        <div className="container">
          <SectionHeader eyebrow="State" title="The protocol, in four numbers." />
          <ProtocolNumberWall />
          <p className="section-footnote wide-footnote">
            Values are rendered from the selected network profile. Devnet is the default first-visit network.
          </p>
        </div>
      </section>

      <section className="section" id="directory">
        <div className="container">
          <SectionHeader eyebrow="Directory" title="Model labels for receipts." />
          <p className="section-intro">
            Any wallet can choose a provider. Directory data remains off-chain.
          </p>
          <div className="protocol-table-shell">
            <table className="protocol-table model-catalog-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th className="num-col">Providers</th>
                  <th className="num-col">Price</th>
                  <th className="num-col">30d volume</th>
                </tr>
              </thead>
              <tbody>
                {registryRows.map(([model, providers, price, volume]) => (
                  <tr key={model}>
                    <td>{model}</td>
                    <td className="right">
                      <a className="count-link" href="/state#overview" data-live-field={`${model}-provider-count`}>{providers}</a>
                    </td>
                    <td className="right" data-live-field={`${model}-price`}>{price}</td>
                    <td className="right" data-live-field={`${model}-volume`}>{volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-action">
            <a href="/docs#models">Full model directory →</a>
          </p>
        </div>
      </section>

      <section className="section supply-section" id="supply">
        <div className="container">
          <SectionHeader eyebrow="Supply" title="Identity-blind supply." />
          <div className="supply-grid">
            <SupplyLayer label="Wallet" title="Provider account">
              Registration is address-based. The ProviderAccount records wallet, stake, pending revenue, counters, and status.
            </SupplyLayer>
            <SupplyLayer label="Directory" title="Off-chain metadata">
              Endpoint, model, price, quality, and limits belong to app, gateway, or operator-directory metadata.
            </SupplyLayer>
            <SupplyLayer label="Proof" title="Compact receipt">
              Settlement requires a configured signer over the compact receipt hash plus delegated payer USDC authority.
            </SupplyLayer>
          </div>
        </div>
      </section>

      <section className="section" id="protocol-state">
        <div className="container">
          <SectionHeader eyebrow="Explorer" title="Protocol state." />
          <HomeProtocolState />
          <p className="table-action">
            <a href="/state">Full state view →</a>
          </p>
        </div>
      </section>

      <section className="section" id="treasury">
        <div className="container">
          <SectionHeader eyebrow="Treasury" title="Treasury and pending revenue." />
          <p className="section-intro">
            Genesis mainnet target: automated buyback-and-burn closes the cost-subsidy loop. Current devnet records a receipt tax on the base charge when payment is recorded; automated buyback-and-burn is not enabled on devnet.
          </p>
          <TreasurySnapshot />
          <div className="key-list">
            <div>Snapshot scope</div>
            <div>Treasury and pending provider vault balances are exposed through the selected network profile.</div>
            <div>Event stream</div>
            <div>Current devnet exposes no automated buyback-and-burn event stream.</div>
          </div>
          <p className="section-footnote wide-footnote">Treasury and pending provider balances come from the static devnet snapshot. Mainnet remains pending until deployment records exist.</p>
          <p className="table-action">
            <a href="/network#config">Full state view →</a>
          </p>
        </div>
      </section>

      <section className="section" id="interface">
        <div className="container">
          <SectionHeader eyebrow="Interface" title="The interface." />
          <p className="section-intro">
            One SDK. Identical surface across off-chain provider choices and wallet-settled calls.
          </p>
          <CodeTabs />
          <p className="interface-note">SDK in TypeScript, Python, Rust. <a href="/docs#sdk">→ SDK reference</a></p>
        </div>
      </section>

      <section className="section" id="economics">
        <div className="container">
          <SectionHeader eyebrow="Economics" title="Emission follows usage." />
          <div className="economics-stack">
            <article>
              <h3>Emission</h3>
              <p>CLAF has a fixed 1B cap. Genesis mainnet targets the complete mining-inference economy; current devnet uses the deployed reward vault and epoch accounting for testing.</p>
            </article>
            <article>
              <h3>Settlement</h3>
              <p>USDC settlement is receipt-based. The base provider charge is held in pending revenue until receipt finalization, while receipt tax is booked to treasury at record time.</p>
            </article>
            <article>
              <h3>Distribution</h3>
              <p>Reward claims create locked streams. Owners withdraw vested CLAF over the configured lock period.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="builders-providers">
        <div className="container">
          <div className="action-columns">
            <article className="action-column">
              <h2>For developers.</h2>
              <p>
                Add settlement to your AI app or agent. Same compatible interface, three lines to switch in. Settlement is metered per request — no minimums, no setup fees, no SDK lock-in.
              </p>
              <a href="/builders">Start with the SDK →</a>
            </article>
            <article className="action-column">
              <h2>For providers.</h2>
              <p>
                Register a provider account. The protocol does not ask where capacity comes from. Base-charge USDC releases after receipt finalization, and finalized usage contributes to Provider Pool mining weight for CLAF rewards.
              </p>
              <a href="/providers">Register a provider account →</a>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionHeader({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  )
}

function SupplyLayer({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <article className="supply-layer">
      <h3><span>{label}</span> — {title}</h3>
      <p>{children}</p>
    </article>
  )
}
