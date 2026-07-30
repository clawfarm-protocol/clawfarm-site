'use client'

import {
  explorerAddressUrl,
  formatBoolean,
  formatBps,
  shortAddress,
  type NetworkProfile,
} from '../lib/protocol'
import { useNetwork } from './NetworkProvider'

type Metric = {
  label: string
  value: string
  note?: string
}

type AddressRow = {
  label: string
  address: string | null
}

function AddressValue({ address, profile }: { address: string | null; profile: NetworkProfile }) {
  const href = explorerAddressUrl(profile, address)
  if (!href) return <span className="mono">-</span>

  return (
    <a className="address-link mono" href={href} target="_blank" rel="noopener noreferrer" title={address ?? undefined}>
      {shortAddress(address)}
    </a>
  )
}

function PendingPanel({ profile }: { profile: NetworkProfile }) {
  if (profile.status !== 'pending') return null

  return (
    <div className="pending-panel" role="status">
      <p className="section-kicker">Deployment</p>
      <h2>{profile.statusText}</h2>
      <p>
        This network does not have a published deployment snapshot. Addresses and balances remain empty until a verified deployment record is available.
      </p>
    </div>
  )
}

function formatDurationSeconds(seconds: string): string {
  const duration = Number(seconds)
  if (!Number.isFinite(duration)) return seconds
  if (duration === 3600) return '1 hour'
  if (duration % 60 === 0) return `${duration / 60} minutes`
  return `${duration} seconds`
}

function formatTotalSupply(value: string): string {
  if (value === '1000000000.000000') return '1B'
  return value.replace(/\.0+$/, '')
}

export function NetworkBadge() {
  const { profile } = useNetwork()

  return (
    <div className="network-badge" data-status={profile.status}>
      <span>{profile.label}</span>
      <strong>{profile.statusText}</strong>
      <small>{profile.snapshotLabel}</small>
    </div>
  )
}

export function ProtocolStatusStrip() {
  const { profile } = useNetwork()
  const config = profile.config

  return (
    <div className="live-status-strip" aria-label="Protocol status">
      <span className="status-dot" aria-hidden="true" />
      <span>{profile.statusText}</span>
      <span>Epoch: <data>{config ? formatDurationSeconds(config.epochDurationSeconds) : '-'}</data></span>
      <span>Snapshot: <data>{profile.snapshotLabel}</data></span>
    </div>
  )
}

