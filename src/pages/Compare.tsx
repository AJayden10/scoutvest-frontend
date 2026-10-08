import { useState } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, SectionTitle, RiskBadge, Btn, Avatar, PositionTag, fmt } from '../components/ui'
import { players } from '../data/mockData'
import type { Page } from '../App'

interface Props { onNavigate: (page: Page) => void; onSelectPlayer: (id: number) => void }

const COLORS = ['#F5B82E', '#3DD6F5', '#FF8A3D', '#FF5A4F']

const radarMetrics = ['Finishing', 'Passing', 'Creativity', 'Ball Progression', 'Defending', 'Physical']

function getRadarData(p: typeof players[0]) {
  return [
    { metric: 'Finishing', value: Math.round(p.goals90 * 250 + p.xG90 * 100) },
    { metric: 'Passing', value: Math.round(p.progressivePasses * 8 + 20) },
    { metric: 'Creativity', value: Math.round(p.xA90 * 300) },
    { metric: 'Ball Progression', value: Math.round(p.progressiveCarries * 10 + 10) },
    { metric: 'Defending', value: p.position === 'CM' || p.position === 'DM' ? 65 : p.position === 'CB' || p.position === 'FB' ? 80 : 30 },
    { metric: 'Physical', value: Math.round(60 + (p.minutes / 3400) * 40) },
  ].map(d => ({ ...d, value: Math.min(99, Math.max(20, d.value)) }))
}

export default function Compare({ onNavigate, onSelectPlayer }: Props) {
  const [selected, setSelected] = useState([players[0].id, players[1].id, players[3].id])

  const selectedPlayers = selected.map(id => players.find(p => p.id === id)!).filter(Boolean)

  const radarData = radarMetrics.map(metric => {
    const row: any = { metric }
    selectedPlayers.forEach(p => {
      const d = getRadarData(p).find(r => r.metric === metric)
      row[p.name] = d?.value ?? 0
    })
    return row
  })

  const addPlayer = (id: number) => {
    if (selected.includes(id) || selected.length >= 4) return
    setSelected([...selected, id])
  }
  const removePlayer = (id: number) => setSelected(selected.filter(x => x !== id))

  const rows = [
    { label: 'Age', fn: (p: typeof players[0]) => String(p.age) },
    { label: 'Position', fn: (p: typeof players[0]) => p.position },
    { label: 'Club', fn: (p: typeof players[0]) => p.club },
    { label: 'Current Value', fn: (p: typeof players[0]) => fmt(p.currentValue) },
    { label: 'Predicted Value', fn: (p: typeof players[0]) => fmt(p.predictedValue) },
    { label: 'Expected Upside', fn: (p: typeof players[0]) => `+${p.upside}%` },
    { label: 'xG / 90', fn: (p: typeof players[0]) => p.xG90.toFixed(2) },
    { label: 'xA / 90', fn: (p: typeof players[0]) => p.xA90.toFixed(2) },
    { label: 'Goals / 90', fn: (p: typeof players[0]) => p.goals90.toFixed(2) },
    { label: 'Prog. Passes', fn: (p: typeof players[0]) => p.progressivePasses.toFixed(1) },
    { label: 'Confidence', fn: (p: typeof players[0]) => `${p.confidence}%` },
    { label: 'Risk Score', fn: (p: typeof players[0]) => `${p.riskScore}/100` },
  ]

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Compare Players</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>Side-by-side analysis of up to 4 players.</p>
      </div>

      {/* Player selector */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {selectedPlayers.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#111111', border: `1px solid ${COLORS[i]}40`, borderRadius: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i] }} />
            <Avatar name={p.name} size={24} />
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 500, color: '#F2F2F2' }}>{p.name}</span>
            <button onClick={() => removePlayer(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A9A9A', padding: 0, marginLeft: 4, fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        ))}
        {selected.length < 4 && (
          <select onChange={e => addPlayer(+e.target.value)} value=""
            style={{ padding: '6px 12px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', cursor: 'pointer' }}>
            <option value="" disabled>+ Add player</option>
            {players.filter(p => !selected.includes(p.id)).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Comparison table */}
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
              <th style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'JetBrains Mono', fontSize: 9, color: '#5E5E5E', width: 160 }}>METRIC</th>
              {selectedPlayers.map((p, i) => (
                <th key={p.id} style={{ padding: '14px 20px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 3, height: 24, background: COLORS[i], borderRadius: 8 }} />
                    <Avatar name={p.name} size={32} />
                    <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>{p.name}</span>
                    <PositionTag pos={p.position} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} style={{ borderBottom: '1px solid #1A1A1A', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '10px 20px', fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{row.label}</td>
                {selectedPlayers.map((p, pi) => {
                  const val = row.fn(p)
                  const isUpside = row.label === 'Expected Upside'
                  const isPredicted = row.label === 'Predicted Value'
                  return (
                    <td key={p.id} style={{ padding: '10px 20px', textAlign: 'center' }}>
                      {row.label === 'Risk Score' ? (
                        <RiskBadge risk={p.risk} />
                      ) : (
                        <span style={{ fontFamily: isUpside || isPredicted ? 'IBM Plex Sans' : 'JetBrains Mono', fontSize: isUpside ? 15 : 13, fontWeight: isUpside || isPredicted ? 700 : 400, color: isUpside || isPredicted ? '#F5B82E' : '#F2F2F2' }}>
                          {val}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Radar Chart */}
      <Card style={{ padding: '24px' }}>
        <SectionTitle>Performance Radar</SectionTitle>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '4px 0 20px' }}>Multi-dimensional performance comparison</p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={110}>
            <PolarGrid stroke="#1A1A1A" />
            <PolarAngleAxis dataKey="metric" tick={{ fontFamily: 'IBM Plex Sans', fontSize: 11, fill: '#9A9A9A' }} />
            {selectedPlayers.map((p, i) => (
              <Radar key={p.id} name={p.name} dataKey={p.name} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.08} strokeWidth={2} />
            ))}
            <Tooltip contentStyle={{ background: '#171717', border: '1px solid #2A2A2A', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {selectedPlayers.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i] }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
