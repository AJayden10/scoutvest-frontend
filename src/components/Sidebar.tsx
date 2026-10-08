import type { Page } from '../App'

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
      height: 64, minHeight: 64, background: '#080E19', borderBottom: '1px solid #1F2E48', boxShadow: 'inset 0 -2px 0 rgba(200,242,60,0.35)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 20, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 4,
          background: 'linear-gradient(135deg, #1B2C4A 0%, #0C1626 100%)',
          border: '1px solid #C8F23C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4" width="14" height="12" rx="1" stroke="#C8F23C" strokeWidth="1.2" fill="none" opacity="0.4"/>
            <line x1="10" y1="4" x2="10" y2="16" stroke="#C8F23C" strokeWidth="0.8" opacity="0.4"/>
            <circle cx="10" cy="10" r="2.5" stroke="#C8F23C" strokeWidth="0.8" fill="none" opacity="0.4"/>
            <polyline points="4,14 8,10 11,12 16,6" stroke="#C8F23C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <polyline points="13,6 16,6 16,9" stroke="#C8F23C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'Saira Condensed', fontStyle: 'italic', fontWeight: 800, fontSize: 24, color: '#E8EEF8', letterSpacing: '0.03em', lineHeight: 1 }}>SCOUTVEST</div>
          <div style={{ fontFamily: 'Saira Condensed', fontSize: 12, color: '#C8F23C', fontWeight: 600, letterSpacing: '0.12em' }}>TRANSFER INTELLIGENCE</div>
        </div>
      </div>

      <div style={{ width: 1, height: 28, background: '#1F2E48', flexShrink: 0 }} />

      {/* Horizontal nav */}
      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', minWidth: 0 }} className="scrollbar-hide">
        {navItems.map((item, i) => {
          const active = currentPage === item.id
          const prevGroup = i > 0 ? navItems[i - 1].group : item.group
          const showDivider = item.group !== prevGroup
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {showDivider && <div style={{ width: 1, height: 20, background: '#1F2E48', margin: '0 4px' }} />}
              <button
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '9px 12px', borderRadius: 0,
                  background: active ? '#C8F23C' : 'transparent',
                  border: 'none', transform: 'skewX(-14deg)',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,242,60,0.12)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
              >
                {/* counter-skew keeps the label upright inside the slanted tab */}
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 7, transform: 'skewX(14deg)',
                  fontFamily: 'Saira Condensed', fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: active ? '#060B14' : '#8493AD',
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
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8F23C', boxShadow: '0 0 6px #C8F23C' }} />
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#8493AD' }}>Model v2.1 active</span>
      </div>
    </header>
  )
}
