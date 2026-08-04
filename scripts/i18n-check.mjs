/**
 * Fails the build if the dictionaries diverge.
 *
 * Plural suffixes are stripped before comparing: English has two forms
 * (`_one`, `_other`), Arabic has six (`_zero _one _two _few _many _other`), so
 * a raw key diff would report every plural as a mismatch. What has to match is
 * the *base* key — `product.catalogueTitle` existing in both.
 *
 *   node scripts/i18n-check.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const load = (l) => JSON.parse(readFileSync(resolve(ROOT, `src/i18n/locales/${l}.json`), 'utf8'))

const PLURAL = /_(zero|one|two|few|many|other)$/

function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, path, out)
    else out.set(path, v)
  }
  return out
}

const en = flatten(load('en'))
const ar = flatten(load('ar'))

const base = (keys) => new Set([...keys].map((k) => k.replace(PLURAL, '')))
const enBase = base(en.keys())
const arBase = base(ar.keys())

const missingInAr = [...enBase].filter((k) => !arBase.has(k))
const orphanInAr = [...arBase].filter((k) => !enBase.has(k))

/* Empty values are worse than a missing key: i18next falls back for a missing
   key but renders a blank for an empty string. */
const emptyAr = [...ar].filter(([, v]) => typeof v === 'string' && v.trim() === '').map(([k]) => k)

/* Interpolations must survive translation — a {{name}} dropped from a sentence
   is a silently broken string.
 *
 * Plural-suffixed keys are exempt, and deliberately so: Arabic's zero/one/two
 * forms carry the number lexically ("بند واحد" — *one line*), so omitting
 * {{count}} there is correct grammar, not a lost variable. Flagging it would
 * train everyone to ignore this check. A variable Arabic uses that English
 * does not have is still caught, since that can only be a typo. */
const vars = (s) => (typeof s === 'string' ? (s.match(/\{\{(\w+)\}\}/g) ?? []).sort().join(',') : '')
const varMismatch = []
for (const [k, v] of en) {
  const arKey = ar.has(k)
    ? k
    : [...ar.keys()].find((c) => c.replace(PLURAL, '') === k.replace(PLURAL, ''))
  if (!arKey) continue
  const enVars = vars(v)
  const arVars = vars(ar.get(arKey))
  if (enVars === arVars) continue
  if (PLURAL.test(k) || PLURAL.test(arKey)) {
    /* Only complain if Arabic invented a variable English never had. */
    const extra = arVars.split(',').filter((x) => x && !enVars.includes(x))
    if (extra.length) varMismatch.push(`${arKey}  unknown var(s): ${extra.join(',')}`)
    continue
  }
  if (enVars !== '') varMismatch.push(`${k}  en:${enVars}  ar:${arVars}`)
}

const report = (label, list) => {
  if (!list.length) return 0
  console.error(`\n${label} (${list.length}):`)
  for (const k of list.slice(0, 25)) console.error('  ' + k)
  if (list.length > 25) console.error(`  …and ${list.length - 25} more`)
  return list.length
}

let failed = 0
failed += report('Missing in ar.json', missingInAr)
failed += report('Orphaned in ar.json (no English key)', orphanInAr)
failed += report('Empty Arabic values', emptyAr)
failed += report('Interpolation mismatch', varMismatch)

if (failed) {
  console.error(`\ni18n:check FAILED — ${failed} problem(s).\n`)
  process.exit(1)
}

console.log(`i18n:check ok — ${enBase.size} keys, en ${en.size} / ar ${ar.size} strings (Arabic carries extra plural forms).`)
