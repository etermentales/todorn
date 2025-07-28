import './App.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Todo {
  id: number;
  item: string;
}

const App: FC = () => {

  const API_URL = "http://127.0.0.1:8000";

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoText, setEditTodoText] = useState<string>('');

  useEffect(() => {
    axios.get<Todo[]>(`${API_URL}/todos`).then(response => {
      setTodos(response.data);
    }).catch(error => {
      console.error("Error fetching todos", error);
    });
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodo.trim() === '') return;

    const todo: Todo = {
      id: Date.now(),
      item: newTodo
    };

    axios.post<Todo>(`${API_URL}/todos`, todo).then(response => {
      setTodos(prevTodos => [...prevTodos, response.data]);
      setNewTodo('');
    }).catch(error => {
      console.error("Failed to add new to-do.", error);
    });
  };

  const handleDelete = (id: number) => {
    axios.delete(`${API_URL}/todos/${id}`).then(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }).catch(error => {
      console.error("Failed to delete todo.", error);
    });
  };

  // render edit view
  const handleEditClick = (todo: Todo) => {
    setEditTodoId(todo.id);
    setEditTodoText(todo.item);
  };

  // actually updates the todo
  const handleUpdateSubmit = (event: FormEvent<HTMLFormElement>, id: number) => {
    event.preventDefault();
    const updatedTodo = { id, item: editTodoText };

    axios.put<Todo>(`${API_URL}/todos/${id}`, updatedTodo).then(response => {
    
      setTodos(prevTodos => prevTodos.map(t => (t.id === id ? response.data : t)));

      setEditTodoId(null);
      setEditTodoText('');
    }).catch(error => {
      console.error("Failed to update todo.", error);
    });
  };

  return (
    <div className='app'>
      <div className='header'>
        <h1>TODORN</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
            placeholder='Add a todo'
          />
          <button type='submit'>Add</button>
        </form>
        <ul>
          {todos.map(t => (
            <li key={t.id} className='todo'>
              {editTodoId === t.id ? (
                <form onSubmit={(e) => handleUpdateSubmit(e, t.id)} className="edit-form">
                  <input
                    type="text"
                    value={editTodoText}
                    onChange={(e) => setEditTodoText(e.target.value)}
                    autoFocus
                  />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <>
                  <span>{t.item}</span>
                  <div className='todo-utils'>
                    <PencilSquareIcon width={24} onClick={() => handleEditClick(t)} />
                    <TrashIcon width={24} onClick={() => handleDelete(t.id)} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
