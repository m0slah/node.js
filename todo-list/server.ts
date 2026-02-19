import http, { IncomingMessage, ServerResponse } from 'http';
import { applyCors, handlePreflight } from './middleware/cors.js';
import { router } from './router.js';

const PORT = 3000;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  applyCors(res);
  if (handlePreflight(req, res)) return;
  await router(req, res, PORT);
});

server.listen(PORT, () => {
  console.log(`✅ Todo app running → http://localhost:${PORT}`);
});