export const CHECKLIST = [
  { id: 'c1',  text: 'HTF bias confirmed (4H + 1H)',               note: 'Both aligned, or 4H primary with 1H noting conflict' },
  { id: 'c2',  text: 'HTF POI identified (4H or 1H OB/FVG/iFVG)', note: 'Price is AT a defined institutional zone — not mid-range' },
  { id: 'c3',  text: 'LTF confirmation (15M ChoCh or BOS)',        note: 'Structure shifting or confirming at HTF POI on 15M or 5M' },
  { id: 'c4',  text: 'Named setup identified (from setup library)', note: 'Setup has a name — OB, FVG, EQ, Spring, etc. — not "looks good"' },
  { id: 'c5',  text: '3M in-out candle or execution pattern confirmed', note: 'Engulfing / pin bar / in-out candle at LTF POI' },
  { id: 'c6',  text: 'Stop loss at structural level — NOT arbitrary', note: 'SL behind swing, OB boundary, FVG extreme, or Spring low' },
  { id: 'c7',  text: 'RR minimum 1:1.5 (calculator confirms)',     note: 'Calculated before entry — preferred 1:2 or better' },
  { id: 'c8',  text: 'NOT a revenge or FOMO trade — 5-min pause taken', note: 'Last trade reviewed. Emotion is calm and neutral.' },
  { id: 'c9',  text: 'Session window active (07:00–12:00 ET)',     note: 'Outside window = no trade. No exceptions.' },
  { id: 'c10', text: 'News context checked — speculation or reaction ready?', note: 'If news in 30 min: thesis formed OR waiting for reaction.' },
]

export const INSTRUMENTS = ['US30', 'NAS100', 'Gold (XAUUSD)', 'USD/JPY', 'EUR/USD', 'Silver', 'Other']
export const DIRECTIONS  = [{ value: 'long', label: 'Long 📈' }, { value: 'short', label: 'Short 📉' }]
export const OUTCOMES    = [{ value: 'win', label: '✅ Win' }, { value: 'loss', label: '❌ Loss' }, { value: 'be', label: '⚪ Breakeven' }]

export const SETUPS = {
  'OB Setups':  ['OB + FVG Confluence', 'BOS + OB', 'ChoCh + OB', 'BOS + FVG + OB Retest', 'BOS + Retrace OB'],
  'FVG Setups': ['FVG + EQ', 'BOS + FVG + EQ', 'ChoCh + FVG', 'ChoCh + FVG + EQ (70.5%)', 'ChoCh + FVG + EQ'],
  'EQ / Liquidity': ['ChoCh + EQ', 'BOS + EQ', 'BOS + EQ + FVG', 'Liquidity Sweep → MSS', 'EQL/EQH Sweep + Reclaim', 'PDH/PDL Grab'],
  'Wyckoff':    ['Spring (Wyckoff Ph.C)', 'Upthrust (UTAD Wyckoff)', 'LPS / LPSY Test'],
  'Advanced':   ['ChoCH on LTF at HTF POI', 'Orderflow Fakeout Swing', 'Opening Range Breach', 'News Speculation Entry', 'News Reaction Entry', 'Custom'],
}

export const HTF_OPTIONS = [
  '✅ 4H + 1H Both Aligned', '🟡 4H Aligned / 1H Neutral',
  '🟡 1H Aligned / 4H Neutral', '⚠️ 4H Only — 1H Counter', '❌ Full Counter-Trend',
]
export const HTF_POI_OPTIONS = [
  '4H OB', '4H FVG', '4H iFVG', '1H OB', '1H FVG', '1H iFVG',
  '4H + 1H POI Confluence', 'No HTF POI — LTF only',
]
export const LTF_OPTIONS = [
  '✅ 15M + 5M Both Confirmed', '🟡 15M BOS / 5M Pending',
  '🟡 5M ChoCh → BOS', '⚠️ 15M Only / 5M Unclear', '❌ No LTF Confirmation',
]
export const LTF_POI_OPTIONS = [
  '15M OB', '15M FVG', '15M iFVG', '5M OB', '5M FVG', '5M iFVG', '15M + 5M Confluence',
]
export const EXEC_3M_OPTIONS = [
  '✅ In-Out Candle Confirmed', '✅ Engulfing at POI',
  '✅ Pin Bar / Hammer at POI', '⚠️ Market Order (no 3M pattern)',
  '⚠️ News Entry — Spike then BOS',
]
export const EMOTION_OPTIONS = [
  '✅ Disciplined — Plan followed', '😌 Calm and confident',
  '🔻 Cautious — Half size', '⚠️ FOMO — Chased entry', '🚨 Revenge trade',
]

export const MOODS = [
  { label: '🎯 Focused',    value: '🎯 Focused' },
  { label: '😌 Calm',       value: '😌 Calm' },
  { label: '💪 Confident',  value: '💪 Confident' },
  { label: '😰 Anxious',    value: '😰 Anxious' },
  { label: '😴 Tired',      value: '😴 Tired' },
  { label: '🔥 Revenge',    value: '🔥 Revenge' },
]

export const MOOD_ALERTS = {
  '😰 Anxious': { type: 'warn', msg: 'Anxious detected. Consider reducing size or sitting out this session.' },
  '🔥 Revenge': { type: 'error', msg: 'Revenge mode detected. Close TradingView. Come back tomorrow.' },
  '😴 Tired':   { type: 'warn', msg: 'Tired. Half size maximum today. No news trades.' },
}

export const SESSION_START = 7 * 60   // 7:00 AM ET in minutes
export const SESSION_END   = 12 * 60  // 12:00 PM ET in minutes
