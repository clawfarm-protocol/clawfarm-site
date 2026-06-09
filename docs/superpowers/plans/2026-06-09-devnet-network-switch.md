# Devnet Network Switch Implementation Plan

Status: completed on 2026-06-09
Branch: `codex/devnet-network-switch`

## Goal

Build a devnet-first ClawFarm website with a manual Mainnet switch, contract-derived devnet data, and a clear pending state for Mainnet.

## Constraints

- Public website copy stays English-only.
- Protocol facts are derived from the current Phase 1 contract implementation.
- Devnet is the first-visit default network.
- Mainnet remains selectable but empty until deployment records exist.
- Public source must not include local machine paths, secrets, credentialed RPC examples, or private wallet material.
- `AGENTS.md` and `.impeccable.md` remain uncommitted project-local guidance files.

## Task Progress

- [x] Task 1: Add content verification guard.
- [x] Task 2: Add static protocol data layer.
- [x] Task 3: Add client network context and header switch.
- [x] Task 4: Add shared protocol network panels.
- [x] Task 5: Update home, state, and network pages.
- [x] Task 6: Align docs and public copy with Phase 1 contracts.
- [x] Task 7: Re-run final verification, copy audit, responsive polish, and cleanup.

## Implementation Summary

- Added typed devnet and pending-mainnet protocol profiles in `app/lib/protocol.ts`.
- Added `NetworkProvider` and `NetworkSwitch` so visitors default to Devnet and can manually switch to Mainnet.
- Added network-aware protocol panels for status, metrics, treasury balances, state, and addresses.
- Updated home, state, network, docs, provider, developer, install, and README copy around receipt-driven Phase 1 economics.
- Removed unsupported public claims around live routing, live registry state, endpoint metadata stored on-chain, and dual user-provider signatures.
- Added responsive CSS so address rows, metrics, grids, and the network switch fit mobile screens.
- Added and expanded `verify:site` to guard English-only public source, stale protocol copy, local path leakage, credential leakage, wallet signing material, and unsupported routing or registry wording.
- Updated `.gitignore` so local guidance files and Playwright CLI state stay outside commits.

## Commit History

- `e10ec3d` - `test: add site content verification`
- `41db397` - verification guard regex follow-up
- `9aaa983` - `feat: add protocol network data`
- `31c1080` - `feat: add devnet mainnet switch`
- `af81b68` - network provider storage, query, and accessibility follow-up
- `2900bd9` - `feat: add protocol network panels`
- `9e2bbda` - metric overflow and explorer URL follow-up
- `41c742f` - `feat: populate devnet protocol surfaces`
- `48f9fa9` - anchor and burn-table affordance follow-up
- `324e9d4` - `fix: align site copy with phase one contracts`
- `45d8509` - provider metadata and install copy follow-up
- `1ea47fe` - deeper contract-fact copy follow-up
- `17fa4e4` - `fix: polish devnet network launch`

## Verification Evidence

Fresh checks after Task 7:

- [x] `npm run verify:site` passed with `Site content verification passed for 22 files.`
- [x] `npx tsc --noEmit` passed with exit code 0.
- [x] Local HTTP smoke checks returned HTTP 200 for `/`, `/state`, and `/network?network=mainnet`.
- [x] Local development and browser automation processes started during verification were stopped.

Known external blocker:

- `npm run build` was attempted repeatedly and failed while `next/font` fetched Google Fonts for `IBM Plex Sans` and `JetBrains Mono` with network timeouts. This remains an external font-fetch dependency in `app/layout.tsx`, not a Task 7 code regression.

## Final Notes

- Devnet contains real devnet program, mint, vault, config, balance, and epoch snapshot data.
- Mainnet contains no placeholder addresses and remains in pending state.
- Public copy describes off-chain provider directory metadata where appropriate and does not claim endpoint metadata is stored in the Phase 1 contracts.
- Receipt copy describes configured signer verification and delegated payer settlement rather than dual user-provider signatures.
