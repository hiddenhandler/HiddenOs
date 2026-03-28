# HiddenOS — React + Vite

Full trading OS. Dashboard · Trade Logger · Portfolio · Calendar · Analytics · Journal · Macro · Knowledge Base.

## Deploy in 5 minutes

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
# Opens at http://localhost:5173
```

### 3. Deploy to Vercel (free, $0/month)

**Option A — Vercel CLI (fastest)**
```bash
npm install -g vercel
vercel
# Follow the prompts. Live in 60 seconds.
```

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo → Deploy
4. Done. Auto-deploys on every push.

---

## Add Supabase later (when ready)

All data functions are in one file: `src/lib/db.js`

```bash
npm install @supabase/supabase-js
```

Then replace the function bodies in `src/lib/db.js` with Supabase queries.
Everything else in the app stays exactly the same — no refactor needed.

```js
// Example: swap getTrades()
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const getTrades = async () => {
  const { data } = await supabase.from('trades').select('*')
  return data
}
```

---

## Stack
- React 18 + Vite 5
- React Router v6
- Tailwind CSS v3
- Chart.js + react-chartjs-2
- Lucide React icons
- Vercel (hosting, free tier)

## Cost
- Vercel: **$0/month** (handles 100K+ visits)
- Supabase free tier: **$0/month** (50K users, 500MB DB)
- Total: **$0/month** until serious scale
