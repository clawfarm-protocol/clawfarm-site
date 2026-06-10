export type NetworkId = 'devnet' | 'mainnet'
export type DeploymentStatus = 'active' | 'pending'

type NullableAddress = string | null

type ProgramAddresses = {
  masterpool: NullableAddress
  attestation: NullableAddress
}

type MintAddresses = {
  claw: NullableAddress
  usdc: NullableAddress
}

type CoreAccounts = {
  poolAuthority: NullableAddress
  masterpoolConfig: NullableAddress
  attestationConfig: NullableAddress
  rewardVault: NullableAddress
  challengeBondVault: NullableAddress
  treasuryUsdcVault: NullableAddress
  providerStakeUsdcVault: NullableAddress
  providerPendingUsdcVault: NullableAddress
  epochCursor: NullableAddress
}

export type ProtocolConfigSnapshot = {
  masterpoolConfigVersion: string
  providerStakeUsdc: string
  receiptTaxRateBps: number
  supportedReceiptTaxRateBps: number[]
  providerEpochPoolShareBps: number
  buyerEpochPoolShareBps: number
  challengeBondClaw: string
  providerSlashClaw: string
  lockDays: string
  epochDurationSeconds: string
  challengeWindowSeconds: string
  challengeResolutionTimeoutSeconds: string
  emissionTotalClaw: string
  halvingPeriodSeconds: string
  emissionDurationSeconds: string
  genesisMinted: boolean
  receiptRecordingPaused: boolean
  challengeProcessingPaused: boolean
  finalizationPaused: boolean
  claimsPaused: boolean
}

export type VaultBalanceSnapshot = {
  rewardVaultClaw: string
  challengeBondVaultClaw: string
  treasuryUsdc: string
  providerStakeUsdc: string
  providerPendingUsdc: string
}

export type EpochCursorSnapshot = {
  latestKnownEpoch: string
  latestFinalizedEpoch: string
  carryForwardClaw: string
}

export type NetworkProfile = {
  id: NetworkId
  label: string
  clusterLabel: string
  explorerCluster: 'devnet' | 'mainnet-beta'
  status: DeploymentStatus
  statusText: string
  snapshotLabel: string
  tokenSymbol: 'CLAF'
  paymentMintLabel: string
  programs: ProgramAddresses
  mints: MintAddresses
  accounts: CoreAccounts
  config: ProtocolConfigSnapshot | null
  balances: VaultBalanceSnapshot | null
  epochCursor: EpochCursorSnapshot | null
}

const emptyPrograms: ProgramAddresses = {
  masterpool: null,
  attestation: null,
}

const emptyMints: MintAddresses = {
  claw: null,
  usdc: null,
}

const emptyAccounts: CoreAccounts = {
  poolAuthority: null,
  masterpoolConfig: null,
  attestationConfig: null,
  rewardVault: null,
  challengeBondVault: null,
  treasuryUsdcVault: null,
  providerStakeUsdcVault: null,
  providerPendingUsdcVault: null,
  epochCursor: null,
}

export const defaultNetworkId: NetworkId = 'devnet'

