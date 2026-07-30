# Mainnet-First AIRouter Onboarding Design

Date: 2026-07-30
Status: Approved
Scope: ClawFarm public website network state, whitepaper cold-start figures, AIRouter onboarding documentation, generated whitepaper PDFs, and content verification

## Context

The ClawFarm masterpool v3 program is deployed on Solana mainnet-beta. The current website still defaults to Devnet, presents Mainnet as undeployed, and describes SDK or wrapper targets instead of the onboarding and HTTP request flow implemented by AIRouter's `feature/clawfarm` branch.

The project owner supplied a local `mainnet-masterpool-v3.json` deployment record. The local source path is an implementation input only and must not appear in shipped website files, generated PDFs, commits, or public documentation. Contract facts remain governed by the latest `../clawfarm-masterpool` source, generated IDL, tests, and verified mainnet account state. AIRouter integration facts come from its current `feature/clawfarm` branch; the local checkout path must not be shipped.

The public site has no onboarding contact surface. Its README links to X and GitHub, and the generated whitepaper footer contains an email address, but none is identified as the Provider or Buyer onboarding channel. Provider and Buyer onboarding calls to action will therefore use the unlinked text `Contact the ClawFarm team`.

## Goals

- Make Mainnet the default and primary network while preserving an explicit Devnet switch.
- Populate the Mainnet network profile from the supplied deployment record and a fresh, sanitized mainnet chain read.
- Correct network-sensitive labels and copy so Mainnet is described as deployed and active rather than a future target.
- Replace public SDK, CLI, and wrapper onboarding instructions with the actual AIRouter Provider and B-side Buyer workflows.
- Update the whitepaper cold-start commitment to `500,000 CLAF + 50 USDC` and keep all derived figures and direct cross-references internally consistent.
- Preserve the existing contract-anchored visual system without a visual redesign.
- Extend automated content checks to prevent regression to Devnet-first, undeployed-Mainnet, SDK-onboarding, or stale cold-start copy.

## Non-Goals

- Do not modify the masterpool contract or AIRouter.
- Do not submit mainnet transactions.
- Do not add runtime browser RPC requests or claim that the static website is realtime.
- Do not remove the Devnet network profile or network switch.
- Do not expose RPC URLs, API keys, admin credentials, provider credentials, private keys, wallet files, or local machine paths.
- Do not build a public self-service onboarding portal.
- Do not document AIRouter admin-only endpoints, sign-service configuration, database schema, or operational secrets.
- Do not reintroduce Wallet Browser or SDK integration flows that AIRouter currently rejects for B-side traffic.

## Source Of Truth

### Contract and deployment

The implementation must re-check these sources immediately before editing protocol-facing copy:

- `../clawfarm-masterpool/programs/clawfarm-masterpool-v3/src`
- `../clawfarm-masterpool/target/idl/clawfarm_masterpool_v3.json`
- Relevant v3 tests and mainnet bootstrap scripts in `../clawfarm-masterpool`
- The owner-supplied mainnet deployment JSON
- Read-only mainnet RPC responses for the deployed program, config, provider account, mints, and vaults

The initial verified mainnet facts are:

- Cluster: `mainnet-beta`
- Masterpool v3 program: `263WhUfCxwVGnsmEdABR2pT3iKnEfSREbm8GT6P3rVGF`
- CLAF mint: `C9C4v7EPpxgYcuJpvBskW6VENA6kL1C1upgfg6jfmCu7`
- Native USDC mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- Pool authority: `36Q2NicqLeS2a6vPc3G2g9nS7inrTQQL8azsY3suQwJ8`
- Global config: `6CAC3WVozLwCeep4RHvm9GE1xaJYrc8hHtMhL1eZWX1m`
- Reward vault: `AVyUyyJJLKw6Zc8P5FvY85rqT9VUJHoxo2AQynUvWEFC`
- Treasury USDC vault: `EzS6EaXyd8LH5VL7QZAZNyeL5ohrs2Wr2LhYFhnj57mS`
- Provider-pending USDC vault: `BowY3xmvodiP4wds8dCFREzR3fUr55Nt8ADct4dYzjoQ`
- Epoch duration: 3,600 seconds
- Deprecated challenge-window account field: 30 seconds
- Provider/Buyer reward split: 70/30
- Configured provider stake parameter: 100 USDC; current `register_provider_v3` still transfers and locks zero USDC
- Emission inventory: 1,000,000,000 CLAF atomic-adjusted display supply
- Emission duration: 315,360,000 seconds
- Tax cap: 300 bps
- Payment recording, settlement, and claims: unpaused at the verified read

