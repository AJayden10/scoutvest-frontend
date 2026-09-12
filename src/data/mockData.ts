export type RiskLevel = 'Low' | 'Medium' | 'High'
export type Position = 'GK' | 'CB' | 'FB' | 'DM' | 'CM' | 'AM' | 'Winger' | 'ST'
export type InvestmentSignal = 'UNDERVALUED' | 'BREAKOUT' | 'STRONG BUY' | 'OVERVALUED' | 'MONITOR'

export interface Player {
  id: number
  name: string
  age: number
  position: Position
  club: string
  league: string
  nationality: string
  currentValue: number
  predictedValue: number
  upside: number
  risk: RiskLevel
  riskScore: number
  signal: InvestmentSignal
  xG90: number
  xA90: number
  goals90: number
  assists90: number
  progressivePasses: number
  progressiveCarries: number
  minutes: number
  peakValue: number
  valueChange: number
  transferFee: number
  contractYears: number
  confidence: number
  reasons: string[]
}

export const players: Player[] = [
  {
    id: 1, name: 'Lucas Fernández', age: 20, position: 'CM', club: 'Sevilla FC', league: 'La Liga',
    nationality: 'Spanish', currentValue: 8.4, predictedValue: 24.7, upside: 194, risk: 'Low',
    signal: 'UNDERVALUED', riskScore: 22, xG90: 0.19, xA90: 0.31, goals90: 0.21, assists90: 0.28,
    progressivePasses: 7.4, progressiveCarries: 4.1, minutes: 2847,
    peakValue: 8.4, valueChange: 12.4, transferFee: 8.4, contractYears: 3,
    confidence: 87,
    reasons: ['Age-related growth potential', 'xG contribution up 3 consecutive seasons', 'Market value below model estimate by 62%', 'Strong performance adjusted for league strength', 'Long contract reduces acquisition risk']
  },
  {
    id: 2, name: 'Matteo Rossi', age: 21, position: 'Winger', club: 'Atalanta', league: 'Serie A',
    nationality: 'Italian', currentValue: 12.5, predictedValue: 31.2, upside: 149, risk: 'Low',
    signal: 'BREAKOUT', riskScore: 28, xG90: 0.27, xA90: 0.24, goals90: 0.31, assists90: 0.22,
    progressivePasses: 5.2, progressiveCarries: 6.8, minutes: 2612,
    peakValue: 12.5, valueChange: 18.7, transferFee: 12.5, contractYears: 4,
    confidence: 82,
    reasons: ['Entering peak development window (21–24)', 'Dribbling & carrying metrics top 5% for position', 'Atalanta system maximises attacking output', 'Contract expiry in 2027 may soften asking price', 'Model projects 2-year growth trajectory']
  },
  {
    id: 3, name: 'Kai Fischer', age: 19, position: 'AM', club: 'RB Leipzig', league: 'Bundesliga',
    nationality: 'German', currentValue: 6.2, predictedValue: 18.9, upside: 205, risk: 'Medium',
    signal: 'UNDERVALUED', riskScore: 41, xG90: 0.22, xA90: 0.36, goals90: 0.18, assists90: 0.31,
    progressivePasses: 8.1, progressiveCarries: 5.3, minutes: 1984,
    peakValue: 6.2, valueChange: 9.1, transferFee: 6.2, contractYears: 2,
    confidence: 74,
    reasons: ['Youngest top-10% chance creator in Bundesliga', 'Leipzig development track record is exceptional', 'Contract expiry risk could depress market price', 'Variance from limited sample (1,984 mins)', 'xA/90 trending upward each half-season']
  },
  {
    id: 4, name: 'Diego Vargas', age: 22, position: 'ST', club: 'Porto', league: 'Primeira Liga',
    nationality: 'Colombian', currentValue: 15.0, predictedValue: 34.5, upside: 130, risk: 'Low',
    signal: 'STRONG BUY', riskScore: 31, xG90: 0.48, xA90: 0.11, goals90: 0.52, assists90: 0.09,
    progressivePasses: 2.1, progressiveCarries: 3.7, minutes: 2901,
    peakValue: 15.0, valueChange: 22.3, transferFee: 15.0, contractYears: 3,
    confidence: 85,
    reasons: ['Porto pipeline consistently produces top-5 league strikers', 'xG overperformance suggests genuine clinical ability', 'Age profile aligns with 3-year peak window', 'South American talent discount in current market', 'Low injury record over 36 months']
  },
  {
    id: 5, name: 'Aris Papadopoulos', age: 20, position: 'CB', club: 'Olympiakos', league: 'Super League',
    nationality: 'Greek', currentValue: 4.8, predictedValue: 13.7, upside: 185, risk: 'Low',
    signal: 'UNDERVALUED', riskScore: 26, xG90: 0.04, xA90: 0.06, goals90: 0.03, assists90: 0.05,
    progressivePasses: 6.9, progressiveCarries: 2.4, minutes: 2700,
    peakValue: 4.8, valueChange: 6.2, transferFee: 4.8, contractYears: 3,
    confidence: 79,
    reasons: ['Ball-playing CB profile scarce in current market', 'Greek league discount vs actual performance level', 'Progressive passing in top 8% for position globally', 'Ideal age for a stepping-stone acquisition', 'Low market competition for this profile']
  },
  {
    id: 6, name: 'Théo Lambert', age: 23, position: 'Winger', club: 'Lens', league: 'Ligue 1',
    nationality: 'French', currentValue: 18.0, predictedValue: 38.2, upside: 112, risk: 'Medium',
    signal: 'BREAKOUT', riskScore: 38, xG90: 0.24, xA90: 0.29, goals90: 0.26, assists90: 0.27,
    progressivePasses: 4.8, progressiveCarries: 7.2, minutes: 3102,
    peakValue: 18.0, valueChange: 24.5, transferFee: 18.0, contractYears: 2,
    confidence: 78,
    reasons: ['Dual-threat winger — creates & scores at elite rates', 'Contract expiry 2026 creates leverage opportunity', 'Ligue 1 adjusted metrics remain elite', 'Larger clubs actively monitoring', 'Performance volatility across cups vs league']
  },
  {
    id: 7, name: 'Noa van den Berg', age: 21, position: 'DM', club: 'Ajax', league: 'Eredivisie',
    nationality: 'Dutch', currentValue: 9.0, predictedValue: 22.4, upside: 149, risk: 'Low',
    signal: 'UNDERVALUED', riskScore: 24, xG90: 0.08, xA90: 0.14, goals90: 0.07, assists90: 0.12,
    progressivePasses: 9.2, progressiveCarries: 3.1, minutes: 2653,
    peakValue: 9.0, valueChange: 11.8, transferFee: 9.0, contractYears: 3,
    confidence: 83,
    reasons: ['Ajax academy graduate with elite positional intelligence', 'Pressing metrics rank 2nd among U22 DMs in Europe', 'Contract stable — no urgency pressure on seller', 'Dutch pipeline strong correlation with top-5 league success', 'Low risk profile relative to upside potential']
  },
  {
    id: 8, name: 'Sandro Abreu', age: 24, position: 'FB', club: 'Braga', league: 'Primeira Liga',
    nationality: 'Portuguese', currentValue: 7.2, predictedValue: 17.1, upside: 138, risk: 'Medium',
    signal: 'MONITOR', riskScore: 45, xG90: 0.06, xA90: 0.18, goals90: 0.05, assists90: 0.16,
    progressivePasses: 7.7, progressiveCarries: 4.9, minutes: 2480,
    peakValue: 7.2, valueChange: 9.3, transferFee: 7.2, contractYears: 2,
    confidence: 71,
    reasons: ['Attacking full-back profile highly valued in modern systems', 'Braga discount applies to all their outgoing players', 'Age means limited further growth window', 'Contract situation could accelerate timeline', 'Injury history in 2024/25 warrants monitoring']
  }
]

