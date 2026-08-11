import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import gameRoutes from './routes/gameRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'chess3d-server', time: new Date().toISOString() });
});

app.use('/api', gameRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
