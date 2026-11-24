import portraits from '../data/portraits.json'
import { LOOKS } from '../data/looks.js'
import { AgentSprite, Pixel } from './Sprites.jsx'

// 14×14 bust. H hair, s skin, E eyes, G glasses, M mouth, B beard, J jacket, W shirt, T tie.
const HEAD = {
  short: ['....HHHHHH....', '...HHHHHHHH...', '..HHHHHHHHHH..', '..HssssssssH..'],
  long: ['....HHHHHH....', '...HHHHHHHH...', '..HHHHHHHHHH..', '.HHssssssssHH.'],
  bald: ['..............', '....ssssss....', '...ssssssss...', '..ssssssssss..'],
}
function grid(l) {
  const long = l.hair === 'long'
  const side = (row) => (long ? `.HH${row.slice(3, 11)}HH.` : row)
  const eyes = l.glasses ? '..ssGEGGEGss..' : '..sssEssEsss..'
  let face = [
    side(eyes),
    side('..ssssssssss..'),
    side('...ssssssss...'),
    side('...sssMMsss...'),
    long ? '.HHHssssssHHH.' : '....ssssss....',
    long ? '.HHH.ssss.HHH.' : '.....ssss.....',
  ]
  if (l.beard) {
    face[2] = side('...BssssssB...')
    face[3] = side('...BBBMMBBB...')
    face[4] = long ? '.HHHBBBBBBHHH.' : '....BBBBBB....'
  }
  const body = l.tie
    ? ['..JJJWTTWJJJ..', '.JJJJJTTJJJJJ.', 'JJJJJJTTJJJJJJ', 'JJJJJJJJJJJJJJ']
    : ['..JJJWWWWJJJ..', '.JJJJJWWJJJJJ.', 'JJJJJJJJJJJJJJ', 'JJJJJJJJJJJJJJ']
  if (long) body[0] = `.HH${body[0].slice(3, 11)}HH.`
  return [...HEAD[l.hair], ...face, ...body]
}
// A one-pixel rim light in the party color so dark suits and hair read on the dark stage.
function withRim(rows) {
  const w = rows[0].length + 2
  const pad = ['.'.repeat(w), ...rows.map((r) => `.${r}.`), '.'.repeat(w)]
  return pad.map((r, y) => [...r].map((c, x) => {
    if (c !== '.') return c
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => pad[y + dy]?.[x + dx] && pad[y + dy][x + dx] !== '.')
    return near ? 'o' : '.'
  }).join('')).join('\n')
}

// The little pixel person on the podium, drawn to look like them.
export function PersonSprite({ person, size = 48 }) {
  const l = LOOKS[person.id]
  if (!l) return <AgentSprite name={person.name} party={person.party} size={size} />
  const rim = person.party === 'D' ? '#4488ff' : person.party === 'R' ? '#ff4444' : '#00ff41'
  return (
    <Pixel
      grid={withRim(grid(l))}
      palette={{ H: l.hairColor, s: l.skin, E: '#1a1010', G: '#6a6a78', M: l.lips || '#8a4a40', B: l.beard, J: l.suit, W: l.shirt, T: l.tie, o: rim }}
      size={size}
      title={person.name}
      className="person-sprite"
    />
  )
}

// The real portrait, for the candidate file.
export function Portrait({ person, width = 96 }) {
  const ph = portraits[person.id]
  if (!ph) return <PersonSprite person={person} size={width} />
  return (
    <span className={`portrait party-${person.party}`} style={{ width }}>
      <img src={`${import.meta.env.BASE_URL}${ph.full}`} alt={`Portrait of ${person.name}`} width={width} height={Math.round((width * ph.h) / ph.w)} loading="lazy" draggable="false" />
    </span>
  )
}

export function portraitCredit(id) {
  return portraits[id] || null
}
