'use client'

import {
  explorerAddressUrl,
  formatBoolean,
  formatBps,
  formatPending,
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
        Mainnet is selectable so the site structure is ready, but no mainnet deployment record exists yet. Addresses and balances stay empty until the contract repository publishes mainnet data.
      </p>
    </div>
  )
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
  const epoch = profile.epochCursor

  return (
    <div className="live-status-strip" aria-label="Protocol status">
      <span className="status-dot" aria-hidden="true" />
      <span>{profile.statusText}</span>
      <span>Epoch: <data>{epoch?.latestKnownEpoch ?? '-'}</data></span>
      <span>Genesis minted: <data>{config ? formatBoolean(config.genesisMinted) : '-'}</data></span>
    </div>
  )
}

export function ProtocolNumberWall() {
  const { profile } = useNetwork()
  const config = profile.config
  const items: Metric[] = config
    ? [
        { label: `${profile.tokenSymbol} total supply`, value: '1B' },
        { label: 'Provider USDC share', value: formatBps(config.providerUsdcShareBps) },
        { label: 'Treasury USDC share', value: formatBps(config.treasuryUsdcShareBps) },
        { label: 'Epoch duration', value: '1 hour' },
      ]
    : [
        { label: 'Deployment status', value: 'Pending' },
        { label: 'Program IDs', value: '-' },
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
  const networkRows: AddressRow[] = [
    { label: 'Masterpool program', address: profile.programs.masterpool },
    { label: 'Attestation program', address: profile.programs.attestation },
    { label: `${profile.tokenSymbol} mint`, address: profile.mints.claw },
    { label: profile.paymentMintLabel, address: profile.mints.usdc },
  ]

  const activityRows: Metric[] = [
    { label: 'Latest known epoch', value: formatPending(profile.epochCursor?.latestKnownEpoch) },
    { label: 'Latest finalized epoch', value: formatPending(profile.epochCursor?.latestFinalizedEpoch) },
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
    { label: 'Treasury share', value: config ? formatBps(config.treasuryUsdcShareBps) : '-' },
    { label: 'Treasury vault', value: balances ? `${balances.treasuryUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider pending vault', value: balances ? `${balances.providerPendingUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Challenge bond vault', value: balances ? `${balances.challengeBondVaultClaw} ${profile.tokenSymbol}` : '-' },
  ]

  return <MetricGrid items={items} />
}

export function StateDashboard() {
  const { profile } = useNetwork()
  const config = profile.config
  const balances = profile.balances
  const epoch = profile.epochCursor

  const overview: Metric[] = [
    { label: 'Network', value: profile.clusterLabel },
    { label: 'Deployment', value: profile.statusText },
    { label: 'Masterpool', value: profile.programs.masterpool ? shortAddress(profile.programs.masterpool) : '-' },
    { label: 'Attestation', value: profile.programs.attestation ? shortAddress(profile.programs.attestation) : '-' },
    { label: 'Latest known epoch', value: formatPending(epoch?.latestKnownEpoch) },
    { label: 'Latest finalized epoch', value: formatPending(epoch?.latestFinalizedEpoch) },
    { label: 'Reward vault', value: balances ? `${balances.rewardVaultClaw} ${profile.tokenSymbol}` : '-' },
    { label: 'Treasury vault', value: balances ? `${balances.treasuryUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider stake vault', value: balances ? `${balances.providerStakeUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider pending vault', value: balances ? `${balances.providerPendingUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Receipt recording paused', value: config ? formatBoolean(config.receiptRecordingPaused) : '-' },
    { label: 'Claims paused', value: config ? formatBoolean(config.claimsPaused) : '-' },
  ]

  const economics: Metric[] = [
    { label: 'Provider stake', value: config ? `${config.providerStakeUsdc} ${profile.paymentMintLabel}` : '-' },
    { label: 'Provider USDC share', value: config ? formatBps(config.providerUsdcShareBps) : '-' },
    { label: 'Treasury USDC share', value: config ? formatBps(config.treasuryUsdcShareBps) : '-' },
    { label: 'Provider reward pool', value: config ? formatBps(config.providerEpochPoolShareBps) : '-' },
    { label: 'Buyer reward pool', value: config ? formatBps(config.buyerEpochPoolShareBps) : '-' },
    { label: 'Challenge bond', value: config ? `${config.challengeBondClaw} ${profile.tokenSymbol}` : '-' },
    { label: 'Provider slash', value: config ? `${config.providerSlashClaw} ${profile.tokenSymbol}` : '-' },
    { label: 'Reward lock', value: config ? `${config.lockDays} days` : '-' },
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
    { label: 'Masterpool program', address: profile.programs.masterpool },
    { label: 'Attestation program', address: profile.programs.attestation },
    { label: `${profile.tokenSymbol} mint`, address: profile.mints.claw },
    { label: profile.paymentMintLabel, address: profile.mints.usdc },
    { label: 'Pool authority', address: profile.accounts.poolAuthority },
    { label: 'Masterpool config', address: profile.accounts.masterpoolConfig },
    { label: 'Attestation config', address: profile.accounts.attestationConfig },
    { label: 'Reward vault', address: profile.accounts.rewardVault },
    { label: 'Challenge bond vault', address: profile.accounts.challengeBondVault },
    { label: 'Treasury USDC vault', address: profile.accounts.treasuryUsdcVault },
    { label: 'Provider stake USDC vault', address: profile.accounts.providerStakeUsdcVault },
    { label: 'Provider pending USDC vault', address: profile.accounts.providerPendingUsdcVault },
    { label: 'Epoch cursor', address: profile.accounts.epochCursor },
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
