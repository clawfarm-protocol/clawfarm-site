export type NetworkId = 'devnet' | 'mainnet'
export type DeploymentStatus = 'active' | 'pending'

type NullableAddress = string | null

type ProgramAddresses = {
  masterpoolV3: NullableAddress
}

type MintAddresses = {
  claf: NullableAddress
  usdc: NullableAddress
}

type CoreAccounts = {
  poolAuthority: NullableAddress
  masterpoolConfig: NullableAddress
  rewardVault: NullableAddress
  treasuryUsdcVault: NullableAddress
  providerPendingUsdcVault: NullableAddress
}

export type ProtocolConfigSnapshot = {
  masterpoolConfigVersion: string
  providerStakeUsdc: string
  taxRateBps: number
  providerEpochPoolShareBps: number
  buyerEpochPoolShareBps: number
  epochDurationSeconds: string
  challengeWindowSeconds: string
  emissionTotalClaf: string
  emissionDurationSeconds: string
  paymentRecordingPaused: boolean
  settlementPaused: boolean
  claimsPaused: boolean
}

export type VaultBalanceSnapshot = {
  rewardVaultClaf: string
  treasuryUsdc: string
  providerPendingUsdc: string
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
}

export const defaultNetworkId: NetworkId = 'mainnet'

export const protocolNetworks: Record<NetworkId, NetworkProfile> = {
  devnet: {
    id: 'devnet',
    label: 'Devnet',
    clusterLabel: 'Solana devnet',
    explorerCluster: 'devnet',
    status: 'active',
    statusText: 'Devnet v3 active',
    snapshotLabel: 'Devnet v3 point-in-time snapshot read on 2026-07-06',
    tokenSymbol: 'CLAF',
    paymentMintLabel: 'Test USDC',
    programs: {
      masterpoolV3: '263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF',
    },
    mints: {
      claf: 'BstFT1KYuPntAzH6Z6mUBCzBGJXc6b6Ha6zKsG7bASYb',
      usdc: 'Pn9LRsXqH3Av44nrJGcAv22Js3iuaEhH36VKYfKTZQo',
    },
    accounts: {
      poolAuthority: '36Q2NicqLeS2a6vPc3G2g9nS7inrTQQL8azsY3suQwJ8',
      masterpoolConfig: '6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m',
      rewardVault: 'AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC',
      treasuryUsdcVault: 'EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS',
      providerPendingUsdcVault: 'BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ',
    },
    config: {
      masterpoolConfigVersion: '3',
      providerStakeUsdc: '0.000000',
      taxRateBps: 300,
      providerEpochPoolShareBps: 7000,
      buyerEpochPoolShareBps: 3000,
      epochDurationSeconds: '300',
      challengeWindowSeconds: '60',
      emissionTotalClaf: '1000000000.000000',
      emissionDurationSeconds: '157680000',
      paymentRecordingPaused: false,
      settlementPaused: false,
      claimsPaused: false,
    },
    balances: {
      rewardVaultClaf: '998371000',
      treasuryUsdc: '19.768488',
      providerPendingUsdc: '2.53232',
    },
  },
  mainnet: {
    id: 'mainnet',
    label: 'Mainnet',
    clusterLabel: 'Solana mainnet-beta',
    explorerCluster: 'mainnet-beta',
    status: 'active',
    statusText: 'Mainnet v3 active',
    snapshotLabel: 'Mainnet v3 point-in-time snapshot read on 2026-07-30 13:20 UTC',
    tokenSymbol: 'CLAF',
    paymentMintLabel: 'USDC',
    programs: {
      masterpoolV3: '263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF',
    },
    mints: {
      claf: 'C9C4v7EPpxgYcuJpvBskW6VENA6kL1C1upgfg6jfmCu7',
      usdc: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    },
    accounts: {
      poolAuthority: '36Q2NicqLeS2a6vPc3G2g9nS7inrTQQL8azsY3suQwJ8',
      masterpoolConfig: '6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m',
      rewardVault: 'AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC',
      treasuryUsdcVault: 'EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS',
      providerPendingUsdcVault: 'BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ',
    },
    config: {
      masterpoolConfigVersion: '3',
      providerStakeUsdc: '100.000000',
      taxRateBps: 300,
      providerEpochPoolShareBps: 7000,
      buyerEpochPoolShareBps: 3000,
      epochDurationSeconds: '3600',
      challengeWindowSeconds: '30',
      emissionTotalClaf: '1000000000.000000',
      emissionDurationSeconds: '315360000',
      paymentRecordingPaused: false,
      settlementPaused: false,
      claimsPaused: false,
    },
    balances: {
      rewardVaultClaf: '997973744.292238',
      treasuryUsdc: '0.134624',
      providerPendingUsdc: '8.756996',
    },
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
  return `${value / 100}%`
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
