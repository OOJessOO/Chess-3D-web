import app from './app.js';
import config from './config/index.js';
import store from './models/GameStore.js';

setInterval(() => store.cleanup(), 1000 * 60 * 10);

app.listen(config.port, () => {
  console.log(`[chess3d-server] API running on http://localhost:${config.port}`);
});
