import portraits from '../data/portraits.json'
import { AgentSprite } from './Sprites.jsx'

// An 8-bit version of the person's public portrait (falls back to the generic agent sprite).
export function Portrait({ person, size = 44 }) {
  const ph = portraits[person.id]
  if (!ph) return <AgentSprite name={person.name} party={person.party} size={size} />
  return (
    <span className={`portrait party-${person.party}`} style={{ width: size, height: size }}>
      <img src={`${import.meta.env.BASE_URL}${ph.src}`} alt={person.name} width={size} height={size} loading="lazy" draggable="false" />
    </span>
  )
}

export function portraitCredit(id) {
  return portraits[id] || null
}
