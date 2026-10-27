import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, API_URL, fetchAllPlayers, type Health } from '../api/client'
import { players as mockPlayers, scatterData as mockScatter, watchlistPlayers as mockWatchlist, type Player } from './mockData'

/** 'live' = served by the Django API, 'demo' = built-in sample data because the API is unreachable or empty. */
export type DataSource = 'loading' | 'live' | 'demo'

interface Ctx {
  source: DataSource
  /** Why the app is showing sample data (only set in demo mode). */
  demoReason: string | null
  /** What the API reported about its data and model (null in demo mode or on older backends). */
  health: Health | null
  apiUrl: string
  players: Player[]
  scatterData: { id: number; name: string; x: number; y: number; position: string; risk: string; upside: number }[]
  watchlist: Player[]
  inWatchlist: (id: number) => boolean
  addToWatchlist: (id: number) => Promise<void>
  removeFromWatchlist: (id: number) => Promise<void>
  reload: () => void
}

const DataCtx = createContext<Ctx | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<DataSource>('loading')
  const [demoReason, setDemoReason] = useState<string | null>(null)
  const [health, setHealth] = useState<Health | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [watchIds, setWatchIds] = useState<number[]>([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setSource('loading')
      try {
        const [list, watch, h] = await Promise.all([
          fetchAllPlayers(),
          api.get<{ id: number }[]>('/watchlist/').catch(() => []),
          api.get<Health>('/health/').catch(() => null),
        ])
        if (cancelled) return
        if (list.length === 0) throw new Error('the API is reachable but has no predictions yet (run train_model and generate_predictions)')
        setPlayers(list)
        setWatchIds(watch.map(w => w.id))
        setHealth(h)
        setDemoReason(null)
        setSource('live')
      } catch (e) {
        if (cancelled) return
        const msg = e instanceof Error ? e.message : String(e)
        setDemoReason(/fetch|network|load failed/i.test(msg) ? `the API at ${API_URL} could not be reached` : msg)
        setPlayers(mockPlayers)
        setWatchIds(mockWatchlist.map(p => p.id))
        setHealth(null)
        setSource('demo')
      }
    })()
    return () => { cancelled = true }
  }, [tick])

  const reload = useCallback(() => setTick(t => t + 1), [])

  const value = useMemo<Ctx>(() => {
    const byId = new Map(players.map(p => [p.id, p]))
    const scatter = source === 'demo'
      ? mockScatter
      : players.map(p => ({ id: p.id, name: p.name, x: p.currentValue, y: p.predictedValue, position: p.position, risk: p.risk, upside: p.upside }))
    const mutate = async (fn: () => Promise<unknown>, next: (ids: number[]) => number[]) => {
      if (source === 'live') await fn()
      setWatchIds(next)
    }
    return {
      source, demoReason, health, apiUrl: API_URL, players, scatterData: scatter as Ctx['scatterData'],
      watchlist: watchIds.map(id => byId.get(id)).filter((p): p is Player => !!p),
      inWatchlist: id => watchIds.includes(id),
      addToWatchlist: id => mutate(() => api.post('/watchlist/', { playerId: id }), ids => ids.includes(id) ? ids : [...ids, id]),
      removeFromWatchlist: id => mutate(() => api.del(`/watchlist/${id}/`), ids => ids.filter(x => x !== id)),
      reload,
    }
  }, [source, demoReason, health, players, watchIds, reload])

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useData(): Ctx {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
