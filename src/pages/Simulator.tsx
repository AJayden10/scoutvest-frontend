import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, SectionTitle, Btn, fmt } from '../components/ui'
import { players } from '../data/mockData'

export default function Simulator() {
  const [budget, setBudget] = useState(50)
  const [selectedPlayer, setSelectedPlayer] = useState(players[1].id)
  const [fee, setFee] = useState(12.5)
  const [salary, setSalary] = useState(2.5)
  const [contractYears, setContractYears] = useState(4)
  const [holdingYears, setHoldingYears] = useState(3)
  const [scenario, setScenario] = useState('Base')
  const [ran, setRan] = useState(false)

  const player = players.find(p => p.id === selectedPlayer) ?? players[1]

  const multipliers = { Conservative: 0.7, Base: 1.0, Optimistic: 1.35 }
  const mult = multipliers[scenario as keyof typeof multipliers]
  const futureBear = fee * 1.27
  const futureBase = fee * (1 + player.upside / 100) * mult
  const futureBull = fee * (1 + player.upside / 100) * 1.5
  const totalCost = fee + salary * Math.min(holdingYears, contractYears)
  const projectedROI = ((futureBase - totalCost) / totalCost) * 100
  const riskAdjustedROI = projectedROI * 0.78

  const scenarios = [
    { case: 'Bear Case', value: futureBear, roi: Math.round(((futureBear - totalCost) / totalCost) * 100), risk: 'High', color: '#C1554A' },
    { case: 'Base Case', value: futureBase, roi: Math.round(projectedROI), risk: 'Medium', color: '#D99A3D' },
    { case: 'Bull Case', value: futureBull, roi: Math.round(((futureBull - totalCost) / totalCost) * 100), risk: 'Low', color: '#E8A33D' },
  ]

  const portfolioPlayers = [
    { name: 'Lucas Fernández', fee: 8.4 },
    { name: 'Kai Fischer', fee: 6.2 },
    { name: 'Diego Vargas', fee: 15.0 },
    { name: 'Noa van den Berg', fee: 9.0 },
  ]
  const portfolioTotal = portfolioPlayers.reduce((s, p) => s + p.fee, 0)
  const portfolioFuture = portfolioPlayers.map(p => players.find(x => x.name === p.name)).reduce((s, p) => s + (p?.predictedValue ?? 0), 0)

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#E8E6DF', margin: 0 }}>Transfer Simulator</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9B9891', margin: '6px 0 0' }}>Model the potential return of a transfer investment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        {/* Inputs */}
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Simulation Parameters</SectionTitle>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SimInput label="Transfer Budget" value={`€${budget}M`}>
              <input type="range" min={5} max={150} value={budget} onChange={e => setBudget(+e.target.value)} style={{ width: '100%', accentColor: '#E8A33D' }} />
            </SimInput>

            <SimInput label="Target Player">
              <select value={selectedPlayer} onChange={e => { setSelectedPlayer(+e.target.value); const p = players.find(x => x.id === +e.target.value); if (p) setFee(p.currentValue) }}
                style={{ width: '100%', padding: '8px 12px', background: '#14171D', border: '1px solid #2A2E37', borderRadius: 3, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#E8E6DF' }}>
                {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </SimInput>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <NumberInput label="Transfer Fee (€M)" value={fee} onChange={setFee} />
              <NumberInput label="Annual Salary (€M)" value={salary} onChange={setSalary} />
              <NumberInput label="Contract Length (yrs)" value={contractYears} onChange={setContractYears} />
              <NumberInput label="Holding Period (yrs)" value={holdingYears} onChange={setHoldingYears} />
            </div>

            <SimInput label="Development Scenario">
              <div style={{ display: 'flex', gap: 8 }}>
                {['Conservative', 'Base', 'Optimistic'].map(s => (
                  <button key={s} onClick={() => setScenario(s)} style={{
                    flex: 1, padding: '7px 0', borderRadius: 3, cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
                    background: scenario === s ? 'rgba(232,163,61,0.12)' : 'transparent',
                    color: scenario === s ? '#E8A33D' : '#9B9891',
                    border: `1px solid ${scenario === s ? '#E8A33D' : '#2A2E37'}`,
                    transition: 'all 0.15s',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </SimInput>

            <Btn variant="primary" onClick={() => setRan(true)} style={{ width: '100%', padding: '11px 0', fontSize: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Run Simulation
            </Btn>
          </div>
        </Card>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ran ? (
            <>
              {/* Main ROI */}
              <Card style={{ padding: '28px', textAlign: 'center', background: 'linear-gradient(135deg, #0f2318 0%, #191D24 100%)', border: '1px solid rgba(232,163,61,0.2)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#E8A33D', marginBottom: 8 }}>EXPECTED TRANSFER ROI</div>
                <div style={{ fontFamily: 'Saira Condensed', fontSize: 52, fontWeight: 700, color: '#4FA97C', lineHeight: 1, marginBottom: 4 }}>+{Math.round(projectedROI)}%</div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>{scenario} scenario · {holdingYears}-year hold</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
                  {[
                    { label: 'Acquisition Cost', value: fmt(totalCost), color: '#E8E6DF' },
                    { label: 'Projected Value', value: fmt(futureBase), color: '#E8A33D' },
                    { label: 'Est. Profit', value: `+${fmt(futureBase - totalCost)}`, color: '#E8A33D' },
                    { label: 'Risk-Adj. ROI', value: `+${Math.round(riskAdjustedROI)}%`, color: '#D99A3D' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 3, padding: '12px 8px' }}>
                      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 10, color: '#9B9891', marginBottom: 6 }}>{m.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scenarios */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {scenarios.map(s => (
                  <Card key={s.case} style={{ padding: '16px', borderColor: `${s.color}30`, background: `linear-gradient(135deg, ${s.color}06, #191D24)` }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: s.color, marginBottom: 8 }}>{s.case.toUpperCase()}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 20, fontWeight: 700, color: '#E8E6DF', marginBottom: 4 }}>{fmt(s.value)}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 8 }}>ROI: +{s.roi}%</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>Risk: {s.risk}</div>
                  </Card>
                ))}
              </div>

              {/* Chart */}
              <Card style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 600, color: '#E8E6DF', marginBottom: 16 }}>Scenario Value Comparison</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={scenarios} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1d2d3d" vertical={false} />
                    <XAxis dataKey="case" tick={{ fontFamily: 'IBM Plex Sans', fontSize: 11, fill: '#9B9891' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9B9891' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
                    <Tooltip formatter={(v: any) => [`€${Number(v).toFixed(1)}M`, 'Future Value']} contentStyle={{ background: '#1a2535', border: '1px solid #2A2E37', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#E8A33D" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card style={{ padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(232,163,61,0.08)', border: '1px solid rgba(232,163,61,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 16, fontWeight: 600, color: '#E8E6DF', marginBottom: 8 }}>Ready to Simulate</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>Configure your parameters and click Run Simulation to model your transfer investment.</div>
            </Card>
          )}
        </div>
      </div>

      {/* Portfolio Simulator */}
      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <SectionTitle>Portfolio Simulator</SectionTitle>
            <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891', margin: '4px 0 0' }}>Model returns across a multi-player transfer portfolio.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891' }}>Transfer Budget</div>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: '#E8E6DF' }}>€50M</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {portfolioPlayers.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1d2d3d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 28, borderRadius: 8, background: ['#E8A33D', '#5B8DBE', '#D99A3D', '#C1554A'][i] }} />
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#E8E6DF' }}>{p.name}</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#E8E6DF' }}>€{p.fee}M</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#E8E6DF' }}>Total</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#E8E6DF' }}>€{portfolioTotal.toFixed(1)}M</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9B9891' }}>Remaining</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E8A33D' }}>€{(50 - portfolioTotal).toFixed(1)}M</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Projected Portfolio Value', value: fmt(portfolioFuture), color: '#E8A33D' },
            { label: 'Expected ROI', value: `+${Math.round((portfolioFuture - portfolioTotal) / portfolioTotal * 100)}%`, color: '#E8A33D' },
            { label: 'Portfolio Risk', value: 'Medium', color: '#D99A3D' },
          ].map(m => (
            <div key={m.label} style={{ background: '#14171D', borderRadius: 3, padding: '16px' }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SimInput({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9B9891' }}>{label}</span>
        {value && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: '#E8E6DF' }}>{value}</span>}
      </div>
      {children}
    </div>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9B9891', marginBottom: 4 }}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(+e.target.value)} step={0.5} min={0}
        style={{ width: '100%', padding: '8px 10px', background: '#14171D', border: '1px solid #2A2E37', borderRadius: 3, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#E8E6DF' }} />
    </div>
  )
}
