import { IncomingMessage, ServerResponse } from 'http';
import { todos, incrementId } from '../store/todos.ts';
import { sendJSON, sendError, getBody } from '../utils/http.js';
import { CreateTodoBody, UpdateTodoBody, Todo } from '../types/index.js';

export async function getAll(res: ServerResponse): Promise<void> {
  sendJSON(res, 200, todos);
}

export async function create(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const body = await getBody<CreateTodoBody>(req);
    if (!body.text?.trim()) {
      sendError(res, 400, 'Text is required');
      return;
    }
    const todo: Todo = {
      id: incrementId(),
      text: body.text.trim(),
      done: false,
      created: new Date().toISOString(),
    };
    todos.push(todo);
    sendJSON(res, 201, todo);
  } catch {
    sendError(res, 400, 'Invalid request body');
  }
}

export async function update(req: IncomingMessage, res: ServerResponse, id: number): Promise<void> {
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    sendError(res, 404, 'Not found');
    return;
  }
  try {
    const body = await getBody<UpdateTodoBody>(req);
    if (body.text !== undefined) todo.text = body.text;
    if (body.done !== undefined) todo.done = body.done;
    sendJSON(res, 200, todo);
  } catch {
    sendError(res, 400, 'Invalid request body');
  }
}

export function remove(res: ServerResponse, id: number): void {
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    sendError(res, 404, 'Not found');
    return;
  }
  todos.splice(idx, 1);
  res.writeHead(204);
  res.end();
}