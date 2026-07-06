# Whitepaper Target Narrative And Devnet V3 Data Alignment Design

## Goal

Align the public ClawFarm website with two distinct truth layers:

1. The whitepaper describes the intended mainnet protocol target and launch policy.
2. Technical documentation and network/state surfaces describe the current `clawfarm_masterpool_v3` devnet implementation and live devnet snapshot.

The work must keep public website output English-only, avoid local paths and secrets, and derive implementation-facing facts from the latest `../clawfarm-masterpool` code plus `deployments/devnet-masterpool-v3.json` and its devnet RPC state.

## Confirmed Inputs

- Whitepaper correction source: owner-provided correction file, treated as the target narrative unless it contains a material error.
- Contract source of truth: `../clawfarm-masterpool/programs/clawfarm-masterpool-v3`.
- Devnet deployment source: `../clawfarm-masterpool/deployments/devnet-masterpool-v3.json`.
- Current devnet v3 program id: `263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF`.
- Current devnet v3 config: `6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m`.
- Current devnet v3 epoch duration: 300 seconds.
- Mainnet target epoch duration: 1 hour. This overrides the correction file's proposed 24-hour daily epoch.

## Epoch And Mining Output Decision

Changing the target epoch length changes epoch granularity, not the intended total mining output.

The whitepaper target remains:

- Total supply: 1,000,000,000 CLAF.
- Maximum scheduled emission: approximately 968.75M CLAF.
- Unemitted residual: approximately 31.25M CLAF.
- Emission horizon: 10 years.
- Halving interval: 2 years.
- Pool split: 70 percent provider side / 30 percent developer or buyer side.

A 1-hour epoch target means each epoch receives a larger reward slice than a 300-second devnet epoch, but the schedule total remains approximately the same when calculated over the full horizon. Approximate first-halving-period examples:

| Epoch length | Epochs per 2-year halving period | Approx. first-period emission per epoch |
|---|---:|---:|
| 300 seconds | 210,240 | 2,378.234398 CLAF |
| 1 hour | 17,520 | 28,538.812785 CLAF |
| 24 hours | 730 | 684,931.506849 CLAF |

The current v3 contract does not calculate these epoch emissions on-chain. It stores `emission_total_claw` and `emission_duration_seconds`, while `commit_epoch_settlement_v3` accepts `provider_pool_claf` and `buyer_pool_claf` in settlement arguments after verifying aggregate payment totals. Website copy should therefore describe emission calculation as a wrapper/indexer/settlement-artifact responsibility for devnet v3, with mainnet target economics stated in the whitepaper.

## Whitepaper Scope

Update the generated whitepaper source and PDF to reflect the target protocol:

- Rewrite treasury and burn around the correction file's 70/20/10 split, buy-and-burn, buy-and-add-LP, Raydium CPMM, protocol-owned liquidity, operational vaults, and anti-MEV target.
- Rewrite governance from genesis immutability to bounded governance scope, structural state, operational state, retained upgrade authority, admin scope, pause scope, transparency, and launch-period trust assumptions.
- Add cold-start commitment language for team-mined CLAF plus team-provided USDC seed liquidity, with LP surrendered or burned as stated by the correction file.
- Replace Jupiter references with Raydium CPMM references.
- Keep `CLAF`, not `CLAW`.
- Correct the correction file's 24-hour epoch proposal to a 1-hour mainnet target.
- Avoid presenting current devnet v3 as if the treasury engine, Raydium CPI, Squads multisig, timelock, seed LP, or buyback engine are already implemented in masterpool v3.

## Technical Documentation Scope

Update technical pages to explicitly distinguish current devnet v3 from the mainnet target:

- Current devnet v3: direct `record_payment_v3`, payment bitmap, epoch accumulator, authority-submitted settlement batch, evidence-based challenge, finalized roots, Merkle proof claims.
- Current devnet v3 parameters: 300-second epochs, 60-second challenge window, 3 percent tax cap, 0 provider stake transfer, 70/30 provider/buyer reward pool split, no current automated swap-and-retirement path.
- Mainnet target: 1-hour epochs, target treasury split, buyback/add-LP module, Raydium CPMM execution, anti-MEV slicing, operational vaults, bounded governance, timelock/multisig launch policy.

SDK examples should remain wrapper targets for current v3:

- `payments.record` maps to `record_payment_v3` and must supply `paymentIndex`, `paymentNonceHash`, `baseChargeUsdc` or atomic equivalent, `taxRateBps`, `taxSweepThresholdAmount`, payer token delegate, epoch accumulator PDA, and payment bitmap PDA.
- `epochs.commitSettlement` maps to `commit_epoch_settlement_v3` and supplies aggregate roots, aggregate payment totals, and provider/buyer CLAF pools computed by the wrapper/indexer.
- `epochs.finalizeSettlement`, `epochs.claimProviderEpoch`, and `epochs.claimBuyerReward` map to the v3 finalize and claim instructions.

## Devnet Data Refresh Scope

Refresh `app/lib/protocol.ts` from current devnet v3 data gathered using the deployment JSON RPC URL, without storing the RPC URL or API key in the website repository.

Expected updated public data:

- Program id: `263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF`.
- Config: `6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m`.
- Pool authority: `36Q2NicqLeS2a6vPc3G2g9nS7inrTQQL8azsY3suQwJ8`.
- CLAF mint: `BstFT1KYuPntAzH6Z6mUBCzBGJXc6b6Ha6zKsG7bASYb`.
- Test USDC mint: `Pn9LRsXqH3Av44nrJGcAv22Js3iuaEhH36VKYfKTZQo`.
- Reward vault: `AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC`.
- Treasury USDC vault: `EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS`.
- Provider pending USDC vault: `BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ`.
- Epoch duration: `300` seconds.
- Challenge window: `60` seconds.
- Provider stake: `0.000000` Test USDC.
- Tax cap: `300` bps.
- Pause flags: payment recording false, settlement false, claims false.
- Snapshot balances from the refreshed read.

Legacy v2 fields should either be removed from UI surfaces or displayed only as absent for current v3, not renamed as if they are v3 accounts.

## Verification

Before delivery, run:

- `npm run verify:site`.
- `npx tsc --noEmit`.
- `npm run build`.
- A scan for Chinese text in public website output and shipped source files.
- A scan for local machine paths and RPC credential strings, including user-home absolute paths, RPC provider hostnames, API-key query parameters, wallet JSON paths, and private key material.
- A scan ensuring whitepaper target terms are allowed only in whitepaper or explicitly mainnet-target contexts, not in current-devnet technical facts.

## Out Of Scope

- Do not modify the contract project.
- Do not implement treasury, Raydium, timelock, multisig, buyback, or LP logic in the website.
- Do not expose the deployment RPC URL or API key.
- Do not claim mainnet is deployed.
