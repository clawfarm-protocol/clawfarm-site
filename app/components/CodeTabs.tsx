'use client'

import { useState } from 'react'

type Lang = 'ts' | 'py' | 'rs'

const examples: Record<Lang, { label: string; code: string }> = {
  ts: {
    label: 'TypeScript',
    code: `import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({ cluster: 'devnet' })

const prepared = await cf.receipts.prepare({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  requestNonce,
  metadata: {
    model: 'model-l-001',
    unit: 'tokens',
  },
  promptTokens: 420,
  completionTokens: 180,
  chargeUsdc: '0.025000',
})

const receipt = await cf.receipts.submit(prepared, {
  gatewaySigner,
  paymentDelegate,
})

console.log(receipt.receiptPda)`,
  },
  py: {
    label: 'Python',
    code: `from clawfarm import ClawFarm

cf = ClawFarm(cluster="devnet")

prepared = cf.receipts.prepare(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    request_nonce=request_nonce,
    metadata={"model": "model-l-001", "unit": "tokens"},
    prompt_tokens=420,
    completion_tokens=180,
    charge_usdc="0.025000",
)

receipt = cf.receipts.submit(
    prepared,
    gateway_signer=gateway_signer,
    payment_delegate=payment_delegate,
)

print(receipt.receipt_pda)`,
  },
  rs: {
    label: 'Rust',
    code: `use clawfarm::Client;

let cf = Client::new("devnet");

let prepared = cf.receipts().prepare()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .request_nonce(request_nonce)
    .metadata_model("model-l-001")
    .metadata_unit("tokens")
    .prompt_tokens(420)
    .completion_tokens(180)
    .charge_usdc("0.025000")
    .build()
    .await?;

let receipt = cf.receipts()
    .submit(prepared)
    .gateway_signer(gateway_signer)
    .payment_delegate(payment_delegate)
    .send()
    .await?;

println!("{}", receipt.receipt_pda);`,
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
