import { useState } from 'react'
import { Card, RiskBadge, InvestmentBadge, Btn, Avatar, PositionTag, fmt, ConfidenceBar } from '../components/ui'
import { players } from '../data/mockData'
import type { Page } from '../App'

interface Props {
  onNavigate: (page: Page) => void
  onSelectPlayer: (id: number) => void
}

const positions = ['GK', 'CB', 'FB', 'DM', 'CM', 'AM', 'Winger', 'ST']

export default function Scouting({ onNavigate, onSelectPlayer }: Props) {
  const [ageMin, setAgeMin] = useState(16)
  const [ageMax, setAgeMax] = useState(30)
  const [selPositions, setSelPositions] = useState<string[]>([])
  const [maxValue, setMaxValue] = useState(50)
  const [minUpside, setMinUpside] = useState(0)
  const [selRisk, setSelRisk] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  const togglePos = (p: string) =>
    setSelPositions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  const toggleRisk = (r: string) =>
    setSelRisk(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const filtered = players.filter(p => {
    if (p.age < ageMin || p.age > ageMax) return false
    if (selPositions.length && !selPositions.includes(p.position)) return false
    if (p.currentValue > maxValue) return false
    if (p.upside < minUpside) return false
    if (selRisk.length && !selRisk.includes(p.risk)) return false
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) &&
        !p.club.toLowerCase().includes(query.toLowerCase()) &&
        !p.position.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const activeFilters = selPositions.length + selRisk.length + (minUpside > 0 ? 1 : 0) + (maxValue < 50 ? 1 : 0) + (ageMin > 16 || ageMax < 30 ? 1 : 0)

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, overflow: 'hidden' }}>

      {/* Filter Sidebar */}
      <div style={{
        width: 244, flexShrink: 0,
        borderRight: '1px solid #2A2E37',
        background: '#0D1520',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }} className="scrollbar-hide">

        {/* Filter header */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(38,51,66,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 600, color: '#E8E6DF' }}>Filters</div>
            {activeFilters > 0 && (
              <button onClick={() => { setSelPositions([]); setSelRisk([]); setAgeMin(16); setAgeMax(30); setMaxValue(50); setMinUpside(0) }}
                style={{ background: 'rgba(240,93,94,0.1)', border: '1px solid rgba(240,93,94,0.2)', borderRadius: 10, padding: '2px 8px', cursor: 'pointer', fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, color: '#C1554A', letterSpacing: '0.06em' }}>
                CLEAR ALL
              </button>
            )}
          </div>
          {activeFilters > 0 && (
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#E8A33D' }}>{activeFilters} filter{activeFilters !== 1 ? 's' : ''} active</div>
          )}
        </div>

        <div style={{ padding: '16px 20px', flex: 1 }}>

          <FilterSection label="Age Range">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="number" value={ageMin} onChange={e => setAgeMin(+e.target.value)} min={16} max={40}
                style={inputStyle} />
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#3a4d62' }}>—</span>
              <input type="number" value={ageMax} onChange={e => setAgeMax(+e.target.value)} min={16} max={40}
                style={inputStyle} />
            </div>
          </FilterSection>

          <FilterSection label="Position">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {positions.map(p => {
                const sel = selPositions.includes(p)
                return (
                  <button key={p} onClick={() => togglePos(p)} style={{
                    padding: '3px 9px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                    background: sel ? 'rgba(78,161,255,0.12)' : 'transparent',
                    color: sel ? '#5B8DBE' : '#9B9891',
                    border: `1px solid ${sel ? 'rgba(78,161,255,0.3)' : '#2A2E37'}`,
                    transition: 'all 0.12s',
                  }}>
                    {p}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection label={`Current Value — up to ${fmt(maxValue)}`}>
            <input type="range" min={0} max={100} value={maxValue} onChange={e => setMaxValue(+e.target.value)}
              style={{ width: '100%', accentColor: '#E8A33D', height: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#3a4d62' }}>€0</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#3a4d62' }}>€100M</span>
            </div>
          </FilterSection>

          <FilterSection label={`Min Upside — ${minUpside > 0 ? `+${minUpside}%` : 'Any'}`}>
            <input type="range" min={0} max={300} step={10} value={minUpside} onChange={e => setMinUpside(+e.target.value)}
              style={{ width: '100%', accentColor: '#E8A33D', height: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#3a4d62' }}>Any</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#3a4d62' }}>+300%</span>
            </div>
          </FilterSection>

          <FilterSection label="Risk Tolerance">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Low', 'Medium', 'High'].map(r => {
                const riskColor = { Low: '#E8A33D', Medium: '#D99A3D', High: '#C1554A' }[r]!
                const sel = selRisk.includes(r)
                return (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '5px 8px', borderRadius: 12, background: sel ? `${riskColor}0d` : 'transparent', border: `1px solid ${sel ? `${riskColor}20` : 'transparent'}` }}>
                    <div onClick={() => toggleRisk(r)} style={{
                      width: 16, height: 16, borderRadius: 10,
                      border: `1.5px solid ${sel ? riskColor : '#2A2E37'}`,
                      background: sel ? `${riskColor}22` : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}>
                      {sel && <div style={{ width: 8, height: 8, borderRadius: 8, background: riskColor }} />}
                    </div>
                    <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: sel ? '#E8E6DF' : '#C8D3DF' }}>{r}</span>
                    <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: riskColor, display: 'inline-block' }} />
                  </label>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection label="Investment Signal">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {['UNDERVALUED', 'BREAKOUT', 'STRONG BUY'].map(s => (
                <button key={s} style={{
                  padding: '3px 8px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700,
                  background: 'transparent', color: '#9B9891', border: '1px solid #2A2E37',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

        </div>
      </div>

      {/* Main Results Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Results Header */}
        <div style={{ padding: '24px 28px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: '#E8E6DF', margin: 0, letterSpacing: '-0.02em' }}>Find Your Targets</h1>
              <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '6px 0 0' }}>
                Showing <strong style={{ color: '#E8E6DF' }}>{filtered.length}</strong> players matching your recruitment criteria
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {/* View toggle */}
              <div style={{ display: 'flex', background: '#14171D', border: '1px solid #2A2E37', borderRadius: 15, padding: 3, gap: 2 }}>
                {([['cards', 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'], ['list', 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01']] as [string, string][]).map(([mode, path]) => (
                  <button key={mode} onClick={() => setViewMode(mode as 'cards' | 'list')} style={{
                    padding: '5px 9px', borderRadius: 12, cursor: 'pointer', border: 'none',
                    background: viewMode === mode ? '#1a2a3a' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={viewMode === mode ? '#E8E6DF' : '#9B9891'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={path}/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9B9891" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search players, clubs, positions..."
              style={{ width: '100%', height: 40, paddingLeft: 38, paddingRight: 14, background: '#14171D', border: '1px solid #2A2E37', borderRadius: 16, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#E8E6DF', outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => (e.target.style.borderColor = '#E8A33D60')}
              onBlur={e => (e.target.style.borderColor = '#2A2E37')}
            />
          </div>
        </div>

        {/* Scrollable Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px 32px' }} className="scrollbar-hide">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 16, color: '#9B9891', marginBottom: 8 }}>No players match your current filters</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#3a4d62' }}>Try adjusting your criteria above</div>
            </div>
          ) : (
            <div style={{
              display: viewMode === 'cards' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'cards' ? 'repeat(auto-fill, minmax(300px, 1fr))' : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: 14,
            }}>
              {filtered.map(p => (
                viewMode === 'cards'
                  ? <InvestmentCard key={p.id} player={p} onView={() => { onSelectPlayer(p.id); onNavigate('player-profile') }} />
                  : <InvestmentRow key={p.id} player={p} onView={() => { onSelectPlayer(p.id); onNavigate('player-profile') }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// The core investment-decision card per spec §31 & §37
function InvestmentCard({ player: p, onView }: { player: typeof players[0]; onView: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#191D24',
        border: `1px solid ${hovered ? 'rgba(232,163,61,0.25)' : '#2A2E37'}`,
        borderRadius: 20,
        overflow: 'hidden',
        transition: 'border-color 0.18s, transform 0.18s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: 'pointer',
      }}
      onClick={onView}
    >
      {/* Investment signal header strip */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(0,0,0,0.2)',
        borderBottom: '1px solid rgba(38,51,66,0.5)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <InvestmentBadge signal={p.signal} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RiskBadge risk={p.risk} />
        </div>
      </div>

      {/* Player identity */}
      <div style={{ padding: '16px 18px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar name={p.name} size={46} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 700, color: '#E8E6DF', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.name}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <PositionTag pos={p.position} />
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>Age {p.age}</span>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#3a4d62' }}>·</span>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{p.club}</span>
          </div>
        </div>
      </div>

      {/* The Investment Case — leads with upside (spec §37) */}
      <div style={{ padding: '4px 18px 14px' }}>
        {/* Value flow: current → predicted */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid rgba(38,51,66,0.5)', borderBottom: '1px solid rgba(38,51,66,0.5)', marginBottom: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9B9891', marginBottom: 4 }}>CURRENT</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: '#C8D3DF' }}>{fmt(p.currentValue)}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 8px' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: '#E8A33D', lineHeight: 1, letterSpacing: '-0.02em' }}>
              +{p.upside}%
            </div>
            <svg width="52" height="10" viewBox="0 0 52 10" fill="none" style={{ marginTop: 4 }}>
              <path d="M0 5h44M38 1l6 4-6 4" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#E8A33D', marginBottom: 4 }}>PREDICTED</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: '#4FA97C' }}>{fmt(p.predictedValue)}</div>
          </div>
        </div>

        {/* Confidence */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>Model confidence</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, color: '#E8A33D' }}>{p.confidence}%</span>
          </div>
          <ConfidenceBar pct={p.confidence} />
        </div>

        {/* Top reason — the "WHY" per spec */}
        <div style={{
          padding: '9px 11px',
          background: 'rgba(232,163,61,0.04)',
          border: '1px solid rgba(232,163,61,0.1)',
          borderRadius: 15,
          marginBottom: 14,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#E8A33D', marginBottom: 4 }}>WHY SCOUTVEST RECOMMENDS</div>
          <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#C8D3DF', lineHeight: 1.5 }}>
            {p.reasons[0]}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <Btn variant="primary" style={{ flex: 1, fontSize: 12, padding: '7px 0' }} onClick={onView}>
            View Profile
          </Btn>
          <Btn variant="secondary" style={{ flex: 1, fontSize: 12, padding: '7px 0' }}>
            + Watchlist
          </Btn>
        </div>
      </div>
    </div>
  )
}

function InvestmentRow({ player: p, onView }: { player: typeof players[0]; onView: () => void }) {
  return (
    <div
      onClick={onView}
      style={{
        background: '#191D24', border: '1px solid #2A2E37', borderRadius: 18,
        padding: '14px 20px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,163,61,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#2A2E37')}
    >
      <Avatar name={p.name} size={38} />
      <div style={{ flex: '0 0 180px' }}>
        <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#E8E6DF', marginBottom: 2 }}>{p.name}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <PositionTag pos={p.position} />
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>Age {p.age} · {p.club}</span>
        </div>
      </div>
      <InvestmentBadge signal={p.signal} />
      <div style={{ flex: '0 0 90px', textAlign: 'right' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#9B9891', marginBottom: 2 }}>CURRENT</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#C8D3DF' }}>{fmt(p.currentValue)}</div>
      </div>
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
        <path d="M0 5h22M17 1l5 4-5 4" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ flex: '0 0 90px' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#E8A33D', marginBottom: 2 }}>PREDICTED</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#4FA97C' }}>{fmt(p.predictedValue)}</div>
      </div>
      <div style={{ flex: '0 0 70px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: '#4FA97C', letterSpacing: '-0.01em' }}>+{p.upside}%</div>
      </div>
      <RiskBadge risk={p.risk} />
      <div style={{ marginLeft: 'auto' }} onClick={e => e.stopPropagation()}>
        <Btn variant="ghost" style={{ padding: '5px 12px', fontSize: 12 }} onClick={onView}>View</Btn>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '6px 9px',
  background: '#14171D', border: '1px solid #2A2E37', borderRadius: 12,
  fontFamily: 'JetBrains Mono', fontSize: 12, color: '#E8E6DF',
} as const

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, color: '#3a4d62', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  )
}
