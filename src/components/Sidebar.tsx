import type { Page } from '../App'
import logoEmblem from '../assets/logo-emblem.png'

const navItems: { id: Page; label: string; icon: string; group: 'main' | 'analytics' | 'system' }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', group: 'main' },
  { id: 'players', label: 'Players', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', group: 'main' },
  { id: 'scouting', label: 'Scouting', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', group: 'main' },
  { id: 'compare', label: 'Compare', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', group: 'main' },
  { id: 'simulator', label: 'Simulator', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', group: 'main' },
  { id: 'watchlist', label: 'Watchlist', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', group: 'main' },
  { id: 'market-trends', label: 'Market Trends', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', group: 'analytics' },
  { id: 'model-performance', label: 'Model Performance', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18', group: 'analytics' },
]

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <header style={{
      height: 64, minHeight: 64, background: '#050505', borderBottom: '1px solid #2A2A2A', boxShadow: 'inset 0 -2px 0 rgba(245,184,46,0.35)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <img src={logoEmblem} alt="Free Agent" width={42} height={42}
          style={{ borderRadius: '50%', flexShrink: 0, boxShadow: '0 0 0 1px rgba(245,184,46,0.5)' }} />
        <div>
          <div style={{ fontFamily: 'Saira Condensed', fontStyle: 'italic', fontWeight: 800, fontSize: 24, color: '#F2F2F2', letterSpacing: '0.03em', lineHeight: 1 }}>FREE AGENT</div>
          <div style={{ fontFamily: 'Saira Condensed', fontSize: 12, color: '#F5B82E', fontWeight: 600, letterSpacing: '0.12em' }}>INTELLIGENT SCOUTING</div>
        </div>
      </div>

      <div style={{ width: 1, height: 28, background: '#2A2A2A', flexShrink: 0 }} />

      {/* Horizontal nav */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', minWidth: 0 }} className="scrollbar-hide">
        {navItems.map((item, i) => {
          const active = currentPage === item.id
          const prevGroup = i > 0 ? navItems[i - 1].group : item.group
          const showDivider = item.group !== prevGroup
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {showDivider && <div style={{ width: 1, height: 20, background: '#2A2A2A', margin: '0 4px' }} />}
              <button
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '9px 12px', borderRadius: 10,
                  background: active ? '#F5B82E' : 'transparent',
                  border: 'none',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,184,46,0.12)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                                <span style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontFamily: 'Saira Condensed', fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: active ? '#000000' : '#9A9A9A',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon}/>
                  </svg>
                  {item.label}
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5B82E', boxShadow: '0 0 6px #F5B82E' }} />
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>Model v2.1 active</span>
      </div>
    </header>
  )
}
