import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, SectionTitle, Btn, fmt, signed } from '../components/ui'
import { useData } from '../data/DataContext'
import { api, type PortfolioResult, type SimulationResult } from '../api/client'

export default function Simulator() {
  const { players, source } = useData()
  const live = source === 'live'
  const [budget, setBudget] = useState(50)
  const [selectedPlayer, setSelectedPlayer] = useState(() => (players[1] ?? players[0]).id)
  const [search, setSearch] = useState('')
  const [fee, setFee] = useState(() => (players[1] ?? players[0]).currentValue)
  const [salary, setSalary] = useState(() => Math.max(0.1, +((players[1] ?? players[0]).currentValue * 0.1).toFixed(2)))
  const [contractYears, setContractYears] = useState(4)
  const [holdingYears, setHoldingYears] = useState(3)
  const [scenario, setScenario] = useState('Base')
  const [ran, setRan] = useState(false)
  const [apiResult, setApiResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioResult | null>(null)

  const player = players.find(p => p.id === selectedPlayer) ?? players[0]
  const options = (search ? players.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : players).slice(0, 100)
  if (!options.some(p => p.id === player.id)) options.unshift(player)

  // Demo mode computes locally; live mode asks the backend, so both use the same case structure.
  const multipliers = { Conservative: 0.7, Base: 1.0, Optimistic: 1.35 }
  const mult = multipliers[scenario as keyof typeof multipliers]
  const totalCost = fee + salary * Math.min(holdingYears, contractYears)
  const localCases = [
    { case: 'Bear Case', value: fee * 1.27, color: '#FF5A4F', risk: 'High' },
    { case: 'Base Case', value: fee * (1 + player.upside / 100) * mult, color: '#FF8A3D', risk: 'Medium' },
    { case: 'Bull Case', value: fee * (1 + player.upside / 100) * 1.5, color: '#3DDC97', risk: 'Low' },
  ].map(c => ({ ...c, roi: Math.round(((c.value - totalCost) / totalCost) * 100) }))
  const palette: Record<string, { color: string; risk: string }> = {
    'Bear Case': { color: '#FF5A4F', risk: 'High' }, 'Base Case': { color: '#FF8A3D', risk: 'Medium' }, 'Bull Case': { color: '#3DDC97', risk: 'Low' },
  }
  const scenarios = live && apiResult
    ? apiResult.cases.map(c => ({ case: c.case, value: c.futureValue, roi: Math.round(c.roi), ...palette[c.case] }))
    : localCases
  const base = scenarios.find(c => c.case === 'Base Case') ?? scenarios[0]
  const futureBase = base.value
  const shownCost = live && apiResult ? apiResult.totalCost : totalCost
  const projectedROI = live && apiResult ? apiResult.projectedROI : base.roi
  const riskAdjustedROI = live && apiResult ? apiResult.riskAdjustedROI : projectedROI * 0.78

  const run = async () => {
    setError(null)
    if (live) {
      try {
        setApiResult(await api.post<SimulationResult>('/simulator/', { playerId: player.id, fee, salary, contractYears, holdingYears, scenario: scenario.toLowerCase() }))
      } catch (e: any) { setError(e.message ?? 'Simulation failed'); return }
    }
    setRan(true)
  }

  // Portfolio: the backend picks the best risk-adjusted set that fits the budget.
  useEffect(() => {
    if (!live) return
    const t = setTimeout(() => { api.post<PortfolioResult>('/simulator/', { budget, maxPlayers: 8 }).then(setPortfolio).catch(() => setPortfolio(null)) }, 300)
    return () => clearTimeout(t)
  }, [live, budget])
  const demoPortfolio = [{ name: 'Dario Montalvo', fee: 8.4 }, { name: 'Jonas Drechsel', fee: 6.2 }, { name: 'Emilio Cardona', fee: 15.0 }, { name: 'Sem Vandermeer', fee: 9.0 }]
  const portfolioPlayers = live ? (portfolio?.players ?? []).map(p => ({ name: p.name, fee: p.fee })) : demoPortfolio
  const portfolioTotal = live ? (portfolio?.totalCost ?? 0) : portfolioPlayers.reduce((s, p) => s + p.fee, 0)
  const portfolioFuture = live ? (portfolio?.projectedValue ?? 0) : portfolioPlayers.map(p => players.find(x => x.name === p.name)).reduce((s, p) => s + (p?.predictedValue ?? 0), 0)
  const portfolioROI = portfolioTotal ? Math.round(((portfolioFuture - portfolioTotal) / portfolioTotal) * 100) : 0
  const portfolioRisk = live && portfolio && portfolio.players.length
    ? (() => { const r = portfolio.players.reduce((s, p) => s + (p.riskScore ?? 50), 0) / portfolio.players.length; return r < 35 ? 'Low' : r < 55 ? 'Medium' : 'High' })()
    : 'Medium'

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      <div>
        <h1 style={{ fontFamily: 'IBM Plex Sans', fontSize: 28, fontWeight: 700, color: '#F2F2F2', margin: 0 }}>Transfer Simulator</h1>
        <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, color: '#9A9A9A', margin: '6px 0 0' }}>Model the potential return of a transfer investment.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        {/* Inputs */}
        <Card style={{ padding: '24px' }}>
          <SectionTitle>Simulation Parameters</SectionTitle>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SimInput label="Transfer Budget" value={`€${budget}M`}>
              <input type="range" min={5} max={150} value={budget} onChange={e => setBudget(+e.target.value)} style={{ width: '100%', accentColor: '#F5B82E' }} />
            </SimInput>

            <SimInput label="Target Player">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name…"
                style={{ width: '100%', padding: '8px 12px', marginBottom: 8, background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2', outline: 'none' }} />
              <select value={selectedPlayer} onChange={e => { setSelectedPlayer(+e.target.value); setRan(false); const p = players.find(x => x.id === +e.target.value); if (p) { setFee(p.currentValue); setSalary(Math.max(0.1, +(p.currentValue * 0.1).toFixed(2))) } }}
                style={{ width: '100%', padding: '8px 12px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2' }}>
                {options.map(p => <option key={p.id} value={p.id}>{p.name} · {p.club}</option>)}
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
                    flex: 1, padding: '7px 0', borderRadius: 8, cursor: 'pointer',
                    fontFamily: 'IBM Plex Sans', fontSize: 12, fontWeight: 500,
                    background: scenario === s ? 'rgba(245,184,46,0.12)' : 'transparent',
                    color: scenario === s ? '#F5B82E' : '#9A9A9A',
                    border: `1px solid ${scenario === s ? '#F5B82E' : '#2A2A2A'}`,
                    transition: 'all 0.15s',
                  }}>
                    {s}
                  </button>
                ))}
              </div>
            </SimInput>

            <Btn variant="primary" onClick={run} style={{ width: '100%', padding: '11px 0', fontSize: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Run Simulation
            </Btn>
            {error && <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#FF5A4F' }}>{error}</div>}
          </div>
        </Card>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ran ? (
            <>
              {/* Main ROI */}
              <Card style={{ padding: '28px', textAlign: 'center', background: 'linear-gradient(135deg, #0D0D0D 0%, #111111 100%)', border: '1px solid rgba(245,184,46,0.2)' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#F5B82E', marginBottom: 8 }}>EXPECTED TRANSFER ROI</div>
                <div style={{ fontFamily: 'Saira Condensed', fontSize: 52, fontWeight: 700, color: '#3DDC97', lineHeight: 1, marginBottom: 4 }}>{signed(Math.round(projectedROI))}%</div>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>{scenario} scenario · {holdingYears}-year hold</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
                  {[
                    { label: 'Acquisition Cost', value: fmt(shownCost), color: '#F2F2F2' },
                    { label: 'Projected Value', value: fmt(futureBase), color: '#F5B82E' },
                    { label: 'Est. Profit', value: `${futureBase - shownCost < 0 ? '-' : '+'}${fmt(Math.abs(futureBase - shownCost))}`, color: futureBase - shownCost < 0 ? '#FF5A4F' : '#F5B82E' },
                    { label: 'Risk-Adj. ROI', value: `${signed(Math.round(riskAdjustedROI))}%`, color: '#FF8A3D' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '12px 8px' }}>
                      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 10, color: '#9A9A9A', marginBottom: 6 }}>{m.label}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scenarios */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {scenarios.map(s => (
                  <Card key={s.case} style={{ padding: '16px', borderColor: `${s.color}30`, background: `linear-gradient(135deg, ${s.color}06, #111111)` }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: s.color, marginBottom: 8 }}>{s.case.toUpperCase()}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 20, fontWeight: 700, color: '#F2F2F2', marginBottom: 4 }}>{fmt(s.value)}</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 8 }}>ROI: {signed(s.roi)}%</div>
                    <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A' }}>Risk: {s.risk}</div>
                  </Card>
                ))}
              </div>

              {/* Chart */}
              <Card style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 14, fontWeight: 600, color: '#F2F2F2', marginBottom: 16 }}>Scenario Value Comparison</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={scenarios} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
                    <XAxis dataKey="case" tick={{ fontFamily: 'IBM Plex Sans', fontSize: 11, fill: '#9A9A9A' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 9, fill: '#9A9A9A' }} axisLine={false} tickLine={false} tickFormatter={v => `€${v}M`} />
                    <Tooltip formatter={(v: any) => [`€${Number(v).toFixed(1)}M`, 'Future Value']} contentStyle={{ background: '#171717', border: '1px solid #2A2A2A', fontFamily: 'IBM Plex Sans', fontSize: 12 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#F5B82E" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card style={{ padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(245,184,46,0.08)', border: '1px solid rgba(245,184,46,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F5B82E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 16, fontWeight: 600, color: '#F2F2F2', marginBottom: 8 }}>Ready to Simulate</div>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>Configure your parameters and click Run Simulation to model your transfer investment.</div>
            </Card>
          )}
        </div>
      </div>

      {/* Portfolio Simulator */}
      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <SectionTitle>Portfolio Simulator</SectionTitle>
            <p style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A', margin: '4px 0 0' }}>Model returns across a multi-player transfer portfolio.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A' }}>Transfer Budget</div>
            <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 22, fontWeight: 700, color: '#F2F2F2' }}>€{budget}M</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {portfolioPlayers.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1A1A1A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 28, borderRadius: 8, background: ['#F5B82E', '#3DD6F5', '#FF8A3D', '#FF5A4F'][i % 4] }} />
                <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#F2F2F2' }}>{p.name}</span>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>€{p.fee}M</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, fontWeight: 600, color: '#F2F2F2' }}>Total</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: '#F2F2F2' }}>€{portfolioTotal.toFixed(1)}M</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 13, color: '#9A9A9A' }}>Remaining</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#F5B82E' }}>€{(budget - portfolioTotal).toFixed(1)}M</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Projected Portfolio Value', value: fmt(portfolioFuture), color: '#F5B82E' },
            { label: 'Expected ROI', value: `${signed(portfolioROI)}%`, color: '#F5B82E' },
            { label: 'Portfolio Risk', value: portfolioRisk, color: '#FF8A3D' },
          ].map(m => (
            <div key={m.label} style={{ background: '#0A0A0A', borderRadius: 8, padding: '16px' }}>
              <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A', marginBottom: 6 }}>{m.label}</div>
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
        <span style={{ fontFamily: 'IBM Plex Sans', fontSize: 12, color: '#9A9A9A' }}>{label}</span>
        {value && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: '#F2F2F2' }}>{value}</span>}
      </div>
      {children}
    </div>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div style={{ fontFamily: 'IBM Plex Sans', fontSize: 11, color: '#9A9A9A', marginBottom: 4 }}>{label}</div>
      <input type="number" value={value} onChange={e => onChange(+e.target.value)} step={0.5} min={0}
        style={{ width: '100%', padding: '8px 10px', background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#F2F2F2' }} />
    </div>
  )
}
