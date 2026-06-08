'use client'

import { useState } from 'react'

type Lang = 'ts' | 'py' | 'rs'

const examples: Record<Lang, { label: string; code: string }> = {
  ts: {
    label: 'TypeScript',
    code: `import { ClawFarm } from '@clawfarm/sdk'

const cf = new ClawFarm({ apiKey: process.env.CLAWFARM_KEY })

const result = await cf.chat({
  model: 'model-l-001',
  messages: [{ role: 'user', content: 'Hello' }],
})

console.log(result.text)`,
  },
  py: {
    label: 'Python',
    code: `from clawfarm import ClawFarm

cf = ClawFarm(api_key=os.environ["CLAWFARM_KEY"])

result = cf.chat(
    model="model-l-001",
    messages=[{"role": "user", "content": "Hello"}],
)

print(result.text)`,
  },
  rs: {
    label: 'Rust',
    code: `use clawfarm::Client;

let cf = Client::new(env::var("CLAWFARM_KEY")?);

let result = cf.chat()
    .model("model-l-001")
    .message("user", "Hello")
    .send()
    .await?;

println!("{}", result.text);`,
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
