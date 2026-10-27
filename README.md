# Free Agent (ScoutVest frontend)

React 19 + TypeScript + Vite + Tailwind + Recharts front end for Free Agent, a football scouting app. It reads the
[Free Agent API](https://github.com/AJayden10/Scoutvest-2) (Django REST + XGBoost).

## Run locally

```bash
npm ci
npm run dev          # http://localhost:5173, talks to http://localhost:8000/api
npm run typecheck
npm run build
```

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api` | the API base URL. **Set it in Vercel (Project → Settings → Environment Variables) and redeploy**: Vite bakes it in at build time. |

The API must also allow this site's origin: `CORS_ALLOWED_ORIGINS=https://<your-app>.vercel.app` on the backend.

## Live model vs demo data

The app never hides which one you are looking at:

- The top bar shows **LIVE MODEL · <version>** or **DEMO DATA**. Click it for the API URL, model version and
  training date, when predictions were written and how fresh each data source is (from `GET /api/health/`).
- In demo mode a banner explains why (API unreachable, or reachable but no predictions yet). Every name and number
  is then an invented example.
- Features that need real data (similar players, real risk breakdown) say so instead of showing made-up results.
- The "Ask Free Agent" assistant is a preview with sample answers; it is labelled as such.

To check a deployment end to end, run the backend's `scripts/smoke_test.py --api <api-url> --origin <this-site>`.

## Features backed by the API

- Player list, profile, value history and a 2-year forecast with its 80% range
- **Similar players**: same-position players with the closest statistical profile, filtered by budget and age,
  each with the stats that match and the ones that differ (Player profile → Similar Players)
- Risk score broken into the factors the backend actually added up
- Transfer ROI simulator, watchlist, market trends
- Model performance: error against three simple baselines, by value band, position and confidence

CI (`.github/workflows/ci.yml`) typechecks and builds every push.
