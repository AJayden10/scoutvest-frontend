import type { ReactNode, CSSProperties } from 'react'

export type RiskLevel = 'Low' | 'Medium' | 'High'
export type InvestmentSignal = 'UNDERVALUED' | 'BREAKOUT' | 'STRONG BUY' | 'OVERVALUED' | 'MONITOR'

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { bg: string; color: string; border: string }> = {
    Low: { bg: 'rgba(232,163,61,0.1)', color: '#E8A33D', border: 'rgba(232,163,61,0.22)' },
    Medium: { bg: 'rgba(245,185,66,0.1)', color: '#D99A3D', border: 'rgba(245,185,66,0.22)' },
    High: { bg: 'rgba(240,93,94,0.1)', color: '#C1554A', border: 'rgba(240,93,94,0.22)' },
  }
  const s = map[risk]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 10,
      background: s.bg, border: `1px solid ${s.border}`,
      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, color: s.color, }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
      {risk.toUpperCase()} RISK
    </span>
  )
}

export function InvestmentBadge({ signal }: { signal: InvestmentSignal }) {
  const map: Record<InvestmentSignal, { bg: string; color: string; border: string }> = {
    'UNDERVALUED':  { bg: 'rgba(232,163,61,0.1)',  color: '#4FA97C', border: 'rgba(232,163,61,0.22)' },
    'BREAKOUT':     { bg: 'rgba(78,161,255,0.1)',   color: '#5B8DBE', border: 'rgba(78,161,255,0.22)' },
    'STRONG BUY':   { bg: 'rgba(232,163,61,0.15)',  color: '#4FA97C', border: 'rgba(232,163,61,0.3)' },
    'OVERVALUED':   { bg: 'rgba(240,93,94,0.1)',    color: '#C1554A', border: 'rgba(240,93,94,0.22)' },
    'MONITOR':      { bg: 'rgba(245,185,66,0.1)',   color: '#D99A3D', border: 'rgba(245,185,66,0.22)' },
  }
  const s = map[signal]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 10,
      background: s.bg, border: `1px solid ${s.border}`,
      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: s.color, }}>
      {signal}
    </span>
  )
}

