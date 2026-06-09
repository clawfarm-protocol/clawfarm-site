export type ProviderRow = {
  provider: string
  address: string
  proofState: string
  services: string
  price: string
  quality: string
  latency: string
  usage: string
}

export const providerRows: ProviderRow[] = [
  {
    provider: 'provider wallet',
    address: 'addr_demo_provider_001',
    proofState: 'signer-ready',
    services: 'model-l-001 · model-l-002',
    price: '—',
    quality: '—',
    latency: '—',
    usage: '—',
  },
  {
    provider: 'provider wallet',
    address: 'addr_demo_provider_002',
    proofState: 'signer-ready',
    services: 'model-l-003 · model-l-004',
    price: '—',
    quality: '—',
    latency: '—',
    usage: '—',
  },
  {
    provider: 'provider wallet',
    address: 'addr_demo_provider_003',
    proofState: 'signer-ready',
    services: 'model-i-001 · model-v-001',
    price: '—',
    quality: '—',
    latency: '—',
    usage: '—',
  },
]

export const topProviderRows = providerRows

export function shortAddress(address: string) {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}
