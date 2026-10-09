import { useState } from 'react'
import { useData } from '../data/DataContext'
import type { Page } from '../App'

interface TopBarProps {
  onNavigate: (page: Page) => void
  onSelectPlayer: (id: number) => void
}

export default function TopBar({ onNavigate, onSelectPlayer }: TopBarProps) {
  const [query, setQuery] = useState('')
  const { players } = useData()
  const q = query.trim().toLowerCase()
  const matches = q.length < 2 ? [] : players.filter(p => p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q)).slice(0, 7)

  return (
    <div style={{
      height: 56, background: '#050505', borderBottom: '1px solid #2A2A2A',
      display: 'flex', alignItems: 'center', paddingLeft: 24, paddingRight: 24, gap: 16, flexShrink: 0,
    }}>
      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400, position: 'relative' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search players, clubs, leagues..."
          style={{
            width: '100%', height: 34, paddingLeft: 36, paddingRight: 12,
            background: '#111111', border: '1px solid #2A2A2A', borderRadius: 13,
            fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2', outline: 'none',
          }}
        />
        {matches.length > 0 && (
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, zIndex: 60, background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 10, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
            {matches.map(p => (
              <button key={p.id} onClick={() => { onSelectPlayer(p.id); setQuery('') }} style={{
                display: 'flex', width: '100%', justifyContent: 'space-between', gap: 12, padding: '9px 14px', background: 'none', border: 'none',
                borderBottom: '1px solid #1A1A1A', cursor: 'pointer', textAlign: 'left', fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2',
              }}>
                <span>{p.name}</span><span style={{ color: '#9A9A9A', fontSize: 12 }}>{p.club} · {p.position}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
        {/* Notifications */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderRadius: '50%', background: '#FF8A3D', border: '1.5px solid #050505' }} />
        </button>

        {/* Profile */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2A2A2A, #111111)',
          border: '1.5px solid #F5B82E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'IBM Plex Sans', fontWeight: 700, fontSize: 12, color: '#F5B82E', cursor: 'pointer',
        }}>
          AO
        </div>
      </div>
    </div>
  )
}
