import type { InvestmentSignal, Player } from '../data/mockData'

// Card tiers follow the investment signal, like rarity tiers in a card game.
// The same accent colours are used for badges and dots so a card and its label always match.
export interface Tier {
  label: string
  accent: string // dots, badges, glows
  light: string // foil highlight
  dark: string // foil shadow
  ink: string // text on the card face
}

export const TIERS: Record<InvestmentSignal, Tier> = {
  'STRONG BUY': { label: 'Strong buy', accent: '#E8A33D', light: '#F8DA94', dark: '#B87A1C', ink: '#1d1405' },
  'UNDERVALUED': { label: 'Undervalued', accent: '#4FA97C', light: '#A5E3C4', dark: '#2E7A56', ink: '#06180f' },
  'BREAKOUT': { label: 'Breakout', accent: '#5B8DBE', light: '#B1D0F0', dark: '#3A6794', ink: '#07131f' },
  'MONITOR': { label: 'Monitor', accent: '#9AA3AD', light: '#DDE2E7', dark: '#69737E', ink: '#12161b' },
  'OVERVALUED': { label: 'Overvalued', accent: '#C1554A', light: '#EBA39B', dark: '#8E3329', ink: '#1f0907' },
}

/**
 * Scout Rating, 40–99: one number that sums up how attractive a player is as a target.
 * Rewards projected upside and model confidence, penalises risk. It is a display score
 * computed here for now; once the backend model exists it should come from the API.
 */
export function scoutRating(p: Pick<Player, 'upside' | 'confidence' | 'riskScore'>): number {
  const upsidePoints = (Math.min(p.upside, 220) / 220) * 32
  const raw = 52 + upsidePoints + p.confidence * 0.12 - p.riskScore * 0.12
  return Math.max(40, Math.min(99, Math.round(raw)))
}