Vault balances are point-in-time data and must be refreshed again during implementation. The website must record the final read timestamp and display these values as a static snapshot.

### AIRouter integration

Public integration behavior must match the current `feature/clawfarm` implementation:

- B-side Buyers authenticate with human-issued `cfk_*` API keys.
- Each active Buyer API key has an active billing configuration bound to a Solana mainnet B-wallet.
- Buyer model traffic uses the bound wallet as the payer identity and Buyer reward identity.
- AIRouter accepts `X-Api-Key: cfk_*` or `Authorization: Bearer cfk_*`.
- Public model routes include `GET /clawfarm/v1/models`, `POST /clawfarm/chat/completions`, `POST /clawfarm/v1/responses`, `POST /clawfarm/v1/messages`, and the Google-compatible routes.
- B-side requests are settled asynchronously after durable receipt persistence; initial responses may report `settlement_pending`.
- AIRouter does not read private keys or sign locally. Public onboarding copy must tell Buyers to provide a public wallet address and fund it with mainnet USDC, never to provide a seed phrase or private key.
- Provider routing requires an active Provider record, protocol driver and base URL, encrypted upstream API credential, model/pricing metadata, settlement profile, and Provider wallet.
- ProviderAccountV3 registration is wallet-address based. AIRouter can bootstrap the account through its controlled chain-operation path; no public SDK is required.

## Network State Design

### Default selection

`defaultNetworkId` becomes `mainnet`. Explicit user intent remains authoritative:

1. A valid `?network=mainnet` or `?network=devnet` query parameter wins.
2. Otherwise a valid saved network choice wins.
3. Otherwise the first visit defaults to Mainnet.

This makes the site Mainnet-first without overriding a visitor who deliberately selected Devnet.

### Mainnet profile

The Mainnet profile becomes `active` and receives the verified addresses, config, pause flags, and point-in-time vault balances. Its label must include the exact UTC read time or date, and must not use `live`, `realtime`, or equivalent wording for static balances.

The Devnet profile remains available as a secondary testing network. Existing Devnet data may remain as its dated snapshot, but public default-state copy must no longer frame Devnet as the primary deployment or Mainnet as pending.

### Network-sensitive components

Shared panels must derive labels from the selected profile rather than hard-code `Devnet` or `Target`:

- status strip
- number wall
- homepage protocol-state snapshot
- state dashboard economics
- treasury snapshot notes
- Network and State page metadata and hero copy

The configured `provider_stake_usdc` field must be labeled as a config parameter, not an enforced transfer. Public copy must retain the contract fact that current v3 Provider registration initializes `staked_usdc_amount` to zero and performs no upfront USDC transfer.

## Provider Onboarding Design

Provider-facing pages will describe the actual operational sequence:

1. **Contact** - `Contact the ClawFarm team` to start onboarding.
2. **Provide routing information** - supply the supported protocol, upstream API base URL, model/catalog information, pricing metadata, and any quota information required for routing.
3. **Provide the upstream API key securely** - ClawFarm stores the credential encrypted and uses it only to authenticate AIRouter requests to that Provider. The site must not suggest pasting a key into a public form or repository.
4. **Provide a public Solana mainnet wallet address** - this becomes the Provider settlement and reward identity. Explicitly state never to send a private key or seed phrase.
5. **ClawFarm configuration** - the team configures the Provider, driver, credential, model catalog, settlement profile, and Provider wallet, then bootstraps ProviderAccountV3 if it does not already exist.
6. **Validation and activation** - ClawFarm validates model discovery/routing, price metadata, provider-account state, a test inference request, durable receipt creation, and mainnet settlement observability before activating traffic.
7. **Settlement** - base-charge USDC is accounted to the Provider side, payment tax goes to treasury, and finalized epoch proofs determine Provider USDC and CLAF claims.

