import { useState } from 'react'
import { Btn, Avatar, fmt } from '../components/ui'
import PlayerCard from '../components/PlayerCard'
import { players } from '../data/mockData'
import type { Page } from '../App'

interface Props { onNavigate: (page: Page) => void; onSelectPlayer: (id: number) => void }

const positions = ['All', 'GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'Winger', 'ST']

const signalColor: Record<string, string> = {
  'UNDERVALUED': '#4FA97C',
  'BREAKOUT': '#5B8DBE',
  'STRONG BUY': '#4FA97C',
  'OVERVALUED': '#C1554A',
  'MONITOR': '#9AA3AD',
}

const riskColor: Record<string, string> = {
  Low: '#4FA97C',
  Medium: '#D99A3D',
  High: '#C1554A',
}

export default function Players({ onNavigate, onSelectPlayer }: Props) {
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
          <h1 style={{ fontFamily: 'Saira Condensed', fontSize: 28, fontWeight: 700, color: '#E8E6DF', margin: 0 }}>Player database</h1>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '6px 0 0' }}>{players.length.toLocaleString()} players tracked across 32 leagues.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div role="group" aria-label="View" style={{ display: 'flex' }}>
            {(['cards', 'list'] as const).map(v => (
              <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} style={{
                padding: '7px 16px', cursor: 'pointer', borderRadius: 0,
                fontFamily: 'Saira Condensed', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                background: view === v ? '#E8A33D' : 'transparent',
                color: view === v ? '#0A0C10' : '#9B9891',
                border: `1px solid ${view === v ? '#E8A33D' : '#2A2E37'}`,
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B9891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players or clubs..."
            style={{ width: '100%', height: 38, paddingLeft: 40, paddingRight: 14, background: '#14171D', border: '1px solid #2A2E37', borderRadius: 3, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#E8E6DF', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {positions.map(pos => (
            <button key={pos} onClick={() => setPosFilter(pos)} style={{
              padding: '7px 14px', borderRadius: 3, cursor: 'pointer',
              fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600,
              background: posFilter === pos ? '#E8A33D' : 'transparent',
              color: posFilter === pos ? '#0A0C10' : '#9B9891',
              border: posFilter === pos ? 'none' : '1px solid #2A2E37',
            }}>{pos}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '12px 0' }}>
          No players match. Clear the search or choose All positions.
        </p>
      )}

      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 208px)', gap: '30px 22px', justifyContent: 'center', padding: '14px 4px 10px' }}>
          {filtered.map(p => (
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
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>Player</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>Signal</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', textAlign: 'right' }}>Current value</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', textAlign: 'right' }}>Predicted value</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>Risk</div>
          <div />
        </div>

        {filtered.map((p, i) => (
          <div
            key={p.id}
            onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}
            style={{
              display: 'grid', gridTemplateColumns: '2.4fr 1fr 1.1fr 1.1fr 0.9fr 0.7fr',
              alignItems: 'center', gap: 12,
              padding: '14px 20px', cursor: 'pointer',
              background: i % 2 === 0 ? '#14171D' : 'transparent',
              borderRadius: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <Avatar name={p.name} size={38} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 600, color: '#E8E6DF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>
                  {p.position} · {p.age} · {p.club}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: signalColor[p.signal], flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#E8E6DF' }}>{p.signal.charAt(0) + p.signal.slice(1).toLowerCase()}</span>
            </div>

            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E8E6DF', textAlign: 'right' }}>{fmt(p.currentValue)}</div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#E8A33D' }}>{fmt(p.predictedValue)}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4FA97C' }}>↑ {p.upside}%</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor[p.risk], flexShrink: 0 }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{p.risk}</span>
            </div>

            <div style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}
                style={{
                  padding: '6px 14px', borderRadius: 3, border: 'none', cursor: 'pointer',
                  background: '#191D24', color: '#E8A33D',
                  fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600,
                }}
              >View →</button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )
}