export const scatterData = players.map(p => ({
  id: p.id, name: p.name, x: p.currentValue, y: p.predictedValue,
  position: p.position, risk: p.risk, upside: p.upside
})).concat([
  { id: 9, name: 'R. Müller', x: 22, y: 28, position: 'CM', risk: 'Medium', upside: 27, id2: 9 },
  { id: 10, name: 'F. Costa', x: 5, y: 8, position: 'GK', risk: 'Low', upside: 60 },
  { id: 11, name: 'B. Özkan', x: 30, y: 38, position: 'ST', risk: 'Medium', upside: 27 },
  { id: 12, name: 'P. Dembélé', x: 3.5, y: 11, position: 'Winger', risk: 'Low', upside: 214 },
  { id: 13, name: 'H. Andersen', x: 45, y: 52, position: 'CB', risk: 'Low', upside: 16 },
  { id: 14, name: 'J. Kowalski', x: 11, y: 19, position: 'DM', risk: 'Low', upside: 73 },
  { id: 15, name: 'A. Mbeki', x: 2.1, y: 9.4, position: 'Winger', risk: 'Medium', upside: 348 },
  { id: 16, name: 'C. Ribeiro', x: 38, y: 44, position: 'ST', risk: 'Low', upside: 16 },
  { id: 17, name: 'T. Nakamura', x: 7.5, y: 21, position: 'AM', risk: 'Medium', upside: 180 },
  { id: 18, name: 'E. Hofmann', x: 19, y: 26, position: 'FB', risk: 'Low', upside: 37 },
  { id: 19, name: 'S. Belkacem', x: 4.2, y: 14.8, position: 'CM', risk: 'Low', upside: 252 },
  { id: 20, name: 'O. Lindqvist', x: 28, y: 35, position: 'CB', risk: 'Medium', upside: 25 },
  { id: 21, name: 'M. Teixeira', x: 1.8, y: 7.2, position: 'GK', risk: 'Low', upside: 300 },
  { id: 22, name: 'L. Dupont', x: 55, y: 62, position: 'ST', risk: 'Low', upside: 13 },
  { id: 23, name: 'A. Stavros', x: 14, y: 32, position: 'Winger', risk: 'Low', upside: 129 },
  { id: 24, name: 'V. Popescu', x: 6, y: 8, position: 'DM', risk: 'High', upside: 33 },
  { id: 25, name: 'B. Svensson', x: 20, y: 24, position: 'FB', risk: 'Medium', upside: 20 },
] as any[])

export const marketValueHistory = [
  { date: 'Jan 23', value: 6.2, predicted: null },
  { date: 'Jul 23', value: 7.1, predicted: null },
  { date: 'Jan 24', value: 7.8, predicted: null },
  { date: 'Jul 24', value: 8.4, predicted: null },
  { date: 'Jan 25', value: null, predicted: 11.2 },
  { date: 'Jul 25', value: null, predicted: 15.8 },
  { date: 'Jan 26', value: null, predicted: 20.7 },
  { date: 'Jul 26', value: null, predicted: 24.7 },
]

export const watchlistPlayers = [players[0], players[1], players[3], players[4], players[6]]
