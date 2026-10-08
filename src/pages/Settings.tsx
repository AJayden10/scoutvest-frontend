import { Card, SectionTitle, Btn, StatRow } from '../components/ui'

export default function Settings() {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Settings</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>Manage your account, data sources and preferences.</p>
      </div>

      <Card style={{ padding: '24px' }}>
        <SectionTitle>Account</SectionTitle>
        <div style={{ marginTop: 16 }}>
          <StatRow label="Name" value="Alex Owen" />
          <StatRow label="Role" value="Sporting Director" />
          <StatRow label="Organisation" value="FC Example" />
          <StatRow label="Plan" value="Enterprise" />
        </div>
      </Card>

      <Card style={{ padding: '24px' }}>
        <SectionTitle>Data Sources</SectionTitle>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { source: 'StatsBomb', status: 'Connected', color: '#F5B82E' },
            { source: 'Transfermarkt', status: 'Connected', color: '#F5B82E' },
            { source: 'Wyscout', status: 'Connected', color: '#F5B82E' },
            { source: 'FBREF', status: 'Connected', color: '#F5B82E' },
            { source: 'Opta', status: 'Pending', color: '#FF8A3D' },
            { source: 'InStat', status: 'Disconnected', color: '#FF5A4F' },
          ].map(s => (
            <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#0A0A0A', borderRadius: 8 }}>
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2' }}>{s.source}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: s.color }}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: '24px' }}>
        <SectionTitle>Notifications</SectionTitle>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Watchlist value alerts', enabled: true },
            { label: 'New high-upside player detected', enabled: true },
            { label: 'Model retraining complete', enabled: true },
            { label: 'Contract expiry alerts', enabled: false },
          ].map(n => (
            <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1A1A1A' }}>
              <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#CFCFCF' }}>{n.label}</span>
              <div style={{
                width: 40, height: 22, borderRadius: 8, cursor: 'pointer',
                background: n.enabled ? '#F5B82E' : '#2A2A2A',
                position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: n.enabled ? 21 : 3, transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
