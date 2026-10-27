import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, SectionTitle, StatRow } from '../components/ui'
import { useData } from '../data/DataContext'
import { api, type ModelInfo } from '../api/client'

const LABELS: Record<string, string> = {
  age: 'Age', minutes: 'Minutes played', log_minutes: 'Minutes played (log)', goals90: 'Goals / 90', assists90: 'Assists / 90',
  xg90: 'xG / 90', xag90: 'xA / 90', npxg90: 'Non-penalty xG / 90', xgchain90: 'xG chain / 90', xgbuildup90: 'xG build-up / 90',
  key_passes90: 'Key passes / 90', shots90: 'Shots / 90', prog_passes90: 'Progressive passes / 90', prog_carries90: 'Progressive carries / 90',
  log_value: 'Current market value', value_growth_12m: 'Value change, last 12 months',
}
const label = (f: string) => LABELS[f] ?? (f.startsWith('pos_') ? `Position: ${f.slice(4)}` : f)

// Demo-mode sample, shown only when no backend is connected.
const DEMO: ModelInfo = {
  trained: true, version: 'sample', horizon_years: 2,
  metrics: { train_rows: 84219, test_rows: 9247, cutoff_year: 2024, mae: 3.82, rmse: 6.17, r2: 0.81, median_abs_pct_error: 24, mean_abs_log_error: 0.3, baseline_mae: 4.6, beats_baseline: true },
  importances: { age: 0.24, xg90: 0.19, log_value: 0.17, prog_passes90: 0.13, value_growth_12m: 0.09, minutes: 0.07 },
}

