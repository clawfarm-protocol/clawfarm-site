'use client'

import { useState } from 'react'

type DonationAsset = {
  token: 'USDC' | 'CLAF'
  address: string
  explorerUrl: string
}

const donationAssets: DonationAsset[] = [
  {
    token: 'USDC',
    address: 'BjXhMuv6irGKBz98jttUdJjtP8tnPCVkYpGmz1sqD3XK',
    explorerUrl: 'https://solscan.io/account/BjXhMuv6irGKBz98jttUdJjtP8tnPCVkYpGmz1sqD3XK',
  },
  {
    token: 'CLAF',
    address: 'DFsfDBs3rUKDyzidPH3NwAUzRvwqQKKFGSEy3hW52A7F',
    explorerUrl: 'https://solscan.io/account/DFsfDBs3rUKDyzidPH3NwAUzRvwqQKKFGSEy3hW52A7F',
  },
]

export default function DonationSurface() {
  const [copiedToken, setCopiedToken] = useState<DonationAsset['token'] | null>(null)

  async function copyAddress(asset: DonationAsset) {
    let copied = false
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(asset.address)
        copied = true
      }
    } catch {
      copied = false
    }

    if (!copied) {
      const textarea = document.createElement('textarea')
      textarea.value = asset.address
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      copied = document.execCommand('copy')
      textarea.remove()
    }

    if (copied) {
      setCopiedToken(asset.token)
      window.setTimeout(() => setCopiedToken(null), 1600)
    }
  }

  return (
    <section className="section" id="donate">
      <div className="container">
        <div className="section-heading">
          <p className="section-kicker">Donations</p>
          <h2 className="section-title">Feed the machine.</h2>
          <p className="section-lede">
            Voluntary USDC or CLAF contributions to the ClawFarm treasury. 100% is converted by on-chain rules into pool liquidity the protocol owns permanently. No one, including the team, can withdraw it.
          </p>
        </div>

        <div className="donation-cards">
          {donationAssets.map((asset) => (
            <article className="donation-card" key={asset.token}>
              <div className="donation-card-head">
                <span className="donation-token">Send {asset.token}</span>
              </div>
              <p className="donation-to">to</p>
              <p className="donation-address">{asset.address}</p>
              <div className="donation-actions">
                <button
                  className={`donation-button${copiedToken === asset.token ? ' is-copied' : ''}`}
                  type="button"
                  onClick={() => void copyAddress(asset)}
                >
                  {copiedToken === asset.token ? 'Copied' : 'Copy address'}
                </button>
                <a className="donation-button" href={asset.explorerUrl} target="_blank" rel="noopener noreferrer">
                  View on Solscan ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="donation-warning">
          Solana network only. Each address accepts one token only. Tokens sent on another network or to the wrong address cannot be recovered.
        </p>

        <div className="donation-flow" aria-label="Donation flow">
          <div className="donation-flow-step">
            <span className="donation-step-label">01 · Sent</span>
            <strong>Arrives in the treasury account</strong>
            <small>visible on-chain immediately</small>
          </div>
          <div className="donation-flow-step">
            <span className="donation-step-label">02 · Pooled</span>
            <strong>Joins protocol revenue</strong>
            <small>same rules · no withdrawal path</small>
          </div>
          <div className="donation-flow-step">
            <span className="donation-step-label">03 · Daily run</span>
            <strong>Bought and deposited by code</strong>
            <small>00:05 UTC, every day</small>
          </div>
          <div className="donation-flow-step">
            <span className="donation-step-label">04 · Result</span>
            <strong>Pool liquidity, locked</strong>
            <small>100% · verifiable</small>
          </div>
        </div>

        <div className="donation-detail">
          <h3>Why donations exist</h3>
          <p>
            Every payment on ClawFarm routes 3% to an automated treasury. Once a day the treasury buys CLAF on the open market and either destroys it or locks it into the trading pool, deepening liquidity. The treasury runs regardless of donations; donations add to what it has to work with while settled volume is still early.
          </p>
          <h3>What happens to a donation</h3>
          <p>
            USDC is handled exactly like protocol revenue: same account, same rules. The next daily run converts it into CLAF and deposits it into the pool. Donated CLAF skips the purchase and is deposited directly, matched with treasury USDC, so the treasury buys less and adds more depth. Large CLAF donations are absorbed over several days, limited by the USDC available to pair each day.
          </p>
          <div className="donation-kv-list">
            <div className="donation-kv-row">
              <span>USDC account</span>
              <a href={donationAssets[0].explorerUrl} target="_blank" rel="noopener noreferrer">balance and history on Solscan ↗</a>
            </div>
            <div className="donation-kv-row">
              <span>CLAF account</span>
              <a href={donationAssets[1].explorerUrl} target="_blank" rel="noopener noreferrer">balance and history on Solscan ↗</a>
            </div>
            <div className="donation-kv-row">
              <span>Treasury program</span>
              <a href="https://solscan.io/account/5RTnMtw5qJzLBwqM8vcWu9atobzz71pG8xptHx6wraDC" target="_blank" rel="noopener noreferrer">5RTn…raDC on Solscan ↗</a>
            </div>
          </div>
        </div>

        <div className="donation-footnote">
          <p>Donations are voluntary contributions to protocol infrastructure. They are not an investment, carry no rights or rewards, and no return of any kind is promised or implied.</p>
          <p>Sending: use any Solana wallet (Phantom, Solflare, Backpack). Select the token first, then paste or scan the matching address.</p>
        </div>
      </div>
    </section>
  )
}
