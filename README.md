# Chess 3D Web

A bilingual (EN/FR) 3D chess game with a **React** frontend and an **Express** (Node.js) backend following the **MVC** architecture.

![Chess 3D](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

## Features

- 3D chess board with interactive pieces (Three.js / react-three-fiber)
- Full chess rules enforcement (chess.js)
- AI opponent with adjustable difficulty
- Bilingual interface (English / French)
- Drag-to-orbit camera controls
- Piece promotion dialog
- REST API backend (MVC architecture)

## Structure

```
chess3d/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Scene, Board, Piece, Hud, Sidebar, PromotionDialog
│   │   ├── i18n/           # en.json / fr.json
│   │   ├── utils/          # api client, chessAI, pieceInfo
│   │   └── styles/         # global.css
│   └── vite.config.js
│
└── server/                 # Express API (MVC)
    └── src/
        ├── config/         # env-driven configuration
        ├── models/         # Game (rules/state), GameStore (in-memory)
        ├── controllers/    # gameController (HTTP orchestration)
        ├── routes/         # gameRoutes (REST contract)
        ├── views/          # gameView (DTO serialization)
        ├── middleware/      # error handlers
        └── utils/          # error utilities
```

## Quick Start

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/chess3d.git
cd chess3d
```

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Server runs on **http://localhost:4000**

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

Open http://localhost:5173 — play for both sides and switch language (EN/FR).

## Environment Variables

| Variable              | Default                     | Description                      |
| --------------------- | --------------------------- | -------------------------------- |
| `PORT`                | `4000`                      | Server port                      |
| `NODE_ENV`            | `development`               | Environment mode                 |
| `CORS_ORIGIN`         | `http://localhost:5173`     | Allowed CORS origin              |
| `MAX_GAMES_PER_PLAYER`| `20`                        | Max simultaneous games           |
| `GAME_TTL_MS`         | `86400000` (24h)            | Game time-to-live in ms          |

## API

| Method   | Path                  | Description                          |
| -------- | --------------------- | ------------------------------------ |
| `GET`    | `/api/health`         | Health check                         |
| `POST`   | `/api/games`          | Create a new game                    |
| `GET`    | `/api/games`          | List active games                    |
| `GET`    | `/api/games/:id`      | Get game state (board, moves, etc.)  |
| `POST`   | `/api/games/:id/move` | Play a move `{from, to, promotion?}` |
| `DELETE` | `/api/games/:id`      | Delete a game                        |

## Controls

| Action                     | Input                              |
| -------------------------- | ---------------------------------- |
| Select / move a piece      | Left click                         |
| Orbit the camera           | Right mouse button + drag          |
| Zoom in / out              | Scroll wheel                       |
| Start new game             | "New Game" button in sidebar       |
| Switch language            | EN / FR toggle in sidebar          |

## Tech Stack

| Layer    | Technology                                |
| -------- | ----------------------------------------- |
| Frontend | React 18, Three.js, react-three-fiber     |
| Backend  | Node.js, Express, chess.js                |
| Build    | Vite                                      |
| i18n     | i18next, react-i18next                    |

## Free Deployment

See [DEPLOY-FREE.md](./DEPLOY-FREE.md) for a step-by-step guide to deploy this project for free using:

- **Vercel** — frontend (React)
- **Render** — backend (Express API)
- **Neon** — PostgreSQL database (optional, for persistence)

## License

MIT
