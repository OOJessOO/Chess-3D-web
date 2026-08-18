# Deploy Chess 3D for Free

Step-by-step guide to deploy this project using free tiers of **Vercel**, **Render**, and optionally **Neon**.

---

## Overview

| Service  | Role              | Free Tier                        |
| -------- | ----------------- | -------------------------------- |
| Vercel   | Frontend (React)  | Unlimited deploys, 100 GB BW/mo |
| Render   | Backend (Express) | 750h/mo, spins down after idle  |
| Neon     | PostgreSQL DB     | 0.5 GB storage, 24/7 compute    |

```
Vercel (client)  ──API──▶  Render (server)  ──▶  Neon (PostgreSQL) [optional]
```

---

## Prerequisites

- A [GitHub](https://github.com) account (to push your code)
- Accounts on [Vercel](https://vercel.com), [Render](https://render.com), and optionally [Neon](https://neon.tech)

---

## 1. Deploy Backend on Render

### Step 1 — Push your server code to GitHub

If your repo is a monorepo, Render can build from a subdirectory. Push the entire project to GitHub.

### Step 2 — Create a Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Fill in the settings:

| Setting         | Value                                |
| --------------- | ------------------------------------ |
| **Name**        | `chess3d-server`                     |
| **Region**      | Oregon (or closest to you)           |
| **Branch**      | `main`                               |
| **Root Directory** | `server`                          |
| **Runtime**     | Node                                |
| **Build Command** | `npm install`                      |
| **Start Command** | `npm start`                        |

4. Add **Environment Variables**:

| Key              | Value                                |
| ---------------- | ------------------------------------ |
| `NODE_ENV`       | `production`                         |
| `PORT`           | `10000` (Render assigns this, but set it as default) |
| `CORS_ORIGIN`    | `https://your-app.vercel.app`        |
| `GAME_TTL_MS`    | `86400000`                           |

5. Click **Create Web Service**

Render will build and deploy. Your API will be available at:
```
https://chess3d-server.onrender.com
```

> **Note:** Render free tier spins down after 15 min of inactivity. The first request after idle may take 30-50 seconds.

### Step 3 — Verify the backend

Visit:
```
https://chess3d-server.onrender.com/api/health
```

You should see:
```json
{"status":"ok","service":"chess3d-server","time":"..."}
```

---

## 2. Deploy Frontend on Vercel

### Step 1 — Update the API base URL

The client currently uses `/api` with a Vite proxy. For production, you need to point to the real backend URL.

Edit `client/src/utils/api.js`:

```javascript
const BASE = import.meta.env.VITE_API_URL || '/api';
```

### Step 2 — Create a Vercel project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **New Project**
2. Import your GitHub repo
3. Fill in the settings:

| Setting            | Value                |
| ------------------ | -------------------- |
| **Framework**      | Vite                 |
| **Root Directory** | `client`             |
| **Build Command**  | `npm run build`      |
| **Output Directory** | `dist`             |

4. Add **Environment Variables**:

| Key              | Value                                |
| ---------------- | ------------------------------------ |
| `VITE_API_URL`   | `https://chess3d-server.onrender.com/api` |

5. Click **Deploy**

Your frontend will be live at:
```
https://chess3d.vercel.app
```

### Step 3 — Update CORS on Render

Go back to Render → your service → **Environment** and update:

| Key           | Value                          |
| ------------- | ------------------------------ |
| `CORS_ORIGIN` | `https://chess3d.vercel.app`   |

Redeploy the service for changes to take effect.

---

## 3. (Optional) Add PostgreSQL with Neon

The current backend uses in-memory storage (games are lost on restart). To persist games, you can add a PostgreSQL database.

### Step 1 — Create a Neon database

1. Go to [Neon Console](https://console.neon.tech) → **Create Project**
2. Choose a region (same as Render for lower latency)
3. Copy the **connection string** (it looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2 — Add the connection string to Render

In Render → **Environment**:

| Key               | Value                                    |
| ----------------- | ---------------------------------------- |
| `DATABASE_URL`    | `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require` |

### Step 3 — Update the server code

You'll need to modify `server/src/models/GameStore.js` to use PostgreSQL instead of in-memory storage. Install a Postgres client:

```bash
cd server
npm install pg
```

Then update the store to use `DATABASE_URL` for CRUD operations on games.

> **Tip:** Use an ORM like [Drizzle](https://orm.drizzle.team) or [Prisma](https://prisma.io) for easier database management.

---

## 4. Custom Domain (Optional)

### Vercel

1. Go to your project → **Settings** → **Domains**
2. Add your domain and follow the DNS instructions

### Render

1. Go to your service → **Settings** → **Custom Domains**
2. Add your domain and configure DNS

---

## Troubleshooting

### CORS errors

Make sure `CORS_ORIGIN` on Render exactly matches your Vercel URL (including `https://`).

### Games disappear after restart

This is expected with in-memory storage. Add Neon PostgreSQL for persistence (see section 3).

### Render spins down / slow first request

This is a limitation of the free tier. Consider upgrading to a paid plan for production use, or use a cron pinger service to keep it awake.

### Build fails on Render

Make sure:
- **Root Directory** is set to `server`
- `package.json` has a `start` script (`npm start`)
- Node version is >= 18

---

## Summary

| Step | Service  | URL                                         |
| ---- | -------- | ------------------------------------------- |
| 1    | Render   | `https://chess3d-server.onrender.com`        |
| 2    | Vercel   | `https://chess3d.vercel.app`                 |
| 3    | Neon     | `https://console.neon.tech`                  |

Your 3D chess game is now live and accessible worldwide — for free!
