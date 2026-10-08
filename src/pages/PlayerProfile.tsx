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
        <button onClick={() => onNavigate('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD', padding: 0 }}>
          Dashboard
        </button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4C5B76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#E8EEF8' }}>Player Intelligence</span>
      </div>

      {/* ── Investment Opportunity Hero (spec §37 — investment case first) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0C1828 0%, #0A1422 40%, #070D18 100%)',
        border: '1px solid rgba(245,184,46,0.2)',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #F5B82E, #A8CC2C 60%, transparent)' }} />

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
                <h1 style={{ fontFamily: 'Saira Condensed', fontSize: 26, fontWeight: 700, color: '#E8EEF8', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {player.name}
                </h1>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <PositionTag pos={player.position} />
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD' }}>Age {player.age}</span>
                  <span style={{ color: '#1F2E48' }}>·</span>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD' }}>{player.club}</span>
                  <span style={{ color: '#1F2E48' }}>·</span>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD' }}>{player.league}</span>
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
                { label: 'CURRENT VALUE', value: fmt(player.currentValue), color: '#C4D0E4', dim: true },
                { label: 'PREDICTED VALUE', value: fmt(player.predictedValue), color: '#3DDC97', dim: false },
                { label: 'EXPECTED UPSIDE', value: `+${player.upside}%`, color: '#3DDC97', dim: false, big: true },
              ].map((m, i) => (
                <div key={m.label} style={{
                  padding: '0 28px',
                  borderLeft: i > 0 ? '1px solid rgba(31,46,72,0.6)' : 'none',
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, color: '#4C5B76', marginBottom: 8 }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: 'IBM Plex Sans', fontWeight: 800, lineHeight: 1,
                    fontSize: m.big ? 38 : 30,
                    color: m.color,
                    letterSpacing: '-0.02em',
                    filter: m.big ? 'drop-shadow(0 0 12px rgba(245,184,46,0.25))' : undefined,
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
            borderRadius: 8,
            border: '1px solid rgba(31,46,72,0.5)',
            display: 'flex', gap: 24, flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#F5B82E', alignSelf: 'center', flexShrink: 0 }}>
              WHY SCOUTVEST →
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', flex: 1 }}>
              {player.reasons.slice(0, 3).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, flex: '0 0 auto', maxWidth: 260 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(245,184,46,0.12)', border: '1px solid rgba(245,184,46,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#F5B82E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#C4D0E4', lineHeight: 1.45 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(31,46,72,0.7)', gap: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 20px', fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: tab === t ? 600 : 400,
            color: tab === t ? '#E8EEF8' : '#8493AD',
            borderBottom: tab === t ? '2px solid #F5B82E' : '2px solid transparent',
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
              title: 'Performance', color: '#3DD6F5',
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
              title: 'Market', color: '#FF8A3D',
              rows: [
                { label: 'Current Value', value: fmt(player.currentValue) },
                { label: 'Peak Value', value: fmt(player.peakValue) },
                { label: 'Value Change', value: `+€${player.valueChange.toFixed(1)}M`, hi: true },
                { label: 'Transfer Fee', value: fmt(player.transferFee) },
                { label: 'Contract', value: `${player.contractYears} years remaining` },
              ],
            },
            {
              title: 'AI Model', color: '#F5B82E',
              rows: [
                { label: 'Predicted Value', value: fmt(player.predictedValue), hi: true },
                { label: 'Expected Growth', value: `+${player.upside}%`, hi: true },
                { label: 'Confidence', value: `${player.confidence}%` },
                { label: 'Risk Score', value: `${player.riskScore} / 100` },
              ],
              extra: (
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD' }}>Model Confidence</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#F5B82E' }}>{player.confidence}%</span>
                  </div>
                  <ConfidenceBar pct={player.confidence} />
                </div>
              ),
            },
          ].map(section => (
            <Card key={section.title} style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 3, height: 16, borderRadius: 8, background: section.color }} />
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#8493AD', }}>{section.title}</div>
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
                <div key={m.label} style={{ background: '#0B1220', borderRadius: 8, padding: '16px' }}>
                  <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#8493AD', marginBottom: 10 }}>{m.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 700, color: '#E8EEF8', marginBottom: 12, letterSpacing: '-0.01em' }}>{m.value}</div>
                  <div style={{ height: 4, background: 'rgba(31,46,72,0.8)', borderRadius: 8 }}>
                    <div style={{ height: 4, width: `${pct}%`, background: 'linear-gradient(90deg, #A8CC2C, #F5B82E)', borderRadius: 8 }} />
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
                  <stop offset="5%"  stopColor="#F5B82E" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#F5B82E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,46,72,0.7)" />
              <XAxis dataKey="date"
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#8493AD' }}
                axisLine={{ stroke: '#1F2E48' }} tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#8493AD' }}
                axisLine={{ stroke: '#1F2E48' }} tickLine={false}
                tickFormatter={v => `€${v}M`}
              />
              <Tooltip
                formatter={(v: any) => [`€${Number(v).toFixed(1)}M`]}
                contentStyle={{ background: '#0C1626', border: '1px solid #1F2E48', fontFamily: 'IBM Plex Sans', fontSize: 12, borderRadius: 8 }}
              />
              <ReferenceLine x="Jul 24" stroke="#1F2E48" strokeDasharray="4 4"
                label={{ value: 'NOW', fill: '#4C5B76', fontSize: 9, fontFamily: 'JetBrains Mono', }}
              />
              <Line dataKey="actual" stroke="#3DD6F5" strokeWidth={2.5} dot={{ fill: '#3DD6F5', r: 4, strokeWidth: 0 }} connectNulls={false} name="Historical" />
              <Area dataKey="predicted" stroke="#F5B82E" strokeWidth={2} strokeDasharray="7 4"
                fill="url(#predAreaGrad)" dot={{ fill: '#F5B82E', r: 4, strokeWidth: 0 }} connectNulls={false} name="AI Projection"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
            {[['Historical Value', '#3DD6F5', false], ['AI Projection (model)', '#F5B82E', true]].map(([label, color, dashed]) => (
              <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="22" height="6" viewBox="0 0 22 6">
                  <line x1="0" y1="3" x2="22" y2="3" stroke={color as string} strokeWidth="2" strokeDasharray={dashed ? '5 3' : undefined} strokeLinecap="round"/>
                </svg>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#8493AD' }}>{label as string}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tab: AI Prediction */}
      {tab === 'AI Prediction' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#F5B82E', marginBottom: 4 }}>AI MARKET PROJECTION</div>
            <SectionTitle>Value Trajectory</SectionTitle>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD', marginBottom: 4 }}>Current Value</div>
              <div style={{ fontFamily: 'Saira Condensed', fontSize: 36, fontWeight: 700, color: '#E8EEF8', letterSpacing: '-0.02em', marginBottom: 20 }}>{fmt(player.currentValue)}</div>

              {projections.map((p, i) => (
                <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(31,46,72,0.5)' }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8493AD', marginBottom: 2 }}>{p.note.toUpperCase()}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C4D0E4' }}>{p.label} Projection</div>
                  </div>
                  <div style={{ fontFamily: 'Saira Condensed', fontSize: 22, fontWeight: 700, color: '#F5B82E', letterSpacing: '-0.01em' }}>
                    {fmt(p.value)}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD' }}>Model Confidence</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#F5B82E' }}>{player.confidence}%</span>
                </div>
                <ConfidenceBar pct={player.confidence} />
              </div>
            </div>
          </Card>

          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: '#3DD6F5', marginBottom: 4 }}>EXPLAINABILITY</div>
            <SectionTitle>Why ScoutVest Recommends</SectionTitle>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {player.reasons.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '12px 14px', borderRadius: 8,
                  background: 'rgba(245,184,46,0.04)', border: '1px solid rgba(245,184,46,0.09)',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(245,184,46,0.1)', border: '1px solid rgba(245,184,46,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#F5B82E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C4D0E4', lineHeight: 1.5 }}>{r}</span>
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
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8493AD', marginBottom: 20 }}>RISK SCORE</div>
            <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 16px' }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="#17243B" strokeWidth="10"/>
                <circle cx="55" cy="55" r="46" fill="none"
                  stroke="#F5B82E" strokeWidth="10"
                  strokeDasharray={`${(player.riskScore / 100) * 289} 289`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Saira Condensed', fontSize: 26, fontWeight: 700, color: '#E8EEF8' }}>{player.riskScore}</span>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 10, color: '#8493AD' }}>/ 100</span>
              </div>
            </div>
            <RiskBadge risk={player.risk} />
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD', marginTop: 12, lineHeight: 1.5 }}>
              Lower score indicates a safer investment profile
            </div>
          </Card>
          <Card style={{ padding: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8493AD', marginBottom: 20 }}>RISK FACTORS</div>
            {[
              { factor: 'Age Profile',             level: 'Low'    as const },
              { factor: 'Injury History',           level: player.riskScore > 35 ? 'Medium' as const : 'Low' as const },
              { factor: 'Performance Volatility',   level: 'Low'    as const },
              { factor: 'League Transition',        level: player.riskScore > 30 ? 'Medium' as const : 'Low' as const },
              { factor: 'Contract Status',          level: 'Low'    as const },
              { factor: 'Model Uncertainty',        level: player.confidence > 80 ? 'Low' as const : 'Medium' as const },
            ].map(f => (
              <div key={f.factor} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(31,46,72,0.5)' }}>
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#C4D0E4' }}>{f.factor}</span>
                <RiskBadge risk={f.level} />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}
