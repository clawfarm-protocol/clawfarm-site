'use client'

import { useEffect, useRef, useState } from 'react'

import type { LiveSurfaceState } from '../lib/config'

type SettlementRow = {
  timestamp: string
  providerWallet: string
  consumerWallet: string
  model: string
  tokens: string
  usdcSettled: string
  baseCharge: string
  protocolTax: string
}

export default function SettlementFeed({
  state = 'populated',
  rows: initialRows = [],
}: {
  state?: LiveSurfaceState
  rows?: SettlementRow[]
}) {
  const cursor = useRef(0)
  const [rows, setRows] = useState(initialRows)

  useEffect(() => {
    if (state !== 'populated' || initialRows.length === 0) return undefined

    const intervalId = window.setInterval(() => {
      cursor.current += 1
      const next = initialRows[cursor.current % initialRows.length]
      setRows((currentRows) => [next, ...currentRows.slice(0, 4)])
    }, 3200)

    return () => window.clearInterval(intervalId)
  }, [state, initialRows])

  return (
    <div className="protocol-table-shell settlement-feed-shell" data-live-state={state}>
      <table className="protocol-table settlement-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Provider wallet</th>
            <th>Consumer wallet</th>
            <th>Model</th>
            <th className="num-col">Tokens metered</th>
            <th className="num-col">USDC settled</th>
            <th className="num-col">Base charge</th>
            <th className="num-col">Protocol tax</th>
          </tr>
        </thead>
        <tbody>
          {state === 'loading' ? (
            <tr>
              <td className="empty-row" colSpan={8}>Loading settled calls.</td>
            </tr>
          ) : null}
          {state === 'empty' ? (
            <tr>
              <td className="empty-row" colSpan={8}>No settled calls yet.</td>
            </tr>
          ) : null}
          {state === 'populated' && rows.length > 0
            ? rows.map((row, index) => (
                <tr className={index === 0 ? 'settlement-feed-row is-new' : ''} key={`${row.timestamp}-${row.providerWallet}-${row.consumerWallet}`}>
                  <td>{row.timestamp}</td>
                  <td>{row.providerWallet}</td>
                  <td>{row.consumerWallet}</td>
                  <td>{row.model}</td>
                  <td className="right">{row.tokens}</td>
                  <td className="right">{row.usdcSettled}</td>
                  <td className="right">{row.baseCharge}</td>
                  <td className="right">{row.protocolTax}</td>
                </tr>
              ))
            : null}
          {state === 'populated' && rows.length === 0 ? (
            <tr>
              <td className="empty-row" colSpan={8}>No settled calls yet.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
