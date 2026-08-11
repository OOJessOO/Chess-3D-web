# Chess 3D Web — README

A bilingual (EN/FR) 3D chess game with a **React** frontend and an **Express** (Node.js) backend following the **MVC** architecture.

## Structure (MVC)

```
server/            Express API — MVC
  src/
    config/        configuration (env-driven)
    models/        Game (rules/state), GameStore (in-memory persistence)
    controllers/   gameController (HTTP orchestration)
    routes/        gameRoutes (REST contract)
    views/         gameView (DTO serialization of models)
    middleware/    error handlers
    utils/         errors
client/            React + Three.js (react-three-fiber)
  src/
    components/    Scene, Board, Piece, Hud, Sidebar, PromotionDialog
    i18n/          en.json / fr.json
    utils/         api client
    styles/        global.css
```

## Run

```bash
# Backend (port 4000)
cd server
npm install
npm run dev

# Frontend (port 5173)
cd client
npm install
npm run dev
```

Open http://localhost:5173 — you can play for both sides and switch language (EN/FR).

## API

| Method | Path                 | Description                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/games`         | Create a game                        |
| GET    | `/api/games`         | List active games                    |
| GET    | `/api/games/:id`     | Get game state (board, moves, etc.)  |
| POST   | `/api/games/:id/move`| Play `{from, to, promotion?}`        |
| DELETE | `/api/games/:id`     | Delete a game                        |

## Controls

- **Click** a piece to select, then click a highlighted square to move.
- **Drag** (right mouse button) to orbit the camera; **scroll** to zoom.
- **New game** restarts from the initial position.
