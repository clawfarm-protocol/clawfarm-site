import Link from 'next/link'

import type { ProviderRow } from '../lib/providers'
import { shortAddress } from '../lib/providers'

export default function ProviderTable({ rows }: { rows: ProviderRow[] }) {
  return (
    <div className="provider-table-shell">
      <table className="provider-table">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Proof state</th>
            <th>Models / Services</th>
            <th>Price</th>
            <th>Quality</th>
            <th>Latency</th>
            <th>30D Usage</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.address}>
              <td>
                <span className="provider-name">{row.provider}</span>
                <span className="provider-address">{shortAddress(row.address)}</span>
              </td>
              <td>{row.proofState}</td>
              <td>{row.services}</td>
              <td className="price">{row.price}</td>
              <td className="success">{row.quality}</td>
              <td className="mono">{row.latency}</td>
              <td className="muted">{row.usage}</td>
              <td>
                <Link href="/docs#quickstart" className="route-button">Choose</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
