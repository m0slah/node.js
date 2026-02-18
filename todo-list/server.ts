    import http, { IncomingMessage, ServerResponse } from 'http';
    import fs from 'fs';
    import path from 'path';

    const PORT = 3000;

    // ── Types ────────────────────────────────────────────────────

    interface Todo {
    id: number;
    text: string;
    done: boolean;
    created: string;
    }

    interface CreateTodoBody {
    text?: string;
    }

    interface UpdateTodoBody {
    text?: string;
    done?: boolean;
    }

    // ── In-memory store ──────────────────────────────────────────

    let todos: Todo[] = [
    { id: 1, text: 'Build something amazing', done: false, created: new Date().toISOString() },
    { id: 2, text: 'Learn TypeScript deeply', done: true, created: new Date().toISOString() },
    ];
    let nextId = 3;

    // ── MIME types ───────────────────────────────────────────────

    const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    };

    // ── Helpers ──────────────────────────────────────────────────

    function sendJSON(res: ServerResponse, statusCode: number, data: unknown): void {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
    }

    function sendError(res: ServerResponse, statusCode: number, message: string): void {
    sendJSON(res, statusCode, { error: message });
    }

    function getBody<T = unknown>(req: IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk: Buffer) => (raw += chunk.toString()));
        req.on('end', () => {
        try {
            resolve(raw ? (JSON.parse(raw) as T) : ({} as T));
        } catch {
            reject(new Error('Invalid JSON'));
        }
        });
        req.on('error', reject);
    });
    }

    function serveStatic(res: ServerResponse, filePath: string): void {
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
    }

    // ── Server ───────────────────────────────────────────────────

    const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
    const pathname = url.pathname;
    const method = req.method ?? 'GET';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // GET /api/todos
    if (pathname === '/api/todos' && method === 'GET') {
        sendJSON(res, 200, todos);
        return;
    }

    // POST /api/todos
    if (pathname === '/api/todos' && method === 'POST') {
        try {
        const body = await getBody<CreateTodoBody>(req);
        if (!body.text?.trim()) {
            sendError(res, 400, 'Text is required');
            return;
        }
        const todo: Todo = {
            id: nextId++,
            text: body.text.trim(),
            done: false,
            created: new Date().toISOString(),
        };
        todos.push(todo);
        sendJSON(res, 201, todo);
        } catch {
        sendError(res, 400, 'Invalid request body');
        }
        return;
    }

    // PATCH /api/todos/:id
    const patchMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
    if (patchMatch && method === 'PATCH') {
        const id = parseInt(patchMatch[1], 10);
        const todo = todos.find(t => t.id === id);
        if (!todo) { sendError(res, 404, 'Not found'); return; }
        try {
        const body = await getBody<UpdateTodoBody>(req);
        if (body.text !== undefined) todo.text = body.text;
        if (body.done !== undefined) todo.done = body.done;
        sendJSON(res, 200, todo);
        } catch {
        sendError(res, 400, 'Invalid request body');
        }
        return;
    }

    // DELETE /api/todos/:id
    const deleteMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
    if (deleteMatch && method === 'DELETE') {
        const id = parseInt(deleteMatch[1], 10);
        const idx = todos.findIndex(t => t.id === id);
        if (idx === -1) { sendError(res, 404, 'Not found'); return; }
        todos.splice(idx, 1);
        res.writeHead(204);
        res.end();
        return;
    }

    // Static files
    const filePath = path.join(
        path.dirname(new URL(import.meta.url).pathname),
        'public',
        pathname === '/' ? 'index.html' : pathname
    );
    serveStatic(res, filePath);
    });

    server.listen(PORT, () => {
    console.log(`✅ Todo app running → http://localhost:${PORT}`);
    });