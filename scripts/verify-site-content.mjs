import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const sourceRoots = ['app', 'README.md', 'docs/superpowers/specs']
const sourceArgs = sourceRoots.map((root) => `'${root}'`).join(' ')

function listFiles(command) {
  try {
    return execSync(command, { encoding: 'utf8' })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

const files = [
  ...listFiles(`git ls-files ${sourceArgs}`),
  ...listFiles(`git ls-files --others --exclude-standard ${sourceArgs}`),
]

const uniqueFiles = [...new Set(files)].filter((file) => !file.endsWith('.png') && !file.endsWith('.pdf'))

const globalChecks = [
  { name: 'Chinese text', pattern: /[\p{Script=Han}]/u },
  { name: 'local absolute path', pattern: /(\/Users\/|\/home\/|\/root\/|~\/\.config|id\.json|keypair\.json)/ },
  { name: 'RPC API-key URL', pattern: /(api-key=|helius-rpc\.com)/i },
  { name: 'private key material', pattern: /(BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|\b(seed phrase|mnemonic)\s*[:=]|\[[0-9]{1,3}(,\s*[0-9]{1,3}){31,}\])/i },
]

const negatedClaimPattern = /\b(not|does not|do not|did not|is not|are not|was not|were not|isn't|aren't|doesn't|don't|without|rather than|instead of|no)\b/i

function globalPattern(pattern) {
  return new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`)
}

function sentenceAround(text, index) {
  const start = Math.max(text.lastIndexOf('.', index), text.lastIndexOf('\n', index)) + 1
  const nextPeriod = text.indexOf('.', index)
  const nextNewline = text.indexOf('\n', index)
  const ends = [nextPeriod, nextNewline].filter((position) => position !== -1)
  const end = ends.length > 0 ? Math.min(...ends) : text.length
  return text.slice(start, end)
}

function firstNonNegatedClaim(text, pattern) {
  for (const match of text.matchAll(globalPattern(pattern))) {
    if (!negatedClaimPattern.test(sentenceAround(text, match.index))) {
      return match[0]
    }
  }
  return null
}

function firstDirectPayoutClaim(text) {
  return firstNonNegatedClaim(
    text,
    /\b(Every call mines|each call mines|mines (CLAW|CLAF) to your wallet|CLAW mined|CLAF mined|CLAF mined directly|direct per-call (CLAF )?reward)\b/i,
  )
}

const publicCopyChecks = [
  { name: 'stale public token symbol', pattern: /\bCLAW\b/ },
  {
    name: 'unqualified buyback language',
    pattern: /\b(Jupiter|execute_buyback|swap aggregator|incinerator)\b/i,
    match: (text) => firstNonNegatedClaim(text, /\b(current[- ]devnet[^.\n]{0,140}buyback|buyback[^.\n]{0,140}current[- ]devnet)\b/i),
  },
  {
    name: 'unqualified mainnet immutability',
    pattern: /\b(Genesis-immutable|deployer wallet keys discarded)\b/i,
    match: (text) => firstNonNegatedClaim(text, /\b(current[- ]devnet[^.\n]{0,140}(immutable|immutability|upgrade authority renounced)|(immutable|immutability|upgrade authority renounced)[^.\n]{0,140}current[- ]devnet)\b/i),
  },
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'direct per-call mining payout claim', match: firstDirectPayoutClaim },
  {
    name: 'unsupported current-devnet registry or routing claim',
    match: (text) => firstNonNegatedClaim(text, /\b(current[- ]devnet[^.\n]{0,160}(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)|(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)[^.\n]{0,160}current[- ]devnet)\b/i),
  },
  {
    name: 'unsupported current-devnet dual-signature claim',
    match: (text) => firstNonNegatedClaim(text, /\b(current[- ]devnet[^.\n]{0,180}(dual-signed|dual-signature|dual signature|user and provider sign|request hash|response hash)|(dual-signed|dual-signature|dual signature|user and provider sign|request hash|response hash)[^.\n]{0,180}current[- ]devnet)\b/i),
  },
  { name: 'contract-native HTTP API example', pattern: /curl https:\/\/api\.clawfarm\.network\/v1\/devnet\/receipts/i },
  { name: 'endpoint-first provider registration', pattern: /\b(Register an endpoint|Register a wallet-backed endpoint|wallet-controlled endpoint|wallet-backed endpoint)\b/i },
  { name: 'one-step SDK receipt submit hides wrapper target', pattern: /receipts\.submit\(\{[\s\S]{0,600}\b(model|totalUsdc|total_usdc)\b/ },
  { name: 'old chained SDK receipt submit hides wrapper target', pattern: /\.receipts\(\)[\s\S]{0,400}\.model\(/ },
  { name: 'unframed provider CLI example', pattern: /npx clawfarm provider register/i },
]

const publicCopyFiles = uniqueFiles.filter((file) => file.startsWith('app/') || file === 'README.md')
const failures = []

function scan(filesToScan, checks) {
  for (const file of filesToScan) {
    const text = readFileSync(file, 'utf8')
    for (const check of checks) {
      const patternMatch = check.pattern ? text.match(check.pattern) : null
      const match = patternMatch || (check.match ? check.match(text) : null)
      if (match) {
        failures.push(`${file}: ${check.name}: ${typeof match === 'string' ? match : match[0]}`)
      }
    }
  }
}

scan(uniqueFiles, globalChecks)
scan(publicCopyFiles, publicCopyChecks)

if (failures.length > 0) {
  console.error('Site content verification failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Site content verification passed for ${uniqueFiles.length} files.`)
