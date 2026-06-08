import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation — ClawFarm',
  description: 'SDK, integration guides, and full protocol specification for ClawFarm.',
  alternates: { canonical: '/docs' },
}

const toc = [
  ['Quickstart', '#quickstart'],
  ['Install', '#install'],
  ['Authenticate', '#authenticate'],
  ['First request', '#first-request'],
  ['SDK', '#sdk'],
  ['Routing modes', '#routing-modes'],
  ['Provider', '#provider'],
  ['Models', '#models'],
  ['Protocol', '#protocol'],
  ['Architecture', '#architecture'],
  ['Smart contracts', '#contracts'],
  ['Settlement', '#settlement'],
  ['Buyback mechanism', '#buyback'],
  ['Anti-fraud', '#anti-fraud'],
  ['Tokenomics', '#tokenomics'],
  ['Genesis parameters', '#genesis-parameters'],
  ['Reproducibility', '#reproducibility'],
  ['Resources', '#resources'],
]

export default function DocsPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1 className="page-title">Documentation</h1>
          <p className="page-copy">SDK, integration guides, and full protocol specification.</p>
        </div>
      </section>

      <section className="section">
        <div className="container docs-layout">
          <nav className="docs-toc" aria-label="Documentation sections">
            {toc.map(([label, href], index) => (
              <a className={index > 0 && index < 7 ? 'toc-sub' : undefined} href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>

          <article className="docs-content">
            <section id="quickstart">
              <h2>Quickstart</h2>
              <p>Route one inference request through ClawFarm and receive a signed usage receipt.</p>
              <h3 id="install">Install</h3>
              <pre className="code-block"><code>{`npm install @clawfarm/sdk`}</code></pre>
              <h3 id="authenticate">Authenticate</h3>
              <pre className="code-block"><code>{`import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({
  apiKey: process.env.CLAWFARM_KEY
})`}</code></pre>
              <h3 id="first-request">First request</h3>
              <pre className="code-block"><code>{`const result = await cf.chat({
  model: 'model-l-001',
  mode: 'auto',
  messages: [{ role: 'user', content: 'Summarize this file.' }]
})

console.log(result.provider)
console.log(result.usageProof)`}</code></pre>
            </section>

            <section id="sdk">
              <h2>SDK</h2>
              <p>Use TypeScript, Python, Rust, or direct HTTP calls with the same routing model.</p>
              <h3>TypeScript</h3>
              <pre className="code-block"><code>{`await cf.chat({
  model: 'model-l-002',
  mode: 'premium',
  messages
})`}</code></pre>
              <h3>Python</h3>
              <pre className="code-block"><code>{`from clawfarm import ClawFarm

cf = ClawFarm(api_key=os.environ["CLAWFARM_KEY"])
result = cf.chat(model="model-l-001", mode="auto", messages=messages)`}</code></pre>
              <h3>Rust</h3>
              <pre className="code-block"><code>{`let result = client
    .chat("model-l-001")
    .mode("eco")
    .messages(messages)
    .send()
    .await?;`}</code></pre>
              <h3>HTTP API</h3>
              <pre className="code-block"><code>{`curl https://api.clawfarm.network/v1/route \\
  -H "Authorization: Bearer $CLAWFARM_KEY" \\
  -d '{"model":"model-l-001","mode":"auto","messages":[{"role":"user","content":"Hello"}]}'`}</code></pre>
            </section>

            <section id="routing-modes">
              <h2>Routing modes</h2>
              <p>Choose the routing objective per request: cost, balance, or quality.</p>
              <div className="key-list">
                <div>eco</div>
                <div>Lowest-cost eligible provider.</div>
                <div>auto</div>
                <div>Balanced price, latency, and historical reliability.</div>
                <div>premium</div>
                <div>Highest-quality route for complex inference.</div>
              </div>
            </section>

            <section id="provider">
              <h2>Provider</h2>
              <p>Providers register one endpoint, one bond, and one pricing table.</p>
              <div className="key-list">
                <div>Register</div>
                <div>Call the provider registry with endpoint, models, wallet, and pricing.</div>
                <div>Bond</div>
                <div>Provider bond: 100 USDC.</div>
                <div>Pricing</div>
                <div>Input, output, request, image, second, or task units.</div>
                <div>Usage proofs</div>
                <div>Requester and provider dual-sign a receipt before settlement.</div>
              </div>
              <p>The protocol does not specify what infrastructure backs a provider&apos;s endpoint.</p>
            </section>

            <section id="models">
              <h2>Models</h2>
              <p>The live registry lists model identifiers, provider counts, clearing price, and 30d volume. Individual suppliers remain wallet-addressed.</p>
              <div className="key-list">
                <div>model-l-001</div>
                <div>Language model identifier. Provider count and price bind from registry state.</div>
                <div>model-i-001</div>
                <div>Image model identifier. Provider count and price bind from registry state.</div>
                <div>model-v-001</div>
                <div>Video model identifier. Provider count and price bind from registry state.</div>
              </div>
            </section>

            <section id="protocol">
              <h2>Protocol</h2>
              <p>ClawFarm is a contract-executed settlement protocol for AI inference.</p>
              <h3 id="architecture">Architecture</h3>
              <pre className="code-block"><code>{`AGENT / APP LAYER
  Apps · Agents · Demand Apps · Frontends

SERVICE REGISTRY
  Model APIs · GPU nodes · Routers · Custom endpoints

PROTOCOL LAYER
  Escrow · Registry · Metering · Proofs · Settlement · Compensation

PROVIDER LAYER
  Inference endpoints · Capacity pools · Operator wallets`}</code></pre>
              <h3 id="contracts">Smart contracts</h3>
              <div className="key-list">
                <div>Escrow</div>
                <div>Holds user USDC until a valid usage proof is settled.</div>
                <div>Registry</div>
                <div>Stores provider endpoint hash, bond state, pricing, and wallet.</div>
                <div>Metering</div>
                <div>Records route mode, provider, price, account, and usage units.</div>
                <div>Settlement</div>
                <div>Splits payment and updates epoch accounting.</div>
              </div>
              <h3 id="settlement">Settlement</h3>
              <pre className="code-block"><code>{`User escrow
  → dual-signed usage proof
  → settlement contract
  → 97% provider wallet
  → 3% Treasury PDA`}</code></pre>
              <h3 id="buyback">Treasury Contract</h3>
              <p>
                A protocol-owned PDA accumulating 3% of every settlement and executing
                automated buyback-and-burn at epoch boundaries.
              </p>
              <div className="key-list">
                <div>Trigger</div>
                <div>epoch end, when Treasury balance ≥ 100 USDC</div>
                <div>Mechanism</div>
                <div>swap aggregator CPI, USDC → CLAF</div>
                <div>Slippage</div>
                <div>1% max</div>
                <div>Max swap</div>
                <div>0.5% of CLAF/USDC pool liquidity per epoch</div>
                <div>Destination</div>
                <div className="mono">1nc1nerator11111111111111111111111111111111</div>
              </div>
              <p>The contract executes when conditions are met.</p>
              <pre className="code-block"><code>{`97% → Provider wallet
 3% → Treasury PDA → automated buyback-and-burn`}</code></pre>
              <h3 id="anti-fraud">Anti-fraud</h3>
              <div className="key-list">
                <div>Challenge bond</div>
                <div>2 USDC</div>
                <div>Challenge period</div>
                <div>24 hours</div>
                <div>Slash</div>
                <div>30 CLAF per challenge success: 21 to challenger, 9 burned</div>
                <div>Unstake</div>
                <div>7-day waiting period</div>
              </div>
              <h3 id="tokenomics">Tokenomics</h3>
              <div className="key-list">
                <div>Total supply</div>
                <div>1,000,000,000 CLAF</div>
                <div>Team allocation</div>
                <div>0%</div>
                <div>Provider pool</div>
                <div>70% of epoch emission</div>
                <div>Developer pool</div>
                <div>30% of epoch emission</div>
                <div>Protocol fee</div>
                <div>3% auto buyback-and-burn via swap aggregator</div>
                <div>Vesting</div>
                <div>180-day linear</div>
              </div>
              <p>
                Parameters are set at Genesis and persist for the lifetime of the protocol&apos;s
                emission schedule.
              </p>
              <h3 id="roadmap">Roadmap</h3>
              <div className="key-list">
                <div>Genesis (block 0)</div>
                <div>
                  All contracts deployed. 1B CLAF minted to emission pool PDA.
                  Mint authority transferred to PDA. Freeze authority disabled. Upgrade authority renounced.
                  Deployer wallet keys discarded after Genesis confirmation.
                </div>
                <div>After Genesis</div>
                <div>The protocol runs. Halving every 2 years. Emission schedule and parameters are fixed at deployment.</div>
              </div>
              <h3 id="genesis-parameters">Appendix A: Genesis Parameters</h3>
              <div className="key-list">
                <div>Chain</div><div>Solana</div>
                <div>Token</div><div>CLAF (SPL)</div>
                <div>Total supply</div><div>1,000,000,000</div>
                <div>Emission period</div><div>10 years</div>
                <div>Halving</div><div>Every 2 years</div>
                <div>Epoch</div><div>1 hour (configurable per block)</div>
                <div>Provider pool</div><div>70% of epoch emission</div>
                <div>Developer pool</div><div>30% of epoch emission</div>
                <div>Vesting</div><div>180-day linear</div>
                <div>Provider bond</div><div>100 USDC</div>
                <div>Challenge bond</div><div>2 USDC</div>
                <div>Challenge slash</div><div>30 CLAF</div>
                <div>Challenge period</div><div>24 hours</div>
                <div>Unstake period</div><div>7 days</div>
                <div>Provider revenue</div><div>97%</div>
                <div>Protocol fee</div><div>3% (auto buyback-and-burn via swap aggregator)</div>
                <div>Treasury trigger</div><div>≥ 100 USDC balance</div>
                <div>Buyback slippage</div><div>1% max</div>
                <div>Buyback max per epoch</div><div>0.5% of CLAF/USDC pool liquidity</div>
                <div>Upgrade authority</div><div>Renounced at Genesis</div>
                <div>Parameters</div><div>Set at Genesis, persistent for emission lifecycle</div>
              </div>
            </section>

            <section id="reproducibility">
              <h2>Reproducibility</h2>
              <p>Genesis state and builds are independently reproducible.</p>
              <h3>Genesis state script</h3>
              <pre className="code-block"><code>{`npx clawfarm genesis-check \\
  --cluster mainnet-beta \\
  --token CLAF \\
  --expected-supply 1000000000`}</code></pre>
              <h3>Reproducible builds</h3>
              <pre className="code-block"><code>{`git clone <source-repository-url>
cd contracts
npm ci
npm run build
npm run test`}</code></pre>
            </section>

            <section id="resources">
              <h2>Resources</h2>
              <p>Reference files and mirrors for developers, providers, and auditors.</p>
              <div className="key-list">
                <div>Whitepaper PDF</div>
                <div><a className="text-link" href="/docs#protocol">Protocol section →</a></div>
                <div>IPFS mirror</div>
                <div><a className="text-link" href="https://ipfs.io/ipfs/clawfarm-protocol" target="_blank" rel="noopener">Open mirror →</a></div>
                <div>Source</div>
                <div>Repository URL publishes after protocol organization migration.</div>
              </div>
            </section>
          </article>
        </div>
      </section>
    </main>
  )
}
