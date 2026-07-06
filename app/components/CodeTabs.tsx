'use client'

import { useState } from 'react'

type Lang = 'ts' | 'py' | 'rs'

const examples: Record<Lang, { label: string; code: string }> = {
  ts: {
    label: 'TypeScript',
    code: `import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({ cluster: 'devnet' })

const payment = await cf.payments.record({
  providerWallet,
  payer: connectedWallet.publicKey,
  payerUsdcToken,
  paymentDelegate,
  paymentIndex: 42n,
  paymentNonceHash,
  baseChargeUsdc: '0.025000',
  taxRateBps: 300,
  taxSweepThresholdAmount: 0n,
})

const settlement = await cf.epochs.commitSettlement({
  epochId: payment.epochId,
  usageRoot,
  providerRoot,
  buyerRoot,
  artifactHash,
  artifactUriHash,
  totals: payment.epochTotals,
  providerPoolClaf,
  buyerPoolClaf,
})

await cf.epochs.finalizeSettlement({ epochId: settlement.epochId })

await cf.epochs.claimBuyerReward({
  epochId: settlement.epochId,
  leafIndex,
  buyerWeight,
  buyerClafReward,
  proof,
})

await cf.epochs.claimProviderEpoch({
  epochId: settlement.epochId,
  leafIndex,
  providerBaseUsdc,
  providerClafReward,
  proof,
})`,
  },
  py: {
    label: 'Python',
    code: `from clawfarm import ClawFarm

cf = ClawFarm(cluster="devnet")

payment = cf.payments.record(
    provider_wallet=provider_wallet,
    payer=connected_wallet.public_key,
    payer_usdc_token=payer_usdc_token,
    payment_delegate=payment_delegate,
    payment_index=42,
    payment_nonce_hash=payment_nonce_hash,
    base_charge_usdc="0.025000",
    tax_rate_bps=300,
    tax_sweep_threshold_amount=0,
)

settlement = cf.epochs.commit_settlement(
    epoch_id=payment.epoch_id,
    usage_root=usage_root,
    provider_root=provider_root,
    buyer_root=buyer_root,
    artifact_hash=artifact_hash,
    artifact_uri_hash=artifact_uri_hash,
    totals=payment.epoch_totals,
    provider_pool_claf=provider_pool_claf,
    buyer_pool_claf=buyer_pool_claf,
)

cf.epochs.finalize_settlement(epoch_id=settlement.epoch_id)

cf.epochs.claim_buyer_reward(
    epoch_id=settlement.epoch_id,
    leaf_index=leaf_index,
    buyer_weight=buyer_weight,
    buyer_claf_reward=buyer_claf_reward,
    proof=proof,
)

cf.epochs.claim_provider_epoch(
    epoch_id=settlement.epoch_id,
    leaf_index=leaf_index,
    provider_base_usdc=provider_base_usdc,
    provider_claf_reward=provider_claf_reward,
    proof=proof,
)`,
  },
  rs: {
    label: 'Rust',
    code: `use clawfarm::Client;

let cf = Client::new("devnet");

let payment = cf.payments().record()
    .provider_wallet(provider_wallet)
    .payer(connected_wallet.pubkey())
    .payer_usdc_token(payer_usdc_token)
    .payment_delegate(payment_delegate)
    .payment_index(42)
    .payment_nonce_hash(payment_nonce_hash)
    .base_charge_usdc("0.025000")
    .tax_rate_bps(300)
    .tax_sweep_threshold_amount(0)
    .send()
    .await?;

let settlement = cf.epochs().commit_settlement()
    .epoch_id(payment.epoch_id)
    .usage_root(usage_root)
    .provider_root(provider_root)
    .buyer_root(buyer_root)
    .artifact_hash(artifact_hash)
    .artifact_uri_hash(artifact_uri_hash)
    .totals(payment.epoch_totals)
    .provider_pool_claf(provider_pool_claf)
    .buyer_pool_claf(buyer_pool_claf)
    .send()
    .await?;

cf.epochs().finalize_settlement(settlement.epoch_id).send().await?;

cf.epochs().claim_buyer_reward()
    .epoch_id(settlement.epoch_id)
    .leaf_index(leaf_index)
    .buyer_weight(buyer_weight)
    .buyer_claf_reward(buyer_claf_reward)
    .proof(proof)
    .send()
    .await?;

cf.epochs().claim_provider_epoch()
    .epoch_id(settlement.epoch_id)
    .leaf_index(leaf_index)
    .provider_base_usdc(provider_base_usdc)
    .provider_claf_reward(provider_claf_reward)
    .proof(proof)
    .send()
    .await?;`,
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
