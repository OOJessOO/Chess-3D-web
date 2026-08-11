import 'dotenv/config';

const config = {
  port: Number(process.env.PORT) || 4000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  games: {
    maxPerPlayer: Number(process.env.MAX_GAMES_PER_PLAYER) || 20,
    ttlMs: Number(process.env.GAME_TTL_MS) || 1000 * 60 * 60 * 24
  }
};

export default config;
