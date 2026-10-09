import { useState } from 'react'
import { Btn, Avatar, fmt } from '../components/ui'
import PlayerCard from '../components/PlayerCard'
import { useData } from '../data/DataContext'
import type { Page } from '../App'

interface Props { onNavigate: (page: Page) => void; onSelectPlayer: (id: number) => void }

const positions = ['All', 'GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'Winger', 'ST']

const signalColor: Record<string, string> = {
  'UNDERVALUED': '#3DD6F5',
  'BREAKOUT': '#A58BFF',
  'STRONG BUY': '#F5B82E',
  'OVERVALUED': '#FF5A4F',
  'MONITOR': '#8FA0B8',
}

const riskColor: Record<string, string> = {
  Low: '#3DDC97',
  Medium: '#FF8A3D',
  High: '#FF5A4F',
}

export default function Players({ onNavigate, onSelectPlayer }: Props) {
  const { players } = useData()
  const [shown, setShown] = useState(60)
  const [query, setQuery] = useState('')
  const [posFilter, setPosFilter] = useState('All')
  const [view, setView] = useState<'cards' | 'list'>('cards')

  const filtered = players.filter(p => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.club.toLowerCase().includes(query.toLowerCase())
    const matchesPos = posFilter === 'All' || p.position === posFilter
    return matchesQuery && matchesPos
  })

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'Saira Condensed', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Player database</h1>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>{players.length.toLocaleString()} players tracked across {new Set(players.map(p => p.league)).size} leagues.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div role="group" aria-label="View" style={{ display: 'flex' }}>
            {(['cards', 'list'] as const).map(v => (
              <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} style={{
                padding: '7px 16px', cursor: 'pointer', borderRadius: 10,
                fontFamily: 'Saira Condensed', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                background: view === v ? '#F5B82E' : 'transparent',
                color: view === v ? '#000000' : '#9A9A9A',
                border: `1px solid ${view === v ? '#F5B82E' : '#2A2A2A'}`,
                marginLeft: v === 'list' ? -1 : 0,
              }}>{v}</button>
            ))}
          </div>
          <Btn variant="primary">Add player</Btn>
        </div>
      </div>

      {/* Search + position filter row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 420 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={query} onChange={e => { setQuery(e.target.value); setShown(60) }} placeholder="Search players or clubs..."
            style={{ width: '100%', height: 38, paddingLeft: 40, paddingRight: 14, background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {positions.map(pos => (
            <button key={pos} onClick={() => { setPosFilter(pos); setShown(60) }} style={{
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600,
              background: posFilter === pos ? '#F5B82E' : 'transparent',
              color: posFilter === pos ? '#000000' : '#9A9A9A',
              border: posFilter === pos ? 'none' : '1px solid #2A2A2A',
            }}>{pos}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '12px 0' }}>
          No players match. Clear the search or choose All positions.
        </p>
      )}

      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 208px)', gap: '30px 22px', justifyContent: 'center', padding: '14px 4px 10px' }}>
          {filtered.slice(0, shown).map(p => (
            <PlayerCard key={p.id} player={p} onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }} />
          ))}
        </div>
      ) : (
      <div>
        {/* Column labels */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2.4fr 1fr 1.1fr 1.1fr 0.9fr 0.7fr',
          padding: '0 20px 10px', gap: 12,
        }}>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>Player</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>Signal</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A', textAlign: 'right' }}>Current value</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A', textAlign: 'right' }}>Predicted value</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>Risk</div>
          <div />
        </div>

        {filtered.slice(0, shown).map((p, i) => (
          <div
            key={p.id}
            onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}
            style={{
              display: 'grid', gridTemplateColumns: '2.4fr 1fr 1.1fr 1.1fr 0.9fr 0.7fr',
              alignItems: 'center', gap: 12,
              padding: '14px 20px', cursor: 'pointer',
              background: i % 2 === 0 ? '#0A0A0A' : 'transparent',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <Avatar name={p.name} size={38} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 600, color: '#F2F2F2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>
                  {p.position} · {p.age} · {p.club}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: signalColor[p.signal], flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#F2F2F2' }}>{p.signal.charAt(0) + p.signal.slice(1).toLowerCase()}</span>
            </div>

            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#F2F2F2', textAlign: 'right' }}>{fmt(p.currentValue)}</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#F5B82E' }}>{fmt(p.predictedValue)}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#3DDC97' }}>↑ {p.upside}%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[p.risk], flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{p.risk}</span>
            </div>

            <div style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}
                style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: '#111111', color: '#F5B82E',
                  fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600,
                }}
              >View →</button>
            </div>
          </div>
        ))}
      </div>
      )}
      {filtered.length > shown && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
          <Btn variant="secondary" onClick={() => setShown(n => n + 60)}>Show more ({(filtered.length - shown).toLocaleString()} left)</Btn>
        </div>
      )}
    </div>
  )
}
