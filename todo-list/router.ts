import { IncomingMessage, ServerResponse } from 'http';
import path from 'path';
import * as todoHandlers from './handlers/todos.js';
import { serveStatic } from './utils/static.js';

export async function router(req: IncomingMessage, res: ServerResponse, port: number): Promise<void> {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`);
  const pathname = url.pathname;
  const method = req.method ?? 'GET';

  // GET /api/todos
  if (pathname === '/api/todos' && method === 'GET') {
    await todoHandlers.getAll(res);
    return;
  }

  // POST /api/todos
  if (pathname === '/api/todos' && method === 'POST') {
    await todoHandlers.create(req, res);
    return;
  }

  // PATCH or DELETE /api/todos/:id
  const todoMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
  if (todoMatch) {
    const id = parseInt(todoMatch[1], 10);

    if (method === 'PATCH') {
      await todoHandlers.update(req, res, id);
      return;
    }

    if (method === 'DELETE') {
      todoHandlers.remove(res, id);
      return;
    }
  }

  // Static files fallback
  const filePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    'public',
    pathname === '/' ? 'index.html' : pathname
  );
  serveStatic(res, filePath);
}