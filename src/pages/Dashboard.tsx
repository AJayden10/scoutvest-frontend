import logoShield from '../assets/logo-shield.png'
import { useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Card, SectionTitle, Btn, fmt } from '../components/ui'
import PlayerCard from '../components/PlayerCard'
import { players, scatterData } from '../data/mockData'
import type { Page } from '../App'

const posFilters = ['All', 'GK', 'DEF', 'MID', 'FWD', 'U21', 'U23', 'U25']

const signalColor: Record<string, string> = {
  'UNDERVALUED': '#3DD6F5',
  'BREAKOUT': '#A58BFF',
  'STRONG BUY': '#F5B82E',
  'OVERVALUED': '#FF5A4F',
  'MONITOR': '#8FA0B8',
}

const riskColorMap: Record<string, string> = {
  Low: '#3DDC97',
  Medium: '#FF8A3D',
  High: '#FF5A4F',
}

interface Props {
  onNavigate: (page: Page) => void
  onSelectPlayer: (id: number) => void
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  const riskColor = { Low: '#3DDC97', Medium: '#FF8A3D', High: '#FF5A4F' }[payload.risk as string] || '#3DD6F5'
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
      background: '#0D0D0D', border: '1px solid #2A2A2A', borderRadius: 8,
      padding: '12px 16px', fontFamily: 'IBM Plex Sans', fontSize: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontWeight: 700, color: '#F2F2F2', marginBottom: 6, fontSize: 13 }}>{d.name}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9A9A9A' }}>Current</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#F2F2F2', fontWeight: 600 }}>{fmt(d.x)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9A9A9A' }}>Predicted</span>
          <span style={{ fontFamily: 'JetBrains Mono', color: '#F5B82E', fontWeight: 600 }}>{fmt(d.y)}</span>
        </div>
        <div style={{ height: 1, background: '#2A2A2A', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span style={{ color: '#9A9A9A' }}>Upside</span>
          <span style={{ fontFamily: 'IBM Plex Sans', color: '#3DDC97', fontWeight: 700 }}>+{d.upside}%</span>
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
      <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px 40px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1240 }}>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
{/* The shield is blended into the photo: soft edges, slightly dimmed, no ring or glow */}
        <img src={logoShield} alt="Free Agent" height={210}
          style={{
            flexShrink: 0, height: 210, width: 'auto', opacity: 0.88, filter: 'brightness(0.9) saturate(0.9)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 72% at 50% 50%, #000 62%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 75% 72% at 50% 50%, #000 62%, transparent 100%)',
          }} />
        <div>
          <h1 style={{ fontFamily: 'Saira Condensed', fontSize: 32, fontWeight: 700, color: '#F2F2F2', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Market Overview
          </h1>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '8px 0 0', lineHeight: 1.5 }}>
            Identify undervalued players and simulate future transfer returns.
          </p>
        </div>
      </div>

      {/* Market Opportunity Chart: starts lower so the banner photo shows above it */}
      <Card style={{ padding: '24px 28px', marginTop: 110 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <SectionTitle
            sub="Players above the diagonal represent investment opportunities — predicted value exceeds current market price."
          >
            Market Opportunity
          </SectionTitle>
          <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 16 }}>
            {posFilters.map(f => (
              <button key={f} onClick={() => setPosFilter(f)} style={{
                padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                background: posFilter === f ? '#F5B82E' : 'transparent',
                color: posFilter === f ? '#000000' : '#9A9A9A',
                border: `1px solid ${posFilter === f ? '#F5B82E' : '#2A2A2A'}`,
                transition: 'all 0.15s',
              }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 14, marginTop: 12 }}>
          {[['Low Risk', '#3DDC97'], ['Medium Risk', '#FF8A3D'], ['High Risk', '#FF5A4F']].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color as string }} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A' }}>{label}</span>
            </div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="8" viewBox="0 0 20 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="#2A2A2A" strokeWidth="1.5" strokeDasharray="4 3"/>
            </svg>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#5E5E5E' }}>Equal value line</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 24, bottom: 28, left: 10 }}>
            <defs>
              <linearGradient id="oppZone" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5B82E" stopOpacity={0.03}/>
                <stop offset="100%" stopColor="#F5B82E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,42,42,0.7)" />
            <XAxis
              dataKey="x" type="number" name="Current Value"
              domain={[0, 65]} tickCount={7}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }}
              axisLine={{ stroke: '#2A2A2A' }} tickLine={false}
              tickFormatter={v => `€${v}M`}
              label={{ value: 'Current Market Value', position: 'insideBottom', offset: -16, fill: '#9A9A9A', fontFamily: 'IBM Plex Sans', fontSize: 11 }}
            />
            <YAxis
              dataKey="y" type="number" name="Predicted Value"
              domain={[0, 70]} tickCount={7}
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }}
              axisLine={{ stroke: '#2A2A2A' }} tickLine={false}
              tickFormatter={v => `€${v}M`}
              label={{ value: 'Predicted Future Value', angle: -90, position: 'insideLeft', offset: 14, fill: '#9A9A9A', fontFamily: 'IBM Plex Sans', fontSize: 11 }}
            />
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 65, y: 65 }]}
              stroke="#2A2A2A" strokeDasharray="5 4" strokeWidth={1.5}
            />
            <Tooltip content={<ChartTooltip />} />
            <Scatter data={scatterData} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      {/* Headline numbers, below the chart */}
      <Card style={{ padding: 0, display: 'flex' }}>
        {[
          { label: 'Players analyzed', value: '12,482', trend: '+6.4%' },
          { label: 'Potential targets', value: '184', trend: null },
          { label: 'Recommended budget', value: '€74.2M', trend: null },
        ].map((row, i) => (
          <div key={row.label} style={{ flex: 1, padding: '20px 24px', borderLeft: i > 0 ? '1px solid #2A2A2A' : 'none' }}>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', marginBottom: 8 }}>{row.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 24, fontWeight: 700, color: '#F2F2F2' }}>{row.value}</div>
              {row.trend && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#3DDC97' }}>↑ {row.trend}</div>}
            </div>
          </div>
        ))}
      </Card>

      {/* Top targets, shown as cards ranked by projected upside */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <SectionTitle sub="Ranked by projected upside. Select a card to open the full report.">
            Top targets
          </SectionTitle>
          <Btn variant="ghost" onClick={() => onNavigate('scouting')}>
            View all targets
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Btn>
        </div>
        <div className="scrollbar-hide" style={{ display: 'flex', gap: 20, overflowX: 'auto', padding: '22px 8px 18px' }}>
          {topPlayers.slice(0, 5).map(p => (
            <PlayerCard key={p.id} player={p} onClick={() => { onSelectPlayer(p.id); onNavigate('player-profile') }} />
          ))}
        </div>
      </div>

      {/* Quick insights strip */}
      <Card style={{ padding: 0, display: 'flex' }}>
        {[
          {
            label: 'Highest upside this week',
            value: 'Jonas Drechsel', sub: '+205% projected · Age 19 · AM',
            color: '#F5B82E',
            onClick: () => { onSelectPlayer(3); onNavigate('player-profile') }
          },
          {
            label: 'Fastest value growth',
            value: 'Emilio Cardona', sub: '+€7.2M in 6 months',
            color: '#3DD6F5',
            onClick: () => { onSelectPlayer(4); onNavigate('player-profile') }
          },
          {
            label: 'Best risk / reward',
            value: 'Dario Montalvo', sub: 'Low risk · +194% upside',
            color: '#FF8A3D',
            onClick: () => { onSelectPlayer(1); onNavigate('player-profile') }
          },
        ].map((item, i) => (
          <div
            key={item.label}
            onClick={item.onClick}
            style={{
              flex: 1, display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '20px 22px', cursor: 'pointer',
              borderLeft: i > 0 ? '1px solid #2A2A2A' : 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${item.color}08` }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
          >
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 8, background: item.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A', marginBottom: 10 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#F2F2F2', marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{item.sub}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Footer: page actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
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
      </div>
    </div>
  )
}
