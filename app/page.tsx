import type { ReactNode } from 'react'

import CodeTabs from './components/CodeTabs'
import SettlementFeed from './components/SettlementFeed'
import { GENESIS_LIVE, type LiveSurfaceState } from './lib/config'

const protocolNumbers = [
  ['1B', 'CLAF total supply'],
  ['0%', 'allocation'],
  ['97/3', 'provider settlement / protocol fee'],
  ['10 yr', 'emission schedule'],
]

const miningStats = [
  ['CLAF mined today', '—'],
  ['Current epoch emission', '—'],
  ['Halving countdown', '—'],
  ['Fixed total supply', '1,000,000,000'],
]

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

const protocolState = {
  network: [
    ['Network', 'Solana mainnet'],
    ['Program ID', '—'],
    ['Genesis slot', '—'],
    ['Upgrade authority', 'renounced'],
    ['Admin key', 'none'],
    ['Current epoch', '—'],
  ],
  activity: [
    ['Total providers', '—'],
    ['Total consumers', '—'],
    ['24h volume (USDC)', '—'],
    ['24h settlements', '—'],
    ['CLAF circulating', '—'],
    ['CLAF burned', '—'],
  ],
}

const treasuryStats = [
  ['Protocol treasury inflow', '—'],
  ['Pending buyback', '—'],
  ['Total CLAF burned', '—'],
  ['Next burn epoch', '—'],
]

