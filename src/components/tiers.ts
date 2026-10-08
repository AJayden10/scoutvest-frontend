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
  'STRONG BUY': { label: 'Strong buy', accent: '#C8F23C', light: '#EAFF9A', dark: '#8BAE17', ink: '#121a02' },
  'UNDERVALUED': { label: 'Undervalued', accent: '#3DD6F5', light: '#B4F1FF', dark: '#1B8FAE', ink: '#031318' },
  'BREAKOUT': { label: 'Breakout', accent: '#A58BFF', light: '#D6CBFF', dark: '#6A4FD4', ink: '#0d0821' },
  'MONITOR': { label: 'Monitor', accent: '#8FA0B8', light: '#D9E1EC', dark: '#586882', ink: '#0d121b' },
  'OVERVALUED': { label: 'Overvalued', accent: '#FF5A4F', light: '#FFB4AC', dark: '#B5322A', ink: '#220807' },
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