export function ProtocolNumberWall() {
  const { profile } = useNetwork()
  const config = profile.config
  const items: Metric[] = config
    ? [
        { label: `${profile.tokenSymbol} Genesis inventory`, value: formatTotalSupply(config.emissionTotalClaf) },
        { label: 'Payment tax cap', value: formatBps(config.taxRateBps) },
        { label: 'Provider reward pool', value: formatBps(config.providerEpochPoolShareBps) },
        { label: 'Epoch duration', value: formatDurationSeconds(config.epochDurationSeconds) },
      ]
    : [
        { label: 'Deployment status', value: 'Pending' },
        { label: 'Program ID', value: '-' },
        { label: 'Config', value: '-' },
        { label: 'Snapshot', value: '-' },
      ]

  return (
    <div className="number-wall">
      {items.map((item) => (
        <div className="number-cell" key={item.label}>
          <p>{item.value}</p>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export function HomeProtocolState() {
  const { profile } = useNetwork()
  const config = profile.config
  const networkRows: AddressRow[] = [
    { label: 'Masterpool v3 program', address: profile.programs.masterpoolV3 },
    { label: `${profile.tokenSymbol} mint`, address: profile.mints.claf },
    { label: profile.paymentMintLabel, address: profile.mints.usdc },
    { label: 'Masterpool v3 config', address: profile.accounts.masterpoolConfig },
  ]

  const activityRows: Metric[] = [
    { label: 'Epoch duration', value: config ? formatDurationSeconds(config.epochDurationSeconds) : '-' },
    { label: 'Challenge window field', value: config ? formatDurationSeconds(config.challengeWindowSeconds) : '-' },
    { label: 'Treasury vault', value: profile.balances ? `${profile.balances.treasuryUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider pending vault', value: profile.balances ? `${profile.balances.providerPendingUsdc} ${profile.paymentMintLabel}` : '-' },
  ]

  return (
    <div className="state-grid">
      <section className="state-panel">
        <h3>Network</h3>
        <dl className="kv-list">
          {networkRows.map((row) => (
            <div className="kv-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd><AddressValue address={row.address} profile={profile} /></dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="state-panel">
        <h3>Snapshot</h3>
        <dl className="kv-list">
          {activityRows.map((row) => (
            <div className="kv-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export function TreasurySnapshot() {
  const { profile } = useNetwork()
  const config = profile.config
  const balances = profile.balances
  const items: Metric[] = [
    { label: 'Payment tax cap', value: config ? formatBps(config.taxRateBps) : '-' },
    { label: 'Treasury vault', value: balances ? `${balances.treasuryUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider pending vault', value: balances ? `${balances.providerPendingUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Target treasury policy', value: 'Whitepaper' },
  ]

  return <MetricGrid items={items} />
}

export function StateDashboard() {
  const { profile } = useNetwork()
  const config = profile.config
  const balances = profile.balances

  const overview: Metric[] = [
    { label: 'Network', value: profile.clusterLabel },
    { label: 'Deployment', value: profile.statusText },
    { label: 'Masterpool v3', value: profile.programs.masterpoolV3 ? shortAddress(profile.programs.masterpoolV3) : '-' },
    { label: 'Config', value: profile.accounts.masterpoolConfig ? shortAddress(profile.accounts.masterpoolConfig) : '-' },
    { label: 'Reward vault', value: balances ? `${balances.rewardVaultClaf} ${profile.tokenSymbol}` : '-' },
    { label: 'Treasury vault', value: balances ? `${balances.treasuryUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider pending vault', value: balances ? `${balances.providerPendingUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Payment recording paused', value: config ? formatBoolean(config.paymentRecordingPaused) : '-' },
    { label: 'Settlement paused', value: config ? formatBoolean(config.settlementPaused) : '-' },
    { label: 'Claims paused', value: config ? formatBoolean(config.claimsPaused) : '-' },
  ]

  const economics: Metric[] = [
    {
      label: 'Configured provider stake',
      value: config ? `${config.providerStakeUsdc} ${profile.paymentMintLabel}` : '-',
      note: 'Current v3 registration does not transfer or lock this amount.',
    },
    { label: 'Payment tax cap', value: config ? formatBps(config.taxRateBps) : '-' },
    { label: 'Provider reward pool', value: config ? formatBps(config.providerEpochPoolShareBps) : '-' },
    { label: 'Buyer reward pool', value: config ? formatBps(config.buyerEpochPoolShareBps) : '-' },
    { label: 'Epoch duration', value: config ? formatDurationSeconds(config.epochDurationSeconds) : '-' },
    {
      label: 'Challenge window field',
      value: config ? formatDurationSeconds(config.challengeWindowSeconds) : '-',
      note: 'Deprecated in the current v3 ledger settlement mode.',
    },
    { label: 'Emission duration', value: config ? formatDurationSeconds(config.emissionDurationSeconds) : '-' },
  ]

  return (
    <>
      <PendingPanel profile={profile} />
      <MetricGrid items={overview} />
      <div className="section-spacer" />
      <MetricGrid items={economics} />
    </>
  )
}

export function NetworkAddressSurface() {
  const { profile } = useNetwork()
  const addressRows: AddressRow[] = [
    { label: 'Masterpool v3 program', address: profile.programs.masterpoolV3 },
    { label: `${profile.tokenSymbol} mint`, address: profile.mints.claf },
    { label: profile.paymentMintLabel, address: profile.mints.usdc },
    { label: 'Pool authority', address: profile.accounts.poolAuthority },
    { label: 'Masterpool v3 config', address: profile.accounts.masterpoolConfig },
    { label: 'Reward vault', address: profile.accounts.rewardVault },
    { label: 'Treasury USDC vault', address: profile.accounts.treasuryUsdcVault },
    { label: 'Provider pending USDC vault', address: profile.accounts.providerPendingUsdcVault },
  ]

  return (
    <>
      <PendingPanel profile={profile} />
      <dl className="kv-list state-kv-wide address-kv">
        {addressRows.map((row) => (
          <div className="kv-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd><AddressValue address={row.address} profile={profile} /></dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function MetricGrid({ items }: { items: Metric[] }) {
  return (
    <div className="stat-grid protocol-metric-grid">
      {items.map((item) => (
        <article className="stat-cell" key={item.label}>
          <p className="stat-label">{item.label}</p>
          <p className="stat-value">{item.value}</p>
          {item.note ? <p className="section-footnote">{item.note}</p> : null}
        </article>
      ))}
    </div>
  )
}
