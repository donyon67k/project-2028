// Builds the pixel portraits on the podiums from each person's public portrait photo.
// Each photo is cropped to a square around the face, shrunk to PX×PX and shown with
// nearest-neighbor scaling, so it reads as an 8-bit version of the real portrait.
// Credits and licenses are saved next to it (CC BY-SA photos need attribution).
//   npm run portraits            all people missing a portrait
//   npm run portraits -- --force rebuild every portrait
import { execFileSync } from 'node:child_process'
import { mkdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { FIELD } from '../src/data/field.js'

const PX = 40
const OUT_DIR = 'public/portraits'
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

mkdirSync(OUT_DIR, { recursive: true })
const meta = existsSync(META) ? JSON.parse(readFileSync(META, 'utf8')) : {}
const tmp = join(tmpdir(), 'p2028-portraits')
mkdirSync(tmp, { recursive: true })

for (const p of FIELD) {
  const out = join(OUT_DIR, `${p.id}.png`)
  if (!force && meta[p.id] && existsSync(out)) continue
  try {
    const title = encodeURIComponent((p.wiki || p.name).replace(/ /g, '_'))
    const sum = await json(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`)
    const img = sum.originalimage?.source || sum.thumbnail?.source
    if (!img) throw new Error('no portrait on the page')
    const file = decodeURIComponent(img.split('?')[0].split('/').pop().replace(/^\d+px-/, ''))
    const q = await json(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=240&titles=${encodeURIComponent(`File:${file}`)}`)
    const info = Object.values(q.query.pages)[0]?.imageinfo?.[0]
    if (!info) throw new Error(`no file info for ${file}`)
    const m = info.extmetadata || {}
    const r = await fetch(info.thumburl, { headers: { 'User-Agent': UA } })
    if (!r.ok) throw new Error(`${r.status} downloading`)
    const raw = join(tmp, `${p.id}.src`)
    writeFileSync(raw, Buffer.from(await r.arrayBuffer()))
    const w = info.thumbwidth
    const h = info.thumbheight
    const side = Math.min(w, h)
    // Portraits put the face in the upper part of the frame: crop a square from near the top.
    const offY = h > w ? Math.round(Math.min(h - side, h * 0.06)) : 0
    const offX = w > h ? Math.round((w - side) / 2) : 0
    execFileSync('sips', ['-s', 'format', 'png', '-c', String(side), String(side), '--cropOffset', String(offY), String(offX), raw, '--out', join(tmp, `${p.id}.png`)], { stdio: 'ignore' })
    execFileSync('sips', ['-z', String(PX), String(PX), join(tmp, `${p.id}.png`), '--out', out], { stdio: 'ignore' })
    meta[p.id] = {
      src: `portraits/${p.id}.png`,
      credit: strip(m.Artist?.value) || 'Unknown',
      license: strip(m.LicenseShortName?.value) || 'See source',
      page: info.descriptionurl,
    }
    console.log(`✓ ${p.name.padEnd(26)} ${meta[p.id].license} · ${meta[p.id].credit.slice(0, 50)}`)
  } catch (e) {
    console.log(`✗ ${p.name}: ${e.message}`)
  }
  await sleep(400)
}

writeFileSync(META, `${JSON.stringify(meta, null, 2)}\n`)
rmSync(tmp, { recursive: true, force: true })
