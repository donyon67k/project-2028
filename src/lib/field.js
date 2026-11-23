// Attention index and stage placement for the 2028 field.
import { FIELD, POLLS, STATUS } from '../data/field.js'
import { parseFeed } from '../data/news.js'
import { IS_DESKTOP, netFetch } from './desktop.js'

const POLL_WINDOW_DAYS = 60
// A speculated name gets a faded podium once their index reaches this share of the party leader's.
export const RADAR_MIN = 0.25

// Average of every recent poll that reported the person (a missing name is "not reported").
export function pollAverage(id, polls = POLLS, now = Date.now()) {
  const recent = polls.filter((p) => now - Date.parse(p.end) < POLL_WINDOW_DAYS * 864e5 && p.results[id] != null)
  if (!recent.length) return null
  return { avg: +(recent.reduce((a, p) => a + p.results[id], 0) / recent.length).toFixed(1), n: recent.length, polls: recent }
}

// News: recent mentions (7 days) and race-specific stories (30 days), each capped at 100 by the
// source, weighted toward race coverage. Polls: the person's average against the party's best.
// Both halves are scaled within the party, so the index reads "relative to this field".
export function scoreField(field = FIELD, attention = {}, polls = POLLS) {
  const out = {}
  for (const party of ['D', 'R']) {
    const people = field.filter((p) => p.party === party)
    const news = Object.fromEntries(people.map((p) => {
      const a = attention.people?.[p.id]
      return [p.id, a ? 0.3 * Math.min(a.news7, 100) + 0.7 * Math.min(a.race30, 100) : 0]
    }))
    const poll = Object.fromEntries(people.map((p) => [p.id, pollAverage(p.id, polls)]))
    const maxNews = Math.max(1, ...Object.values(news))
    const maxPoll = Math.max(1, ...Object.values(poll).map((x) => x?.avg || 0))
    for (const p of people) {
      const n = news[p.id] / maxNews
      const v = (poll[p.id]?.avg || 0) / maxPoll
      out[p.id] = { news: n, poll: poll[p.id], pollShare: v, index: Math.round(100 * (0.5 * n + 0.5 * v)) }
    }
    const top = Math.max(1, ...people.map((p) => out[p.id].index))
    for (const p of people) out[p.id].rel = out[p.id].index / top
  }
  return out
}

// Debate-stage order: the strongest index stands at center, the rest alternate outward,
// the way networks place podiums by polling.
function centerOut(list) {
  const res = []
  list.forEach((x, i) => (i % 2 ? res.unshift(x) : res.push(x)))
  return res
}

export function stageFor(party, field, scores) {
  const people = field.filter((p) => p.party === party)
    .map((p) => ({ ...p, score: scores[p.id] }))
    .sort((a, b) => STATUS[a.status].rank - STATUS[b.status].rank || b.score.index - a.score.index)
  const lit = people.filter((p) => p.status === 'declared' || p.status === 'exploring')
  const radar = people.filter((p) => (p.status === 'speculated' || p.status === 'conditional') && p.score.rel >= RADAR_MIN)
  const podiums = centerOut([...lit, ...radar].sort((a, b) => b.score.index - a.score.index))
  return {
    podiums,
    wings: people.filter((p) => (p.status === 'speculated' || p.status === 'conditional') && p.score.rel < RADAR_MIN),
    out: people.filter((p) => p.status === 'out'),
    declared: lit.length,
  }
}

// ---------- news ----------
const GNEWS = 'https://news.google.com/rss/search'
const feedFetch = (url) => (IS_DESKTOP ? netFetch(url) : fetch(`/api/feed?u=${encodeURIComponent(url)}`))

export async function searchHeadlines(q, days = 14, limit = 8) {
  const url = `${GNEWS}?q=${encodeURIComponent(`${q} when:${days}d`)}&hl=en-US&gl=US&ceid=US:en`
  const r = await feedFetch(url)
  if (!r.ok) throw new Error(`news ${r.status}`)
  const seen = new Set()
  return parseFeed(await r.text(), 'news.google.com')
    .filter((s) => { const k = s.title.toLowerCase().slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true })
    .slice(0, limit)
}
