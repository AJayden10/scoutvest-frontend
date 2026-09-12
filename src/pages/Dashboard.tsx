import { useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, SectionTitle, Btn, Avatar, StadiumPattern, fmt } from '../components/ui'
import { players, scatterData } from '../data/mockData'
import type { Page } from '../App'

const posFilters = ['All', 'GK', 'DEF', 'MID', 'FWD', 'U21', 'U23', 'U25']

const signalColor: Record<string, string> = {
  'UNDERVALUED': '#4FA97C',
  'BREAKOUT': '#5B8DBE',
  'STRONG BUY': '#4FA97C',
  'OVERVALUED': '#C1554A',
  'MONITOR': '#D99A3D',
}

const riskColorMap: Record<string, string> = {
  Low: '#4FA97C',
  Medium: '#D99A3D',
  High: '#C1554A',
}

interface Props {
  onNavigate: (page: Page) => void
  onSelectPlayer: (id: number) => void
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  const riskColor = { Low: '#E8A33D', Medium: '#D99A3D', High: '#C1554A' }[payload.risk as string] || '#5B8DBE'
  const big = payload.upside > 150
  return (
    <g>
      {big && <circle cx={cx} cy={cy} r={12} fill={riskColor} fillOpacity={0.07} />}
      <circle cx={cx} cy={cy} r={big ? 7 : 5}
        fill={riskColor} fillOpacity={big ? 0.85 : 0.6}
        stroke={riskColor} strokeWidth={big ? 1.5 : 1}
        style={{ cursor: 'pointer', filter: big ? `drop-shadow(0 0 4px ${riskColor}66)` : undefined }}
      />
    </g>
  )
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#0f1c29', border: '1px solid #2A2E37', borderRadius: 16,
      padding: '12px 16px', fontFamily: 'IBM Plex Sans', fontSize: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontWeight: 700, color: '#E8E6DF', marginBottom: 6, fontSize: 13 }}>{d.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9B9891' }}>Current</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#E8E6DF', fontWeight: 600 }}>{fmt(d.x)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9B9891' }}>Predicted</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#E8A33D', fontWeight: 600 }}>{fmt(d.y)}</span>
        </div>
        <div style={{ height: 1, background: '#2A2E37', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9B9891' }}>Upside</span>
          <span style={{ fontFamily: 'IBM Plex Sans', color: '#4FA97C', fontWeight: 700 }}>+{d.upside}%</span>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate, onSelectPlayer }: Props) {
  const [posFilter, setPosFilter] = useState('All')
  const topPlayers = [...players].sort((a, b) => b.upside - a.upside).slice(0, 6)

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <StadiumPattern />
      <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1240 }}>

      {/* Page Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 700, color: '#E8E6DF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Market Overview
          </h1>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '8px 0 0', lineHeight: 1.5 }}>
            Identify undervalued players and simulate future transfer returns.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Btn variant="secondary" onClick={() => onNavigate('players')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Player
          </Btn>
          <Btn variant="ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </Btn>
        </div>
      </div>

      {/* Overview: featured metric + compact supporting stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: 24, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '8px 4px' }}>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', marginBottom: 6 }}>
            Avg predicted upside this quarter
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12 }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 56, fontWeight: 700, color: '#E8A33D', letterSpacing: '-0.03em', lineHeight: 1 }}>
              +38.7%
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#4FA97C' }}>
              <span>↑</span> +2.1pp
            </div>
          </div>
          <div style={{ height: 1, background: '#2A2E37', margin: '18px auto 16px', maxWidth: 220 }} />
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891', lineHeight: 1.6, maxWidth: 320 }}>
            Across <span style={{ color: '#E8E6DF', fontWeight: 600 }}>184</span> flagged targets, spanning a recommended budget of <span style={{ color: '#E8E6DF', fontWeight: 600 }}>€74.2M</span>.
          </div>
        </div>

        <Card style={{ padding: 0 }}>
          {[
            { label: 'Players analyzed', value: '12,482', trend: '+6.4%', up: true },
            { label: 'Potential targets', value: '184', trend: null },
            { label: 'Recommended budget', value: '€74.2M', trend: null },
          ].map((row, i) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: i < 2 ? '1px solid #2A2E37' : 'none',
            }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>{row.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: '#E8E6DF' }}>{row.value}</div>
                {row.trend && (
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: row.up ? '#4FA97C' : '#C1554A' }}>
                    ↑ {row.trend}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Market Opportunity Chart */}
      <Card style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <SectionTitle
            sub="Players above the diagonal represent investment opportunities — predicted value exceeds current market price."
          >
            Market Opportunity
          </SectionTitle>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 16 }}>
            {posFilters.map(f => (
              <button key={f} onClick={() => setPosFilter(f)} style={{
                padding: '4px 10px', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                background: posFilter === f ? '#E8A33D' : 'transparent',
                color: posFilter === f ? '#0A0C10' : '#9B9891',
                border: `1px solid ${posFilter === f ? '#E8A33D' : '#2A2E37'}`,
                transition: 'all 0.15s',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 14, marginTop: 12 }}>
          {[['Low Risk', '#E8A33D'], ['Medium Risk', '#D99A3D'], ['High Risk', '#C1554A']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color as string }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="8" viewBox="0 0 20 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#2A2E37" strokeWidth="1.5" strokeDasharray="4 3"/>
            </svg>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#3a4d62' }}>Equal value line</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 24, bottom: 28, left: 10 }}>
            <defs>
              <linearGradient id="oppZone" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8A33D" stopOpacity={0.03}/>
                <stop offset="100%" stopColor="#E8A33D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,51,66,0.7)" />
            <XAxis
              dataKey="x" type="number" name="Current Value"
              domain={[0, 65]} tickCount={7}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9B9891' }}
              axisLine={{ stroke: '#2A2E37' }} tickLine={false}
              tickFormatter={v => `€${v}M`}
              label={{ value: 'Current Market Value', position: 'insideBottom', offset: -16, fill: '#9B9891', fontFamily: 'IBM Plex Sans', fontSize: 11 }}
            />
            <YAxis
              dataKey="y" type="number" name="Predicted Value"
              domain={[0, 70]} tickCount={7}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9B9891' }}
              axisLine={{ stroke: '#2A2E37' }} tickLine={false}
              tickFormatter={v => `€${v}M`}
              label={{ value: 'Predicted Future Value', angle: -90, position: 'insideLeft', offset: 14, fill: '#9B9891', fontFamily: 'IBM Plex Sans', fontSize: 11 }}
            />
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 65, y: 65 }]}
              stroke="#2A2E37" strokeDasharray="5 4" strokeWidth={1.5}
            />
            <Tooltip content={<ChartTooltip />} />
            <Scatter data={scatterData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Investment Opportunities Table */}
      <Card>
        <div style={{
          padding: '18px 24px 16px',
          borderBottom: '1px solid rgba(38,51,66,0.8)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <SectionTitle sub="Ranked by projected upside — click any row to view full intelligence.">
            Top Investment Opportunities
          </SectionTitle>
          <Btn variant="ghost" onClick={() => onNavigate('scouting')}>
            View All Targets
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Btn>
        </div>

        <div>
          {topPlayers.map((p, i) => (
            <div
              key={p.id}
              onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 24px', cursor: 'pointer',
                background: i % 2 === 0 ? '#14171D' : 'transparent',
                borderBottom: i < topPlayers.length - 1 ? '1px solid #191D24' : 'none',
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < 3 ? 'rgba(232,163,61,0.15)' : 'transparent',
                fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700,
                color: i < 3 ? '#E8A33D' : '#3a4d62',
              }}>
                {i + 1}
              </div>

              <Avatar name={p.name} size={34} />

              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#E8E6DF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891', marginTop: 1 }}>
                  {p.position} · Age {p.age} · {p.club}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 130px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: signalColor[p.signal], flexShrink: 0 }} />
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#E8E6DF' }}>{p.signal.charAt(0) + p.signal.slice(1).toLowerCase()}</span>
              </div>

              <div style={{ flex: '0 0 90px', fontFamily: 'JetBrains Mono', fontSize: 13, color: '#9B9891', textAlign: 'right' }}>
                {fmt(p.currentValue)}
              </div>

              <div style={{ flex: '0 0 100px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#E8A33D' }}>{fmt(p.predictedValue)}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4FA97C' }}>↑ {p.upside}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 90px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: riskColorMap[p.risk], flexShrink: 0 }} />
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{p.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick insights strip */}
      <Card style={{ padding: 0, display: 'flex' }}>
        {[
          {
            label: 'Highest upside this week',
            value: 'Kai Fischer', sub: '+205% projected · Age 19 · AM',
            color: '#E8A33D',
            onClick: () => { onSelectPlayer(3); onNavigate('player-profile') }
          },
          {
            label: 'Fastest value growth',
            value: 'Diego Vargas', sub: '+€7.2M in 6 months',
            color: '#5B8DBE',
            onClick: () => { onSelectPlayer(4); onNavigate('player-profile') }
          },
          {
            label: 'Best risk / reward',
            value: 'Lucas Fernández', sub: 'Low risk · +194% upside',
            color: '#D99A3D',
            onClick: () => { onSelectPlayer(1); onNavigate('player-profile') }
          },
        ].map((item, i) => (
          <div
            key={item.label}
            onClick={item.onClick}
            style={{
              flex: 1, display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '20px 22px', cursor: 'pointer',
              borderLeft: i > 0 ? '1px solid #2A2E37' : 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${item.color}08` }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 8, background: item.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', marginBottom: 10 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#E8E6DF', marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </Card>
      </div>
    </div>
  )
}
