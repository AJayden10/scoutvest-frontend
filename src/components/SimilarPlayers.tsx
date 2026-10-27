import { useEffect, useState } from 'react'
import { api, ApiError, type SimilarResponse, type SimilarStat } from '../api/client'
import { useData } from '../data/DataContext'
import { Avatar, Card, PositionTag, SectionTitle, fmt } from './ui'

interface Props {
  playerId: number
  onSelectPlayer?: (id: number) => void
}

const num = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2))

/** "Who plays like this player, within budget?" Position-aware, every match explained with real numbers. */
export default function SimilarPlayers({ playerId, onSelectPlayer }: Props) {
  const { source } = useData()
  const [budget, setBudget] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [data, setData] = useState<SimilarResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (source !== 'live') return
    let cancelled = false
    const params = new URLSearchParams({ limit: '8' })
    if (budget) params.set('max_value', budget)
    if (maxAge) params.set('max_age', maxAge)
    setLoading(true)
    setError(null)
    const t = setTimeout(() => {
      api.get<SimilarResponse>(`/players/${playerId}/similar/?${params}`)
        .then(d => { if (!cancelled) setData(d) })
        .catch(e => { if (!cancelled) { setData(null); setError(e instanceof ApiError ? e.message : 'Could not load similar players') } })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 250) // wait for typing to settle
    return () => { cancelled = true; clearTimeout(t) }
  }, [source, playerId, budget, maxAge])

  if (source !== 'live') {
    return (
      <Card style={{ padding: 24 }}>
        <SectionTitle sub="Connect the Free Agent API to compare real players.">Similar Players</SectionTitle>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', marginTop: 12 }}>
          Similarity is computed from real season stats, so it is not available with demo data.
        </p>
      </Card>
    )
  }

  const input = (value: string, set: (v: string) => void, placeholder: string, label: string) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9A9A9A' }}>
      {label}
      <input value={value} onChange={e => set(e.target.value.replace(/[^0-9.]/g, ''))} placeholder={placeholder} inputMode="decimal"
        style={{ width: 120, height: 32, padding: '0 10px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, color: '#F2F2F2', fontFamily: 'IBM Plex Sans', fontSize: 13, outline: 'none' }} />
    </label>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <SectionTitle sub={data
              ? `${data.positionGroupLabel} in ${data.season} with ${data.minMinutes}+ minutes (${data.poolSize} players), compared on ${data.features.length} stats.`
              : 'Same-position players with the closest statistical profile.'}>
              Similar Players
            </SectionTitle>
          </div>
          {input(budget, setBudget, 'any', 'MAX VALUE (€M)')}
          {input(maxAge, setMaxAge, 'any', 'MAX AGE')}
        </div>
        {data?.referenceBelowMinMinutes && (
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#FF8A3D', margin: '12px 0 0' }}>
            This player only has {data.referenceMinutes.toLocaleString()} minutes that season, so his own numbers are noisy.
          </p>
        )}
      </Card>

      {loading && !data && <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>Finding similar players…</p>}
      {error && <Card style={{ padding: 20, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#FF8A3D' }}>{error}</Card>}
      {data && data.results.length === 0 && (
        <Card style={{ padding: 20, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>No players match these filters.</Card>
      )}

      {data?.results.map(r => (
        <Card key={r.playerId} style={{ padding: '18px 22px', opacity: loading ? 0.6 : 1 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 54, textAlign: 'center' }}>
              <div style={{ fontFamily: 'Saira Condensed', fontSize: 30, fontWeight: 800, color: '#F5B82E', lineHeight: 1 }}>{r.similarity}</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5E5E5E' }}>MATCH</div>
            </div>
            <Avatar name={r.player.name} size={38} />
            <button onClick={() => onSelectPlayer?.(r.playerId)} disabled={!onSelectPlayer || r.player.predictedValue == null}
              style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: onSelectPlayer ? 'pointer' : 'default', flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 15, fontWeight: 600, color: '#F2F2F2' }}>{r.player.name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                {r.player.position && <PositionTag pos={r.player.position} />}
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>
                  {[r.player.age && `Age ${r.player.age}`, r.player.club, `${r.minutes.toLocaleString()} min`].filter(Boolean).join(' · ')}
                </span>
              </div>
            </button>
            <Money label="VALUE" v={r.player.currentValue} />
            <Money label="FORECAST" v={r.player.predictedValue} low={r.player.predictedLow} high={r.player.predictedHigh} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
            <Stats title="CLOSEST ON" items={r.closest} color="#3DDC97" />
            <Stats title="DIFFERS MOST ON" items={r.differences} color="#FF8A3D" />
          </div>
        </Card>
      ))}

      {data && (
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#5E5E5E', margin: 0 }}>
          Method: {data.method}. Similarity describes playing style and output, not quality, tactical fit or price.
        </p>
      )}
    </div>
  )
}

function Money({ label, v, low, high }: { label: string; v: number | null; low?: number | null; high?: number | null }) {
  return (
    <div style={{ textAlign: 'right', minWidth: 90 }}>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color: '#5E5E5E' }}>{label}</div>
      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 16, fontWeight: 700, color: '#F2F2F2' }}>{v == null ? '—' : fmt(v)}</div>
      {low != null && high != null && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9A9A9A' }}>{fmt(low)}–{fmt(high)}</div>}
    </div>
  )
}

function Stats({ title, items, color }: { title: string; items: SimilarStat[]; color: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 8, color, marginBottom: 6 }}>{title}</div>
      {items.map(s => (
        <div key={s.feature} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0', fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#CFCFCF' }}>
          <span>{s.label}</span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#9A9A9A', whiteSpace: 'nowrap' }}>{num(s.reference)} vs {num(s.candidate)}</span>
        </div>
      ))}
    </div>
  )
}