export const protocolNetworks: Record<NetworkId, NetworkProfile> = {
  devnet: {
    id: 'devnet',
    label: 'Devnet',
    clusterLabel: 'Solana devnet',
    explorerCluster: 'devnet',
    status: 'active',
    statusText: 'Devnet active',
    snapshotLabel: 'Devnet deployment created on 2026-06-10',
    tokenSymbol: 'CLAF',
    paymentMintLabel: 'Test USDC',
    programs: {
      masterpool: '3gaSkyvgHJQxYpHJNxTBqSNrPMvu9fcCpoQkBsMKo3fg',
      attestation: 'En7rhJSk1VXq7YaNRszGqWos8tz6f9GbpF6qRU83ZeFC',
    },
    mints: {
      claw: 'Ez9N4FXcGPB5VpUTPY71dAjSEMbigUosBkaksVQyg1Rk',
      usdc: 'DuAQqzKYxmxb2XHyMCHwSigSbpowMvhXxjfnU4vkjHrE',
    },
    accounts: {
      poolAuthority: '2bBrzVKaz2L2LZmx1yceKRfxbtn4RKv4SmWbBKW1nE3K',
      masterpoolConfig: 'Gg1Aos3GXR7bWEgUi3eVoAhW9kcWQiA4D643CgvoqRnx',
      attestationConfig: '9Wmkya3gEzX8eAqgYJqTjEaGJYdwEw7QB78DE87JuGRk',
      rewardVault: 'vZ4knPgRo2aYK3k3Tc9h3VVvKeQN1syGetPuUdeZr6e',
      challengeBondVault: '34Yf2fXtBHiRY3CsE8Zowr66NbktHvgYeLZwwCHdiDg3',
      treasuryUsdcVault: '3VBogLjhkfDv2oLU9YSuDAN8F2oSCY9jamyiSGAxFsJX',
      providerStakeUsdcVault: 'CzcWMHyA78nAo8nN5Qosi7XfH4xJTMQNybSE7t2JFWYj',
      providerPendingUsdcVault: '1f6F21ivF3DYivHRz5Zv17E83o98FkWpdAHMdeEduJk',
      epochCursor: 'C7Fe9jXNUSPGdCaFJatU54ZKu8xPvNePswu4K3UVGX5j',
    },
    config: {
      masterpoolConfigVersion: '2',
      providerStakeUsdc: '100.000000',
      receiptTaxRateBps: 30,
      supportedReceiptTaxRateBps: [5, 10, 15, 20, 25, 30],
      providerEpochPoolShareBps: 700,
      buyerEpochPoolShareBps: 300,
      challengeBondClaw: '2.000000',
      providerSlashClaw: '30.000000',
      lockDays: '180',
      epochDurationSeconds: '3600',
      challengeWindowSeconds: '30',
      challengeResolutionTimeoutSeconds: '30',
      emissionTotalClaw: '1000000000.000000',
      halvingPeriodSeconds: '31536000',
      emissionDurationSeconds: '157680000',
      genesisMinted: true,
      receiptRecordingPaused: false,
      challengeProcessingPaused: false,
      finalizationPaused: false,
      claimsPaused: false,
    },
    balances: null,
    epochCursor: null,
  },
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    clusterLabel: 'Solana mainnet-beta',
    explorerCluster: 'mainnet-beta',
    status: 'pending',
    statusText: 'Awaiting mainnet deployment',
    snapshotLabel: 'Mainnet deployment pending',
    tokenSymbol: 'CLAF',
    paymentMintLabel: 'USDC',
    programs: emptyPrograms,
    mints: emptyMints,
    accounts: emptyAccounts,
    config: null,
    balances: null,
    epochCursor: null,
  },
}

export function coerceNetworkId(value: string | null | undefined): NetworkId | null {
  if (value === 'devnet' || value === 'mainnet') return value
  return null
}

export function getNetworkProfile(value: string | null | undefined): NetworkProfile {
  const id = coerceNetworkId(value) ?? defaultNetworkId
  return protocolNetworks[id]
}

export function formatBps(value: number): string {
  return `${value / 10}%`
}

export function formatBoolean(value: boolean): string {
  return value ? 'Yes' : 'No'
}

export function formatPending(value: string | null | undefined): string {
  return value ?? '-'
}

export function shortAddress(address: string | null | undefined): string {
  if (!address) return '-'
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function explorerAddressUrl(network: NetworkProfile, address: string | null | undefined): string | null {
  if (!address) return null
  const cluster = network.explorerCluster === 'devnet' ? '?cluster=devnet' : ''
  return `https://explorer.solana.com/address/${encodeURIComponent(address)}${cluster}`
}
