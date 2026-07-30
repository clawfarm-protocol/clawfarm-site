import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'

const sourceRoots = ['app', 'README.md', 'docs/superpowers/specs', 'scripts/generate-whitepaper-v1.py']
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

const uniqueFiles = [...new Set(files)].filter((file) => existsSync(file) && !file.endsWith('.png') && !file.endsWith('.pdf'))

const globalChecks = [
  { name: 'Chinese text', pattern: /[\p{Script=Han}]/u },
  { name: 'local absolute path', pattern: /(\/Users\/|\/home\/|\/root\/|~\/\.config|id\.json|keypair\.json)/ },
  { name: 'RPC API-key URL', pattern: /(api-key=|helius-rpc\.com)/i },
  { name: 'private key material', pattern: /(BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY|\b(seed phrase|mnemonic)\s*[:=]|\[[0-9]{1,3}(,\s*[0-9]{1,3}){31,}\])/i },
]

const currentDevnetCopyChecks = [
  { name: 'current devnet buyback claim', pattern: /current\s+(devnet|contract|masterpool)[\s\S]{0,120}\b(buyback|Raydium|LP|timelock|Squads)\b/i },
  { name: 'implemented treasury engine claim', pattern: /\b(masterpool v3|current v3|devnet v3)\b[\s\S]{0,140}\b(executes? swaps?|buy-and-burn|buy-and-add-LP|protocol-owned liquidity|Raydium CPMM)\b/i },
  { name: 'current devnet provider bond claim', pattern: /\b(current devnet|devnet v3|current v3)\b[\s\S]{0,120}\b(100 USDC bond|provider bond|upfront collateral)\b/i },
  { name: 'current devnet timelock claim', pattern: /\b(current devnet|devnet v3|current v3)\b[\s\S]{0,120}\b(48-hour timelock|24-hour timelock|Squads multisig)\b/i },
]

const legacyV2CopyChecks = [
  { name: 'old challenge bond unit', pattern: /\b2 USDC\b/ },
  { name: 'old direct mining wording', pattern: /\b(mines CLAF to your wallet|CLAF mined)\b/i },
  { name: 'unsupported routing or registry wording', pattern: /\b(live registry|service registry|registered endpoints?|clearing price|registry state|historical reliability|routing objective|protocol routes requests|declared offerings)\b/i },
  { name: 'contract-native HTTP API example', pattern: /curl https:\/\/api\.clawfarm\.network\/v1\/devnet\/receipts/i },
  { name: 'endpoint-first provider registration', pattern: /\b(Register an endpoint|Register a wallet-backed endpoint|wallet-controlled endpoint|wallet-backed endpoint)\b/i },
  { name: 'one-step SDK receipt submit hides wrapper target', pattern: /receipts\.submit\(\{[\s\S]{0,600}\b(model|totalUsdc|total_usdc)\b/ },
  { name: 'old chained SDK receipt submit hides wrapper target', pattern: /\.receipts\(\)[\s\S]{0,400}\.model\(/ },
  { name: 'old SDK receipt prepare surface', pattern: /\b(?:cf\.)?receipts(?:\(\))?\.prepare\(/i },
  { name: 'old SDK receipt submit surface', pattern: /\b(?:cf\.)?receipts(?:\(\))?\.submit\(/i },
  { name: 'old SDK gateway signer surface', pattern: /\bgatewaySigner\b|\bgateway_signer\b/i },
  { name: 'old SDK receipt PDA surface', pattern: /\breceiptPda\b|\breceipt_pda\b/i },
  { name: 'invalid v3 SDK tax-rate example', pattern: /\b(?:taxRateBps|tax_rate_bps)\s*(?:[:=]|\()\s*30\b/i },
  { name: 'unframed provider CLI example', pattern: /npx clawfarm provider register/i },
  { name: 'v2 SubmitReceiptArgs in current public copy', pattern: /\bSubmitReceiptArgs\b/ },
  { name: 'v2 ReceiptEconomicRecord in current public copy', pattern: /\bReceiptEconomicRecord\b/ },
  { name: 'v2 attestation submit receipt in current public copy', pattern: /attestation\.submit_receipt/i },
  { name: 'v2 epoch cursor label in current public copy', pattern: /\bepoch cursor\b/i },
  { name: 'hard-coded v2 provider stake in current public copy', pattern: /\b100 Test USDC\b/i },
  { name: 'v2 challenge bond vault in current public copy', pattern: /\bchallenge[- ]bond vault\b/i },
  { name: 'v2 provider stake vault in current public copy', pattern: /\bprovider[- ]stake vault\b/i },
]

const publicCopyChecks = [...currentDevnetCopyChecks, ...legacyV2CopyChecks]

const requiredChecks = [
  {
    file: 'app/lib/protocol.ts',
    name: 'Mainnet default network',
    pattern: /defaultNetworkId:\s*NetworkId\s*=\s*'mainnet'/,
  },
  {
    file: 'app/providers/page.tsx',
    name: 'Provider contact onboarding',
    pattern: /Contact the ClawFarm team/,
  },
  {
    file: 'app/builders/page.tsx',
    name: 'Buyer API-key onboarding',
    pattern: /cfk_\*/,
  },
  {
    file: 'app/builders/page.tsx',
    name: 'Buyer contact onboarding',
    pattern: /Contact the ClawFarm team/,
  },
  {
    file: 'app/docs/page.tsx',
    name: 'AIRouter chat route',
    pattern: /\/clawfarm\/chat\/completions/,
  },
  {
    file: 'scripts/generate-whitepaper-v1.py',
    name: 'Cold-start seed pair',
    pattern: /500,000 CLAF[\s\S]{0,180}50 USDC/,
  },
]

const staleLaunchChecks = [
  { name: 'Mainnet still pending', pattern: /Mainnet (?:target )?(?:pending|not deployed)|mainnet deployment record exists yet/i },
  { name: 'public SDK package', pattern: /@clawfarm\/sdk|sdk-wrapper-target|Start with the SDK/i },
  { name: 'fictional payment wrapper endpoint', pattern: /\/devnet\/payment-transactions/i },
]

const staleWhitepaperChecks = [
  { name: 'old seed CLAF amount', pattern: /10,000,000 CLAF/ },
  { name: 'old seed USDC amount', pattern: /5,000 USDC/ },
  { name: 'old opening price', pattern: /0\.0005 USDC per CLAF/ },
  { name: 'old seed FDV', pattern: /500,000 USDC/ },
]

const publicCopyFiles = uniqueFiles.filter((file) => file.startsWith('app/') || file === 'README.md')
const failures = []

function scan(filesToScan, checks) {
  for (const file of filesToScan) {
    const text = readFileSync(file, 'utf8')
    for (const check of checks) {
      const match = text.match(check.pattern)
      if (match) {
        failures.push(`${file}: ${check.name}: ${match[0]}`)
      }
    }
  }
}

function scanRequired(checks) {
  for (const check of checks) {
    const text = readFileSync(check.file, 'utf8')
    if (!check.pattern.test(text)) {
      failures.push(`${check.file}: missing ${check.name}`)
    }
  }
}

scan(uniqueFiles, globalChecks)
scan(publicCopyFiles, publicCopyChecks)
scan(publicCopyFiles, staleLaunchChecks)
scan(['scripts/generate-whitepaper-v1.py'], staleWhitepaperChecks)
scanRequired(requiredChecks)

if (failures.length > 0) {
  console.error('Site content verification failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log(`Site content verification passed for ${uniqueFiles.length} files.`)
