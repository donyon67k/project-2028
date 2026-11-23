import { useCallback, useEffect, useMemo, useState } from 'react'
import attentionSnapshot from './data/attention.json'
import { CALENDAR, DEBATES, FIELD, POLLS } from './data/field.js'
import { BATTLEGROUNDS, EV, SPLITS_2024, WON_2024, evTotals } from './data/electoral.js'
import { STATES } from './data/wiki.js'
import { RESULT_COLORS, countdown, pad } from './lib/util.js'
import { scoreField, searchHeadlines } from './lib/field.js'
import UsMap from './components/UsMap.jsx'
import About from './components/About.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'
import CandidateFile from './components/CandidateFile.jsx'
import { DebateStage } from './components/Stage.jsx'
import { ExplainerModal, Help, LearnCtx, LearnPage } from './components/Explainer.jsx'
import { Icon } from './components/Sprites.jsx'
import './App.css'
import './stage.css'

const PAGES = [
  { key: 'stages', label: 'DEBATE STAGES', icon: 'senate' },
  { key: 'map', label: 'ELECTORAL MAP', icon: 'governor' },
  { key: 'learn', label: 'BRIEFING ROOM', icon: 'news' },
]
const NEWS_MS = 10 * 60 * 1000

const BOOT = [
  'INITIALIZING PROJECT: 2028…',
  'ESTABLISHING SECURE UPLINK…………… OK',
  `SCANNING THE FIELD (${FIELD.length} NAMES)… OK`,
  'CALIBRATING ATTENTION INDEX…… OK',
  'LOADING 538 ELECTORAL VOTES…… OK',
  'OPENING 2028 HQ… WELCOME, AGENT.',
]

function Boot({ onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= BOOT.length) { const t = setTimeout(onDone, 450); return () => clearTimeout(t) }
    const t = setTimeout(() => setN(n + 1), 260)
    return () => clearTimeout(t)
  }, [n, onDone])
  return (
    <div className="boot" onClick={onDone} onKeyDown={onDone} role="button" tabIndex={0} aria-label="Skip intro">
      <div className="boot-inner">
        <Icon name="radar" size={64} />
        <h1 className="pixel glow">PROJECT: 2028</h1>
        {BOOT.slice(0, n).map((l) => <div key={l} className="boot-line">&gt; {l}</div>)}
        <div className="boot-line"><span className="blink">█</span></div>
        <div className="dim boot-skip">[CLICK OR PRESS ANY KEY TO SKIP]</div>
      </div>
    </div>
  )
}

function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  const cd = countdown(now)
  return (
    <div className="countdown" aria-label="Countdown to Election Day 2028">
      <div className="cd-label">T-MINUS TO NOV 7, 2028</div>
      <div className="cd-digits pixel">
        {cd.d}<small>D</small> {pad(cd.h)}<small>H</small> {pad(cd.m)}<small>M</small> <span className="glow-amber">{pad(cd.s)}</span><small>S</small>
      </div>
    </div>
  )
}

const fmtDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

