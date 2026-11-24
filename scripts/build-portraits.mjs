// Portraits for the 2028 field, from each person's public portrait photo.
//  - public/portraits/full/<id>.jpg   the real portrait, shown in the candidate file
//  - src/data/portraits.json          size, credit and license (CC BY / BY-SA photos need the credit)
// The pixel person on the podium is drawn from src/data/looks.js (set by hand from these photos).
//   npm run portraits            people missing a portrait
//   npm run portraits -- --force download every portrait again
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FIELD } from '../src/data/field.js'

const FULL_DIR = 'public/portraits/full'
const META = 'src/data/portraits.json'
const UA = 'Project2028/0.1 (https://github.com/donyon67k/project-2028)'
const force = process.argv.includes('--force')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

mkdirSync(FULL_DIR, { recursive: true })
const meta = existsSync(META) ? JSON.parse(readFileSync(META, 'utf8')) : {}
const tmp = join(tmpdir(), 'p2028-portraits')
mkdirSync(tmp, { recursive: true })

for (const p of FIELD) {
  const full = join(FULL_DIR, `${p.id}.jpg`)
  try {
    if (!force && meta[p.id] && existsSync(full)) continue
    const title = encodeURIComponent((p.wiki || p.name).replace(/ /g, '_'))
    const sum = await json(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`)
    const img = sum.originalimage?.source || sum.thumbnail?.source
    if (!img) throw new Error('no portrait on the page')
    const file = decodeURIComponent(img.split('?')[0].split('/').pop().replace(/^\d+px-/, ''))
    const q = await json(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=300&titles=${encodeURIComponent(`File:${file}`)}`)
    const info = Object.values(q.query.pages)[0]?.imageinfo?.[0]
    if (!info) throw new Error(`no file info for ${file}`)
    const m = info.extmetadata || {}
    const r = await fetch(info.thumburl, { headers: { 'User-Agent': UA } })
    if (!r.ok) throw new Error(`${r.status} downloading`)
    const raw = join(tmp, `${p.id}.src`)
    writeFileSync(raw, Buffer.from(await r.arrayBuffer()))
    execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', raw, '--out', full], { stdio: 'ignore' })
    meta[p.id] = {
      full: `portraits/full/${p.id}.jpg`,
      w: info.thumbwidth,
      h: info.thumbheight,
      credit: strip(m.Artist?.value) || 'Unknown',
      license: strip(m.LicenseShortName?.value) || 'See source',
      page: info.descriptionurl,
    }
    await sleep(400)
    console.log(`✓ ${p.name.padEnd(26)} ${meta[p.id].license}`)
  } catch (e) {
    console.log(`✗ ${p.name}: ${e.message}`)
  }
}

writeFileSync(META, `${JSON.stringify(meta, null, 2)}\n`)
rmSync(tmp, { recursive: true, force: true })
