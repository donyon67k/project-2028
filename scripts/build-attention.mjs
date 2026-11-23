// Media attention for everyone in the 2028 field: how many news stories mention them,
// with and without the 2028 race in the story. Writes src/data/attention.json (bundled
// with the app) and, with --live, live/attention.json for the live branch.
//
//   npm run attention            refresh the bundled file
//   npm run attention -- --live  also write the live copy
//
// Sources: Google News RSS search (story counts, capped at 100 per query) and, when it
// answers, GDELT's DOC API (share of all monitored coverage, no cap). GDELT allows one
// request every 5 s per address, so the script spaces requests and skips it on refusal.
import { mkdirSync, writeFileSync } from 'node:fs'
import { FIELD } from '../src/data/field.js'

const UA = 'Project2028/data (+https://github.com/donyon67k/project-2028)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const live = process.argv.includes('--live')

async function gnewsCount(q, days) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${q} when:${days}d`)}&hl=en-US&gl=US&ceid=US:en`
  const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) })
  if (!r.ok) throw new Error(`Google News ${r.status}`)
  return ((await r.text()).match(/<item>/g) || []).length
}

let gdeltOk = true
async function gdeltVolume(name) {
  if (!gdeltOk) return null
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(`"${name}"`)}&mode=timelinevol&timespan=30d&format=json`
  for (let attempt = 0; attempt < 2; attempt++) {
    await sleep(6000)
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) })
      const text = await r.text()
      if (!text.startsWith('{')) continue // rate-limit notice comes back as plain text
      const pts = JSON.parse(text).timeline?.[0]?.data || []
      return pts.length ? +(pts.reduce((a, p) => a + p.value, 0) / pts.length).toFixed(4) : 0
    } catch { /* try once more */ }
  }
  gdeltOk = false
  console.log('  GDELT is refusing requests from this address; using Google News counts only.')
  return null
}

const out = { at: new Date().toISOString(), method: 'news-v1', people: {} }
for (const p of FIELD) {
  const q = `"${p.name}"`
  try {
    const news7 = await gnewsCount(q, 7)
    await sleep(1200)
    const race30 = await gnewsCount(`${q} 2028`, 30)
    await sleep(1200)
    const gdelt = await gdeltVolume(p.name)
    out.people[p.id] = { news7, race30, gdelt }
    console.log(`${p.name.padEnd(26)} 7d ${String(news7).padStart(3)} · 2028 stories 30d ${String(race30).padStart(3)}${gdelt != null ? ` · GDELT ${gdelt}` : ''}`)
  } catch (e) {
    console.log(`${p.name}: ${e.message}`)
  }
}

const json = `${JSON.stringify(out, null, 1)}\n`
writeFileSync(new URL('../src/data/attention.json', import.meta.url), json)
if (live) {
  mkdirSync(new URL('../live/', import.meta.url), { recursive: true })
  writeFileSync(new URL('../live/attention.json', import.meta.url), json)
}
console.log(`\nWrote attention for ${Object.keys(out.people).length} people.`)
