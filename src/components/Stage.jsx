import { PARTIES, STATUS } from '../data/field.js'
import { stageFor } from '../lib/field.js'
import { Help } from './Explainer.jsx'
import { AgentSprite } from './Sprites.jsx'

const lastName = (n) => n.replace(/ (Jr\.|Sr\.|III|II)$/, '').split(' ').pop()

function Podium({ p, center, onPick }) {
  const lit = p.status === 'declared' || p.status === 'exploring'
  return (
    <button type="button" className={`podium ${lit ? 'lit' : 'radar'} ${center ? 'center' : ''}`} onClick={() => onPick(p.id)}
      title={`${p.name} · ${STATUS[p.status].label} · attention ${p.score.index}`}>
      {center && <span className="spot" aria-hidden="true" />}
      <span className="podium-head"><AgentSprite name={p.name} party={p.party} size={44} /></span>
      <span className="lectern">
        <span className="lectern-top" />
        <span className="lectern-name pixel">{(p.short || lastName(p.name)).toUpperCase()}</span>
        <span className={`status-chip s-${p.status}`}>{STATUS[p.status].short}</span>
      </span>
      <span className="podium-meter" aria-label={`Attention index ${p.score.index}`}>
        <i style={{ width: `${p.score.index}%` }} />
      </span>
      <span className="podium-index">{p.score.index}</span>
    </button>
  )
}

export function DebateStage({ party, field, scores, onPick }) {
  const s = stageFor(party, field, scores)
  const meta = PARTIES[party]
  // centerOut already stands the strongest index in the middle; the spotlight follows it.
  const leader = s.podiums.reduce((a, p) => (!a || p.score.index > a.score.index ? p : a), null)?.id
  return (
    <section className={`stage stage-${party}`} aria-label={meta.stage}>
      <div className="stage-banner">
        <span className="pixel">{meta.stage}</span>
        <span className="stage-count">{s.declared} DECLARED · {s.podiums.length - s.declared} ON THE RADAR <Help id="attention-index" /></span>
      </div>
      <div className="stage-floor">
        <div className="stage-lights" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="podiums">
          {s.podiums.map((p) => <Podium key={p.id} p={p} center={p.id === leader} onPick={onPick} />)}
          {!s.podiums.length && <div className="dim empty-stage">NO CANDIDATES ON STAGE YET</div>}
        </div>
        <div className="stage-edge" />
      </div>
      {s.declared === 0 && <div className="stage-note">No major candidate has declared yet. Faded podiums are people with real coverage and polling who are weighing a run. They light up when they announce.</div>}
      {!!s.wings.length && (
        <div className="wings">
          <span className="pixel wings-tag">IN THE WINGS</span>
          {s.wings.map((p) => <button key={p.id} type="button" className="wing-chip" onClick={() => onPick(p.id)}>{p.name} <span className="dim">{p.score.index}</span></button>)}
        </div>
      )}
      {!!s.out.length && (
        <div className="out-row">
          <span className="pixel out-tag">✕ NOT RUNNING</span>
          {s.out.map((p) => (
            <button key={p.id} type="button" className="out-chip" onClick={() => onPick(p.id)} title={p.note}>
              <s>{p.name}</s>
              <span className="out-why">SAID NO{p.score.poll ? ` · STILL POLLING ${p.score.poll.avg}%` : ''}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
