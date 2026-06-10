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

function clauseAround(text, index) {
  const previousBreaks = ['.', '\n', ';', ':', '!', '?'].map((separator) => text.lastIndexOf(separator, index))
  const start = Math.max(...previousBreaks) + 1
  const nextBreaks = ['.', '\n', ';', ':', '!', '?']
    .map((separator) => text.indexOf(separator, index))
    .filter((position) => position !== -1)
  const end = nextBreaks.length > 0 ? Math.min(...nextBreaks) : text.length
  return text.slice(start, end)
}

function sentenceAround(text, index) {
  const previousBreaks = ['.', '\n', '!', '?'].map((separator) => text.lastIndexOf(separator, index))
  const start = Math.max(...previousBreaks) + 1
  const nextBreaks = ['.', '\n', '!', '?']
    .map((separator) => text.indexOf(separator, index))
    .filter((position) => position !== -1)
  const end = nextBreaks.length > 0 ? Math.min(...nextBreaks) : text.length
  return text.slice(start, end)
}

function claimIndex(match, termPattern) {
  if (!termPattern) {
    return match.index
  }
  const termMatch = match[0].match(termPattern)
  return termMatch ? match.index + termMatch.index : match.index
}

function firstNonNegatedClaim(text, pattern, termPattern) {
  for (const match of text.matchAll(globalPattern(pattern))) {
    if (!negatedClaimPattern.test(clauseAround(text, claimIndex(match, termPattern)))) {
      return match[0]
    }
  }
  return null
}

function firstNonNegatedClaimInClauses(text, pattern) {
  const clauses = text.split(/[.\n;:!?]/)
  for (const clause of clauses) {
    const match = clause.match(pattern)
    if (match && !negatedClaimPattern.test(clause)) {
      return match[0]
    }
  }
  return null
}

const directPayoutPattern = /\b(Every call mines|each call mines|mines (CLAW|CLAF) to your wallet|CLAW mined|CLAF mined|CLAF mined directly|direct per-call (CLAF )?reward)\b/i
const buybackTermPattern = /\b(Jupiter|execute_buyback|swap aggregator|incinerator|buyback)\b/i
const immutabilityTermPattern = /\b(Genesis-immutable|deployer wallet keys discarded|immutable|immutability|upgrade authority renounced)\b/i
const registryTermPattern = /\b(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)\b/i
const dualSignatureTermPattern = /\b(dual-signed|dual-signature|dual signature|user and provider sign|request hash|response hash)\b/i

function currentDevnetClaimPattern(termPattern, distance) {
  return new RegExp(
    `\\b(current[- ]devnet[^.\\n]{0,${distance}}${termPattern.source}|${termPattern.source}[^.\\n]{0,${distance}}current[- ]devnet)\\b`,
    'i',
  )
}

function firstBuybackClaim(text) {
  for (const match of text.matchAll(globalPattern(buybackTermPattern))) {
    const clause = clauseAround(text, match.index)
    const sentence = sentenceAround(text, match.index)
    const isGenesisTarget =
      /\bGenesis mainnet target\b/i.test(sentence) && /\bautomated buyback-and-burn\b/i.test(sentence)

    if (!negatedClaimPattern.test(clause) && !isGenesisTarget) {
      return match[0]
    }
  }
  return null
}

function firstImmutabilityClaim(text) {
  return (
    firstNonNegatedClaim(text, currentDevnetClaimPattern(immutabilityTermPattern, 140), immutabilityTermPattern) ||
    firstNonNegatedClaimInClauses(text, /\b(Genesis-immutable|deployer wallet keys discarded)\b/i)
  )
}

function firstRegistryClaim(text) {
  return firstNonNegatedClaim(text, currentDevnetClaimPattern(registryTermPattern, 160), registryTermPattern)
}

function firstDualSignatureClaim(text) {
  return firstNonNegatedClaim(text, currentDevnetClaimPattern(dualSignatureTermPattern, 180), dualSignatureTermPattern)
}

function firstDirectPayoutClaim(text) {
  return firstNonNegatedClaim(text, directPayoutPattern, directPayoutPattern)
}

const publicCopyChecks = [
  { name: 'stale public token symbol', pattern: /\bCLAW\b/ },
  {
    name: 'unqualified buyback language',
    match: firstBuybackClaim,
  },
  {
    name: 'unqualified mainnet immutability',
    match: firstImmutabilityClaim,
  },
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'direct per-call mining payout claim', match: firstDirectPayoutClaim },
  {
    name: 'unsupported current-devnet registry or routing claim',
    match: firstRegistryClaim,
  },
  {
    name: 'unsupported current-devnet dual-signature claim',
    match: firstDualSignatureClaim,
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
      const match = check.match ? check.match(text) : text.match(check.pattern)
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
