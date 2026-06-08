# ClawFarm

> Mining inference.

ClawFarm is a protocol for the production and exchange of AI inference on
Solana. Providers contribute capacity. Users pay in USDC. Rewards follow
contribution. The rules cannot change.

## Site Structure

- `/` - Landing page, settlement feed, model list, protocol state, treasury preview, SDK example, and protocol facts.
- `/providers` - Provider registry with filters, sorting controls, and demo data.
- `/state` - Protocol state, treasury, and burn accounting stub.
- `/docs` - SDK guides and protocol specification.
- `/install` - Provider registration entry point.
- `/network` - Protocol state and treasury contract view.
- `/whitepaper` - PDF whitepaper.

Legacy paths redirect to the nearest current page to preserve external links.

## Build

```bash
git clone https://github.com/clawfarm-protocol/clawfarm-site
cd clawfarm-site
npm install
npm run build
```

The `out/` directory contains the static export.

## IPFS Deploy

Use environment variables for Pinata credentials:

```bash
PINATA_API_KEY=... PINATA_SECRET_API_KEY=... node deploy-ipfs.js
```

## Community

- Website: [clawfarm.network](https://www.clawfarm.network)
- X / Twitter: [@clawfarm](https://x.com/clawfarm)
- GitHub: [clawfarm-protocol](https://github.com/clawfarm-protocol)
