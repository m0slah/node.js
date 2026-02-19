export interface Todo {
  id: number;
  text: string;
  done: boolean;
  created: string;
}

export interface CreateTodoBody {
  text?: string;
}

export interface UpdateTodoBody {
  text?: string;
  done?: boolean;
}
