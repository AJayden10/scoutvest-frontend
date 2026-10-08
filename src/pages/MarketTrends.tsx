import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, SectionTitle, KpiCard } from '../components/ui'

const positionValues = [
  { position: 'ST', value: 28.4 },
  { position: 'Winger', value: 24.1 },
  { position: 'AM', value: 21.7 },
  { position: 'CM', value: 18.2 },
  { position: 'CB', value: 15.8 },
  { position: 'FB', value: 13.4 },
  { position: 'DM', value: 12.1 },
  { position: 'GK', value: 10.3 },
]

const marketGrowth = [
  { month: 'Jan 25', value: 16.2 },
  { month: 'Feb 25', value: 16.8 },
  { month: 'Mar 25', value: 17.1 },
  { month: 'Apr 25', value: 17.4 },
  { month: 'May 25', value: 17.9 },
  { month: 'Jun 25', value: 18.1 },
  { month: 'Jul 25', value: 18.4 },
  { month: 'Aug 25', value: 18.9 },
]

export default function MarketTrends() {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#E8EEF8', margin: 0 }}>Market Trends</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#8493AD', margin: '6px 0 0' }}>Broader transfer market intelligence and valuation trends.</p>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <KpiCard label="Average Player Value" value="€18.4M" sub="+4.2% this quarter" />
        <KpiCard label="U23 Market Growth" value="+12.8%" sub="Year on year" accent />
        <KpiCard label="Most Valuable Position" value="Wingers" sub="Avg €24.1M" />
        <KpiCard label="Fastest Growing League" value="Bundesliga" sub="+18.3% avg growth" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Average Value by Position</SectionTitle>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD', margin: '4px 0 20px' }}>Which positions command the highest transfer fees?</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={positionValues} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#17243B" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#8493AD' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
              <YAxis type="category" dataKey="position" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#8493AD' }} axisLine={false} tickLine={false} width={44} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Avg Value']} contentStyle={{ background: '#14213A', border: '1px solid #1F2E48', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
              <Bar dataKey="value" fill="#C8F23C" radius={[0, 4, 4, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: '24px' }}>
          <SectionTitle>Average Market Value (2025)</SectionTitle>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#8493AD', margin: '4px 0 20px' }}>Monthly trend across tracked players</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={marketGrowth} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8F23C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C8F23C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#17243B" />
              <XAxis dataKey="month" tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#8493AD' }} axisLine={{ stroke: '#1F2E48' }} tickLine={false} />
              <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#8493AD' }} axisLine={{ stroke: '#1F2E48' }} tickLine={false} tickFormatter={v => `€${v}M`} domain={[14, 22]} />
              <Tooltip formatter={(v: any) => [`€${v}M`, 'Avg Value']} contentStyle={{ background: '#14213A', border: '1px solid #1F2E48', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#C8F23C" strokeWidth={2.5} dot={{ fill: '#C8F23C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* League table */}
      <Card style={{ padding: '24px' }}>
        <SectionTitle>League Value Intelligence</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { league: 'Premier League', avg: '€32.4M', growth: '+8.2%', players: 4821 },
            { league: 'La Liga', avg: '€24.1M', growth: '+11.4%', players: 3204 },
            { league: 'Bundesliga', avg: '€21.7M', growth: '+18.3%', players: 2874 },
            { league: 'Serie A', avg: '€18.9M', growth: '+6.8%', players: 3102 },
            { league: 'Ligue 1', avg: '€14.2M', growth: '+14.7%', players: 2513 },
          ].map(l => (
            <div key={l.league} style={{ background: '#0B1220', borderRadius: 3, padding: '16px' }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#E8EEF8', marginBottom: 10 }}>{l.league}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, color: '#E8EEF8', marginBottom: 4 }}>{l.avg}</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 600, color: '#C8F23C', marginBottom: 4 }}>{l.growth}</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#8493AD' }}>{l.players.toLocaleString()} players</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
