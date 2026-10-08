import { useState } from 'react'
import { Card, SectionTitle, RiskBadge, Btn, Avatar, PositionTag, fmt } from '../components/ui'
import { watchlistPlayers } from '../data/mockData'
import SquadPitch from '../components/SquadPitch'
import type { Page } from '../App'

type SortKey = 'upside' | 'currentValue' | 'predictedValue' | 'riskScore' | 'age'

interface Props { onNavigate: (page: Page) => void; onSelectPlayer: (id: number) => void }

export default function Watchlist({ onNavigate, onSelectPlayer }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('upside')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [view, setView] = useState<'pitch' | 'table'>('pitch')

  const sorted = [...watchlistPlayers].sort((a, b) => {
    const diff = (a[sortKey] as number) - (b[sortKey] as number)
    return sortDir === 'desc' ? -diff : diff
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setDir(sortDir === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  function setDir(d: 'asc' | 'desc') { setSortDir(d) }

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} style={{
      padding: '4px 10px', borderRadius: 3, cursor: 'pointer',
      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600,
      background: sortKey === k ? 'rgba(200,242,60,0.12)' : 'transparent',
      color: sortKey === k ? '#C8F23C' : '#8493AD',
      border: `1px solid ${sortKey === k ? '#C8F23C' : '#1F2E48'}`,
    }}>
      {label} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </button>
  )

  const totals = {
    currentValue: sorted.reduce((s, p) => s + p.currentValue, 0),
    predictedValue: sorted.reduce((s, p) => s + p.predictedValue, 0),
  }

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#E8EEF8', margin: 0 }}>My Watchlist</h1>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#8493AD', margin: '6px 0 0' }}>Tracked investment targets — {sorted.length} players</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <div role="group" aria-label="View" style={{ display: 'flex', marginRight: 8 }}>
            {(['pitch', 'table'] as const).map(v => (
              <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} style={{
                padding: '6px 16px', cursor: 'pointer', borderRadius: 0,
                fontFamily: 'Saira Condensed', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                background: view === v ? '#C8F23C' : 'transparent',
                color: view === v ? '#060B14' : '#8493AD',
                border: `1px solid ${view === v ? '#C8F23C' : '#1F2E48'}`,
                marginLeft: v === 'table' ? -1 : 0,
              }}>{v}</button>
            ))}
          </div>
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD', alignSelf: 'center' }}>Sort by:</span>
          <SortBtn k="upside" label="Upside" />
          <SortBtn k="currentValue" label="Value" />
          <SortBtn k="predictedValue" label="Future" />
          <SortBtn k="riskScore" label="Risk" />
          <SortBtn k="age" label="Age" />
        </div>
      </div>

      {/* Summary Row */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { label: 'Players Tracked', value: String(sorted.length) },
          { label: 'Total Current Value', value: fmt(totals.currentValue) },
          { label: 'Total Predicted Value', value: fmt(totals.predictedValue), accent: true },
          { label: 'Portfolio Upside', value: `+${Math.round((totals.predictedValue - totals.currentValue) / totals.currentValue * 100)}%`, accent: true },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, background: '#101A2C', border: '1px solid #1F2E48', borderRadius: 3, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'Saira Condensed', fontStyle: 'italic', fontSize: 34, fontWeight: 800, color: (m as any).accent ? '#C8F23C' : '#E8EEF8' }}>{m.value}</div>
          </div>
        ))}
      </div>

      {view === 'pitch' ? (
        <SquadPitch players={sorted} onSelectPlayer={id => { onSelectPlayer(id); onNavigate('player-profile') }} onAddToSlot={() => onNavigate('players')} />
      ) : (
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #17243B' }}>
              {['Player', 'Age', 'Position', 'Current Value', 'Predicted Value', 'Upside', 'Risk', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, color: '#4C5B76', textAlign: 'left', }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id}
                style={{ borderBottom: i < sorted.length - 1 ? '1px solid #17243B' : 'none', transition: 'background 0.12s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={p.name} size={34} />
                    <div>
                      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#E8EEF8' }}>{p.name}</div>
                      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#8493AD' }}>{p.club} · {p.league}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E8EEF8' }}>{p.age}</td>
                <td style={{ padding: '14px 16px' }}><PositionTag pos={p.position} /></td>
                <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E8EEF8' }}>{fmt(p.currentValue)}</td>
                <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono', fontSize: 13, color: '#C8F23C', fontWeight: 600 }}>{fmt(p.predictedValue)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#3DDC97' }}>+{p.upside}%</span>
                </td>
                <td style={{ padding: '14px 16px' }}><RiskBadge risk={p.risk} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="ghost" style={{ padding: '5px 10px', fontSize: 11 }} onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}>View</Btn>
                    <Btn variant="danger" style={{ padding: '5px 10px', fontSize: 11 }}>Remove</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      )}
    </div>
  )
}
