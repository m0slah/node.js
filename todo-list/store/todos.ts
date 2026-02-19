import { Todo } from '../types/index.js';

export let todos: Todo[] = [
  { id: 1, text: 'Build something amazing', done: false, created: new Date().toISOString() },
  { id: 2, text: 'Learn TypeScript deeply', done: true, created: new Date().toISOString() },
];

export let nextId = 3;

export function incrementId(): number {
  return nextId++;
}