export function StadiumPattern() {
  // Original abstract pattern inspired by a stadium roof's radiating panel
  // structure — not a reproduction of any photograph.
  const rings = [420, 340, 260, 180]
  const segments = 24
  return (
    <svg
      viewBox="0 0 800 800"
      style={{
        position: 'absolute', top: -180, right: -220, width: 640, height: 640,
        pointerEvents: 'none', opacity: 0.5, zIndex: 0,
      }}
    >
      {rings.map((r, ri) => (
        <g key={r}>
          {Array.from({ length: segments }).map((_, i) => {
            const a0 = (i / segments) * Math.PI * 2
            const a1 = ((i + 0.72) / segments) * Math.PI * 2
            const cx = 400, cy = 400
            const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0)
            const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
            return (
              <path
                key={i}
                d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`}
                fill="none"
                stroke={ri === 0 ? '#E8A33D' : '#2A2E37'}
                strokeWidth={ri === 0 ? 1.4 : 1}
                strokeOpacity={ri === 0 ? 0.35 : 0.5}
              />
            )
          })}
        </g>
      ))}
      <circle cx="400" cy="400" r="90" fill="none" stroke="#2A2E37" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

export function Card({ children, style, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      background: '#191D24', border: '1px solid #2A2E37', borderRadius: 18,
      cursor: onClick ? 'pointer' : undefined,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function KpiCard({
  label, value, sub, accent, trend, icon
}: {
  label: string; value: string; sub?: string; accent?: boolean
  trend?: { value: string; up: boolean }
  icon?: ReactNode
}) {
  return (
    <Card style={{ padding: '22px 24px', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 500,
          color: '#9B9891',
        }}>
          {label}
        </div>
        {icon && (
          <div style={{ width: 28, height: 28, borderRadius: 15, background: accent ? 'rgba(232,163,61,0.1)' : 'rgba(78,161,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{
        fontFamily: 'Space Grotesk', fontSize: 34, fontWeight: 700, lineHeight: 1,
        color: accent ? '#E8A33D' : '#E8E6DF',
        letterSpacing: '-0.02em',
        marginBottom: 10,
      }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trend && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
            color: trend.up ? '#E8A33D' : '#C1554A',
          }}>
            <span>{trend.up ? '↑' : '↓'}</span>
            {trend.value}
          </span>
        )}
        {sub && (
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{sub}</span>
        )}
      </div>
    </Card>
  )
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'IBM Plex Sans', fontSize: 20, fontWeight: 600, color: '#E8E6DF', margin: 0, lineHeight: 1.2 }}>{children}</h2>
      {sub && <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891', margin: '5px 0 0' }}>{sub}</p>}
    </div>
  )
}

export function Btn({
  children, variant = 'primary', onClick, style, disabled
}: {
  children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  onClick?: () => void; style?: CSSProperties; disabled?: boolean
}) {
  const map = {
    primary:   { bg: '#E8A33D', color: '#0A0C10', border: '#E8A33D', hoverBg: '#35C788' },
    secondary: { bg: '#1a2a3a', color: '#E8E6DF', border: '#2A2E37', hoverBg: '#1f3347' },
    ghost:     { bg: 'transparent', color: '#9B9891', border: '#2A2E37', hoverBg: 'rgba(255,255,255,0.04)' },
    danger:    { bg: 'rgba(240,93,94,0.1)', color: '#C1554A', border: 'rgba(240,93,94,0.25)', hoverBg: 'rgba(240,93,94,0.18)' },
  }
  const s = map[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '7px 15px', borderRadius: 15,
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = s.hoverBg }}
      onMouseLeave={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = s.bg }}
    >
      {children}
    </button>
  )
}

export function StatRow({ label, value, mono, highlight }: { label: string; value: string | number; mono?: boolean; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(38,51,66,0.7)' }}>
      <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>{label}</span>
      <span style={{
        fontFamily: mono ? 'JetBrains Mono' : 'IBM Plex Sans', fontSize: 13, fontWeight: 600,
        color: highlight ? '#E8A33D' : '#E8E6DF',
      }}>
        {value}
      </span>
    </div>
  )
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const hue = ((name.charCodeAt(0) * 37) + (name.charCodeAt(1) || 0) * 13) % 360
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 30%, 20%)`,
      border: `1.5px solid hsl(${hue}, 30%, 30%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'IBM Plex Sans', fontWeight: 700, fontSize: Math.round(size * 0.34),
      color: `hsl(${hue}, 55%, 68%)`,
      flexShrink: 0, userSelect: 'none',
    }}>
      {initials}
    </div>
  )
}

export function PositionTag({ pos }: { pos: string }) {
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: 10,
      background: 'rgba(78,161,255,0.1)', border: '1px solid rgba(78,161,255,0.18)',
      fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#5B8DBE',
      letterSpacing: '0.04em',
    }}>
      {pos}
    </span>
  )
}

export function fmt(val: number) {
  if (val >= 1000) return `€${(val / 1000).toFixed(1)}B`
  if (val >= 1) return `€${val.toFixed(1)}M`
  return `€${(val * 1000).toFixed(0)}K`
}

export function ValueArrow({ from, to }: { from: string; to: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#9B9891' }}>{from}</span>
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
        <path d="M0 5h24M19 1l5 4-5 4" stroke="#E8A33D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#E8A33D' }}>{to}</span>
    </div>
  )
}

export function ConfidenceBar({ pct, color = '#E8A33D' }: { pct: number; color?: string }) {
  return (
    <div style={{ position: 'relative', height: 6, background: 'rgba(38,51,66,0.8)', borderRadius: 9, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}99, ${color})`,
        borderRadius: 9,
        transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

export function Divider() {
  return <div style={{ height: 1, background: 'rgba(38,51,66,0.7)', margin: '0' }} />
}
