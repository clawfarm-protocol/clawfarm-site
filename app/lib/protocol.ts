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
  providerUsdcShareBps: number
  treasuryUsdcShareBps: number
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
  tokenSymbol: 'CLAW'
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
    snapshotLabel: 'Devnet snapshot read on 2026-06-09',
    tokenSymbol: 'CLAW',
    paymentMintLabel: 'Test USDC',
    programs: {
      masterpool: 'DWbzvr2F8hKquw7cXQqhpEc8JnJ1covmP6f28Rwmy15q',
      attestation: 'BwRMqumgiHbeMhG9xs1a76vUjmprrokr6WsPCzhz3pKK',
    },
    mints: {
      claw: 'EW7npwHnVtTXvimde3Zj6dHX4mWbSAb5zkkHCrvkC8ui',
      usdc: 'Hpq3GKSHa6rX9pGSRw2Gvoz6AbP16GMtHPVMxLr7P553',
    },
    accounts: {
      poolAuthority: '5C1XsgA6SX9vfii55138q7yxwFuEssmxcMfWw6FEBYN5',
      masterpoolConfig: 'B7kijN5oMvrEXc4ihsebG7fWi1DwTPPv3zL2u6WuxMDA',
      attestationConfig: '5Rta1Vgp68Yr8HQqwFFzC6TZkUqCotqgvjTqF5ZgtEiD',
      rewardVault: 'FLwt8ouUSaxfEhTEwNZbAP8yYSBy5sbYqV7Lvwz9xh3M',
      challengeBondVault: '2JTopbYhBeLRzDHXSX5HRLvimURhiQs8n7a2HJoGoh3M',
      treasuryUsdcVault: '3GCM4JwxDZDDa4wUDAGJ3vUkapAQU6EjSFougXnKjtQn',
      providerStakeUsdcVault: 'BDGJQXiStxnWgZAXp2jXGvKekQghCY3nWynqMqsxwQzp',
      providerPendingUsdcVault: 'E4bjKdR1n9n3cqYamgHUcvTGn8tpEoBmAvqb9X2qpcv4',
      epochCursor: 'A9nrM4fm1T8pLwNaGRixPkmAg1FmKADJk7rPPQeA6d1a',
    },
    config: {
      masterpoolConfigVersion: '2',
      providerStakeUsdc: '100.000000',
      providerUsdcShareBps: 970,
      treasuryUsdcShareBps: 30,
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
    balances: {
      rewardVaultClaw: '999899885.946700',
      challengeBondVaultClaw: '0.000000',
      treasuryUsdc: '41.387849',
      providerStakeUsdc: '300.000000',
      providerPendingUsdc: '98.994182',
    },
    epochCursor: {
      latestKnownEpoch: '522',
      latestFinalizedEpoch: '521',
      carryForwardClaw: '0.000000',
    },
  },
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    clusterLabel: 'Solana mainnet-beta',
    explorerCluster: 'mainnet-beta',
    status: 'pending',
    statusText: 'Awaiting mainnet deployment',
    snapshotLabel: 'Mainnet deployment pending',
    tokenSymbol: 'CLAW',
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
