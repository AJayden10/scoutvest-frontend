import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, SectionTitle, StatRow } from '../components/ui'

// Simulated actual vs predicted for model display
const modelData = Array.from({ length: 40 }, (_, i) => {
  const actual = Math.random() * 50 + 2
  const noise = (Math.random() - 0.5) * 8
  return { actual: +actual.toFixed(1), predicted: +(actual + noise).toFixed(1) }
})

export default function ModelPerformance() {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#E8E6DF', margin: 0 }}>Model Performance</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '6px 0 0' }}>Transparency and accountability for the AI prediction engine.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Model', value: 'XGBoost v2.1', sub: 'Future Market Value' },
          { label: 'MAE', value: '€3.82M', sub: 'Mean Absolute Error' },
          { label: 'RMSE', value: '€6.17M', sub: 'Root Mean Square Error' },
          { label: 'R² Score', value: '0.81', sub: 'Last training: Aug 10 2026' },
        ].map(m => (
          <Card key={m.label} style={{ padding: '20px' }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#3a4d62', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: '#E8E6DF', marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: '24px' }}>
        <SectionTitle>Predicted vs Actual Market Value</SectionTitle>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891', margin: '4px 0 20px' }}>Each point is a validation-set player. The dashed line represents a perfect prediction.</p>
        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1d2d3d" />
            <XAxis dataKey="actual" type="number" name="Actual" unit="M"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9B9891' }} axisLine={{ stroke: '#2A2E37' }} tickLine={false}
              label={{ value: 'Actual Market Value (€M)', position: 'insideBottom', offset: -14, fill: '#9B9891', fontFamily: 'IBM Plex Sans', fontSize: 11 }} />
            <YAxis dataKey="predicted" type="number" name="Predicted" unit="M"
              tick={{ fontFamily: 'JetBrains Mono', fontSize: 10, fill: '#9B9891' }} axisLine={{ stroke: '#2A2E37' }} tickLine={false}
              label={{ value: 'Predicted Value (€M)', angle: -90, position: 'insideLeft', offset: 14, fill: '#9B9891', fontFamily: 'IBM Plex Sans', fontSize: 11 }} />
            <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 60, y: 60 }]} stroke="#E8A33D" strokeDasharray="6 4" strokeOpacity={0.5} />
            <Tooltip formatter={(v: any) => [`€${Number(v).toFixed(1)}M`]}
              contentStyle={{ background: '#1a2535', border: '1px solid #2A2E37', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
            <Scatter data={modelData} fill="#5B8DBE" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Feature Importance</SectionTitle>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { feature: 'Age', importance: 0.24 },
              { feature: 'xG / 90 (3-season)', importance: 0.19 },
              { feature: 'Market Value Trajectory', importance: 0.17 },
              { feature: 'Progressive Actions', importance: 0.13 },
              { feature: 'League Strength', importance: 0.11 },
              { feature: 'Contract Status', importance: 0.09 },
              { feature: 'Injury History', importance: 0.07 },
            ].map(f => (
              <div key={f.feature}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#C8D3DF' }}>{f.feature}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#9B9891' }}>{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: 5, background: '#1d2d3d', borderRadius: 9 }}>
                  <div style={{ height: 5, width: `${f.importance * 100}%`, background: '#E8A33D', borderRadius: 9 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: '24px' }}>
          <SectionTitle>Model Configuration</SectionTitle>
          <div style={{ marginTop: 16 }}>
            <StatRow label="Algorithm" value="XGBoost Regressor" />
            <StatRow label="Training samples" value="84,219" mono />
            <StatRow label="Validation samples" value="9,247" mono />
            <StatRow label="Cross-validation" value="5-fold" mono />
            <StatRow label="Last training date" value="Aug 10, 2026" />
            <StatRow label="Retraining cadence" value="Monthly" />
            <StatRow label="Data sources" value="6 integrated" />
            <StatRow label="Leagues covered" value="32" mono />
            <div style={{ marginTop: 16, padding: '12px', background: 'rgba(232,163,61,0.06)', border: '1px solid rgba(232,163,61,0.15)', borderRadius: 16 }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#E8A33D', fontWeight: 600, marginBottom: 4 }}>Model Status</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>All systems nominal. Next scheduled retraining: Sep 10, 2026.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
