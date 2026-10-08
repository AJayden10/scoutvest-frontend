import type { Player, Position } from '../data/mockData'
import PlayerCard from './PlayerCard'

interface Slot { pos: Position; x: number; y: number }

// 4-3-3, attacking up the page. x and y are percentages of the pitch.
const FORMATION: Slot[] = [
  { pos: 'ST', x: 50, y: 12 },
  { pos: 'Winger', x: 15, y: 24 },
  { pos: 'Winger', x: 85, y: 24 },
  { pos: 'CM', x: 30, y: 45 },
  { pos: 'CM', x: 70, y: 45 },
  { pos: 'DM', x: 50, y: 61 },
  { pos: 'FB', x: 12, y: 75 },
  { pos: 'CB', x: 37, y: 79 },
  { pos: 'CB', x: 63, y: 79 },
  { pos: 'FB', x: 88, y: 75 },
  { pos: 'GK', x: 50, y: 92 },
]

// The pitch is drawn in a 76 x 70 box so circles stay circles.
const LINE = 'rgba(232,230,223,0.26)'

function Markings() {
  return (
    <svg viewBox="0 0 76 70" preserveAspectRatio="none" aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x="0" y={i * 10} width="76" height="10" fill={i % 2 === 0 ? '#10261c' : '#122a1f'} />
      ))}
      <g fill="none" stroke={LINE} strokeWidth="0.35">
        <rect x="2" y="2" width="72" height="66" />
        <line x1="2" y1="35" x2="74" y2="35" />
        <circle cx="38" cy="35" r="7" />
        <rect x="20" y="2" width="36" height="12" />
        <rect x="29" y="2" width="18" height="5" />
        <rect x="20" y="56" width="36" height="12" />
        <rect x="29" y="63" width="18" height="5" />
        <path d="M 31.5 14 A 7 7 0 0 0 44.5 14" />
        <path d="M 31.5 56 A 7 7 0 0 1 44.5 56" />
      </g>
    </svg>
  )
}

interface Props {
  players: Player[]
  onSelectPlayer: (id: number) => void
  onAddToSlot: (position: Position) => void
}

export default function SquadPitch({ players, onSelectPlayer, onAddToSlot }: Props) {
  // Fill each slot with the first unused player of that position.
  const used = new Set<number>()
  const filled = FORMATION.map(slot => {
    const player = players.find(p => p.position === slot.pos && !used.has(p.id))
    if (player) used.add(player.id)
    return { slot, player }
  })
  const unplaced = players.filter(p => !used.has(p.id))

  return (
    <div style={{ overflowX: 'auto' }} className="scrollbar-hide">
      <div style={{
        position: 'relative', width: '100%', minWidth: 640, maxWidth: 780, aspectRatio: '76 / 70',
        margin: '0 auto', border: '1px solid #2A2E37', overflow: 'hidden',
        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)',
      }}>
        <Markings />
        {filled.map(({ slot, player }, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
            transform: 'translate(-50%, -50%)',
          }}>
            {player ? (
              <PlayerCard player={player} compact onClick={() => onSelectPlayer(player.id)} />
            ) : (
              <button type="button" className="slot" onClick={() => onAddToSlot(slot.pos)}
                aria-label={`Add a ${slot.pos} to your squad`}
                style={{
                  width: '5.4em', height: '7em', fontSize: 13, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4,
                  background: 'rgba(10,12,16,0.35)', border: '1.5px dashed rgba(232,230,223,0.28)',
                  color: 'rgba(232,230,223,0.55)', fontFamily: 'Saira Condensed', fontWeight: 700,
                }}>
                <span style={{ fontSize: '1.9em', lineHeight: 1 }}>+</span>
                <span style={{ fontSize: '1.05em', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{slot.pos}</span>
              </button>
            )}
          </div>
        ))}
      </div>
      {unplaced.length > 0 && (
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', textAlign: 'center', margin: '12px 0 0' }}>
          {unplaced.length} more on your watchlist {unplaced.length === 1 ? 'has' : 'have'} no free slot: {unplaced.map(p => p.name).join(', ')}.
        </p>
      )}
    </div>
  )
}