function RaceDesk({ scores, onPick }) {
  const upcoming = CALENDAR.filter((c) => c.date >= new Date().toISOString().slice(0, 10)).slice(0, 5)
  const byId = Object.fromEntries(FIELD.map((p) => [p.id, p]))
  return (
    <div className="race-desk">
      <section className="desk-card pixel-border-dim">
        <h4 className="pixel">▣ DEBATES <Help id="debates" /></h4>
        {['D', 'R'].map((p) => (
          <p key={p} className="brief"><b className={p === 'D' ? 'party-d' : 'party-r'}>{p === 'D' ? 'DNC' : 'RNC'}:</b> {DEBATES[p].summary}{DEBATES[p].src && <> <a href={DEBATES[p].src} target="_blank" rel="noreferrer">Source ↗</a></>}</p>
        ))}
      </section>
      <section className="desk-card pixel-border-dim">
        <h4 className="pixel">▣ LATEST PRIMARY POLLS</h4>
        <ul className="poll-table">
          {[...POLLS].sort((a, b) => b.end.localeCompare(a.end)).map((x) => (
            <li key={x.pollster + x.end + x.party}>
              <span className={x.party === 'D' ? 'badge-d' : 'badge-r'}>{x.party}</span>{' '}
              <a href={x.src} target="_blank" rel="noreferrer">{x.pollster}</a> <span className="dim">{x.dates}</span>
              <div className="poll-line">
                {Object.entries(x.results).sort((a, b) => b[1] - a[1]).map(([id, v]) => (
                  <button key={id} type="button" className={`poll-name ${byId[id]?.status === 'out' ? 'is-out' : ''}`} onClick={() => onPick(id)} title={byId[id]?.status === 'out' ? 'Has said they will not run' : undefined}>
                    {byId[id]?.name.split(' ').pop()} <b>{v}</b>{byId[id]?.status === 'out' && <span className="out-mark">✕</span>}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="dim">✕ = has said they will not run. Index leaders: {['D', 'R'].map((p) => FIELD.filter((x) => x.party === p && x.status !== 'out').sort((a, b) => scores[b.id].index - scores[a.id].index)[0]?.name).join(' · ')}</div>
      </section>
      <section className="desk-card pixel-border-dim">
        <h4 className="pixel">▣ RACE CLOCK <Help id="invisible-primary" /></h4>
        <ul className="clock">
          {upcoming.map((c) => <li key={c.date + c.label}><b>{fmtDate(c.date)}</b> {c.label}{c.party === 'D' && <span className="dim"> · D</span>}</li>)}
        </ul>
        <Help id="primaries-caucuses" label="HOW PRIMARIES WORK ▸" />
      </section>
    </div>
  )
}

function MapDesk({ selected }) {
  const t = evTotals()
  const st = selected
  const dDate = st && CALENDAR.find((c) => c.state === st)
  return (
    <div className="race-desk map-desk">
      <section className="desk-card pixel-border-dim">
        <h4 className="pixel">▣ THE MAP TO 270 <Help id="electoral-college" /></h4>
        <div className="ev-bar" aria-label={`2024 baseline: D ${t.D}, R ${t.R}`}>
          <i style={{ width: `${(t.D / 538) * 100}%`, background: RESULT_COLORS.D }} />
          <i style={{ width: `${(t.R / 538) * 100}%`, background: RESULT_COLORS.R }} />
          <span className="ev-270" />
        </div>
        <div className="ev-legend"><span className="party-d">D {t.D}</span><span className="dim">270 TO WIN</span><span className="party-r">R {t.R}</span></div>
        <p className="brief dim">2024 results on 2028’s electoral votes. Blinking states were the seven battlegrounds. Forecasts replace this baseline once nominees are set.</p>
      </section>
      <section className="desk-card pixel-border-dim">
        {st
          ? (
            <>
              <h4 className="pixel">▣ {STATES[st]?.toUpperCase() || st}</h4>
              <p className="brief"><b className="pixel">{EV[st]}</b> electoral votes</p>
              <p className="brief">2024: {SPLITS_2024[st] ? `split, D ${SPLITS_2024[st].D} · R ${SPLITS_2024[st].R} (by district)` : <span className={WON_2024[st] === 'D' ? 'party-d' : 'party-r'}>{WON_2024[st] === 'D' ? 'Harris (D)' : 'Trump (R)'}</span>}</p>
              {BATTLEGROUNDS.includes(st) && <p className="brief glow-amber">2024 BATTLEGROUND</p>}
              <p className="brief">{dDate ? <>Democratic primary: <b>{fmtDate(dDate.date)}</b> (early state)</> : <span className="dim">Primary dates not set yet.</span>}</p>
            </>
          )
          : <p className="brief dim">Select a state for its electoral votes, 2024 result and primary date.</p>}
      </section>
    </div>
  )
}

export default function App() {
  const [booted, setBooted] = useState(false)
  const [page, setPage] = useState(() => (typeof location !== 'undefined' && /^#(map|learn)\b/.test(location.hash) ? location.hash.slice(1) : 'stages'))
  const [aboutOpen, setAboutOpen] = useState(false)
  const [person, setPerson] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [state, setState] = useState(null)
  const [region, setRegion] = useState(null)
  const [heads, setHeads] = useState([])
  const scores = useMemo(() => scoreField(FIELD, attentionSnapshot, POLLS), [])
  const finishBoot = useCallback(() => setBooted(true), [])

  useEffect(() => {
    const load = () => searchHeadlines('"2028" president OR presidential primary', 3, 14).then(setHeads).catch(() => {})
    load()
    const t = setInterval(load, NEWS_MS)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || document.querySelector('.cmd-backdrop')) return
      if (state) setState(null)
      else if (region) setRegion(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, region])

  const go = (key) => { setPage(key); history.replaceState(null, '', key === 'stages' ? location.pathname : `#${key}`) }

  const { fills, blips, labels } = useMemo(() => {
    const fills = {}
    const blips = {}
    const labels = {}
    for (const [s, n] of Object.entries(EV)) {
      fills[s] = RESULT_COLORS[WON_2024[s]]
      labels[s] = `${n} ELECTORAL VOTES · 2024: ${SPLITS_2024[s] ? `SPLIT D ${SPLITS_2024[s].D} / R ${SPLITS_2024[s].R}` : WON_2024[s] === 'D' ? 'HARRIS (D)' : 'TRUMP (R)'}`
      if (BATTLEGROUNDS.includes(s)) blips[s] = true
    }
    return { fills, blips, labels }
  }, [])

  const ticker = useMemo(() => {
    const out = FIELD.filter((p) => p.status === 'out').map((p) => `✕ ${p.name.toUpperCase()}: NOT RUNNING`)
    return [...heads.map((h) => `NEWS ▸ ${h.title.toUpperCase()}`), ...out, 'DNC: 12 PRIMARY DEBATES, FIRST IN JUNE 2027', 'SOUTH CAROLINA OPENS THE DEMOCRATIC CALENDAR: JAN 22, 2028']
  }, [heads])

  return (
    <LearnCtx.Provider value={setLesson}>
      <div className="hq hq-2028">
        {!booted && <Boot onDone={finishBoot} />}
        <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
        <UpdateBanner />
        {person && <CandidateFile person={FIELD.find((p) => p.id === person)} score={scores[person]} onClose={() => setPerson(null)} />}
        {lesson && <ExplainerModal id={lesson} onClose={() => setLesson(null)} onOpen={setLesson} />}

        <header className="topbar">
          <div className="brand">
            <Icon name="radar" size={28} />
            <div>
              <h1 className="pixel glow">2028 HQ</h1>
              <div className="sub">PRESIDENTIAL ELECTION INTELLIGENCE COMMAND</div>
            </div>
          </div>
          <Countdown />
          <div className="top-right">
            <button type="button" className="btn-mini about-btn" onClick={() => setAboutOpen(true)} title="About, sources and standards">ⓘ ABOUT</button>
          </div>
        </header>

        <nav className="modes" aria-label="Pages">
          {PAGES.map((p) => (
            <button key={p.key} type="button" className={`mode ${page === p.key ? 'on' : ''}`} onClick={() => go(p.key)} aria-pressed={page === p.key}>
              <Icon name={p.icon} size={16} color={page === p.key ? '#050510' : '#00ff41'} />
              {p.label}
            </button>
          ))}
        </nav>

        <main className={`main2028 page-${page}`}>
          {page === 'stages' && (
            <>
              <div className="stages">
                <DebateStage party="D" field={FIELD} scores={scores} onPick={setPerson} />
                <DebateStage party="R" field={FIELD} scores={scores} onPick={setPerson} />
              </div>
              <RaceDesk scores={scores} onPick={setPerson} />
            </>
          )}
          {page === 'map' && (
            <>
              <section className="map-panel pixel-border">
                <div className="panel-label">
                  <span className="pixel">ELECTORAL MAP · 2024 BASELINE</span>
                  <span className="dim">{state ? `TARGET LOCKED: ${STATES[state]?.toUpperCase()}` : 'SELECT A STATE'}</span>
                </div>
                <UsMap fills={fills} blips={blips} labels={labels} selected={state} onSelect={setState} zoom={null} region={region} onRegion={setRegion} />
                <div className="legend" aria-label="Legend">
                  <span className="lg"><i style={{ background: RESULT_COLORS.D }} />2024 D</span>
                  <span className="lg"><i style={{ background: RESULT_COLORS.R }} />2024 R</span>
                  <span className="lg"><i className="blip-legend" />BATTLEGROUND</span>
                </div>
              </section>
              <MapDesk selected={state} />
            </>
          )}
          {page === 'learn' && <LearnPage onOpen={setLesson} />}
        </main>

        <footer className="ticker" aria-label="News ticker">
          <div className="ticker-tag pixel">INTEL FEED</div>
          <div className="ticker-window">
            <div className="ticker-track" style={{ animationDuration: `${Math.max(40, ticker.length * 7)}s` }}>
              {[...ticker, ...ticker].map((t, i) => <span key={i}>◆ {t}</span>)}
            </div>
          </div>
        </footer>
      </div>
    </LearnCtx.Provider>
  )
}