export default function ModelPerformance() {
  const { source } = useData()
  const [info, setInfo] = useState<ModelInfo | null>(null)
  useEffect(() => {
    if (source !== 'live') return
    api.get<ModelInfo>('/model/performance/').then(setInfo).catch(() => setInfo({ trained: false }))
  }, [source])

  const model = source === 'live' ? info : DEMO
  const m = model?.metrics
  const importances = Object.entries(model?.importances ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxImp = importances[0]?.[1] || 1

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Model Performance</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>
          How well the model predicts values it has never seen, tested on later seasons than it trained on.
          {source === 'demo' && ' (Sample figures: no backend connected.)'}
        </p>
      </div>

      {!model && <p style={{ color: '#9A9A9A', fontFamily: 'IBM Plex Sans' }}>Loading…</p>}
      {model && !model.trained && (
        <Card style={{ padding: 24 }}>
          <SectionTitle>No trained model yet</SectionTitle>
          <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>Run <code>python manage.py train_model</code> on the backend, then <code>generate_predictions</code>.</p>
        </Card>
      )}

      {m && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'MAE', value: `€${m.mae.toFixed(2)}M`, sub: `Naive baseline €${m.baseline_mae.toFixed(2)}M` },
              { label: 'RMSE', value: `€${m.rmse.toFixed(2)}M`, sub: 'Penalises big misses' },
              { label: 'R² SCORE', value: m.r2.toFixed(2), sub: 'Share of variance explained' },
              { label: 'MEDIAN ERROR', value: `${m.median_abs_pct_error.toFixed(0)}%`, sub: `${model.horizon_years}-year-ahead value` },
            ].map(k => (
              <Card key={k.label} style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#5E5E5E', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: '#F2F2F2', marginBottom: 4 }}>{k.value}</div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{k.sub}</div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: '24px' }}>
            <SectionTitle>Model vs. simple baselines</SectionTitle>
            <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '4px 0 12px' }}>
              Average error in €M on {m.test_rows.toLocaleString()} player-seasons from {m.test_year ?? `after ${m.cutoff_year}`}, a season the model never saw
              {m.embargo ? `; it only trained on seasons up to ${m.cutoff_year}, whose outcomes were already known by then` : ''}. Lower is better.{' '}
              <strong style={{ color: (m.beats_all_baselines ?? m.beats_baseline) ? '#3DDC97' : '#FF8A3D' }}>
                {(m.beats_all_baselines ?? m.beats_baseline) ? 'The model beats every baseline.' : 'The model does not beat every baseline yet; treat predictions with caution.'}
              </strong>
            </p>
            <ResponsiveContainer width="100%" height={m.baselines ? 210 : 150}>
              <BarChart data={[
                { name: 'Free Agent model', v: m.mae },
                { name: 'Value stays the same', v: m.baselines?.no_change ?? m.baseline_mae },
                ...(m.baselines ? [{ name: 'Same growth for all', v: m.baselines.median_growth }, { name: 'Age curve', v: m.baselines.age_curve }] : []),
              ]} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" horizontal={false} />
                <XAxis type="number" tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9A9A9A' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
                <YAxis type="category" dataKey="name" width={140} tick={{ fontFamily: 'IBM Plex Sans', fontSize: 12, fill: '#CFCFCF' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [`€${v}M`, 'MAE']} contentStyle={{ background: '#171717', border: '1px solid #2A2A2A', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
                <Bar dataKey="v" radius={[0, 4, 4, 0]}>
                  <Cell fill="#F5B82E" /><Cell fill="#3A3A3A" /><Cell fill="#3A3A3A" /><Cell fill="#3A3A3A" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ padding: '24px' }}>
              <SectionTitle>Feature Importance</SectionTitle>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {importances.map(([f, v]) => (
                  <div key={f}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#CFCFCF' }}>{label(f)}</span>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#9A9A9A' }}>{(v * 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 5, background: '#1A1A1A', borderRadius: 9 }}>
                      <div style={{ height: 5, width: `${(v / maxImp) * 100}%`, background: '#F5B82E', borderRadius: 9 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ padding: '24px' }}>
              <SectionTitle>Model Configuration</SectionTitle>
              <div style={{ marginTop: 16 }}>
                <StatRow label="Algorithm" value="XGBoost Regressor" />
                <StatRow label="Version" value={model.version ?? '—'} mono />
                <StatRow label="Predicts" value={`Value ${model.horizon_years} years ahead`} />
                <StatRow label="Training samples" value={m.train_rows.toLocaleString()} mono />
                <StatRow label="Test samples" value={m.test_rows.toLocaleString()} mono />
                <StatRow label="Validation" value={m.test_year ? `Train ≤${m.cutoff_year}, test ${m.test_year}${m.embargo ? ' (embargoed)' : ''}` : `Time split at ${m.cutoff_year}`} mono />
                <StatRow label="Features" value={String(model.features?.length ?? '—')} mono />
                {m.interval && m.interval.checked_coverage != null && (
                  <StatRow label="80% range really covers" value={`${(m.interval.checked_coverage * 100).toFixed(0)}% (${m.interval.checked_on_rows} rows)`} mono />
                )}
                {model.trained_at && <StatRow label="Trained" value={new Date(model.trained_at).toLocaleDateString('en-GB')} mono />}
              </div>
            </Card>
          </div>

          {m.segments && (
            <Card style={{ padding: '24px' }}>
              <SectionTitle sub="The same held-out season, split up. A model can look good on average and still fail one group; the confidence rows check whether higher confidence really means smaller errors.">
                Where the model is weaker
              </SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 16 }}>
                {([['By value band', m.segments.value_band], ['By position', m.segments.position], ['By confidence', m.segments.confidence_band], ['By league', m.segments.league]] as const)
                  .filter(([, rows]) => rows.length > 0)
                  .map(([title, rows]) => (
                    <div key={title}>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#9A9A9A', marginBottom: 8 }}>{title.toUpperCase()}</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
                        <thead><tr>{['', 'n', 'MAE', 'base', 'med %'].map(h => <th key={h} style={{ textAlign: h ? 'right' : 'left', color: '#5E5E5E', fontWeight: 500, padding: '4px 0' }}>{h}</th>)}</tr></thead>
                        <tbody>{rows.map(r => (
                          <tr key={r.segment} style={{ borderTop: '1px solid #1A1A1A' }}>
                            <td style={{ color: '#CFCFCF', padding: '5px 0', fontFamily: 'IBM Plex Sans' }}>{r.segment}</td>
                            <td style={{ textAlign: 'right', color: '#9A9A9A' }}>{r.n}</td>
                            <td style={{ textAlign: 'right', color: r.mae <= r.baseline_mae ? '#3DDC97' : '#FF8A3D' }}>{r.mae.toFixed(2)}</td>
                            <td style={{ textAlign: 'right', color: '#9A9A9A' }}>{r.baseline_mae.toFixed(2)}</td>
                            <td style={{ textAlign: 'right', color: '#9A9A9A' }}>{r.median_abs_pct_error.toFixed(0)}</td>
                          </tr>))}</tbody>
                      </table>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
