import { useState } from 'react'
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  Card, SectionTitle, RiskBadge, InvestmentBadge, Btn,
  Avatar, PositionTag, fmt, StatRow, ConfidenceBar,
} from '../components/ui'
import { players, marketValueHistory } from '../data/mockData'
import type { Page } from '../App'

const tabs = ['Overview', 'Performance', 'Market Value', 'AI Prediction', 'Risk Analysis']

interface Props {
  playerId: number
  onNavigate: (page: Page) => void
}

export default function PlayerProfile({ playerId, onNavigate }: Props) {
  const [tab, setTab] = useState('Overview')
  const player = players.find(p => p.id === playerId) ?? players[0]

  const chartData = marketValueHistory.map(d => ({
    date: d.date,
    actual: d.value,
    predicted: d.predicted,
  }))

  const projections = [
    { label: '1-Year', value: player.predictedValue * 0.63, note: 'Short-term' },
    { label: '2-Year', value: player.predictedValue * 0.88, note: 'Mid-term' },
    { label: '3-Year', value: player.predictedValue,       note: 'Model horizon' },
  ]

  return (
    <div style={{ padding: '24px 32px 40px', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', padding: 0 }}>
          Dashboard
        </button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3a4d62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#E8E6DF' }}>Player Intelligence</span>
      </div>

      {/* ── Investment Opportunity Hero (spec §37 — investment case first) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1e2b 0%, #0d1a26 40%, #0b1117 100%)',
        border: '1px solid rgba(232,163,61,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #E8A33D, #2ba870 60%, transparent)' }} />

        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Avatar + identity */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flex: '0 0 auto' }}>
              <Avatar name={player.name} size={72} />
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                  <InvestmentBadge signal={player.signal} />
                  <RiskBadge risk={player.risk} />
                </div>
                <h1 style={{ fontFamily: 'Saira Condensed', fontSize: 26, fontWeight: 700, color: '#E8E6DF', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {player.name}
                </h1>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <PositionTag pos={player.position} />
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>Age {player.age}</span>
                  <span style={{ color: '#2A2E37' }}>·</span>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>{player.club}</span>
                  <span style={{ color: '#2A2E37' }}>·</span>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>{player.league}</span>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Btn variant="primary">+ Add to Watchlist</Btn>
                  <Btn variant="secondary" onClick={() => onNavigate('simulator')}>Simulate Transfer</Btn>
                  <Btn variant="ghost" onClick={() => onNavigate('compare')}>Compare</Btn>
                </div>
              </div>
            </div>

            {/* The investment numbers — right-aligned, spec §11 & §37 */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 0, alignItems: 'stretch', flexShrink: 0 }}>
              {[
                { label: 'CURRENT VALUE', value: fmt(player.currentValue), color: '#C8D3DF', dim: true },
                { label: 'PREDICTED VALUE', value: fmt(player.predictedValue), color: '#4FA97C', dim: false },
                { label: 'EXPECTED UPSIDE', value: `+${player.upside}%`, color: '#4FA97C', dim: false, big: true },
              ].map((m, i) => (
                <div key={m.label} style={{
                  padding: '0 28px',
                  borderLeft: i > 0 ? '1px solid rgba(38,51,66,0.6)' : 'none',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, color: '#3a4d62', marginBottom: 8 }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: 'IBM Plex Sans', fontWeight: 800, lineHeight: 1,
                    fontSize: m.big ? 38 : 30,
                    color: m.color,
                    letterSpacing: '-0.02em',
                    filter: m.big ? 'drop-shadow(0 0 12px rgba(232,163,61,0.25))' : undefined,
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why ScoutVest strip */}
          <div style={{
            marginTop: 24,
            padding: '14px 18px',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 3,
            border: '1px solid rgba(38,51,66,0.5)',
            display: 'flex', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#E8A33D', alignSelf: 'center', flexShrink: 0 }}>
              WHY SCOUTVEST →
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', flex: 1 }}>
              {player.reasons.slice(0, 3).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, flex: '0 0 auto', maxWidth: 260 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(232,163,61,0.12)', border: '1px solid rgba(232,163,61,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#C8D3DF', lineHeight: 1.45 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(38,51,66,0.7)', gap: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 20px', fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === t ? 600 : 400,
            color: tab === t ? '#E8E6DF' : '#9B9891',
            borderBottom: tab === t ? '2px solid #E8A33D' : '2px solid transparent',
            marginBottom: -1, transition: 'color 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            {
              title: 'Performance', color: '#5B8DBE',
              rows: [
                { label: 'Goals / 90', value: player.goals90.toFixed(2) },
                { label: 'Assists / 90', value: player.assists90.toFixed(2) },
                { label: 'xG / 90', value: player.xG90.toFixed(2) },
                { label: 'xA / 90', value: player.xA90.toFixed(2) },
                { label: 'Prog. Passes / 90', value: player.progressivePasses.toFixed(1) },
                { label: 'Prog. Carries / 90', value: player.progressiveCarries.toFixed(1) },
                { label: 'Minutes', value: player.minutes.toLocaleString() },
              ],
            },
            {
              title: 'Market', color: '#D99A3D',
              rows: [
                { label: 'Current Value', value: fmt(player.currentValue) },
                { label: 'Peak Value', value: fmt(player.peakValue) },
                { label: 'Value Change', value: `+€${player.valueChange.toFixed(1)}M`, hi: true },
                { label: 'Transfer Fee', value: fmt(player.transferFee) },
                { label: 'Contract', value: `${player.contractYears} years remaining` },
              ],
            },
            {
              title: 'AI Model', color: '#E8A33D',
              rows: [
                { label: 'Predicted Value', value: fmt(player.predictedValue), hi: true },
                { label: 'Expected Growth', value: `+${player.upside}%`, hi: true },
                { label: 'Confidence', value: `${player.confidence}%` },
                { label: 'Risk Score', value: `${player.riskScore} / 100` },
              ],
              extra: (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>Model Confidence</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#E8A33D' }}>{player.confidence}%</span>
                  </div>
                  <ConfidenceBar pct={player.confidence} />
                </div>
              ),
            },
          ].map(section => (
            <Card key={section.title} style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, borderRadius: 8, background: section.color }} />
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#9B9891', }}>{section.title}</div>
              </div>
              {section.rows.map(r => <StatRow key={r.label} label={r.label} value={r.value} mono highlight={(r as any).hi} />)}
              {(section as any).extra}
            </Card>
          ))}
        </div>
      )}

      {/* Tab: Performance */}
      {tab === 'Performance' && (
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Performance Breakdown</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
            {[
              { label: 'Goals / 90',        value: player.goals90.toFixed(2),         max: 0.6 },
              { label: 'Assists / 90',       value: player.assists90.toFixed(2),        max: 0.5 },
              { label: 'xG / 90',            value: player.xG90.toFixed(2),             max: 0.6 },
              { label: 'xA / 90',            value: player.xA90.toFixed(2),             max: 0.5 },
              { label: 'Prog. Passes',        value: player.progressivePasses.toFixed(1), max: 12 },
              { label: 'Prog. Carries',       value: player.progressiveCarries.toFixed(1), max: 10 },
              { label: 'Minutes Played',      value: player.minutes.toLocaleString(),   max: 3400, raw: player.minutes },
            ].map(m => {
              const pct = Math.min(100, ((m.raw ?? +m.value) / m.max) * 100)
              return (
                <div key={m.label} style={{ background: '#14171D', borderRadius: 3, padding: '16px' }}>
                  <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: '#E8E6DF', marginBottom: 12, letterSpacing: '-0.01em' }}>{m.value}</div>
                  <div style={{ height: 4, background: 'rgba(38,51,66,0.8)', borderRadius: 8 }}>
                    <div style={{ height: 4, width: `${pct}%`, background: 'linear-gradient(90deg, #2ba870, #E8A33D)', borderRadius: 8 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Tab: Market Value */}
      {tab === 'Market Value' && (
        <Card style={{ padding: '24px 28px' }}>
          <SectionTitle sub="Historical market value and AI-projected trajectory to 2026/27">
            Market Value Evolution
          </SectionTitle>
          <ResponsiveContainer width="100%" height={300} style={{ marginTop: 24 }}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 24, bottom: 20, left: 10 }}>
              <defs>
                <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E8A33D" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#E8A33D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,51,66,0.7)" />
              <XAxis dataKey="date"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9B9891' }}
                axisLine={{ stroke: '#2A2E37' }} tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9B9891' }}
                axisLine={{ stroke: '#2A2E37' }} tickLine={false}
                tickFormatter={v => `€${v}M`}
              />
              <Tooltip
                formatter={(v: any) => [`€${Number(v).toFixed(1)}M`]}
                contentStyle={{ background: '#0f1c29', border: '1px solid #2A2E37', fontFamily: 'IBM Plex Sans', fontSize: 12, borderRadius: 3 }}
              />
              <ReferenceLine x="Jul 24" stroke="#2A2E37" strokeDasharray="4 4"
                label={{ value: 'NOW', fill: '#3a4d62', fontSize: 9, fontFamily: 'JetBrains Mono', }}
              />
              <Line dataKey="actual" stroke="#5B8DBE" strokeWidth={2.5} dot={{ fill: '#5B8DBE', r: 4, strokeWidth: 0 }} connectNulls={false} name="Historical" />
              <Area dataKey="predicted" stroke="#E8A33D" strokeWidth={2} strokeDasharray="7 4"
                fill="url(#predAreaGrad)" dot={{ fill: '#E8A33D', r: 4, strokeWidth: 0 }} connectNulls={false} name="AI Projection"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
            {[['Historical Value', '#5B8DBE', false], ['AI Projection (model)', '#E8A33D', true]].map(([label, color, dashed]) => (
              <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="22" height="6" viewBox="0 0 22 6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke={color as string} strokeWidth="2" strokeDasharray={dashed ? '5 3' : undefined} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>{label as string}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: AI Prediction */}
      {tab === 'AI Prediction' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#E8A33D', marginBottom: 4 }}>AI MARKET PROJECTION</div>
            <SectionTitle>Value Trajectory</SectionTitle>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', marginBottom: 4 }}>Current Value</div>
              <div style={{ fontFamily: 'Saira Condensed', fontSize: 36, fontWeight: 700, color: '#E8E6DF', letterSpacing: '-0.02em', marginBottom: 20 }}>{fmt(player.currentValue)}</div>

              {projections.map((p, i) => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(38,51,66,0.5)' }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9B9891', marginBottom: 2 }}>{p.note.toUpperCase()}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C8D3DF' }}>{p.label} Projection</div>
                  </div>
                  <div style={{ fontFamily: 'Saira Condensed', fontSize: 22, fontWeight: 700, color: '#E8A33D', letterSpacing: '-0.01em' }}>
                    {fmt(p.value)}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>Model Confidence</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#E8A33D' }}>{player.confidence}%</span>
                </div>
                <ConfidenceBar pct={player.confidence} />
              </div>
            </div>
          </Card>

          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#5B8DBE', marginBottom: 4 }}>EXPLAINABILITY</div>
            <SectionTitle>Why ScoutVest Recommends</SectionTitle>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {player.reasons.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 14px', borderRadius: 3,
                  background: 'rgba(232,163,61,0.04)', border: '1px solid rgba(232,163,61,0.09)',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(232,163,61,0.1)', border: '1px solid rgba(232,163,61,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C8D3DF', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Risk Analysis */}
      {tab === 'Risk Analysis' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          <Card style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9B9891', marginBottom: 20 }}>RISK SCORE</div>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 16px' }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="#1d2d3d" strokeWidth="10"/>
                <circle cx="55" cy="55" r="46" fill="none"
                  stroke="#E8A33D" strokeWidth="10"
                  strokeDasharray={`${(player.riskScore / 100) * 289} 289`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Saira Condensed', fontSize: 26, fontWeight: 700, color: '#E8E6DF' }}>{player.riskScore}</span>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 10, color: '#9B9891' }}>/ 100</span>
              </div>
            </div>
            <RiskBadge risk={player.risk} />
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', marginTop: 12, lineHeight: 1.5 }}>
              Lower score indicates a safer investment profile
            </div>
          </Card>
          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9B9891', marginBottom: 20 }}>RISK FACTORS</div>
            {[
              { factor: 'Age Profile',             level: 'Low'    as const },
              { factor: 'Injury History',           level: player.riskScore > 35 ? 'Medium' as const : 'Low' as const },
              { factor: 'Performance Volatility',   level: 'Low'    as const },
              { factor: 'League Transition',        level: player.riskScore > 30 ? 'Medium' as const : 'Low' as const },
              { factor: 'Contract Status',          level: 'Low'    as const },
              { factor: 'Model Uncertainty',        level: player.confidence > 80 ? 'Low' as const : 'Medium' as const },
            ].map(f => (
              <div key={f.factor} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(38,51,66,0.5)' }}>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C8D3DF' }}>{f.factor}</span>
                <RiskBadge risk={f.level} />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}