The Provider guide must distinguish three identities:

- upstream API credential: secret supplied securely to ClawFarm;
- Provider wallet: public mainnet address used for settlement and rewards;
- Provider endpoint: off-chain AIRouter routing metadata, not stored in ProviderAccountV3.

## Buyer Onboarding Design

Buyer-facing pages will use a no-SDK HTTP workflow:

1. **Contact** - `Contact the ClawFarm team` to request access.
2. **Receive a Buyer API key** - ClawFarm creates a `cfk_*` key and reveals the plaintext value once. The Buyer must store it as a secret and never embed it in public frontend code.
3. **Register a public Solana mainnet wallet** - ClawFarm binds the API key to the Buyer wallet. Explicitly state never to provide private key or seed phrase material.
4. **Fund the wallet** - deposit native mainnet USDC into the bound wallet and keep enough SOL for any Buyer-controlled wallet operations that require network fees.
5. **Payment authorization** - ClawFarm verifies the billing configuration and manages the AIRouter payment authorization workflow through its configured signing boundary. The public guide describes the outcome, not internal sign-service URLs or admin operations.
6. **Discover models** - call `GET /clawfarm/v1/models` with the `cfk_*` credential.
7. **Send inference requests** - call an AIRouter HTTP route directly. The primary example uses `POST /clawfarm/chat/completions` with an environment-variable placeholder for the public Gateway base URL and `Authorization: Bearer $CLAWFARM_API_KEY`.
8. **Observe settlement** - explain `X-ClawFarm-Request-Nonce`, `X-ClawFarm-Payment-Status`, actual/max charge, receipt hash, and queue task identifiers where available. `settlement_pending` means a durable receipt is queued for asynchronous mainnet settlement, not that payment was skipped.
9. **Rewards** - finalized Buyer allocation is associated with the bound Buyer wallet and can be observed or withdrawn through the supported ClawFarm reward flow.

The website must not invent a production Gateway hostname. Examples use a clearly named environment variable such as `$CLAWFARM_GATEWAY_URL` and tell the Buyer to obtain the current base URL from the ClawFarm team during onboarding.

## Documentation Information Architecture

The existing pages keep their roles but change content:

- `/providers`: concise Provider value proposition, prerequisites, onboarding steps, credential/wallet security, activation, and settlement.
- `/install`: detailed Provider onboarding checklist. The route may retain its URL for compatibility, but its metadata and headings must no longer imply installing an SDK or CLI.
- `/builders`: B-side Buyer onboarding, funding, direct HTTP call examples, response/settlement semantics, and security.
- `/docs`: canonical AIRouter integration reference. Remove SDK installation and TypeScript/Python/Rust wrapper targets. Document authentication, supported HTTP endpoints, model IDs, mainnet payment lifecycle, settlement headers/public status surfaces, current contract shape, and mainnet parameters.
- `/`: replace SDK-first calls to action and interface copy with direct AIRouter/API onboarding language where necessary.
- `README.md`: update project stage, Mainnet-first behavior, page descriptions, and verification wording.

Technical contract material that remains accurate may stay, but it must be framed as protocol internals rather than something a Provider or Buyer must construct manually.

## Whitepaper Design

Section 14 and every direct cold-start cross-reference must use:

- CLAF side: 500,000 CLAF
- USDC side: 50 USDC
- Opening price: 0.0001 USDC per CLAF
- Initial fully diluted valuation at a fixed 1,000,000,000 CLAF supply: 100,000 USDC
- Seed LP: burned as already specified

Appendix A's `Initial pool seeding` row must match the new pair. Any minimum-liquidity sentence derived from the old seed size must be revised so it does not claim a 5,000 USDC post-seed floor for a 50 USDC seed. The implementation must use a neutral launch description if the exact replacement threshold is not a contract fact, rather than invent a new governance parameter.

Both `public/whitepaper.pdf` and `public/ClawFarm_Whitepaper_v1.0.pdf` must be regenerated from `scripts/generate-whitepaper-v1.py` and verified visually and by text extraction.

