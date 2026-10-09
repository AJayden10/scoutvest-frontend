import type { Player, Position, RiskLevel, InvestmentSignal } from '../data/mockData'

// Set VITE_API_URL (e.g. https://api.example.com/api) to point at the Django backend.
// Without it, local dev talks to http://localhost:8000/api and a deployed site with no backend falls back to demo data.
export const API_URL: string = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8000/api'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  if (!res.ok) {
    let detail = res.statusText
    try { detail = (await res.json()).detail ?? detail } catch { /* not json */ }
    throw new ApiError(res.status, detail)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: 'DELETE' }),
}

/** What the API sends for a player. Anything the model hasn't produced yet is null. */
export interface ApiPlayer {
  id: number; name: string; age: number | null; position: string | null; club: string | null
  league: string | null; nationality: string | null; currentValue: number | null
  predictedValue: number | null; upside: number | null; risk: string | null; riskScore: number | null
  signal: string | null; xG90: number | null; xA90: number | null; goals90: number | null
  assists90: number | null; progressivePasses: number | null; progressiveCarries: number | null
  minutes: number; peakValue: number | null; valueChange: number | null; transferFee: number | null
  contractYears: number | null; confidence: number | null; reasons: string[]
}

export interface Paged<T> { count: number; next: string | null; results: T[] }

/** The pages need a full Player. Players without a prediction and a current value are left out, since an
 *  investment screen has nothing to say about them; remaining gaps (e.g. no xG outside Understat leagues) become 0 / "—". */
export function normalizePlayer(p: ApiPlayer): (Player & { hasXg: boolean }) | null {
  if (p.predictedValue == null || p.currentValue == null || p.age == null || p.signal == null) return null
  return {
    id: p.id, name: p.name, age: p.age, position: (p.position || 'CM') as Position,
    club: p.club ?? 'Unattached', league: p.league ?? '', nationality: p.nationality ?? '',
    currentValue: p.currentValue, predictedValue: p.predictedValue, upside: p.upside ?? 0,
    risk: (p.risk ?? 'Medium') as RiskLevel, riskScore: p.riskScore ?? 50, signal: p.signal as InvestmentSignal,
    xG90: p.xG90 ?? 0, xA90: p.xA90 ?? 0, goals90: p.goals90 ?? 0, assists90: p.assists90 ?? 0,
    progressivePasses: p.progressivePasses ?? 0, progressiveCarries: p.progressiveCarries ?? 0,
    minutes: p.minutes, peakValue: p.peakValue ?? p.currentValue, valueChange: p.valueChange ?? 0,
    transferFee: p.transferFee ?? 0, contractYears: p.contractYears ?? 0,
    confidence: p.confidence ?? 0, reasons: p.reasons ?? [],
    hasXg: p.xG90 != null,
  }
}

export async function fetchAllPlayers(): Promise<Player[]> {
  // Only players the model has scored; the first page tells us how many more to fetch, and those load in parallel.
  const limit = 1000
  const url = (offset: number) => `/players/?predicted=true&limit=${limit}&offset=${offset}&ordering=-upside`
  const first = await api.get<Paged<ApiPlayer>>(url(0))
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, Math.ceil(first.count / limit) - 1) }, (_, i) => api.get<Paged<ApiPlayer>>(url((i + 1) * limit))),
  )
  return [first, ...rest].flatMap(p => p.results).map(normalizePlayer).filter((p): p is NonNullable<typeof p> => p !== null)
}

export interface PlayerDetail extends ApiPlayer {
  marketValueHistory: { date: string; value: number }[]
  forecast: { date: string; predicted: number }[]
  modelVersion: string | null
  seasonStats: { season: string; club: string | null; age: number; matches: number; minutes: number; goals: number; assists: number; xg: number | null; xag: number | null }[]
}

export interface MarketTrends {
  averagePlayerValue: number | null
  mostValuablePosition: { position: string; value: number; players: number } | null
  averageValueByPosition: { position: string; value: number; players: number }[]
  averageValueByLeague: { league: string; value: number; players: number }[]
  averageValueByMonth: { month: string; value: number }[]
}

export interface ModelInfo {
  trained: boolean; version?: string; horizon_years?: number; features?: string[]
  metrics?: {
    train_rows: number; test_rows: number; cutoff_year: number; mae: number; rmse: number; r2: number
    median_abs_pct_error: number; mean_abs_log_error: number; baseline_mae: number; beats_baseline: boolean
  }
  importances?: Record<string, number>
}

export interface SimulationResult {
  totalCost: number; scenario: string; projectedROI: number; riskAdjustedROI: number
  cases: { case: string; futureValue: number; roi: number }[]
}
export interface PortfolioResult {
  budget: number; totalCost: number; projectedValue: number; portfolioROI: number
  players: { id: number; name: string; fee: number; predictedValue: number; upside: number; riskScore: number }[]
}