const burnRows: string[][] = []
const burnRowsState: LiveSurfaceState = 'loading'

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Genesis-immutable · 0% allocation · Solana</p>
          <h1 className="hero-title">Mining inference.</h1>
          <div className="live-status-strip" aria-label="Protocol status">
            <span className="status-dot" aria-hidden="true" />
            <span>Protocol live</span>
            <span>Current epoch: <data data-live-field="current-epoch">—</data></span>
            <span>Genesis: <data data-live-field="genesis-status">{GENESIS_LIVE ? 'active' : 'inactive'}</data></span>
          </div>
          <p className="hero-copy">
            The settlement protocol for the inference economy.
          </p>
          <div className="hero-role-grid" aria-label="Protocol entry paths">
            <a className="role-entry" href="/providers">
              <span>Providers</span>
              <strong>Register an endpoint →</strong>
              <small>Supply capacity from any source. Settlement pays USDC and mines CLAF.</small>
            </a>
            <a className="role-entry" href="/builders">
              <span>Developers</span>
              <strong>Start with the SDK →</strong>
              <small>Call any registered model. Every settled call mines CLAF to the wallet.</small>
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
            The 3% protocol split is treasury inflow. Data rows are bound to the live settlement source.
          </p>
        </div>
      </section>

      <section className="section" id="mining">
        <div className="container">
          <SectionHeader eyebrow="Mining" title="Mining." />
          <p className="section-intro">
            Each inference call mines CLAF. Emission splits 70% to the providing side and 30% to the consuming side.
          </p>
          <div className="stat-strip mining-strip" data-live-state="loading">
            {miningStats.map(([label, value]) => (
              <div className="treasury-stat" key={label}>
                <span>{label}</span>
                <p data-live-field={label.toLowerCase().replaceAll(' ', '-')}>{value}</p>
              </div>
            ))}
          </div>
          <p className="section-footnote wide-footnote">
            Epoch length is 1 hour. Halving occurs every 2 years across a 10-year emission horizon; about 968.75M CLAF can emit, and the residual remains uncirculated.
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
          <div className="number-wall">
            {protocolNumbers.map(([value, label]) => (
              <div className="number-cell" key={label}>
                <p>{value}</p>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="section-footnote wide-footnote">
            Fixed at Genesis. Cannot be modified by any party including the original author.
          </p>
        </div>
      </section>

      <section className="section" id="registry">
        <div className="container">
          <SectionHeader eyebrow="Registry" title="Models on the protocol." />
          <p className="section-intro">
            Any wallet can supply. Permissionless.
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
                      <a className="count-link" href="/state#registry" data-live-field={`${model}-provider-count`}>{providers}</a>
                    </td>
                    <td className="right" data-live-field={`${model}-price`}>{price}</td>
                    <td className="right" data-live-field={`${model}-volume`}>{volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="table-action">
            <a href="/docs#models">Full model registry →</a>
          </p>
        </div>
      </section>

      <section className="section supply-section" id="supply">
        <div className="container">
          <SectionHeader eyebrow="Supply" title="Identity-blind supply." />
          <div className="supply-grid">
            <SupplyLayer label="Wallet" title="Provider wallet">
              Registration is address-based. The protocol records wallet, bond, declared offerings, and endpoint metadata.
            </SupplyLayer>
            <SupplyLayer label="Endpoint" title="Declared offerings">
              Providers declare model IDs, price, quality, and limits. Source is not recorded.
            </SupplyLayer>
            <SupplyLayer label="Proof" title="Dual-signed settlement">
              A call settles only when user and provider sign request hash, response hash, token counts, and price.
            </SupplyLayer>
          </div>
        </div>
      </section>

      <section className="section" id="protocol-state">
        <div className="container">
          <SectionHeader eyebrow="Explorer" title="Protocol state." />
          <StateGrid network={protocolState.network} activity={protocolState.activity} />
          <p className="table-action">
            <a href="/state">Full state view →</a>
          </p>
        </div>
      </section>

      <section className="section" id="treasury">
        <div className="container">
          <SectionHeader eyebrow="Treasury" title="Treasury and burn." />
          <p className="section-intro">
            Every protocol-routed settlement collects a 3% fee in USDC. At each 1-hour epoch boundary, if the Treasury PDA balance exceeds 100 USDC, accumulated USDC swaps to CLAF via Jupiter and burns. No human trigger. No admin key. No discretionary spending.
          </p>
          <div className="stat-strip" data-live-state="loading">
            {treasuryStats.map(([label, value]) => (
              <div className="treasury-stat" key={label}>
                <span>{label}</span>
                <p data-live-field={label.toLowerCase().replaceAll(' ', '-')}>{value}</p>
              </div>
            ))}
          </div>
          <div className="protocol-table-shell burn-table-shell" data-live-state={burnRowsState}>
            <table className="protocol-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="num-col">USDC in</th>
                  <th className="num-col">CLAF burned</th>
                  <th>Tx</th>
                </tr>
              </thead>
              <tbody>
                {burnRowsState === 'loading' ? (
                  <tr>
                    <td className="empty-row" colSpan={4}>Loading burn events.</td>
                  </tr>
                ) : null}
                {burnRowsState === 'empty' ? (
                  <tr>
                    <td className="empty-row" colSpan={4}>No burn events yet.</td>
                  </tr>
                ) : null}
                {burnRowsState === 'populated'
                  ? burnRows.map(([date, usdc, burned, tx], index) => (
                      <tr key={index}>
                        <td>{date}</td>
                        <td className="right">{usdc}</td>
                        <td className="right">{burned}</td>
                        <td>{tx}</td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
          <p className="section-footnote wide-footnote">Burn rows populate from the live treasury source. Evaluation occurs at the next epoch boundary.</p>
          <p className="table-action">
            <a href="/state#treasury">Full state view →</a>
          </p>
        </div>
      </section>

      <section className="section" id="interface">
        <div className="container">
          <SectionHeader eyebrow="Interface" title="The interface." />
          <p className="section-intro">
            One SDK. Identical surface across registered endpoints and wallet-settled calls.
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
              <p>CLAF emission is fixed at Genesis. Every epoch releases a known amount against settled protocol activity.</p>
            </article>
            <article>
              <h3>Settlement</h3>
              <p>USDC settlement is per call. The provider receives 97%; the protocol receives 3% for buyback-and-burn.</p>
            </article>
            <article>
              <h3>Distribution</h3>
              <p>Mining splits across both sides of usage: 70% to the providing side and 30% to the consuming side.</p>
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
                Register an endpoint. The protocol does not ask where capacity comes from. 97% of every settlement is paid to the provider in USDC. CLAF rewards accrue automatically by settled volume.
              </p>
              <a href="/providers">Register an endpoint →</a>
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

function StateGrid({
  network,
  activity,
}: {
  network: string[][]
  activity: string[][]
}) {
  return (
    <div className="state-grid">
      <StatePanel title="Network" rows={network} />
      <StatePanel title="Activity" rows={activity} />
    </div>
  )
}

function StatePanel({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="state-panel">
      <h3>{title}</h3>
      <dl className="kv-list">
        {rows.map(([label, value]) => (
          <div className="kv-row" key={label}>
            <dt>{label}</dt>
            <dd data-live-field={label.toLowerCase().replaceAll(' ', '-')}>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
