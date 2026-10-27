import { useState } from 'react'
import { useData } from '../data/DataContext'

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** Always-visible badge: is the screen showing the live model or built-in sample data? Click for details. */
export default function DataStatus() {
  const { source, health, demoReason, apiUrl, reload } = useData()
  const [open, setOpen] = useState(false)

  const live = source === 'live'
  const color = live ? '#3DDC97' : source === 'demo' ? '#FF8A3D' : '#9A9A9A'
  const label = live ? 'LIVE MODEL' : source === 'demo' ? 'DEMO DATA' : 'CONNECTING'
  const version = health?.predictions.modelVersion ?? health?.model.version
  const values = health?.dataSources.find(s => s.name === 'Market values')

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Data status: ${label}`}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, height: 30, padding: '0 12px', borderRadius: 10, cursor: 'pointer',
          background: `${color}14`, border: `1px solid ${color}55`, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: live ? `0 0 6px ${color}` : undefined }} />
        {label}
        {live && version && <span style={{ color: '#9A9A9A', fontWeight: 500 }}>· {version}</span>}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 38, zIndex: 70, width: 320, padding: 16, borderRadius: 10,
          background: '#0D0D0D', border: '1px solid #2A2A2A', boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#CFCFCF', lineHeight: 1.55,
        }}>
          {live ? (
            <>
              <div style={{ color: '#F2F2F2', fontWeight: 600, marginBottom: 8 }}>Connected to the Free Agent API</div>
              <Row k="API" v={apiUrl} />
              <Row k="Model" v={version ?? 'unknown'} />
              <Row k="Trained" v={fmtDate(health?.model.trainedAt)} />
              <Row k="Predictions written" v={fmtDate(health?.predictions.createdAt)} />
              <Row k="Players scored" v={health ? health.playersWithPrediction.toLocaleString() : '—'} />
              <Row k="Latest valuation" v={fmtDate(values?.latest)} />
              {health?.dataSources.filter(s => s.name !== 'Market values').map(s => (
                <Row key={s.name} k={s.name} v={`${s.rows.toLocaleString()} rows${s.latest ? ` · to ${s.latest}` : ''}`} />
              ))}
              {health?.model.beatsAllBaselines === false && (
                <div style={{ marginTop: 8, color: '#FF8A3D' }}>This model does not beat every simple baseline. See Model Performance.</div>
              )}
              {!health && <div style={{ marginTop: 8, color: '#9A9A9A' }}>This backend has no /health endpoint, so data dates are unknown.</div>}
            </>
          ) : (
            <>
              <div style={{ color: '#F2F2F2', fontWeight: 600, marginBottom: 8 }}>
                {source === 'demo' ? 'Showing built-in sample players' : 'Contacting the API…'}
              </div>
              {demoReason && <div style={{ marginBottom: 8 }}>Reason: {demoReason}.</div>}
              <div style={{ color: '#9A9A9A' }}>Names, values and predictions on screen are invented examples, not model output.</div>
              <Row k="API" v={apiUrl} />
              <button onClick={reload} style={{ marginTop: 10, background: 'none', border: '1px solid #2A2A2A', borderRadius: 6, color: '#F5B82E', padding: '4px 10px', cursor: 'pointer', fontFamily: 'IBM Plex Sans', fontSize: 11 }}>
                Retry connection
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '3px 0', borderBottom: '1px solid #1A1A1A' }}>
      <span style={{ color: '#9A9A9A' }}>{k}</span>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
    </div>
  )
}
