'use client'

import { protocolNetworks, type NetworkId } from '../lib/protocol'
import { useNetwork } from './NetworkProvider'

const networkIds: NetworkId[] = ['devnet', 'mainnet']

export default function NetworkSwitch() {
  const { networkId, setNetworkId } = useNetwork()

  return (
    <div className="network-switch" aria-label="Network selection" role="group">
      {networkIds.map((id) => (
        <button
          aria-pressed={networkId === id}
          className={networkId === id ? 'is-active' : undefined}
          key={id}
          onClick={() => setNetworkId(id)}
          type="button"
        >
          {protocolNetworks[id].label}
        </button>
      ))}
    </div>
  )
}
