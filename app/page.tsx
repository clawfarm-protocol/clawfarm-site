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
          <p className="hero-status">Devnet active . Mainnet pending . Solana</p>
          <h1 className="hero-title">Receipt settlement for inference.</h1>
          <ProtocolStatusStrip />
          <NetworkBadge />
          <p className="hero-copy">
            ClawFarm records wallet-paid inference payments, routes base Test USDC to provider pending revenue, and turns finalized epoch roots into CLAF reward claims.
          </p>
          <div className="hero-role-grid" aria-label="Protocol entry paths">
            <a className="role-entry" href="/providers">
              <span>Providers</span>
              <strong>Register a provider account →</strong>
              <small>Register a wallet-backed ProviderAccount. Provider USDC releases after epoch settlement finalizes and the provider claim verifies against the finalized root.</small>
            </a>
            <a className="role-entry" href="/builders">
              <span>Developers</span>
              <strong>Start with the SDK →</strong>
              <small>Record payments through masterpool v3. Finalized epoch roots carry buyer-side reward allocations.</small>
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
            Current technical implementation records payments through masterpool v3 and settles ended epochs through aggregate roots and Merkle claims.
          </p>
        </div>
      </section>

      <section className="section" id="mining">
        <div className="container">
          <SectionHeader eyebrow="Mining" title="Mining." />
          <p className="section-intro">
            Payment records do not pay direct per-call rewards. Finalized epoch roots carry buyer and provider allocations, and Merkle claims transfer CLAF directly from the reward vault. Devnet v3 uses 300-second epochs for testing cadence; the mainnet target keeps 1-hour epochs without changing the total scheduled CLAF emission.
          </p>
          <div className="stat-strip mining-strip">
            <div className="treasury-stat">
              <span>Provider epoch pool</span>
              <p>70%</p>
            </div>
            <div className="treasury-stat">
              <span>Buyer epoch pool</span>
              <p>30%</p>
            </div>
            <div className="treasury-stat">
              <span>Reward claims</span>
              <p>Direct</p>
            </div>
            <div className="treasury-stat">
              <span>Devnet challenge window</span>
              <p>60 sec</p>
            </div>
          </div>
          <p className="section-footnote wide-footnote">
            The devnet challenge window is intentionally short for testing. Mainnet target timing is 1 hour per epoch and remains pending until mainnet config is deployed.
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
          <SectionHeader eyebrow="Directory" title="Model labels for payment records." />
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
              Registration is address-based. ProviderAccountV3 records provider wallet, pending provider USDC, status, and timestamps. Current v3 registration has no upfront USDC collateral transfer.
            </SupplyLayer>
            <SupplyLayer label="Directory" title="Off-chain metadata">
              Endpoint, model, price, quality, and limits belong to app, gateway, or operator-directory metadata.
            </SupplyLayer>
            <SupplyLayer label="Proof" title="Settlement proofs">
              Payment recording uses delegated payer USDC authority; finalized settlement roots verify provider and buyer Merkle proofs.
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
            In devnet v3, every payment uses a bounded payment tax rate. The tax moves to the treasury vault, while the base charge moves to provider pending revenue. The whitepaper target adds treasury split, buyback, burn, and protocol-owned-liquidity policy for mainnet. The live masterpool settlement program exposes payment, settlement-root, and claim instructions only.
          </p>
          <TreasurySnapshot />
          <div className="key-list">
            <div>Snapshot scope</div>
            <div>Treasury and pending provider vault balances are exposed through the selected network profile.</div>
            <div>Event stream</div>
            <div>No automated swap-and-retirement event stream is exposed by the current contract.</div>
          </div>
          <p className="section-footnote wide-footnote">Treasury and pending provider balances come from a refreshed point-in-time devnet v3 snapshot. Mainnet target policy remains pending until deployment records exist.</p>
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
          <p className="interface-note">SDK in TypeScript, Python, Rust. <a href="/docs#sdk-wrapper-target">→ SDK reference</a></p>
        </div>
      </section>

      <section className="section" id="economics">
        <div className="container">
          <SectionHeader eyebrow="Economics" title="Emission follows usage." />
          <div className="economics-stack">
            <article>
              <h3>Emission</h3>
              <p>CLAF emission inventory is minted at Genesis. Epoch rewards are allocated by finalized buyer and provider usage weight.</p>
            </article>
            <article>
              <h3>Settlement</h3>
              <p>USDC settlement is epoch-root based. The configured tax rate routes tax to treasury, records base charge as pending provider revenue, and releases provider USDC through finalized root claims.</p>
            </article>
            <article>
              <h3>Distribution</h3>
              <p>Reward claims transfer CLAF directly from the reward vault to provider or buyer token accounts.</p>
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
                Add settlement to your AI app or agent. Same compatible interface, three lines to switch in. Settlement is metered per request — no minimums, no setup fees, and portable SDK wrappers.
              </p>
              <a href="/builders">Start with the SDK →</a>
            </article>
            <article className="action-column">
              <h2>For providers.</h2>
              <p>
                Register a provider account. The protocol does not ask where capacity comes from. Provider USDC releases after epoch settlement finalizes and the provider claim verifies against the finalized root. CLAF rewards accrue through finalized epoch weight.
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
