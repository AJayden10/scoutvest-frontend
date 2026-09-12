import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Scouting from './pages/Scouting'
import Compare from './pages/Compare'
import Simulator from './pages/Simulator'
import Watchlist from './pages/Watchlist'
import MarketTrends from './pages/MarketTrends'
import ModelPerformance from './pages/ModelPerformance'
import PlayerProfile from './pages/PlayerProfile'

export type Page =
  | 'dashboard' | 'players' | 'player-profile'
  | 'scouting' | 'compare' | 'simulator'
  | 'watchlist' | 'market-trends' | 'model-performance'

const ASSISTANT_RESPONSES = [
  {
    query: 'u23 midfielders under €15M low risk',
    answer: `I found 18 players matching your criteria.\n\nTop recommendations:\n\n1. Lucas Fernández\n   €8.4M → €24.7M\n   +194% projected upside · Low risk\n\n2. Noa van den Berg\n   €9.0M → €22.4M\n   +149% projected upside · Low risk\n\n3. Kai Fischer\n   €6.2M → €18.9M\n   +205% projected upside · Medium risk`,
  },
  {
    query: '',
    answer: `Hi, I'm ScoutVest AI. Ask me anything — for example:\n\n• "Find U23 midfielders under €15M with high upside"\n• "Who are the best value wingers in Ligue 1?"\n• "Which defenders have the lowest risk score?"`,
  },
]

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(1)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: ASSISTANT_RESPONSES[1].answer }
  ])

  const navigate = (p: Page) => setPage(p)
  const selectPlayer = (id: number) => { setSelectedPlayerId(id); setPage('player-profile') }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTimeout(() => {
      const response = ASSISTANT_RESPONSES[0].answer
      setChatMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 800)
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={navigate} onSelectPlayer={selectPlayer} />
      case 'players': return <Players onNavigate={navigate} onSelectPlayer={selectPlayer} />
      case 'player-profile': return <PlayerProfile playerId={selectedPlayerId} onNavigate={navigate} />
      case 'scouting': return <Scouting onNavigate={navigate} onSelectPlayer={selectPlayer} />
      case 'compare': return <Compare onNavigate={navigate} onSelectPlayer={selectPlayer} />
      case 'simulator': return <Simulator />
      case 'watchlist': return <Watchlist onNavigate={navigate} onSelectPlayer={selectPlayer} />
      case 'market-trends': return <MarketTrends />
      case 'model-performance': return <ModelPerformance />
      default: return <Dashboard onNavigate={navigate} onSelectPlayer={selectPlayer} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#0A0C10', fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      <Sidebar currentPage={page} onNavigate={navigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <TopBar onNavigate={navigate} onSelectPlayer={selectPlayer} />

        <main style={{ flex: 1, overflowY: 'auto', background: '#0A0C10' }} className="scrollbar-hide">
          {page === 'scouting' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {renderPage()}
            </div>
          ) : renderPage()}
        </main>
      </div>

      {/* AI Assistant Button */}
      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 50,
          height: 44, padding: '0 18px 0 16px', borderRadius: 22,
          background: assistantOpen ? '#2ba870' : '#E8A33D',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'all 0.2s',
          fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#0A0C10',
        }}
      >
        {assistantOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        )}
        {assistantOpen ? 'Close' : 'Ask ScoutVest'}
      </button>

      {/* AI Assistant Panel */}
      {assistantOpen && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 49,
          width: 360, height: 480, background: '#191D24',
          border: '1px solid #2A2E37', borderRadius: 14,
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2A2E37', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,163,61,0.12)', border: '1px solid rgba(232,163,61,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#E8E6DF' }}>Ask ScoutVest</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#E8A33D' }}>AI SCOUTING ASSISTANT</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }} className="scrollbar-hide">
            {chatMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: m.role === 'user' ? 'rgba(232,163,61,0.12)' : '#14171D',
                  border: `1px solid ${m.role === 'user' ? 'rgba(232,163,61,0.2)' : '#2A2E37'}`,
                  fontFamily: 'IBM Plex Sans', fontSize: 12.5, color: '#C8D3DF', lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 16px', borderTop: '1px solid #2A2E37' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Ask about players, targets..."
                style={{ flex: 1, padding: '8px 12px', background: '#14171D', border: '1px solid #2A2E37', borderRadius: 8, fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#E8E6DF', outline: 'none' }}
              />
              <button onClick={sendChat} style={{
                width: 34, height: 34, borderRadius: 8, background: '#E8A33D', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A0C10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {["U23 midfielders <€15M", "Low risk wingers", "Expiring contracts"].map(hint => (
                <button key={hint} onClick={() => { setChatInput(hint); }} style={{
                  padding: '3px 8px', borderRadius: 4, background: 'transparent',
                  border: '1px solid #2A2E37', cursor: 'pointer',
                  fontFamily: 'IBM Plex Sans', fontSize: 10, color: '#9B9891',
                }}>
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
