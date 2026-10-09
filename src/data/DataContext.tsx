import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, fetchAllPlayers } from '../api/client'
import { players as mockPlayers, scatterData as mockScatter, watchlistPlayers as mockWatchlist, type Player } from './mockData'

/** 'live' = served by the Django API, 'demo' = built-in sample data because the API is unreachable or empty. */
export type DataSource = 'loading' | 'live' | 'demo'

interface Ctx {
  source: DataSource
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
  const [players, setPlayers] = useState<Player[]>([])
  const [watchIds, setWatchIds] = useState<number[]>([])
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setSource('loading')
      try {
        const [list, watch] = await Promise.all([
          fetchAllPlayers(),
          api.get<{ id: number }[]>('/watchlist/').catch(() => []),
        ])
        if (cancelled) return
        if (list.length === 0) throw new Error('API has no predictions yet')
        setPlayers(list)
        setWatchIds(watch.map(w => w.id))
        setSource('live')
      } catch {
        if (cancelled) return
        setPlayers(mockPlayers)
        setWatchIds(mockWatchlist.map(p => p.id))
        setSource('demo')
      }
    })()
    return () => { cancelled = true }
  }, [tick])

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
      source, players, scatterData: scatter as Ctx['scatterData'],
      watchlist: watchIds.map(id => byId.get(id)).filter((p): p is Player => !!p),
      inWatchlist: id => watchIds.includes(id),
      addToWatchlist: id => mutate(() => api.post('/watchlist/', { playerId: id }), ids => ids.includes(id) ? ids : [...ids, id]),
      removeFromWatchlist: id => mutate(() => api.del(`/watchlist/${id}/`), ids => ids.filter(x => x !== id)),
      reload: () => setTick(t => t + 1),
    }
  }, [source, players, watchIds])

  return <DataCtx.Provider value={value}>{children}</DataCtx.Provider>
}

export function useData(): Ctx {
  const ctx = useContext(DataCtx)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
