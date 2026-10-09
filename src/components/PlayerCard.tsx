import type { ReactNode } from 'react'
import type { Player } from '../data/mockData'
import { TIERS, scoutRating } from './tiers'
import { fmt, signed } from './ui'

// Rounded shield: soft corners on top, a rounder curve toward the bottom.
const RADIUS = '1.1em 1.1em 45% 45% / 1.1em 1.1em 14% 14%'
const RADIUS_IN = '0.9em 0.9em 45% 45% / 0.9em 0.9em 14% 14%'

interface Props {
  player: Player
  onClick?: () => void
  /** Small version for the pitch view: rating, position, name and upside only. */
  compact?: boolean
  /** Base font size in px; the whole card scales with it. */
  size?: number
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function PlayerCard({ player: p, onClick, compact = false, size }: Props) {
  const tier = TIERS[p.signal]
  const rating = scoutRating(p)
  const fs = size ?? (compact ? 13 : 16)
  const width = compact ? 7.2 : 13
  const height = compact ? 9 : 20.8

  // Long names step down in size so they stay on one line.
  const nameSize = p.name.length > 17 ? 1.2 : p.name.length > 13 ? 1.4 : 1.55

  const stats: [string, string][] = [
    // Show what the data source actually provides: xG/xA only exist for Understat leagues and progressive
    // actions for FBref-style feeds, so fall back to goals/assists and minutes rather than printing zeros.
    p.xG90 > 0 ? [p.xG90.toFixed(2), 'xG'] : [p.goals90.toFixed(2), 'G/90'],
    p.xA90 > 0 ? [p.xA90.toFixed(2), 'xA'] : [p.assists90.toFixed(2), 'A/90'],
    p.progressivePasses > 0 ? [p.progressivePasses.toFixed(1), 'Pass'] : [`${(p.minutes / 1000).toFixed(1)}k`, 'Mins'],
    p.progressiveCarries > 0 ? [p.progressiveCarries.toFixed(1), 'Carry'] : [`${signed(p.valueChange)}%`, 'Last Δ'],
    [String(p.confidence), 'Conf'],
    [String(p.riskScore), 'Risk'],
  ]

  const label = `${p.name}, ${p.position}, ${tier.label}, scout rating ${rating}, ${fmt(p.currentValue)} to ${fmt(p.predictedValue)}`

  const face: ReactNode = (
    <>
      {/* foil */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: RADIUS,
        background: `linear-gradient(155deg, ${tier.light} 0%, ${tier.accent} 48%, ${tier.dark} 100%)`,
      }} />
      {/* bevel + diagonal sheen */}
      <div style={{
        position: 'absolute', inset: '0.28em', borderRadius: RADIUS_IN,
        background: `repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0 0.7em, transparent 0.7em 1.4em), linear-gradient(160deg, rgba(255,255,255,0.32), rgba(0,0,0,0.10))`,
      }} />
      {/* monogram stands in for a portrait until photos exist */}
      {!compact && (
        <div aria-hidden style={{
          position: 'absolute', right: '0.9em', top: '1.2em',
          fontFamily: 'Saira Condensed', fontStyle: 'italic', fontWeight: 800,
          fontSize: '4.8em', lineHeight: 1, color: tier.ink, opacity: 0.16,
        }}>
          {initials(p.name)}
        </div>
      )}
      {/* the streak is clipped by its parent, so it cannot show outside the card while it waits off to the side */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: RADIUS, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="streak" />
      </div>

      <div style={{
        position: 'absolute', inset: 0, color: tier.ink,
        padding: compact ? '0.8em 0.7em 1.5em' : '1.3em 1.1em 2.3em',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* rating + position */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 'none', height: compact ? '3.3em' : '4.9em' }}>
          <span style={{
            fontFamily: 'Saira Condensed', fontStyle: 'italic', fontWeight: 800,
            fontSize: compact ? '2.1em' : '3.3em', lineHeight: 0.9,
          }}>{rating}</span>
          <span style={{
            fontFamily: 'Saira Condensed', fontWeight: 700, textTransform: 'uppercase',
            fontSize: compact ? '0.95em' : '1.3em', lineHeight: 1.1, marginTop: '0.15em',
          }}>{p.position}</span>
        </div>

        {/* name */}
        <div style={{
          fontFamily: 'Saira Condensed', fontStyle: 'italic', fontWeight: 800, textTransform: 'uppercase',
          fontSize: compact ? '0.98em' : `${nameSize}em`, lineHeight: 1.1, textAlign: 'center', flex: 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {compact ? p.name.split(' ').slice(-1)[0] : p.name}
        </div>

        {compact ? (
          <div style={{
            marginTop: 'auto', textAlign: 'center',
            fontFamily: 'Saira Condensed', fontWeight: 800, fontSize: '1.1em',
          }}>{signed(p.upside)}%</div>
        ) : (
          <>
            <div style={{
              textAlign: 'center', fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '0.74em', flex: 'none',
              opacity: 0.75, marginTop: '0.2em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {p.club} · age {p.age}
            </div>

            <div style={{ flex: 'none', height: 2, background: tier.ink, opacity: 0.25, margin: '0.6em 0.4em 0.5em' }} />

            <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1.1em', rowGap: '0.1em', padding: '0 0.5em' }}>
              {stats.map(([value, name]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: '0.45em' }}>
                  <span style={{ fontFamily: 'Saira Condensed', fontWeight: 800, fontSize: '1.25em', minWidth: '1.9em', textAlign: 'right' }}>{value}</span>
                  <span style={{ fontFamily: 'IBM Plex Sans', fontWeight: 600, fontSize: '0.74em', opacity: 0.75 }}>{name}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 'auto', paddingTop: '0.6em', textAlign: 'center', flex: 'none',
              fontFamily: 'Saira Condensed', fontWeight: 800, fontSize: '1.12em', lineHeight: 1.1,
            }}>
              {fmt(p.currentValue)} → {fmt(p.predictedValue)}
              <div style={{ fontSize: '0.82em', fontWeight: 700, opacity: 0.8 }}>{signed(p.upside)}% projected</div>
            </div>
          </>
        )}
      </div>
    </>
  )

  const style = {
    width: `${width}em`, height: `${height}em`, fontSize: fs, flexShrink: 0,
    ['--glow' as string]: tier.accent,
  }

  if (onClick) {
    return (
      <button type="button" className="pcard" onClick={onClick} aria-label={label} style={style}>
        {face}
      </button>
    )
  }
  return (
    <div className="pcard" role="img" aria-label={label} style={style}>
      {face}
    </div>
  )
}
