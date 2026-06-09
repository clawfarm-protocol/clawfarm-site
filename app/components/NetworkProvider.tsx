'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  coerceNetworkId,
  defaultNetworkId,
  protocolNetworks,
  type NetworkId,
  type NetworkProfile,
} from '../lib/protocol'

type NetworkContextValue = {
  networkId: NetworkId
  profile: NetworkProfile
  setNetworkId: (networkId: NetworkId) => void
}

const storageKey = 'clawfarm.network'
const NetworkContext = createContext<NetworkContextValue | null>(null)

export default function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkId, setNetworkIdState] = useState<NetworkId>(defaultNetworkId)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlNetwork = coerceNetworkId(params.get('network'))
    const storedNetwork = coerceNetworkId(window.localStorage.getItem(storageKey))
    setNetworkIdState(urlNetwork ?? storedNetwork ?? defaultNetworkId)
  }, [])

  const setNetworkId = (nextNetworkId: NetworkId) => {
    setNetworkIdState(nextNetworkId)
    window.localStorage.setItem(storageKey, nextNetworkId)

    const nextUrl = new URL(window.location.href)
    nextUrl.searchParams.set('network', nextNetworkId)
    window.history.replaceState(null, '', nextUrl.toString())
  }

  const value = useMemo(
    () => ({
      networkId,
      profile: protocolNetworks[networkId],
      setNetworkId,
    }),
    [networkId],
  )

  return (
    <NetworkContext.Provider value={value}>
      <div data-active-network={networkId}>{children}</div>
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('useNetwork must be used inside NetworkProvider')
  }
  return context
}
