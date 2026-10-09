import type { ReactNode, CSSProperties } from 'react'
import { TIERS } from './tiers'

// Broadcast-graphic corners: cut top-right on panels; top-right and bottom-left on buttons.

export type RiskLevel = 'Low' | 'Medium' | 'High'
export type InvestmentSignal = 'UNDERVALUED' | 'BREAKOUT' | 'STRONG BUY' | 'OVERVALUED' | 'MONITOR'

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { bg: string; color: string; border: string }> = {
    Low: { bg: 'rgba(61,220,151,0.1)', color: '#3DDC97', border: 'rgba(61,220,151,0.22)' },
    Medium: { bg: 'rgba(255,138,61,0.1)', color: '#FF8A3D', border: 'rgba(255,138,61,0.22)' },
    High: { bg: 'rgba(255,90,79,0.1)', color: '#FF5A4F', border: 'rgba(255,90,79,0.22)' },
  }
  const s = map[risk]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 8,
      background: s.bg, border: `1px solid ${s.border}`,
      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 600, color: s.color, }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
      {risk.toUpperCase()} RISK
    </span>
  )
}

export function InvestmentBadge({ signal }: { signal: InvestmentSignal }) {
  // Same colours as the card tiers, so a badge and its card always match.
  const accent = TIERS[signal].accent
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 8,
      background: `${accent}1f`, border: `1px solid ${accent}55`,
      fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, color: accent, }}>
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
                stroke={ri === 0 ? '#F5B82E' : '#2A2A2A'}
                strokeWidth={ri === 0 ? 1.4 : 1}
                strokeOpacity={ri === 0 ? 0.35 : 0.5}
              />
            )
          })}
        </g>
      ))}
      <circle cx="400" cy="400" r="90" fill="none" stroke="#2A2A2A" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

export function Card({ children, style, onClick }: { children: ReactNode; style?: CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{
      background: 'linear-gradient(180deg, #171717 0%, #111111 100%)', border: '1px solid #2A2A2A', borderRadius: 10,
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
          color: '#9A9A9A',
        }}>
          {label}
        </div>
        {icon && (
          <div style={{ width: 28, height: 28, borderRadius: 4, background: accent ? 'rgba(245,184,46,0.1)' : 'rgba(61,214,245,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{
        fontFamily: 'Saira Condensed', fontStyle: 'italic', fontSize: 44, fontWeight: 800, lineHeight: 1,
        color: accent ? '#F5B82E' : '#F2F2F2',
        letterSpacing: '0',
        marginBottom: 10,
      }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trend && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
            color: trend.up ? '#F5B82E' : '#FF5A4F',
          }}>
            <span>{trend.up ? '↑' : '↓'}</span>
            {trend.value}
          </span>
        )}
        {sub && (
          <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{sub}</span>
        )}
      </div>
    </Card>
  )
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'Saira Condensed', color: '#F2F2F2', margin: 0, lineHeight: 1.1 }}>{children}</h2>
      {sub && <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '5px 0 0' }}>{sub}</p>}
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
    primary:   { bg: '#F5B82E', color: '#000000', border: '#F5B82E', hoverBg: '#FFD66B' },
    secondary: { bg: '#171717', color: '#F2F2F2', border: '#2A2A2A', hoverBg: '#1F1F1F' },
    ghost:     { bg: 'transparent', color: '#9A9A9A', border: '#2A2A2A', hoverBg: 'rgba(255,255,255,0.04)' },
    danger:    { bg: 'rgba(255,90,79,0.1)', color: '#FF5A4F', border: 'rgba(255,90,79,0.25)', hoverBg: 'rgba(255,90,79,0.18)' },
  }
  const s = map[variant]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '7px 18px', borderRadius: 10,
        background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        fontFamily: 'Saira Condensed', fontSize: 15, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
        cursor: disabled ? 'default' : 'pointer',
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(42,42,42,0.7)' }}>
      <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>{label}</span>
      <span style={{
        fontFamily: mono ? 'JetBrains Mono' : 'IBM Plex Sans', fontSize: 13, fontWeight: 600,
        color: highlight ? '#F5B82E' : '#F2F2F2',
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
      display: 'inline-flex', padding: '2px 8px', borderRadius: 8,
      background: 'rgba(61,214,245,0.1)', border: '1px solid rgba(61,214,245,0.18)',
      fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#3DD6F5',
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
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#9A9A9A' }}>{from}</span>
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
        <path d="M0 5h24M19 1l5 4-5 4" stroke="#F5B82E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#F5B82E' }}>{to}</span>
    </div>
  )
}

export function ConfidenceBar({ pct, color = '#F5B82E' }: { pct: number; color?: string }) {
  return (
    <div style={{ position: 'relative', height: 6, background: 'rgba(42,42,42,0.8)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}99, ${color})`,
        borderRadius: 2,
        transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

export function Divider() {
  return <div style={{ height: 1, background: 'rgba(42,42,42,0.7)', margin: '0' }} />
}

/** "+12" / "-12": the sign belongs to the number, so a negative upside never shows as "+-12". */
export function signed(n: number, digits = 0): string {
  const v = n.toFixed(digits)
  return n > 0 ? `+${v}` : v
}