## Error Handling And Security Copy

Public onboarding must explain these failure classes without exposing internal implementation:

- invalid or disabled API key;
- missing or inactive Buyer billing configuration;
- invalid bound wallet;
- insufficient configured max charge;
- insufficient mainnet USDC funding or authorization discovered by settlement operations;
- provider route, credential, or model unavailable;
- receipt persisted but mainnet settlement still pending.

Security rules:

- Never request or publish private keys, seed phrases, wallet files, or secret provider credentials.
- Tell Providers to deliver upstream credentials only through a secure channel agreed with the ClawFarm team.
- Tell Buyers to keep `cfk_*` keys server-side or in a secret manager, not browser bundles or public repositories.
- Never include real API keys, auth headers, RPC credentials, or signing-service URLs in examples.

## Verification Strategy

### Automated content tests first

Before production edits, update `scripts/verify-site-content.mjs` with checks that fail against the current site for:

- Devnet remaining the default network;
- Mainnet described as pending or undeployed;
- SDK install/wrapper onboarding copy in public app pages;
- stale `10,000,000 CLAF`, `5,000 USDC`, `0.0005 USDC per CLAF`, or `500,000 USDC` cold-start values;
- a hard-coded production Gateway hostname in onboarding examples;
- unsafe requests for wallet secrets or examples containing credential-like values.

After observing the expected failure, implement the minimum content/config changes and rerun the guard to green.

### Code and build verification

- `npm run verify:site`
- `npx tsc --noEmit`
- `npm run build`

### Browser verification

Run the exported or local site and inspect at desktop and mobile widths:

- first-visit Mainnet selection;
- explicit Devnet selection and persisted choice;
- Mainnet addresses, balances, config labels, and Explorer links;
- Provider and Buyer onboarding readability;
- code-block wrapping and table overflow;
- absence of pending-Mainnet or SDK-first copy.

### Whitepaper verification

- Regenerate both PDFs from the canonical script.
- Extract PDF text and confirm the new amounts, price, and FDV appear.
- Confirm stale cold-start figures do not appear.
- Render the affected whitepaper pages and inspect for clipping, overflow, or unexpected pagination.

### Delivery audit

Audit every changed shipped file for:

- Chinese text;
- local absolute paths;
- RPC URLs and credentials;
- API keys, bearer values, private keys, seed phrases, wallet files, or signing-service secrets;
- stale Devnet-first/Mainnet-pending claims;
- stale contract facts;
- stale whitepaper cold-start figures.

## Acceptance Criteria

- A first-time visitor sees Mainnet selected by default.
- A deliberate query-string or saved Devnet selection remains respected.
- Mainnet is active and populated with verified addresses, parameters, pause flags, and a dated static snapshot.
- Mainnet Explorer links omit the Devnet query parameter.
- Shared state components use selected-network labels and contain no hard-coded Devnet metric names.
- Provider onboarding accurately asks for an upstream API credential, routing metadata, and a public Provider wallet through `Contact the ClawFarm team`.
- Buyer onboarding accurately asks the Buyer to contact the team, receive a `cfk_*` key, register a public wallet, fund it with mainnet USDC, and call AIRouter HTTP endpoints without an SDK.
- No onboarding page asks for a private key, seed phrase, or wallet file.
- No public example claims a production Gateway hostname that is not established in code.
- Whitepaper source and both generated PDFs consistently use `500,000 CLAF + 50 USDC`, `0.0001 USDC per CLAF`, and `100,000 USDC` FDV.
- Content verification, TypeScript checking, production build, browser checks, PDF text checks, and the delivery audit complete successfully or any external blocker is reported with exact evidence.

## Self-Review

- The design contains no implementation placeholders.
- Mainnet state, AIRouter onboarding, and whitepaper changes form one coherent public-launch update.
- Runtime RPC fetching, contract changes, AIRouter changes, and self-service onboarding are explicitly excluded.
- Static snapshot language is consistent with the site's `output: 'export'` architecture.
- Provider credential handling and Buyer wallet handling are separated and do not request secret wallet material.
- Derived whitepaper figures are mathematically consistent with the approved seed pair and fixed CLAF supply.
