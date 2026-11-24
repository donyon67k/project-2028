import { useEffect, useRef, useState } from 'react'
import { PARTIES, STATUS } from '../data/field.js'
import { STATES } from '../data/wiki.js'
import { searchHeadlines } from '../lib/field.js'
import { timeAgo } from '../lib/util.js'
import { Help } from './Explainer.jsx'
import { Portrait, portraitCredit } from './Portrait.jsx'

export default function CandidateFile({ person: p, score, onClose }) {
  const panel = useRef(null)
  const [news, setNews] = useState(null)
  useEffect(() => { panel.current?.focus() }, [])
  useEffect(() => {
    let live = true
    searchHeadlines(`"${p.name}"`, 14, 8).then((s) => live && setNews(s)).catch(() => live && setNews([]))
    return () => { live = false }
  }, [p.name])
  const st = STATUS[p.status]
  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className={`about cand-file party-${p.party}`} role="dialog" aria-label={`${p.name} file`} tabIndex={-1} ref={panel}
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }}>
        <div className="about-head">
          <Portrait person={p} width={96} />
          <div>
            <div className="stamp">CANDIDATE FILE · {PARTIES[p.party].name.toUpperCase()} · {STATES[p.home]?.toUpperCase() || p.home}</div>
            <h2 className={`pixel ${p.party === 'D' ? 'glow-dem' : 'glow-rep'}`}>{p.name.toUpperCase()}</h2>
            <div className="dim">{p.role}</div>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={`status-banner s-${p.status}`}>
          <span className="pixel">{p.status === 'out' ? '✕ ' : ''}{st.label}</span>
          <span>{p.note}</span>
          {p.src && <a href={p.src.url} target="_blank" rel="noreferrer">Source: {p.src.label} ↗</a>}
        </div>

        <section className="intel-block">
          <h4 className="pixel">▣ ATTENTION INDEX <Help id="attention-index" /></h4>
          <div className="file-stats">
            <div><b className="pixel">{score.index}</b><span className="dim">INDEX (PARTY LEADER = 100)</span></div>
            <div><b className="pixel">{Math.round(score.news * 100)}</b><span className="dim">COVERAGE vs FIELD</span></div>
            <div><b className="pixel">{score.poll ? `${score.poll.avg}%` : '—'}</b><span className="dim">{score.poll ? `POLL AVG · ${score.poll.n} POLL${score.poll.n > 1 ? 'S' : ''}` : 'NOT IN RECENT POLLS'}</span></div>
          </div>
          {p.status === 'out' && <p className="brief dim">Shown for reference only. People who have said they will not run are kept off the stage, even when voters still name them in polls.</p>}
        </section>

        {score.poll && (
          <section className="intel-block">
            <h4 className="pixel">▣ NATIONAL PRIMARY POLLS</h4>
            <ul className="poll-list">
              {score.poll.polls.map((x) => (
                <li key={x.pollster + x.end}><b>{x.results[p.id]}%</b> · <a href={x.src} target="_blank" rel="noreferrer">{x.pollster}</a> <span className="dim">{x.dates}</span></li>
              ))}
            </ul>
          </section>
        )}

        {!!p.past.length && (
          <section className="intel-block">
            <h4 className="pixel">▣ RECORD</h4>
            <ul className="credits">{p.past.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}

        <section className="intel-block">
          <h4 className="pixel">▣ NEWS WIRE · LAST 14 DAYS</h4>
          {!news && <div className="dim">Pulling headlines…</div>}
          {news && !news.length && <div className="dim">No headlines came back. Try again in a minute.</div>}
          <ul className="wire">
            {news?.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> <span className="dim">{s.domain}{s.at ? ` · ${timeAgo(s.at)}` : ''}</span></li>
            ))}
          </ul>
        </section>
        {portraitCredit(p.id) && (
          <div className="photo-credit dim">
            Portrait adapted from a photo by {portraitCredit(p.id).credit} · {portraitCredit(p.id).license} · <a href={portraitCredit(p.id).page} target="_blank" rel="noreferrer">source ↗</a>
          </div>
        )}
      </div>
    </div>
  )
}
