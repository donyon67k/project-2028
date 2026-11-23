import { createContext, useContext, useEffect, useRef } from 'react'
import { LESSONS, lessonById } from '../data/learn.js'
import { Icon } from './Sprites.jsx'

// Any component can open an explainer: <Help id="debates" /> renders a small ? button.
export const LearnCtx = createContext(() => {})

export function Help({ id, label }) {
  const open = useContext(LearnCtx)
  const l = lessonById[id]
  if (!l) return null
  return (
    <button type="button" className="help-btn" onClick={(e) => { e.stopPropagation(); open(id) }} title={`Explain: ${l.title}`} aria-label={`Explain: ${l.title}`}>
      {label || '?'}
    </button>
  )
}

export function ExplainerModal({ id, onClose, onOpen }) {
  const panel = useRef(null)
  useEffect(() => { if (id) panel.current?.focus() }, [id])
  const l = lessonById[id]
  if (!l) return null
  const i = LESSONS.indexOf(l)
  const next = LESSONS[(i + 1) % LESSONS.length]
  return (
    <div className="cmd-backdrop" onMouseDown={onClose}>
      <div className="about explainer" role="dialog" aria-label={l.title} tabIndex={-1} ref={panel}
        onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose() } }}>
        <div className="about-head">
          <Icon name="news" size={28} color="#ffd700" />
          <div>
            <div className="stamp">BRIEFING · {l.tag}</div>
            <h2 className="pixel glow-amber">{l.title.toUpperCase()}</h2>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="explainer-body">
          {l.body.map((p) => <p key={p.slice(0, 40)} className="brief">{p}</p>)}
        </div>
        <div className="explainer-foot">
          <button type="button" className="btn-mini" onClick={() => onOpen(next.id)}>NEXT BRIEFING: {next.title.toUpperCase()} ▶</button>
        </div>
      </div>
    </div>
  )
}

export function LearnPage({ onOpen }) {
  const groups = [...new Set(LESSONS.map((l) => l.tag))]
  return (
    <section className="learn pixel-border">
      <div className="panel-label"><span className="pixel">BRIEFING ROOM · HOW THE RACE WORKS</span><span className="dim">{LESSONS.length} BRIEFINGS</span></div>
      <div className="learn-grid">
        {groups.map((g) => (
          <div key={g} className="learn-group">
            <h4 className="pixel">▣ {g}</h4>
            {LESSONS.filter((l) => l.tag === g).map((l) => (
              <button key={l.id} type="button" className="learn-card" onClick={() => onOpen(l.id)}>
                <span className="pixel">{l.title.toUpperCase()}</span>
                <span className="dim">{l.body[0].slice(0, 110)}…</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
