'use client'

import { useState } from 'react'

type Lang = 'ts' | 'py' | 'rs'

const examples: Record<Lang, { label: string; code: string }> = {
  ts: {
    label: 'TypeScript',
    code: `import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({ cluster: 'devnet' })

const receipt = await cf.receipts.submit({
  model: 'model-l-001',
  provider: providerWallet,
  payer: connectedWallet.publicKey,
  promptTokens: 420,
  completionTokens: 180,
  totalUsdc: '0.025000',
})

console.log(receipt.status)`,
  },
  py: {
    label: 'Python',
    code: `from clawfarm import ClawFarm

cf = ClawFarm(cluster="devnet")

receipt = cf.receipts.submit(
    model="model-l-001",
    provider=provider_wallet,
    payer=connected_wallet,
    prompt_tokens=420,
    completion_tokens=180,
    total_usdc="0.025000",
)

print(receipt.status)`,
  },
  rs: {
    label: 'Rust',
    code: `use clawfarm::Client;

let cf = Client::new("devnet");

let receipt = cf.receipts()
    .model("model-l-001")
    .provider(provider_wallet)
    .payer(connected_wallet)
    .prompt_tokens(420)
    .completion_tokens(180)
    .total_usdc("0.025000")
    .submit()
    .await?;

println!("{}", receipt.status);`,
  },
}

export default function CodeTabs() {
  const [active, setActive] = useState<Lang>('ts')
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(examples[active].code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="v5-code-card">
      <div className="v5-code-tabs">
        <div className="v5-tabs" role="tablist" aria-label="SDK language">
          {(Object.keys(examples) as Lang[]).map((lang) => (
            <button
              aria-selected={active === lang}
              className={`v5-tab${active === lang ? ' is-active' : ''}`}
              key={lang}
              onClick={() => setActive(lang)}
              role="tab"
              type="button"
            >
              {examples[lang].label}
            </button>
          ))}
        </div>
        <button className={`v5-copy${copied ? ' is-copied' : ''}`} onClick={copyCode} type="button">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="v5-code-body" aria-label={`${examples[active].label} SDK example`}>
        <code>{examples[active].code}</code>
      </pre>
    </div>
  )
}
