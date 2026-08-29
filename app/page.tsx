import type { ReactNode } from 'react'

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

export default function Home() {
  return (
    <main>
      <section className="hero-section">
        <div className="container paper-column">
          <p className="hero-status">Mainnet active · Solana</p>
          <h1 className="hero-title">Receipt settlement for inference.</h1>
          <ProtocolStatusStrip />
          <NetworkBadge />
          <p className="hero-copy">
            ClawFarm routes wallet-funded inference through AIRouter, records native USDC settlement on Solana Mainnet, and turns finalized epoch roots into auditable provider and Buyer claims.
          </p>
          <div className="hero-role-grid" aria-label="Protocol entry paths">
            <a className="role-entry" href="/providers">
              <span>Providers</span>
              <strong>Connect an upstream API →</strong>
              <small>Share API compatibility, model and pricing metadata, an upstream credential through a secure channel, and a public provider wallet.</small>
            </a>
            <a className="role-entry" href="/builders">
              <span>Buyers</span>
              <strong>Request AIRouter access →</strong>
              <small>Receive a wallet-bound cfk_* key, fund the registered Mainnet wallet with native USDC, and call AIRouter over HTTP.</small>
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
            Payment records do not pay direct per-call rewards. Finalized epoch roots carry Buyer and Provider allocations, and Merkle claims transfer CLAF directly from the reward vault. Mainnet uses 1-hour epochs without changing the configured CLAF emission inventory.
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
              <span>Mainnet epoch cadence</span>
              <p>1 hour</p>
            </div>
          </div>
          <p className="section-footnote wide-footnote">
            Mainnet epoch duration is stored in GlobalConfigV3. Settlement batches and finalized roots determine when Provider and Buyer claims become available.
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
            Values are rendered from the selected network profile. Mainnet is the default on first visit; Devnet remains available in the network selector.
          </p>
        </div>
      </section>

      <section className="section" id="directory">
        <div className="container">
          <SectionHeader eyebrow="Catalog" title="Discover models through AIRouter." />
          <p className="section-intro">
            The available catalog is operational data, not a hard-coded protocol registry. Authenticated Buyers query AIRouter before selecting a model.
          </p>
          <div className="key-list">
            <div>Catalog</div>
            <div><span className="mono">GET /clawfarm/v1/models</span> returns the model IDs currently exposed to the authenticated Buyer.</div>
            <div>Selection</div>
            <div>Send the selected ID through the matching OpenAI-, Anthropic-, or Google-compatible AIRouter route.</div>
            <div>On-chain scope</div>
            <div>Masterpool v3 records payment and settlement facts; model and endpoint metadata remain in AIRouter.</div>
          </div>
          <p className="table-action">
            <a href="/docs#routes">AIRouter route reference →</a>
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
            Every Mainnet payment uses a bounded payment tax rate. The tax moves to the treasury vault, while the base charge moves to provider pending revenue. The live masterpool program exposes payment, settlement-root, challenge, and claim instructions; treasury operations beyond those instructions remain policy commitments.
          </p>
          <TreasurySnapshot />
          <div className="key-list">
            <div>Snapshot scope</div>
            <div>Treasury and pending provider vault balances are exposed through the selected network profile.</div>
            <div>Event stream</div>
            <div>No automated swap-and-retirement event stream is exposed by the current contract.</div>
          </div>
          <p className="section-footnote wide-footnote">Treasury and pending provider balances come from the dated point-in-time snapshot shown for the selected network.</p>
          <p className="table-action">
            <a href="/network#config">Full state view →</a>
          </p>
          <p className="table-action">
            <a href="/donate">Support protocol infrastructure →</a>
          </p>
        </div>
      </section>

      <section className="section" id="interface">
        <div className="container">
          <SectionHeader eyebrow="Interface" title="The interface." />
          <p className="section-intro">
            Direct AIRouter HTTP. Authenticate with the wallet-bound Buyer key and use a model returned by the live model catalog.
          </p>
          <pre className="code-block"><code>{`curl "$CLAWFARM_GATEWAY_URL/clawfarm/chat/completions" \\
  -H "Authorization: Bearer $CLAWFARM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"<model-id>","messages":[{"role":"user","content":"Hello"}]}'`}</code></pre>
          <p className="interface-note">No ClawFarm SDK is required. <a href="/docs#quickstart">→ HTTP quickstart</a></p>
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
              <h2>For Buyers.</h2>
              <p>
                Contact the ClawFarm team to receive a one-time cfk_* API key, bind a public Solana Mainnet wallet, fund it with native USDC, and call AIRouter directly over HTTP.
              </p>
              <a href="/builders">Open Buyer onboarding →</a>
            </article>
            <article className="action-column">
              <h2>For providers.</h2>
              <p>
                Contact the ClawFarm team with the upstream API protocol, base URL, model and pricing metadata, a securely delivered API key, and a public Mainnet provider wallet.
              </p>
              <a href="/providers">Open Provider onboarding →</a>
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
