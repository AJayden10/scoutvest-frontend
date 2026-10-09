import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useEffect, useState } from 'react'
import { Card, SectionTitle, KpiCard } from '../components/ui'
import { useData } from '../data/DataContext'
import { api, type MarketTrends as Trends } from '../api/client'

const DEMO_POSITIONS = [
  { position: 'ST', value: 28.4 },
  { position: 'Winger', value: 24.1 },
  { position: 'AM', value: 21.7 },
  { position: 'CM', value: 18.2 },
  { position: 'CB', value: 15.8 },
  { position: 'FB', value: 13.4 },
  { position: 'DM', value: 12.1 },
  { position: 'GK', value: 10.3 },
]

const DEMO_GROWTH = [
  { month: 'Jan 25', value: 16.2 },
  { month: 'Feb 25', value: 16.8 },
  { month: 'Mar 25', value: 17.1 },
  { month: 'Apr 25', value: 17.4 },
  { month: 'May 25', value: 17.9 },
  { month: 'Jun 25', value: 18.1 },
  { month: 'Jul 25', value: 18.4 },
  { month: 'Aug 25', value: 18.9 },
]

const DEMO_LEAGUES = [
  { league: 'Premier League', value: 32.4, players: 4821 }, { league: 'La Liga', value: 24.1, players: 3204 },
  { league: 'Bundesliga', value: 21.7, players: 2874 }, { league: 'Serie A', value: 18.9, players: 3102 },
  { league: 'Ligue 1', value: 14.2, players: 2513 },
]

export default function MarketTrends() {
  const { source } = useData()
  const [live, setLive] = useState<Trends | null>(null)
  useEffect(() => {
    if (source !== 'live') return
    api.get<Trends>('/market-trends/').then(setLive).catch(() => setLive(null))
  }, [source])

  const isLive = source === 'live' && live !== null
  const positionValues = isLive ? live.averageValueByPosition.map(p => ({ position: p.position, value: p.value })) : DEMO_POSITIONS
  const marketGrowth = isLive ? live.averageValueByMonth.slice(-36) : DEMO_GROWTH
  const leagues = isLive ? live.averageValueByLeague.slice(0, 10) : DEMO_LEAGUES
  const top = isLive ? live.mostValuablePosition : { position: 'Wingers', value: 24.1, players: 0 }
  const topLeague = leagues[0]
  const totalValued = leagues.reduce((s, l) => s + l.players, 0)

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Market Trends</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>Broader transfer market intelligence and valuation trends.</p>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <KpiCard label="Average Player Value" value={isLive ? `€${live.averagePlayerValue ?? 0}M` : '€18.4M'} sub={isLive ? 'Across valued players' : 'Sample data'} />
        <KpiCard label="Players valued" value={isLive ? totalValued.toLocaleString() : '—'} sub={isLive ? `${leagues.length} leagues` : 'Sample data'} accent />
        <KpiCard label="Most Valuable Position" value={top?.position ?? '—'} sub={top ? `Avg €${top.value}M` : ''} />
        <KpiCard label="Most Valuable League" value={topLeague?.league ?? '—'} sub={topLeague ? `Avg €${topLeague.value}M` : ''} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Average Value by Position</SectionTitle>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '4px 0 20px' }}>Which positions command the highest transfer fees?</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={positionValues} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
              <YAxis type="category" dataKey="position" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9A9A9A' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Avg Value']} contentStyle={{ background: '#171717', border: '1px solid #2A2A2A', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
              <Bar dataKey="value" fill="#F5B82E" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: '24px' }}>
          <SectionTitle>Average Market Value Over Time</SectionTitle>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '4px 0 20px' }}>Average of all valuations recorded each month</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={marketGrowth} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B82E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F5B82E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
              <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }} axisLine={{ stroke: '#2A2A2A' }} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }} axisLine={{ stroke: '#2A2A2A' }} tickLine={false} tickFormatter={v => `€${v}M`} domain={isLive ? ['auto', 'auto'] : [14, 22]} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Avg Value']} contentStyle={{ background: '#171717', border: '1px solid #2A2A2A', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#F5B82E" strokeWidth={2.5} dot={{ fill: '#F5B82E', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* League table */}
      <Card style={{ padding: '24px' }}>
        <SectionTitle>League Value Intelligence</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginTop: 20 }}>
          {leagues.map(l => (
            <div key={l.league} style={{ background: '#0A0A0A', borderRadius: 8, padding: '16px' }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#F2F2F2', marginBottom: 10 }}>{l.league}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: '#F2F2F2', marginBottom: 4 }}>€{l.value}M</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#F5B82E', marginBottom: 4 }}>average value</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A' }}>{l.players.toLocaleString()} players</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
